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
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*, orders(total_amount, status)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Admin Users GET] Supabase error:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint,
            });
            return NextResponse.json(
                { error: 'Database error', details: error.message, hint: error.hint, code: error.code },
                { status: 500 }
            );
        }

        const enrichedProfiles = (profiles || []).map((p: any) => {
            const validOrders = p.orders ? p.orders.filter((o: any) => o.status === 'completed' || o.status === 'paid') : [];
            const dynamicTotalSpent = validOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
            
            // Remove the orders array before sending to client to save bandwidth
            const { orders, ...profileData } = p;
            
            return {
                ...profileData,
                // Use the calculated total if it's greater than the cached one
                total_spent: Math.max(dynamicTotalSpent, Number(p.total_spent || 0))
            };
        });

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
