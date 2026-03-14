import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MOCK_ADMIN_PASS = "admin888";

// GET all orders (Admin only)
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${MOCK_ADMIN_PASS}`) {
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

        // Map them together
        const formattedOrders = (orders || []).map(order => {
            const orderItems = (items || []).filter(item => item.order_id === order.id);
            const orderAccounts = (vaultAccounts || []).filter(acc => acc.assigned_order_id === order.id);

            return {
                id: order.public_id,
                email: order.email,
                cryptoType: order.crypto_type,
                txid: order.txid,
                status: order.status,
                txVerified: order.tx_verified,
                totalAmount: Number(order.total_amount),
                createdAt: order.created_at,
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

// POST: Fullfill an order (Deliver accounts)
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${MOCK_ADMIN_PASS}`) {
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
            product_id: 'auto-fulfillment', // We could map specifically but this works for now
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
