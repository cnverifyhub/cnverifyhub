import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

/* ============================================
   TRC20 Background Polling Verification
   Designed to be called repeatedly by the client
   until the transaction is confirmed on-chain.

   Flow:
     Client submits TXID → starts polling every 30s
     Each poll calls this endpoint → returns status
     On confirmation: updates Supabase + triggers delivery
     After 20 attempts (10 min): returns failed
   ============================================ */

const TRON_GRID_API = 'https://api.trongrid.io';
const USDT_CONTRACT = 'TR7NHqjuS2PV2Q9vwJwgK7xH9vx96fQ9s1';

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';
const WALLET_ADDRESS_2 = process.env.NEXT_PUBLIC_TRC20_WALLET_2 || 'TH2mdXf9wkddGSpynCTLJcS4CcHSLHSv4E';

/** Check if a transaction is confirmed on TRC20 */
async function checkTRC20Transaction(txHash: string, expectedAmount: number, targetWallet: string) {
    try {
        // 1. Fetch transaction detail from TronGrid
        const response = await fetch(`${TRON_GRID_API}/wallet/gettransactionbyid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: txHash }),
        });
        const txData = await response.json();

        if (!txData || !txData.ret) {
            return { status: 'pending', reason: 'Transaction not yet visible on chain' };
        }

        if (txData.ret[0]?.contractRet !== 'SUCCESS') {
            return { status: 'failed', reason: 'Transaction failed on blockchain' };
        }

        // 2. Fetch TRC20 Transfer events
        const eventsRes = await fetch(`${TRON_GRID_API}/v1/transactions/${txHash}/events`);
        const eventsData = await eventsRes.json();

        const transferEvent = eventsData.data?.find(
            (e: any) => e.event_name === 'Transfer' && e.contract_address === USDT_CONTRACT
        );

        if (!transferEvent) {
            return { status: 'pending', reason: 'USDT transfer event not found — transaction may still be processing' };
        }

        const { to, from, value } = transferEvent.result;
        const amountPaid = parseFloat(value) / 1_000_000; // USDT has 6 decimals

        // 3. Validate recipient wallet (check both wallets)
        const toLower = to.toLowerCase();
        const validWallets = [WALLET_ADDRESS.toLowerCase(), WALLET_ADDRESS_2.toLowerCase()];
        if (!validWallets.includes(toLower)) {
            return { status: 'failed', reason: `Payment sent to wrong wallet: ${to}` };
        }

        // 4. Validate amount (allow 2% slippage for fees)
        if (amountPaid < expectedAmount * 0.98) {
            return {
                status: 'failed',
                reason: `Amount too low. Expected ≥${expectedAmount} USDT, got ${amountPaid.toFixed(2)} USDT`,
            };
        }

        // 5. Check block confirmations
        const blockNumber = txData.blockNumber;
        const nowBlock = await fetch(`${TRON_GRID_API}/wallet/getnowblock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const nowBlockData = await nowBlock.json();
        const currentBlock = nowBlockData.block_header?.raw_data?.number || 0;
        const confirmations = Math.max(0, currentBlock - blockNumber);

        // Need at least 19 confirmations (~1 minute) for confidence
        if (confirmations < 19) {
            return {
                status: 'pending',
                reason: `${confirmations}/19 confirmations — waiting for network`,
                confirmations,
                requiredConfirmations: 19,
            };
        }

        // 6. All checks passed — confirmed
        return {
            status: 'confirmed',
            amount: amountPaid,
            from,
            to,
            token: 'USDT',
            network: 'trc20',
            timestamp: txData.raw_data?.timestamp,
            confirmations,
        };
    } catch (err) {
        console.error('[Poll] TRC20 check error:', err);
        return { status: 'pending', reason: 'Network error — will retry' };
    }
}

/** Trigger auto-delivery after confirmed payment */
async function triggerDelivery(orderId: string) {
    try {
        const { data: updatedOrder } = await supabase
            .from('orders')
            .select('id')
            .eq('public_id', orderId)
            .single();

        if (updatedOrder) {
            const { autoAssignAccountsToOrder } = await import('@/lib/supabase/delivery');
            const result = await autoAssignAccountsToOrder(updatedOrder.id, orderId);
            console.log(`[Poll] Auto-delivery for ${orderId}:`, result.success ? 'OK' : 'FAILED');
        }
    } catch (err) {
        console.error('[Poll] Delivery trigger error:', err);
    }
}

/** Update Supabase order after confirmation */
async function markOrderPaid(orderId: string, verificationData: any) {
    const { error: updateError } = await supabase
        .from('orders')
        .update({
            status: 'paid',
            tx_verified: true,
            verification_details: {
                amount: verificationData.amount,
                from: verificationData.from,
                to: verificationData.to,
                network: verificationData.network || 'trc20',
                token: verificationData.token || 'USDT',
                timestamp: verificationData.timestamp,
            },
        })
        .eq('public_id', orderId);

    if (updateError) {
        console.error('[Poll] Supabase update error:', updateError);
        return false;
    }

    // Trigger auto-delivery for TRC20 confirmed payments
    await triggerDelivery(orderId);
    return true;
}

// ─── Main Handler ───
export async function POST(request: Request) {
    try {
        const { txHash, expectedAmount, orderId, network } = await request.json();

        if (!txHash || !orderId) {
            return NextResponse.json({ error: 'txHash and orderId are required' }, { status: 400 });
        }

        if (network && network !== 'trc20') {
            // Non-TRC20 networks: fall back to single-shot verification via existing endpoint
            const existingRes = await fetch(new URL('/api/verify-payment', request.url).toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txHash, expectedAmount, orderId, network }),
            });
            const result = await existingRes.json();
            return NextResponse.json({
                status: result.verified ? 'confirmed' : 'failed',
                ...result,
            });
        }

        // Check if order is already verified (avoid double-processing)
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('tx_verified, status')
            .eq('public_id', orderId)
            .single();

        if (existingOrder?.tx_verified) {
            return NextResponse.json({
                status: 'confirmed',
                reason: 'Order already verified',
                alreadyVerified: true,
            });
        }

        // Run TRC20 verification
        const result = await checkTRC20Transaction(txHash, expectedAmount || 0, '');

        if (result.status === 'confirmed') {
            // Mark order as paid + verified
            await markOrderPaid(orderId, result);
        }

        return NextResponse.json({
            status: result.status,
            reason: result.reason,
            confirmations: result.confirmations,
            requiredConfirmations: result.requiredConfirmations,
            verificationData: result.status === 'confirmed' ? result : undefined,
        });
    } catch (error) {
        console.error('[Poll] API error:', error);
        return NextResponse.json(
            { status: 'pending', reason: 'Internal error — will retry' },
            { status: 500 }
        );
    }
}
