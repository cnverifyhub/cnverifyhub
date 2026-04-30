import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Sawmik888';

function isAuthorized(request: NextRequest): boolean {
    return request.headers.get('Authorization') === `Bearer ${ADMIN_PASS}`;
}

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Query 1: Fetch all profiles
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profilesError) {
            console.error('[Admin Users GET] Supabase error:', profilesError);
            return NextResponse.json(
                { error: 'Database error', details: profilesError.message, hint: profilesError.hint, code: profilesError.code },
                { status: 500 }
            );
        }

        // Query 2: Fetch all orders with user_id + total_amount + status
        // (Separate query to avoid PostgREST schema cache issues with FK joins)
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('user_id, total_amount, status')
            .in('status', ['paid', 'completed'])
            .not('user_id', 'is', null);

        if (ordersError) {
            console.warn('[Admin Users GET] Could not fetch orders for spend calc:', ordersError.message);
        }

        // Build a map: userId → total spent
        const spendMap = new Map<string, number>();
        for (const order of orders || []) {
            if (!order.user_id) continue;
            spendMap.set(order.user_id, (spendMap.get(order.user_id) || 0) + Number(order.total_amount || 0));
        }

        // Merge: use dynamic value if higher than the cached column
        const enrichedProfiles = (profiles || []).map((p: any) => ({
            ...p,
            total_spent: Math.max(spendMap.get(p.id) || 0, Number(p.total_spent || 0))
        }));

        return NextResponse.json(enrichedProfiles);
    } catch (err: any) {
        console.error('[Admin Users GET] Unexpected error:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err?.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { email, telegram, displayName, vipTier, password } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if profile already exists
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existing) {
            // Update existing profile
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    telegram: telegram || null,
                    display_name: displayName || null,
                    vip_tier: vipTier || 'bronze',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json({ success: true, user: data, created: false });
        }

        // Create real auth user (DB trigger will auto-create profile)
        const tempPassword = password || `CNW-${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-6).toUpperCase()}!`;

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { telegram, is_admin_created: true, display_name: displayName },
        });

        if (authError) {
            console.error('[Admin Users POST] Auth create error:', authError);
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Update profile with extra fields (trigger created it already)
        if (telegram || vipTier || displayName) {
            await supabase
                .from('profiles')
                .update({
                    telegram: telegram || null,
                    display_name: displayName || null,
                    vip_tier: vipTier || 'bronze',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', authData.user.id);
        }

        return NextResponse.json({
            success: true,
            created: true,
            userId: authData.user.id,
            tempPassword,
        });
    } catch (err: any) {
        console.error('[Admin Users POST] Error:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err?.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, vipTier, totalSpent, telegram, displayName } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (vipTier !== undefined) updateFields.vip_tier = vipTier;
        if (typeof totalSpent === 'number') updateFields.total_spent = totalSpent;
        if (telegram !== undefined) updateFields.telegram = telegram;
        if (displayName !== undefined) updateFields.display_name = displayName;

        const { error } = await supabase.from('profiles').update(updateFields).eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Admin Users PATCH] Error:', err);
        return NextResponse.json({ error: 'Internal Server Error', details: err?.message }, { status: 500 });
    }
}
