import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, cart } = body;

        if (!email || !cart) {
            return NextResponse.json({ error: 'Missing email or cart data' }, { status: 400 });
        }

        // Upsert or insert depending on if they already have an active abandoned cart
        const { error } = await supabase
            .from('cart_recoveries')
            .insert({
                email,
                cart_snapshot: cart,
                recovered: false,
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
