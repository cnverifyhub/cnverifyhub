import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';
import { allProducts } from '@/data/products';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Sawmik888';

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('--- ADMIN SYNC START ---');

        for (const prod of allProducts) {
            const { error } = await supabase
                .from('products')
                .upsert({
                    id: prod.id,
                    category: prod.category.toUpperCase(),
                    variant: prod.tierSlug,
                    name_en: prod.tierName.en,
                    name_zh: prod.tierName.zh,
                    stock_count: prod.stockCount,
                    price_usdt: prod.price.single,
                    is_active: true
                }, { onConflict: 'id' });
            
            if (error) {
                console.error(`Sync error for ${prod.id}:`, error.message);
            }
        }

        return NextResponse.json({ success: true, count: allProducts.length });
    } catch (error) {
        console.error('Sync Products Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
