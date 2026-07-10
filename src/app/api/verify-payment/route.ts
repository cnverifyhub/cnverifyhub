import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
import { checkPaymentVerification } from '@/lib/fraud-detection';
import { sendPaymentVerifiedEmail, logNotification } from '@/lib/email';

/* ============================================
   Multi-Chain Payment Verification API
   Supports: TRC20 (TronGrid), BEP20 (BSCScan), ERC20 (Etherscan), TON (Tonapi)
   ============================================ */

const TRON_GRID_API = 'https://api.trongrid.io';
const BSCSCAN_API = 'https://api.bscscan.com/api';
const ETHERSCAN_API = 'https://api.etherscan.io/api';

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';
const WALLET_ADDRESS_2 = process.env.NEXT_PUBLIC_TRC20_WALLET_2 || 'TPUxa1UGWLo7iHpx8fWK63YwxqP4FPzHnj';

const BEP20_WALLET = process.env.NEXT_PUBLIC_BEP20_WALLET || '0xb47669d0d17b57be5af515bf57e0294c130359b1';
const ERC20_WALLET = process.env.NEXT_PUBLIC_ERC20_WALLET || '0xb47669d0d17b57be5af515bf57e0294c130359b1';

const USDT_CONTRACT = 'TR7NHqjuS2PV2Q9vwJwgK7xH9vx96fQ9s1'; // USDT TRC20 Mainnet

const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

const TON_WALLET = process.env.NEXT_PUBLIC_TON_WALLET || 'UQBwpxL3iG214vI1TNwqlcHVZMJzCEKOQZlqopmRT1VQ8Pkv';

const ALLOWED_WALLETS = [
    WALLET_ADDRESS.toLowerCase(),
    WALLET_ADDRESS_2.toLowerCase(),
    BEP20_WALLET.toLowerCase(),
    ERC20_WALLET.toLowerCase(),
    TON_WALLET.toLowerCase()
];

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

    // Security: Verify recipient wallet
    if (!ALLOWED_WALLETS.includes(to.toLowerCase())) {
        return { verified: false, error: `Invalid recipient wallet: ${to}` };
    }

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
                    // Maybe 6 decimals
                    amountPaid = Number(rawAmount) / 1e6;
                }

                // Security: Verify recipient wallet (for tokens, it's the 2nd topic in Transfer event)
                const toInLog = '0x' + transferLog.topics[2].substring(26).toLowerCase();
                if (!ALLOWED_WALLETS.includes(toInLog)) {
                    return { verified: false, error: `Invalid recipient wallet in log: ${toInLog}` };
                }
            }
        }

        // Fallback: check native BNB value
        if (amountPaid === 0 && tx.value) {
            if (toAddress && !ALLOWED_WALLETS.includes(toAddress)) {
                return { verified: false, error: `Invalid recipient wallet for native BNB: ${toAddress}` };
            }
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

                // Security: Verify recipient wallet (for tokens, it's the 2nd topic in Transfer event)
                if (transferLog.topics && transferLog.topics[2]) {
                    const toInLog = '0x' + transferLog.topics[2].substring(26).toLowerCase();
                    if (!ALLOWED_WALLETS.includes(toInLog)) {
                        return { verified: false, error: `Invalid recipient wallet in log: ${toInLog}` };
                    }
                }
            }
        }

        // Fallback: native ETH value
        if (amountPaid === 0 && tx.value) {
            const toAddress = tx.to?.toLowerCase();
            if (!toAddress || !ALLOWED_WALLETS.includes(toAddress)) {
                return { verified: false, error: `Invalid recipient wallet for native transfer: ${toAddress}` };
            }
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

// ─── TON Verification (Tonapi.io) ───
function getTonapiHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
    };
    if (process.env.TONAPI_API_KEY) {
        headers['Authorization'] = `Bearer ${process.env.TONAPI_API_KEY}`;
    }
    return headers;
}

async function getRawAddress(address: string): Promise<string> {
    try {
        const res = await fetch(`https://tonapi.io/v2/accounts/${address}`, {
            headers: getTonapiHeaders()
        });
        const data = await res.json();
        return data.address || address.toLowerCase();
    } catch {
        return address.toLowerCase();
    }
}

async function verifyTON(txHash: string, expectedAmount: number) {
    try {
        const eventRes = await fetch(`https://tonapi.io/v2/events/${txHash}`, {
            headers: getTonapiHeaders()
        });
        const eventData = await eventRes.json();

        if (!eventData || eventData.error || !eventData.actions) {
            return { verified: false, error: 'Transaction/Event not found on TON network' };
        }

        const jettonAction = eventData.actions.find((action: any) =>
            action.type === 'JettonTransfer' &&
            action.status === 'ok'
        );

        if (!jettonAction) {
            return { verified: false, error: 'USDT Transfer action not found in this transaction' };
        }

        const transfer = jettonAction.JettonTransfer;
        const symbol = transfer.jetton?.symbol?.toUpperCase();

        if (symbol !== 'USDT') {
            return { verified: false, error: `Invalid token: expected USDT, got ${symbol}` };
        }

        const recipient = transfer.recipient?.address?.toLowerCase();
        const myTonWallet = TON_WALLET.toLowerCase();

        const recipientRaw = await getRawAddress(recipient);
        const myTonWalletRaw = await getRawAddress(myTonWallet);

        if (recipientRaw !== myTonWalletRaw) {
            return { verified: false, error: `Invalid recipient wallet: ${transfer.recipient?.address}` };
        }

        const decimals = transfer.jetton?.decimals || 6;
        const amountPaid = parseFloat(transfer.amount) / Math.pow(10, decimals);

        if (amountPaid < expectedAmount * 0.98) {
            return { verified: false, error: `Amount mismatch. Expected: ${expectedAmount}, Paid: ${amountPaid}` };
        }

        return {
            verified: true,
            amount: amountPaid,
            from: transfer.sender?.address || '',
            to: transfer.recipient?.address || TON_WALLET,
            token: 'USDT',
            network: 'ton_usdt',
            timestamp: (eventData.timestamp || Math.floor(Date.now() / 1000)) * 1000,
            confirmed: true
        };
    } catch (err) {
        console.error('TON verification error:', err);
        return { verified: false, error: 'TON verification failed. Please check TXID/Event ID.' };
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
            case 'ton_usdt':
                result = await verifyTON(txHash, expectedAmount);
                break;
            case 'bep20_usdt':
                result = await verifyBEP20(txHash, expectedAmount, 'USDT');
                break;
            case 'bep20_btc':
                result = await verifyBEP20(txHash, expectedAmount, 'BTC');
                break;
            case 'erc20_usdt':
                result = await verifyERC20(txHash, expectedAmount, 'USDT');
                break;
            case 'erc20_btc':
                result = await verifyERC20(txHash, expectedAmount, 'BTC');
                break;
            default:
                return NextResponse.json({ error: 'Unsupported network' }, { status: 400 });
        }

        // ── Fraud Detection on Payment ──
        const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
        const fraudCheck = await checkPaymentVerification({
            txid: txHash,
            fromWallet: result.from,
            ip,
        });

        if (fraudCheck.severity === 'high' || fraudCheck.severity === 'critical') {
            console.warn(`[Fraud] Payment flagged: txid=${txHash.substring(0, 12)}..., severity=${fraudCheck.severity}`);
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
                // Fetch order email for notification
                const { data: orderRow } = await supabase
                    .from('orders')
                    .select('id, email')
                    .eq('public_id', orderId)
                    .single();

                // ── Send Payment Verified Email ──
                if (orderRow?.email) {
                    sendPaymentVerifiedEmail({
                        to: orderRow.email,
                        publicId: orderId,
                        amount: result.amount,
                        network: result.network || network,
                        txid: txHash,
                    }).then(() => {
                        logNotification({ orderId: orderRow.id, type: 'payment_verified', recipientEmail: orderRow.email });
                        console.log(`[Email] ✅ Payment verified email sent to ${orderRow.email}`);
                    }).catch((err: unknown) => {
                        console.error('[Email] ❌ Failed to send payment verified email:', err);
                    });
                }

                // Trigger automated delivery for verified payments on auto-verification networks
                if ((network === 'trc20' || network === 'ton_usdt' || network === 'bep20_usdt') && orderRow) {
                    try {
                        const { autoAssignAccountsToOrder } = await import('@/lib/supabase/delivery');
                        await autoAssignAccountsToOrder(orderRow.id, orderId);
                        console.log(`[Auto-Delivery] Triggered for ${orderId}`);
                    } catch (deliveryErr) {
                        console.error('[Auto-Delivery] Error:', deliveryErr);
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
