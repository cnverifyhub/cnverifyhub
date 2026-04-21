import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Sawmik888';

// ─── GET: Fetch all orders (Admin only) ───
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all orders, ordered by newest first
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch all items
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*');

        if (itemsError) throw itemsError;

        // Fetch all delivered accounts
        const { data: vaultAccounts, error: vaultError } = await supabase
            .from('vault_accounts')
            .select('*');

        if (vaultError) throw vaultError;

        // Map them together with new wallet + network fields
        const formattedOrders = (orders || []).map(order => {
            const orderItems = (items || []).filter(item => item.order_id === order.id);
            const orderAccounts = (vaultAccounts || []).filter(acc => acc.assigned_order_id === order.id);

            return {
                id: order.public_id,
                internalId: order.id,
                email: order.email,
                telegram: order.telegram || '',
                cryptoType: order.crypto_type,
                txid: order.txid,
                status: order.status,
                txVerified: order.tx_verified || false,
                verificationDetails: order.verification_details || null,
                totalAmount: Number(order.total_amount),
                paymentWallet: order.payment_wallet || '',
                paymentNetwork: order.payment_network || '',
                createdAt: order.created_at,
                userId: order.user_id || null,
                items: orderItems.map(i => ({
                    productId: i.product_id,
                    quantity: i.quantity,
                    priceAtTime: Number(i.price_at_time)
                })),
                deliveredAccounts: orderAccounts.map(acc => acc.credentials)
            };
        });

        return NextResponse.json(formattedOrders);

    } catch (error) {
        console.error('Admin Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── POST: Deliver accounts to an order ───
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderPublicId, accounts } = await request.json();

        if (!orderPublicId || !accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id')
            .eq('public_id', orderPublicId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Insert accounts
        const accountInserts = accounts.map((acc: string) => ({
            product_id: 'auto-fulfillment',
            credentials: acc,
            is_sold: true,
            assigned_order_id: order.id,
            sold_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
            .from('vault_accounts')
            .insert(accountInserts);

        if (insertError) throw insertError;

        // Update order status to completed
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', order.id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Admin Fulfillment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── PATCH: Update order status manually ───
export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderPublicId, status, txVerified } = await request.json();

        if (!orderPublicId) {
            return NextResponse.json({ error: 'orderPublicId is required' }, { status: 400 });
        }

        const validStatuses = ['pending', 'paid', 'processing', 'completed', 'cancelled'];
        const updateFields: Record<string, any> = {};

        if (status && validStatuses.includes(status)) {
            updateFields.status = status;
        }

        if (typeof txVerified === 'boolean') {
            updateFields.tx_verified = txVerified;
        }

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update(updateFields)
            .eq('public_id', orderPublicId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, updated: updateFields });

    } catch (error) {
        console.error('Admin Status Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ─── PUT: Manual TXID verification by admin ───
export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderPublicId } = await request.json();

        if (!orderPublicId) {
            return NextResponse.json({ error: 'orderPublicId is required' }, { status: 400 });
        }

        // 1. Fetch the order
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('public_id', orderPublicId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (!order.txid) {
            return NextResponse.json({ error: 'No TXID found for this order' }, { status: 400 });
        }

        if (order.tx_verified) {
            return NextResponse.json({ success: true, alreadyVerified: true, message: 'Order is already verified' });
        }

        // 2. Call verify-payment API internally
        const network = order.payment_network || 'trc20';
        const baseUrl = request.headers.get('x-forwarded-proto')
            ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}`
            : new URL(request.url).origin;

        const verifyRes = await fetch(`${baseUrl}/api/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                txHash: order.txid,
                expectedAmount: Number(order.total_amount),
                orderId: order.public_id,
                network,
                walletAddress: order.payment_wallet || '',
            }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.verified) {
            return NextResponse.json({
                success: true,
                verified: true,
                details: {
                    amount: verifyData.amount,
                    from: verifyData.from,
                    to: verifyData.to,
                    network: verifyData.network,
                    token: verifyData.token,
                },
            });
        } else {
            // Even if auto-verification fails, allow admin to force-verify
            return NextResponse.json({
                success: false,
                verified: false,
                error: verifyData.error || 'Blockchain verification failed',
                canForceVerify: true,
            });
        }

    } catch (error) {
        console.error('Admin Manual Verify Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
