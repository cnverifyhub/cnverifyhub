import { NextRequest, NextResponse } from 'next/server';

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';

// USDT TRC20 contract address on Tron
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

interface TronTx {
    confirmed: boolean;
    contractRet: string;
    toAddress: string;
    amount: number;
    timestamp: number;
    ownerAddress: string;
    tokenInfo?: {
        symbol: string;
        address: string;
        decimals: number;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { txHash, expectedAmount } = body;

        if (!txHash || typeof txHash !== 'string') {
            return NextResponse.json(
                { verified: false, error: 'Missing or invalid transaction hash' },
                { status: 400 }
            );
        }

        // Clean the hash
        const cleanHash = txHash.trim();

        // Basic format validation (Tron TXIDs are 64-char hex strings)
        if (!/^[a-fA-F0-9]{64}$/.test(cleanHash)) {
            return NextResponse.json(
                { verified: false, error: 'Invalid TXID format. Must be 64 hex characters.' },
                { status: 400 }
            );
        }

        // ============================================
        // Step 1: Query TronScan API for transaction info
        // ============================================
        const tronScanUrl = `https://apilist.tronscanapi.com/api/transaction-info?hash=${cleanHash}`;

        const response = await fetch(tronScanUrl, {
            headers: {
                'Accept': 'application/json',
                'TRON-PRO-API-KEY': process.env.TRONSCAN_API_KEY || '',
            },
            next: { revalidate: 0 } // No caching for verification
        });

        if (!response.ok) {
            // Fallback: Try TronGrid API
            return await verifyViaTronGrid(cleanHash, expectedAmount);
        }

        const data = await response.json();

        // Transaction not found
        if (!data || !data.hash) {
            return NextResponse.json({
                verified: false,
                error: 'Transaction not found on blockchain. Please check the TXID and try again.',
                status: 'not_found'
            });
        }

        // ============================================
        // Step 2: Validate transaction details
        // ============================================

        // Check if it's a TRC20 token transfer (USDT)
        const trc20Info = data.trc20TransferInfo?.[0];
        const isContractCall = data.contractType === 31; // TriggerSmartContract

        let verified = false;
        let amount = 0;
        let fromAddress = '';
        let toAddress = '';
        let tokenSymbol = '';
        let timestamp = data.timestamp || 0;
        let confirmed = data.confirmed || false;

        if (trc20Info) {
            // TRC20 transfer (most common for USDT)
            toAddress = trc20Info.to_address || '';
            fromAddress = trc20Info.from_address || '';
            const decimals = trc20Info.decimals || 6;
            amount = parseFloat(trc20Info.amount_str || '0') / Math.pow(10, decimals);
            tokenSymbol = trc20Info.symbol || '';

            // Verify recipient
            const recipientMatch = toAddress.toLowerCase() === WALLET_ADDRESS.toLowerCase();
            // Verify it's USDT
            const isUsdt = tokenSymbol === 'USDT' ||
                (trc20Info.contract_address || '').toLowerCase() === USDT_CONTRACT.toLowerCase();
            // Verify amount (allow 0.5 USDT tolerance for gas/rounding)
            const amountMatch = expectedAmount
                ? amount >= (expectedAmount - 0.5)
                : amount > 0;
            // Verify confirmed
            const isConfirmed = confirmed && data.contractRet === 'SUCCESS';

            verified = recipientMatch && isUsdt && amountMatch && isConfirmed;

            if (!recipientMatch) {
                return NextResponse.json({
                    verified: false,
                    error: 'This transaction was sent to a different wallet address.',
                    details: { to: toAddress, expected: WALLET_ADDRESS },
                    status: 'wrong_recipient'
                });
            }

            if (!isUsdt) {
                return NextResponse.json({
                    verified: false,
                    error: 'This transaction is not a USDT transfer. Please send USDT (TRC20).',
                    status: 'wrong_token'
                });
            }

            if (!amountMatch && expectedAmount) {
                return NextResponse.json({
                    verified: false,
                    error: `Amount mismatch. Expected $${expectedAmount} USDT but received $${amount.toFixed(2)} USDT.`,
                    details: { received: amount, expected: expectedAmount },
                    status: 'wrong_amount'
                });
            }

            if (!isConfirmed) {
                return NextResponse.json({
                    verified: false,
                    error: 'Transaction is still pending confirmation on the blockchain. Please wait a moment and try again.',
                    status: 'pending'
                });
            }
        } else {
            // Not a TRC20 transfer — could be TRX or other token
            return NextResponse.json({
                verified: false,
                error: 'This transaction is not a USDT TRC20 transfer. Please send USDT on the TRC20 network.',
                status: 'wrong_type'
            });
        }

        // ============================================
        // Step 3: Return verification result
        // ============================================
        return NextResponse.json({
            verified,
            amount: amount.toFixed(2),
            from: fromAddress,
            to: toAddress,
            token: tokenSymbol,
            timestamp,
            confirmed,
            txHash: cleanHash,
            status: 'verified'
        });

    } catch (error: any) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { verified: false, error: 'Verification service temporarily unavailable. Your payment is safe — please contact support.' },
            { status: 500 }
        );
    }
}

// Fallback verification via TronGrid API
async function verifyViaTronGrid(txHash: string, expectedAmount?: number) {
    try {
        const response = await fetch(
            `https://api.trongrid.io/v1/transactions/${txHash}/events`,
            {
                headers: {
                    'Accept': 'application/json',
                    'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY || '',
                }
            }
        );

        if (!response.ok) {
            return NextResponse.json({
                verified: false,
                error: 'Unable to verify transaction at this time. Please try again in a few moments or contact support.',
                status: 'api_error'
            });
        }

        const data = await response.json();
        const events = data.data || [];

        // Look for a Transfer event to our wallet
        const transferEvent = events.find((e: any) =>
            e.event_name === 'Transfer' &&
            e.contract_address?.toLowerCase() === USDT_CONTRACT.toLowerCase()
        );

        if (!transferEvent) {
            return NextResponse.json({
                verified: false,
                error: 'No USDT transfer found in this transaction.',
                status: 'not_found'
            });
        }

        const toAddress = transferEvent.result?.to
            ? `T${transferEvent.result.to}`
            : '';
        const amount = parseInt(transferEvent.result?.value || '0') / 1e6;
        const recipientMatch = toAddress.toLowerCase().includes(
            WALLET_ADDRESS.slice(1).toLowerCase()
        );

        if (!recipientMatch) {
            return NextResponse.json({
                verified: false,
                error: 'This transaction was sent to a different wallet.',
                status: 'wrong_recipient'
            });
        }

        return NextResponse.json({
            verified: true,
            amount: amount.toFixed(2),
            from: transferEvent.result?.from || 'Unknown',
            to: toAddress,
            token: 'USDT',
            timestamp: transferEvent.block_timestamp || Date.now(),
            confirmed: true,
            txHash,
            status: 'verified'
        });
    } catch {
        return NextResponse.json({
            verified: false,
            error: 'Verification service temporarily unavailable.',
            status: 'api_error'
        });
    }
}
