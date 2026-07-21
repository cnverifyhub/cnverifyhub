import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, txHash, amount, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId missing' }, { status: 400 });
    }

    // Update order status to paid which triggers database stock decrement
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        payment_details: {
          txHash,
          amount,
          paymentMethod: paymentMethod || 'x402',
          paidAt: new Date().toISOString()
        }
      })
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      console.error('Failed to update order status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, status: 'paid', order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment webhook error' }, { status: 500 });
  }
}
