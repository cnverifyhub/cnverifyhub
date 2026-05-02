import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

/**
 * GET /api/orders/service/[id] - Get service order details
 * PATCH /api/orders/service/[id] - Update status or data (Admin/Customer)
 */

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { data, error } = await supabase
            .from('service_orders')
            .select(`
                *,
                product:products(name_en, name_zh, description_en, description_zh, requirements),
                order:orders(public_id, email, telegram, status)
            `)
            .eq('id', params.id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Service order not found' }, { status: 404 });
        }

        return NextResponse.json({ service: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { status, requirementsData, resultData, assignedTo, requirementsSubmitted } = body;

        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (status) updateData.status = status;
        if (requirementsData) updateData.requirements_data = requirementsData;
        if (resultData) updateData.result_data = resultData;
        if (assignedTo) updateData.assigned_to = assignedTo;
        if (requirementsSubmitted !== undefined) updateData.requirements_submitted = requirementsSubmitted;

        const { data, error } = await supabase
            .from('service_orders')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, service: data });
    } catch (error: any) {
        console.error('[API Service Order PATCH] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
