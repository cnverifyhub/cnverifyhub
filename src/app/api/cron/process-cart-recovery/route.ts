import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;
        if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized: Invalid or missing Cron secret' },
                { status: 401 }
            );
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnverifyhub.com';
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // Fetch abandoned carts that:
        // 1. Haven't been recovered
        // 2. Have sent fewer than 3 reminders
        // 3. Were created at least 1 hour ago
        // 4. Have not received a reminder in the last 24 hours (or never)
        const { data: abandonedCarts, error } = await supabase
            .from('cart_recoveries')
            .select('*')
            .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
            .eq('recovered', false)
            .lt('created_at', oneHourAgo)
            .or(`reminder_count.is.null,reminder_count.lt.3`)
            .or(`last_reminder_sent_at.is.null,last_reminder_sent_at.lt.${oneDayAgo}`)
            .limit(20);

        if (error) {
            // Fallback query if columns reminder_count/last_reminder_sent_at are not yet created in remote DB
            console.warn('[CartRecovery] Advanced filter fallback:', error.message);
            const { data: fallbackCarts, error: fallbackError } = await supabase
                .from('cart_recoveries')
                .select('*')
                .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
                .eq('recovered', false)
                .is('sent_at', null)
                .lt('created_at', oneHourAgo)
                .limit(20);

            if (fallbackError) throw fallbackError;
            if (!fallbackCarts || fallbackCarts.length === 0) {
                return NextResponse.json({ success: true, message: 'No carts to recover' });
            }

            return await processAndSendCartEmails(fallbackCarts, siteUrl);
        }

        if (!abandonedCarts || abandonedCarts.length === 0) {
            return NextResponse.json({ success: true, message: 'No carts to recover' });
        }

        return await processAndSendCartEmails(abandonedCarts, siteUrl);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function processAndSendCartEmails(carts: any[], siteUrl: string) {
    const couponCode = 'RECOVER5';
    const now = new Date().toISOString();

    const emailsToSend = carts.map((cart) => {
        const checkoutUrl = `${siteUrl}/checkout?coupon=${couponCode}&email=${encodeURIComponent(cart.email)}`;

        return {
            from: process.env.RESEND_FROM || 'CNVerifyHub <support@cnverifyhub.com>',
            to: cart.email,
            subject: '⚡ Complete your order & claim 5% OFF | CNVerifyHub',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1526; color: #F0F4FF; padding: 32px; border-radius: 12px; border: 1px solid #1E2D45;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <span style="display: inline-block; background: rgba(255, 0, 54, 0.15); border: 1px solid rgba(255, 0, 54, 0.35); color: #FF2D55; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">
                            Exclusive 5% Discount Inside
                        </span>
                        <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 800; margin: 16px 0 8px 0;">
                            Did you forget something in your cart?
                        </h1>
                        <p style="color: #7B91B0; font-size: 14px; line-height: 1.6; margin: 0;">
                            Your verified digital assets are reserved for a limited time. Complete your order now and take <strong>5% OFF</strong> with coupon code <strong>${couponCode}</strong>.
                        </p>
                    </div>

                    <div style="background: #060B18; border: 2px dashed #00E5FF; border-radius: 10px; padding: 18px; text-align: center; margin: 24px 0;">
                        <span style="font-size: 11px; font-family: monospace; color: #00E5FF; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">5% Instant Checkout Code</span>
                        <span style="font-size: 26px; font-weight: 900; color: #FFFFFF; letter-spacing: 4px; font-family: monospace;">${couponCode}</span>
                    </div>

                    <div style="text-align: center; margin: 28px 0;">
                        <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF0036 0%, #C0001A 100%); color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 14px rgba(255,0,54,0.35);">
                            Return to Checkout with 5% OFF →
                        </a>
                    </div>

                    <div style="border-top: 1px solid #1E2D45; padding-top: 20px; text-align: center; font-size: 12px; color: #455773;">
                        <p style="margin: 0 0 6px 0;">CNVerifyHub • Instant Crypto Automated Delivery • 72-Hour Warranty</p>
                        <p style="margin: 0;">If you already completed this purchase, please ignore this email.</p>
                    </div>
                </div>
            `,
        };
    });

    if (emailsToSend.length > 0) {
        try {
            await resend.batch.send(emailsToSend);
        } catch (resendErr) {
            console.warn('[CartRecovery] Resend batch send error:', resendErr);
        }
    }

    // Update reminder tracking
    for (const cart of carts) {
        const nextCount = (cart.reminder_count || 0) + 1;
        await supabase
            .from('cart_recoveries')
            .update({
                sent_at: now,
                last_reminder_sent_at: now,
                reminder_count: nextCount,
            })
            .eq('id', cart.id);
    }

    return NextResponse.json({ success: true, count: carts.length });
}
