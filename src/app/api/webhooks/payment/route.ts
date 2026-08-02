import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');
    const secret = process.env.WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret configuration' },
        { status: 401 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);
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

