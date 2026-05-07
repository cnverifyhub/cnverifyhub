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
            .from('products')
            .select('*')
            .order('category', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Fetch Products Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== `Bearer ${ADMIN_PASS}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { 
            id, stockCount, priceUsdt, isActive, nameEn, nameZh,
            descEn, descZh, soldCount, rating, reviewCount,
            seoTitle, seoDesc, isPublished
        } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const updateFields: any = {};
        if (typeof stockCount === 'number') updateFields.stock_count = stockCount;
        if (typeof priceUsdt === 'number') updateFields.price_usdt = priceUsdt;
        if (typeof isActive === 'boolean') updateFields.is_active = isActive;
        if (nameEn) updateFields.name_en = nameEn;
        if (nameZh) updateFields.name_zh = nameZh;
        
        // Extended fields
        if (descEn !== undefined) updateFields.description_en = descEn;
        if (descZh !== undefined) updateFields.description_zh = descZh;
        if (typeof soldCount === 'number') updateFields.sold_count = soldCount;
        if (typeof rating === 'number') updateFields.rating = rating;
        if (typeof reviewCount === 'number') updateFields.review_count = reviewCount;
        if (seoTitle) updateFields.seo_title = seoTitle;
        if (seoDesc) updateFields.seo_description = seoDesc;
        if (typeof isPublished === 'boolean') updateFields.is_published = isPublished;

        const { error } = await supabase
            .from('products')
            .update(updateFields)
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update Product Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
