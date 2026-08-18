import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import { getTenantId } from '@/lib/tenant-context';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const tenantId = getTenantId(req);
        const { code, email, apply, orderId } = await req.json();
        if (!code) {
            return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
        }

        const normalizedCode = code.toUpperCase().trim();
        if (normalizedCode.startsWith('REF-')) {
            const { data: ref, error: refError } = await supabase
                .from('referrals')
                .select('*')
                .eq('referral_code', normalizedCode)
                .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
                .maybeSingle();
            if (refError || !ref) {
                return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
            }
            return NextResponse.json({
                success: true,
                valid: true,
                discount_type: 'percent',
                discount_value: 5,
                is_referral: true
            });
        }

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', normalizedCode)
            .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
            .maybeSingle();

        if (error || !coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        if ((coupon.used_count || 0) >= (coupon.max_uses || 1)) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
        }

        if (email) {
            const { data: existingUse } = await supabase
                .from('coupon_uses')
                .select('id')
                .eq('coupon_code', normalizedCode)
                .eq('email', email.toLowerCase().trim())
                .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
                .maybeSingle();

            if (existingUse) {
                return NextResponse.json({ error: 'Coupon has already been used by this email' }, { status: 400 });
            }
        }

        if (apply && email) {
            await supabase
                .from('coupons')
                .update({ used_count: (coupon.used_count || 0) + 1 })
                .eq('id', coupon.id);

            await supabase
                .from('coupon_uses')
                .insert({
                    coupon_id: coupon.id,
                    coupon_code: normalizedCode,
                    email: email.toLowerCase().trim(),
                    order_id: orderId || null,
                    tenant_id: 'cnverifyhub'
                });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

