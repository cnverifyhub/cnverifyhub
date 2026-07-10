const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('--- STARTING PRODUCT SYNC (Full Schema Integration) ---');

  const productsFilePath = path.join(__dirname, '../src/data/products.ts');
  const content = fs.readFileSync(productsFilePath, 'utf8');

  const extractArray = (name) => {
    const regex = new RegExp(`const ${name}: Product\\[\\] = \\[([\\s\\S]*?)\\];`, 'g');
    const match = regex.exec(content);
    if (!match) return [];
    let str = match[1];
    str = str.replace(/: [A-Z][a-z]+/g, '');
    str = str.replace(/\/\/.*$/gm, '');
    try {
      return eval(`[${str}]`);
    } catch (e) {
      console.error(`Failed to parse ${name}:`, e.message);
      return [];
    }
  };

  const wechat = extractArray('wechatProducts');
  const alipay = extractArray('alipayProducts');
  const douyin = extractArray('douyinProducts');
  const qq = extractArray('qqProducts');
  const xianyu = extractArray('xianyuProducts');
  const taobao = extractArray('taobaoProducts');
  const xiaohongshu = extractArray('xiaohongshuProducts');
  const bundle = extractArray('bundleProducts');
  const verification = extractArray('verificationProducts');
  const trading = extractArray('tradingProducts');

  const allProducts = [
    ...wechat, ...alipay, ...douyin, ...qq, ...xianyu, 
    ...taobao, ...xiaohongshu, ...bundle, ...verification, ...trading
  ];

  console.log(`Extracted ${allProducts.length} products total.`);

  // Sync Products to database
  console.log('Syncing products to Supabase...');
  for (const prod of allProducts) {
    const originalSingle = prod.price.originalPrice?.single || null;
    const originalBulk10 = prod.price.originalPrice?.bulk10 || null;
    const originalBulk50 = prod.price.originalPrice?.bulk50 || null;
    const originalBulk200 = prod.price.originalPrice?.bulk200 || null;

    // Filter metadata to avoid redundant storage
    const metadata = { ...prod };
    delete metadata.id;
    delete metadata.category;
    delete metadata.tierSlug;
    delete metadata.tierName;
    delete metadata.price;
    delete metadata.stockCount;
    delete metadata.sortOrder;

    const payload = {
      id: prod.id,
      category_id: prod.category,
      category: prod.category.toUpperCase(),
      tier_slug: prod.tierSlug,
      tier_name_zh: prod.tierName.zh,
      tier_name_en: prod.tierName.en,
      name_zh: prod.name?.zh || prod.tierName.zh,
      name_en: prod.name?.en || prod.tierName.en,
      description_zh: prod.description.zh,
      description_en: prod.description.en,
      
      // Pricing
      price_single: prod.price.single,
      price_bulk10: prod.price.bulk10,
      price_bulk50: prod.price.bulk50,
      price_bulk200: prod.price.bulk200,
      original_price_single: originalSingle,
      original_price_bulk10: originalBulk10,
      original_price_bulk50: originalBulk50,
      original_price_bulk200: originalBulk200,
      
      // USDT counterparts
      price_usdt: prod.price.single,
      price_old_usdt: originalSingle || 0,
      price_bulk_10: prod.price.bulk10,
      price_bulk_50: prod.price.bulk50,
      price_bulk_200: prod.price.bulk200,
      price_old_bulk_10: originalBulk10 || 0,
      price_old_bulk_50: originalBulk50 || 0,
      price_old_bulk_200: originalBulk200 || 0,

      // Other fields
      features: prod.features || [],
      warranty_zh: prod.warranty?.zh || '',
      warranty_en: prod.warranty?.en || '',
      delivery_time_zh: prod.deliveryTime?.zh || '',
      delivery_time_en: prod.deliveryTime?.en || '',
      stock_count: prod.stockCount,
      popular: prod.popular || false,
      badge_zh: prod.badge?.zh || null,
      badge_en: prod.badge?.en || null,
      sort_order: prod.sortOrder,
      
      slug: prod.slug || prod.id,
      subcategory: prod.subcategory || null,
      type: prod.type || 'account',
      compare_at_price: originalSingle,
      includes: prod.includes || null,
      requirements: prod.requirements ? (prod.requirements.list || null) : null,
      delivery_method: prod.deliveryMethod || 'auto',
      delivery_time: prod.deliveryTime?.zh || null,
      is_published: prod.isPublished !== false,
      seo_title: prod.seoTitle || null,
      seo_description: prod.seoDescription || null,
      featured_image: prod.featuredImage || null,
      og_image: prod.ogImage || null,
      
      metadata: metadata,
      is_active: true
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error(`Error syncing product ${prod.id}:`, error.message);
    } else {
      console.log(`Synced: ${prod.id}`);
    }
  }

  console.log('--- SYNC COMPLETE ---');
}

sync().catch(console.error);
