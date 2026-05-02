import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

/**
 * GET /api/orders/service - List service orders (Admin only)
 * POST /api/orders/service - Create a service order manually (if needed)
 */

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const assignedTo = searchParams.get('assignedTo');

        let query = supabase
            .from('service_orders')
            .select(`
                *,
                product:products(name_en, name_zh),
                order:orders(public_id, email, telegram)
            `);

        if (status) query = query.eq('status', status);
        if (assignedTo) query = query.eq('assigned_to', assignedTo);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ services: data || [] });
    } catch (error: any) {
        console.error('[API Service Order GET] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
