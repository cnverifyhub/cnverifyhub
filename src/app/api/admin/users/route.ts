import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Sawmik888';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Fetch Users Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { email, telegram, displayName, vipTier, totalSpent } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // We use a random UUID since this might be a manual profile not linked to Auth yet
        // If they register later with this email, the profile will already exist.
        // NOTE: In a real app, you might want to handle the auth.users link more carefully.
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: crypto.randomUUID(), // Fallback UUID
                email,
                telegram,
                display_name: displayName,
                vip_tier: vipTier || 'bronze',
                total_spent: totalSpent || 0,
                updated_at: new Date().toISOString()
            }, { onConflict: 'email' })
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, user: data });
    } catch (error) {
        console.error('Create User Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, vipTier, totalSpent, telegram } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updateFields: any = {};
        if (vipTier) updateFields.vip_tier = vipTier;
        if (typeof totalSpent === 'number') updateFields.total_spent = totalSpent;
        if (telegram !== undefined) updateFields.telegram = telegram;
        updateFields.updated_at = new Date().toISOString();

        const { error } = await supabase
            .from('profiles')
            .update(updateFields)
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update User Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
