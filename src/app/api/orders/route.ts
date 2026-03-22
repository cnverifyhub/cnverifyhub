import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// POST — Create a new order
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order, items } = body;

        // 1. Insert the main order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                public_id: order.id,
                user_id: order.userId || null, // Link to auth user if available
                email: order.email,
                telegram: order.telegram,
                crypto_type: order.cryptoType || 'USDT',
                total_amount: order.totalAmount,
                status: 'pending'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Supabase Order Error:', orderError);
            return NextResponse.json({ error: 'Failed to create order in database' }, { status: 500 });
        }

        // 2. Insert order items
        const orderItems = items.map((item: any) => ({
            order_id: orderData.id,
            product_id: item.productId,
            quantity: item.quantity,
            price_at_time: item.priceAtTime || 0
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Supabase Items Error:', itemsError);
            return NextResponse.json({ error: 'Order created but failed to save items' }, { status: 500 });
        }

        return NextResponse.json({ success: true, orderId: orderData.id, publicId: orderData.public_id });
    } catch (error) {
        console.error('API Order Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET — Fetch orders (by email or public_id)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const publicId = searchParams.get('id');
        const status = searchParams.get('status');

        let query = supabase
            .from('orders')
            .select('*, order_items(*)');

        if (publicId) {
            query = query.eq('public_id', publicId);
        } else if (email) {
            query = query.eq('email', email);
        } else {
            return NextResponse.json({ error: 'Email or order ID required' }, { status: 400 });
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query.order('created_at', { ascending: false }).limit(50);

        if (error) {
            console.error('Fetch Orders Error:', error);
            return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
        }

        return NextResponse.json({ orders: data || [] });
    } catch (error) {
        console.error('API GET Orders Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
