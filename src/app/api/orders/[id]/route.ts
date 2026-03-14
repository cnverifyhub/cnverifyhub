import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!id || !email) {
        return NextResponse.json({ error: 'Order ID and email are required' }, { status: 400 });
    }

    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*)
            `)
            .eq('public_id', id)
            .eq('email', email)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Fetch delivered accounts if completed
        let deliveredAccounts: string[] = [];
        if (order.status === 'completed') {
            const { data: accounts } = await supabase
                .from('vault_accounts')
                .select('credentials')
                .eq('assigned_order_id', order.id);
            
            if (accounts) {
                deliveredAccounts = accounts.map(a => a.credentials);
            }
        }

        return NextResponse.json({
            ...order,
            deliveredAccounts
        });
    } catch (error) {
        console.error('Order Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
