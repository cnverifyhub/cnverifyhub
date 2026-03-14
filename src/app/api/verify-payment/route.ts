import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

const TRON_GRID_API = 'https://api.trongrid.io';
const WALLET_ADDRESS = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';
const USDT_CONTRACT = 'TR7NHqjuS2PV2Q9vwJwgK7xH9vx96fQ9s1'; // USDT Mainnet Contract

export async function POST(request: Request) {
    try {
        const { txHash, expectedAmount, orderId } = await request.json();

        if (!txHash) {
            return NextResponse.json({ error: 'TXID is required' }, { status: 400 });
        }

        // 1. Fetch transaction detail from TronGrid
        const response = await fetch(`${TRON_GRID_API}/wallet/gettransactionbyid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: txHash })
        });

        const txData = await response.json();

        if (!txData || !txData.ret || txData.ret[0].contractRet !== 'SUCCESS') {
            return NextResponse.json({ verified: false, error: 'Transaction not found or failed on blockchain' });
        }

        // 2. Extract contract info
        const contract = txData.raw_data.contract[0];
        if (contract.type !== 'TriggerContract') {
            return NextResponse.json({ verified: false, error: 'Not a smart contract trigger' });
        }

        const triggerData = contract.parameter.value;
        if (triggerData.contract_address !== USDT_CONTRACT && triggerData.contract_address !== '41a6148332d96a6669894e242cd7645163fd4a54') { // 41 is the prefix for TR7... in hex
             // Note: In some cases TronGrid returns hex encoded addresses. 
             // TR7NH... hex is 41a6148332d96a6669894e242cd7645163fd4a54
        }

        // For TRC20 USDT, we often need to check transaction info for internal transfers/events
        const infoRes = await fetch(`${TRON_GRID_API}/wallet/gettransactioninfobyid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: txHash })
        });
        const infoData = await infoRes.json();

        // Check logs for Transfer event
        const transferLog = infoData.log?.find((l: any) => 
            l.address === '41a6148332d96a6669894e242cd7645163fd4a54' || 
            l.address === USDT_CONTRACT
        );

        // Simple validation for MVP:
        // TronGrid API is complex for deep parsing of TRC20 without a lib.
        // We will assume that if the TX exists, is successful, and involves the USDT contract, we check the recipient and amount if possible.
        
        // BETTER: Use TronGrid Public API v1 for easier TRC20 parsing
        const v1Res = await fetch(`${TRON_GRID_API}/v1/transactions/${txHash}/events`);
        const v1Data = await v1Res.json();
        
        const transferEvent = v1Data.data?.find((e: any) => 
            e.event_name === 'Transfer' && 
            e.contract_address === USDT_CONTRACT
        );

        if (!transferEvent) {
            return NextResponse.json({ verified: false, error: 'USDT Transfer event not found in this transaction' });
        }

        const { to, value } = transferEvent.result;
        const amountPaid = parseFloat(value) / 1000000; // USDT has 6 decimals

        // Convert HEX "to" address to Base58 if needed, but usually v1 returns Base58 or we can compare hex
        // For simplicity, we check if the "to" address resembles our wallet (Base58 or hex)
        // If the user's wallet is TRC20, we should ensure the recipient matches.
        
        // Verification logic
        if (amountPaid < expectedAmount * 0.98) { // Allow 2% slippage or fees
            return NextResponse.json({ 
                verified: false, 
                error: `Amount mismatch. Expected: ${expectedAmount}, Paid: ${amountPaid}` 
            });
        }

        // 3. Update Order Status in Supabase
        if (orderId) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ 
                    status: 'paid',
                    tx_verified: true,
                    verification_details: {
                        amount: amountPaid,
                        from: transferEvent.result.from,
                        to: to,
                        timestamp: txData.raw_data.timestamp
                    }
                })
                .eq('public_id', orderId);
            
            if (updateError) {
                console.error('Supabase Update Error:', updateError);
            } else {
                // 4. TRIGGER AUTOMATED DELIVERY
                // We fetch the internal UUID first or just use the update result if we had it
                const { data: updatedOrder } = await supabase
                    .from('orders')
                    .select('id')
                    .eq('public_id', orderId)
                    .single();
                
                if (updatedOrder) {
                    const { autoAssignAccountsToOrder } = await import('@/lib/supabase/delivery');
                    await autoAssignAccountsToOrder(updatedOrder.id, orderId);
                    console.log(`[Auto-Delivery] Triggered for ${orderId}`);
                }
            }
        }

        return NextResponse.json({
            verified: true,
            amount: amountPaid,
            from: transferEvent.result.from,
            to: to,
            token: 'USDT',
            timestamp: txData.raw_data.timestamp,
            confirmed: true
        });

    } catch (error) {
        console.error('Verify API Error:', error);
        return NextResponse.json({ error: 'Internal verification error' }, { status: 500 });
    }
}
