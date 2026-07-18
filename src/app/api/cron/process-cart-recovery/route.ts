import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    try {
        // Fetch cart recoveries that haven't been recovered and haven't been sent an email yet
        // and are older than 1 hour.
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const { data: abandonedCarts, error } = await supabase
            .from('cart_recoveries')
            .select('*')
            .eq('recovered', false)
            .is('sent_at', null)
            .lt('created_at', oneHourAgo)
            .limit(10); // Process in batches

        if (error) throw error;
        if (!abandonedCarts || abandonedCarts.length === 0) {
            return NextResponse.json({ success: true, message: 'No carts to recover' });
        }

        const emailsToSend = abandonedCarts.map(cart => ({
            from: process.env.RESEND_FROM || 'CNVerifyHub <support@cnverifyhub.com>',
            to: cart.email,
            subject: 'Did you forget something? Complete your CNVerifyHub order',
            html: `
                <h2>Hi there,</h2>
                <p>We noticed you left some items in your cart at CNVerifyHub.</p>
                <p>Complete your purchase now to secure your digital assets!</p>
                <br />
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/checkout">Return to Checkout</a>
            `,
        }));

        if (emailsToSend.length > 0) {
            await resend.batch.send(emailsToSend);
        }

        // Mark them as sent
        const cartIds = abandonedCarts.map(c => c.id);
        const { error: updateError } = await supabase
            .from('cart_recoveries')
            .update({ sent_at: new Date().toISOString() })
            .in('id', cartIds);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, count: abandonedCarts.length });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
