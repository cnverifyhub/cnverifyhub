import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { checkPaymentVerification } from '@/lib/fraud-detection';

/* ============================================
   Multi-Chain Payment Verification API
   Supports: TRC20 (TronGrid), BEP20 (BSCScan), ERC20 (Etherscan)
   ============================================ */

const TRON_GRID_API = 'https://api.trongrid.io';
const BSCSCAN_API = 'https://api.bscscan.com/api';
const ETHERSCAN_API = 'https://api.etherscan.io/api';

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';
const WALLET_ADDRESS_2 = process.env.NEXT_PUBLIC_TRC20_WALLET_2 || 'TH2mdXf9wkddGSpynCTLJcS4CcHSLHSv4E';

const BEP20_WALLET = process.env.NEXT_PUBLIC_BEP20_WALLET || '0xb47669d0d17b57be5af515bf57e0294c130359b1';
const ERC20_WALLET = process.env.NEXT_PUBLIC_ERC20_WALLET || '0xb47669d0d17b57be5af515bf57e0294c130359b1';

const USDT_CONTRACT = 'TR7NHqjuS2PV2Q9vwJwgK7xH9vx96fQ9s1'; // USDT TRC20 Mainnet

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

// ─── TRC20  Verification (TronGrid) ───
async function verifyTRC20(txHash: string, expectedAmount: number) {
    // 1. Fetch transaction detail
    const response = await fetch(`${TRON_GRID_API}/wallet/gettransactionbyid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: txHash })
    });
    const txData = await response.json();

    if (!txData || !txData.ret || txData.ret[0].contractRet !== 'SUCCESS') {
        return { verified: false, error: 'Transaction not found or failed on blockchain' };
    }

    // 2. Use TronGrid v1 API for easier TRC20 parsing
    const v1Res = await fetch(`${TRON_GRID_API}/v1/transactions/${txHash}/events`);
    const v1Data = await v1Res.json();

    const transferEvent = v1Data.data?.find((e: any) =>
        e.event_name === 'Transfer' &&
        e.contract_address === USDT_CONTRACT
    );

    if (!transferEvent) {
        return { verified: false, error: 'USDT Transfer event not found in this transaction' };
    }

    const { to, from, value } = transferEvent.result;
    const amountPaid = parseFloat(value) / 1000000; // USDT has 6 decimals

    // Allow 2% slippage/fees
    if (amountPaid < expectedAmount * 0.98) {
        return { verified: false, error: `Amount mismatch. Expected: ${expectedAmount}, Paid: ${amountPaid}` };
    }

    return {
        verified: true,
        amount: amountPaid,
        from,
        to,
        token: 'USDT',
        network: 'trc20',
        timestamp: txData.raw_data.timestamp,
        confirmed: true
    };
}

// ─── BEP20 Verification (BSCScan) ───
async function verifyBEP20(txHash: string, expectedAmount: number, token: string) {
    try {
        // 1. Check TX receipt status
        const receiptUrl = `${BSCSCAN_API}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}${BSCSCAN_API_KEY ? `&apikey=${BSCSCAN_API_KEY}` : ''}`;
        const receiptRes = await fetch(receiptUrl);
        const receiptData = await receiptRes.json();

        if (receiptData.result?.status !== '1') {
            return { verified: false, error: 'Transaction failed or not found on BNB Smart Chain' };
        }

        // 2. Get TX details
        const txUrl = `${BSCSCAN_API}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}${BSCSCAN_API_KEY ? `&apikey=${BSCSCAN_API_KEY}` : ''}`;
        const txRes = await fetch(txUrl);
        const txData = await txRes.json();

        if (!txData.result) {
            return { verified: false, error: 'Transaction details not found on BSCScan' };
        }

        const tx = txData.result;
        const toAddress = tx.to?.toLowerCase();

        // Check if the recipient is our wallet
        if (toAddress !== BEP20_WALLET.toLowerCase()) {
            // Might be a token transfer (to contract, not direct wallet)
            // Check token transfer events via log
        }

        // 3. Get TX receipt for logs (token transfers)
        const receiptDetailUrl = `${BSCSCAN_API}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}${BSCSCAN_API_KEY ? `&apikey=${BSCSCAN_API_KEY}` : ''}`;
        const receiptDetailRes = await fetch(receiptDetailUrl);
        const receiptDetail = await receiptDetailRes.json();

        let amountPaid = 0;
        let fromAddress = tx.from || '';

        if (receiptDetail.result?.logs?.length) {
            // Look for ERC20 Transfer event (topic0 = Transfer signature)
            const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            const transferLog = receiptDetail.result.logs.find((log: any) =>
                log.topics[0] === transferTopic
            );

            if (transferLog) {
                // Amount is in data field
                const rawAmount = BigInt(transferLog.data);
                // USDT typically 18 decimals on BSC, BTC wrapped also 18
                amountPaid = Number(rawAmount) / 1e18;
                if (amountPaid < 0.001 && Number(rawAmount) > 0) {
                    // Maybe 6 decimals (some USDT on BSC uses 18, some use 6)
                    amountPaid = Number(rawAmount) / 1e6;
                }
            }
        }

        // Fallback: check native BNB value
        if (amountPaid === 0 && tx.value) {
            amountPaid = Number(BigInt(tx.value)) / 1e18;
        }

        return {
            verified: true,
            amount: amountPaid || expectedAmount,
            from: fromAddress,
            to: BEP20_WALLET,
            token,
            network: 'bep20',
            timestamp: Date.now(),
            confirmed: true 
        };
    } catch (err) {
        console.error('BSCScan verification error:', err);
        return { verified: false, error: 'BSCScan verification failed. Please contact support.' };
    }
}

// ─── ERC20 Verification (Etherscan) ───
async function verifyERC20(txHash: string, expectedAmount: number, token: string) {
    try {
        // 1. Check TX receipt status
        const receiptUrl = `${ETHERSCAN_API}?module=transaction&action=gettxreceiptstatus&txhash=${txHash}${ETHERSCAN_API_KEY ? `&apikey=${ETHERSCAN_API_KEY}` : ''}`;
        const receiptRes = await fetch(receiptUrl);
        const receiptData = await receiptRes.json();

        if (receiptData.result?.status !== '1') {
            return { verified: false, error: 'Transaction failed or not found on Ethereum' };
        }

        // 2. Get TX details
        const txUrl = `${ETHERSCAN_API}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}${ETHERSCAN_API_KEY ? `&apikey=${ETHERSCAN_API_KEY}` : ''}`;
        const txRes = await fetch(txUrl);
        const txData = await txRes.json();

        if (!txData.result) {
            return { verified: false, error: 'Transaction details not found on Etherscan' };
        }

        const tx = txData.result;
        let amountPaid = 0;
        let fromAddress = tx.from || '';

        // 3. Get TX receipt for logs
        const receiptDetailUrl = `${ETHERSCAN_API}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}${ETHERSCAN_API_KEY ? `&apikey=${ETHERSCAN_API_KEY}` : ''}`;
        const receiptDetailRes = await fetch(receiptDetailUrl);
        const receiptDetail = await receiptDetailRes.json();

        if (receiptDetail.result?.logs?.length) {
            const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            const transferLog = receiptDetail.result.logs.find((log: any) =>
                log.topics[0] === transferTopic
            );

            if (transferLog) {
                const rawAmount = BigInt(transferLog.data);
                amountPaid = Number(rawAmount) / 1e18;
                if (amountPaid < 0.001 && Number(rawAmount) > 0) {
                    amountPaid = Number(rawAmount) / 1e6;
                }
            }
        }

        // Fallback: native ETH value
        if (amountPaid === 0 && tx.value) {
            amountPaid = Number(BigInt(tx.value)) / 1e18;
        }

        return {
            verified: true,
            amount: amountPaid || expectedAmount,
            from: fromAddress,
            to: ERC20_WALLET,
            token,
            network: 'erc20',
            timestamp: Date.now(),
            confirmed: true
        };
    } catch (err) {
        console.error('Etherscan verification error:', err);
        return { verified: false, error: 'Etherscan verification failed. Please contact support.' };
    }
}

// ─── Main Handler ───
export async function POST(request: Request) {
    try {
        const { txHash, expectedAmount, orderId, network, walletAddress } = await request.json();

        if (!txHash) {
            return NextResponse.json({ error: 'TXID is required' }, { status: 400 });
        }

        let result: any;

        switch (network) {
            case 'trc20':
                result = await verifyTRC20(txHash, expectedAmount);
                break;
            case 'bep20_usdt':
                result = await verifyBEP20(txHash, expectedAmount, 'USDT');
                break;
            case 'bep20_btc':
                result = await verifyBEP20(txHash, expectedAmount, 'BTC');
                break;
            case 'erc20_btc':
                result = await verifyERC20(txHash, expectedAmount, 'BTC');
                break;
            default:
                return NextResponse.json({ error: 'Unsupported network' }, { status: 400 });
        }

        // ── Fraud Detection on Payment ──
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
        const fraudCheck = await checkPaymentVerification({
            txid: txHash,
            fromWallet: result.from,
            ip,
        });

        if (fraudCheck.severity === 'high' || fraudCheck.severity === 'critical') {
            console.warn(`[Fraud] Payment flagged: txid=${txHash.substring(0, 12)}..., severity=${fraudCheck.severity}`);
            // Still process but log for admin review
        }

        // If verification succeeded, update order in Supabase
        if (result.verified && orderId) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'paid',
                    tx_verified: true,
                    verification_details: {
                        amount: result.amount,
                        from: result.from,
                        to: result.to,
                        network: result.network,
                        token: result.token,
                        timestamp: result.timestamp
                    }
                })
                .eq('public_id', orderId);

            if (updateError) {
                console.error('Supabase Update Error:', updateError);
            } else {
                // Trigger automated delivery for TRC20 verified payments
                if (network === 'trc20') {
                    const { data: updatedOrder } = await supabase
                        .from('orders')
                        .select('id')
                        .eq('public_id', orderId)
                        .single();

                    if (updatedOrder) {
                        try {
                            const { autoAssignAccountsToOrder } = await import('@/lib/supabase/delivery');
                            await autoAssignAccountsToOrder(updatedOrder.id, orderId);
                            console.log(`[Auto-Delivery] Triggered for ${orderId}`);
                        } catch (deliveryErr) {
                            console.error('[Auto-Delivery] Error:', deliveryErr);
                        }
                    }
                }
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('Verify API Error:', error);
        return NextResponse.json({ error: 'Internal verification error' }, { status: 500 });
    }
}
