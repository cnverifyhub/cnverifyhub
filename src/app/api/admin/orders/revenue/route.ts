import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Sawmik888';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        const { data: orders, error } = await supabase
            .from('orders')
            .select('created_at, total_amount, status')
            .gte('created_at', sevenDaysAgo.toISOString())
            .eq('status', 'completed');

        if (error) throw error;

        // Group by day
        const dailyRevenue: Record<string, number> = {};
        
        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
            const dateStr = date.toISOString().split('T')[0];
            dailyRevenue[dateStr] = 0;
        }

        orders.forEach(order => {
            const dateStr = new Date(order.created_at).toISOString().split('T')[0];
            if (dailyRevenue[dateStr] !== undefined) {
                dailyRevenue[dateStr] += Number(order.total_amount);
            }
        });

        const formattedData = Object.entries(dailyRevenue).map(([date, amount]) => ({
            date,
            amount: Number(amount.toFixed(2))
        }));

        return NextResponse.json(formattedData);

    } catch (error) {
        console.error('Revenue API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
