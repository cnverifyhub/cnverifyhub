import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order, items } = body;

        // 1. Insert the main order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                public_id: order.id,
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
            price_at_time: item.priceAtTime || 0 // Should ideally be fetched from data/products on server
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            console.error('Supabase Items Error:', itemsError);
            // Non-critical if order exists, but ideally we'd rollback
            return NextResponse.json({ error: 'Order created but failed to save items' }, { status: 500 });
        }

        return NextResponse.json({ success: true, orderId: orderData.id });
    } catch (error) {
        console.error('API Order Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
