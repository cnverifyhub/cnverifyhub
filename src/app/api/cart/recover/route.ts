import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const abandonId = searchParams.get('id');

  if (!abandonId) {
    return NextResponse.json({ error: 'Abandon ID missing' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('cart_abandonment')
      .update({ recovered_at: new Date().toISOString() })
      .eq('id', abandonId)
      .select('cart_items')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, items: data.cart_items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
