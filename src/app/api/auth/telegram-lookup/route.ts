import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Rate limiting: max 5 attempts per IP per 15 min
const attemptMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = attemptMap.get(ip);
    if (!entry || now > entry.resetAt) {
        attemptMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
        return true;
    }
    if (entry.count >= 5) return false;
    entry.count++;
    return true;
}

function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***@***.***';
    const masked = local[0] + '*'.repeat(Math.max(local.length - 1, 3));
    return `${masked}@${domain}`;
}

export async function POST(request: NextRequest) {
    const ip =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        'unknown';

    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { error: 'Too many attempts. Please wait 15 minutes and try again.' },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const { telegram, orderId } = body;

        if (!telegram || !orderId) {
            return NextResponse.json(
                { error: 'Telegram handle and Order ID are required' },
                { status: 400 }
            );
        }

        const cleanTelegram = telegram.replace('@', '').trim().toLowerCase();
        const cleanOrderId = orderId.trim().toUpperCase();

        if (!cleanOrderId.startsWith('CNW-')) {
            return NextResponse.json(
                { error: 'Invalid Order ID format. Must start with CNW-', hint: 'e.g. CNW-123456' },
                { status: 400 }
            );
        }

        // Find order by public_id
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('email, telegram, user_id, public_id')
            .eq('public_id', cleanOrderId)
            .maybeSingle();

        if (orderError) {
            console.error('[telegram-lookup] Order query error:', orderError);
            return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
        }

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found. Check your Order ID (format: CNW-XXXXXX).' },
                { status: 404 }
            );
        }

        // Verify telegram matches order
        const orderTelegram = (order.telegram || '').replace('@', '').trim().toLowerCase();
        if (orderTelegram !== cleanTelegram) {
            // Log suspicious attempt
            await supabaseAdmin.from('fraud_events').insert({
                event_type: 'telegram_lookup_mismatch',
                severity: 'medium',
                ip_address: ip,
                metadata: { attempted_telegram: cleanTelegram, order_id: cleanOrderId },
            });
            return NextResponse.json(
                { error: 'Telegram handle does not match this order. Contact support if you need help.' },
                { status: 403 }
            );
        }

        if (!order.email) {
            return NextResponse.json(
                { error: 'No email found for this account. Contact support on Telegram.' },
                { status: 404 }
            );
        }

        // Generate password reset link
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: order.email,
            options: {
                redirectTo: `${siteUrl}/auth/callback?redirect=/account`,
            },
        });

        if (linkError) {
            console.error('[telegram-lookup] Generate link error:', linkError);
            return NextResponse.json(
                { error: 'Could not send reset link. Contact support on Telegram.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            sent: true,
            emailHint: maskEmail(order.email),
            message: 'Password reset link sent to your email',
        });
    } catch (err: any) {
        console.error('[telegram-lookup] Unexpected error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
