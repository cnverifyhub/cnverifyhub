import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
    try {
        const { code } = await req.json();
        if (!code) {
            return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
        }

        const normalizedCode = code.toUpperCase();
        if (normalizedCode.startsWith('REF-')) {
            const { data: ref, error: refError } = await supabase
                .from('referrals')
                .select('*')
                .eq('referral_code', normalizedCode)
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
            .maybeSingle();

        if (error || !coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
        }

        if (coupon.used_count >= coupon.max_uses) {
            return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
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
