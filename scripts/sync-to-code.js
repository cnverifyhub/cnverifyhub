const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('Fetching products from Supabase...');
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Fetch error:', error);
    process.exit(1);
  }

  // Transform data to ensure it matches the Product type structure
  const normalizedProducts = products.map(p => {
    // Convert nulls to undefined
    const cleanProduct = Object.fromEntries(
      Object.entries(p).map(([k, v]) => [k, v === null ? undefined : v])
    );

    const metadata = p.metadata || {};

    // Drop database-only fields
    delete cleanProduct.created_at;
    delete cleanProduct.updated_at;
    delete cleanProduct.metadata;

    // Map snake_case to camelCase
    const mappings = {
      stock_count: 'stockCount',
      sort_order: 'sortOrder',
      delivery_method: 'deliveryMethod',
      delivery_time: 'deliveryTime',
      stock_status: 'stockStatus',
      review_count: 'reviewCount',
      sold_count: 'soldCount',
      featured_image: 'featuredImage',
      og_image: 'ogImage',
      tier_slug: 'tierSlug'
    };

    Object.entries(mappings).forEach(([snake, camel]) => {
      if (snake in cleanProduct) {
        cleanProduct[camel] = cleanProduct[snake];
        delete cleanProduct[snake];
      }
    });

    // Construct nested name object if missing
    if (!cleanProduct.name && (cleanProduct.name_en || cleanProduct.name_zh)) {
      cleanProduct.name = {
        en: cleanProduct.name_en || '',
        zh: cleanProduct.name_zh || ''
      };
    }

    // Map fields that need { zh, en }
    const localizedFields = ['tierName', 'description', 'warranty', 'deliveryTime', 'badge'];
    localizedFields.forEach(field => {
      // First try to check metadata
      let val = metadata[field];
      if (val) {
        if (typeof val === 'string') {
          cleanProduct[field] = { en: val, zh: val };
        } else {
          cleanProduct[field] = { en: val.en || '', zh: val.zh || '' };
        }
      } else {
        // Fallback to snake_case text columns from products table
        let snakeField = field;
        if (field === 'tierName') snakeField = 'tier_name';
        if (field === 'deliveryTime') snakeField = 'delivery_time';
        
        const enVal = cleanProduct[`${snakeField}_en`] || cleanProduct.name_en || '';
        const zhVal = cleanProduct[`${snakeField}_zh`] || cleanProduct.name_zh || '';
        cleanProduct[field] = { en: String(enVal), zh: String(zhVal) };
      }
    });

    // Ensure required fields exist
    if (!cleanProduct.slug) cleanProduct.slug = cleanProduct.id || '';
    if (!cleanProduct.tierSlug) cleanProduct.tierSlug = cleanProduct.id || '';
    
    // Construct price object (PricingTier)
    if (!cleanProduct.price) {
      cleanProduct.price = {
        single: Number(cleanProduct.price_usdt || cleanProduct.price_single || 0),
        bulk10: Number(cleanProduct.price_bulk_10 || cleanProduct.price_bulk10 || 0),
        bulk50: Number(cleanProduct.price_bulk_50 || cleanProduct.price_bulk50 || 0),
        bulk200: Number(cleanProduct.price_bulk_200 || cleanProduct.price_bulk200 || 0)
      };
      
      // Add optional originalPrice if exists
      const originalSingle = cleanProduct.price_old_usdt || cleanProduct.original_price_single;
      if (originalSingle) {
        cleanProduct.price.originalPrice = {
          single: Number(originalSingle),
          bulk10: Number(cleanProduct.price_old_bulk_10 || cleanProduct.original_price_bulk10 || originalSingle),
          bulk50: Number(cleanProduct.price_old_bulk_50 || cleanProduct.original_price_bulk50 || originalSingle),
          bulk200: Number(cleanProduct.price_old_bulk_200 || cleanProduct.original_price_bulk200 || originalSingle)
        };
      }
    }

    // Clean up unnecessary keys to save bundle size
    const databaseOnlyFields = [
      'price_single', 'price_bulk10', 'price_bulk50', 'price_bulk200',
      'original_price_single', 'original_price_bulk10', 'original_price_bulk50', 'original_price_bulk200',
      'price_usdt', 'price_old_usdt', 'price_cny', 'price_old_cny',
      'price_bulk_10', 'price_bulk_50', 'price_bulk_200', 'price_bulk_10_cny', 'price_bulk_50_cny', 'price_bulk_200_cny',
      'price_old_bulk_10', 'price_old_bulk_50', 'price_old_bulk_200',
      'name_zh', 'name_en', 'tier_name_zh', 'tier_name_en', 'description_zh', 'description_en',
      'warranty_zh', 'warranty_en', 'delivery_time_zh', 'delivery_time_en', 'badge_zh', 'badge_en',
      'is_active', 'variant'
    ];
    databaseOnlyFields.forEach(f => delete cleanProduct[f]);
    
    return {
      ...cleanProduct,
      category: cleanProduct.category ? cleanProduct.category.toLowerCase() : 'other'
    };
  });

  const content = `// Auto-generated from Supabase. Do not edit manually.
import { Product } from '@/types';

export const products: Product[] = ${JSON.stringify(normalizedProducts, null, 2)};
`;

  const filePath = path.join(process.cwd(), 'src/data/db-products.ts');
  fs.writeFileSync(filePath, content);
  console.log(`Successfully synced ${products.length} products to ${filePath}`);
}

sync().catch(console.error);
