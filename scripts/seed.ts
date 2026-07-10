import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import our local data directly from the src directory
import { categories, allProducts } from '../src/data/products';

async function seedDatabase() {
  console.log("🌱 Starting Supabase Seeding Process...");

  // 1. Seed Categories
  console.log("\n📦 Seeding Categories...");
  const categoriesData = categories.map(c => ({
    id: c.id,
    name_zh: c.name.zh,
    name_en: c.name.en,
    description_zh: c.description.zh,
    description_en: c.description.en,
    icon: c.icon,
    color: c.color,
    gradient: c.gradient,
    href: c.href
  }));
  
  const { error: catError } = await supabase.from('categories').upsert(categoriesData, { onConflict: 'id' });
  if (catError) console.error("❌ Error seeding categories:", catError);
  else console.log(`✅ successfully upserted ${categoriesData.length} categories.`);

  // 2. Seed Products
  console.log("\n🛍️ Seeding Products...");
  const productsData = allProducts.map(p => {
    const originalSingle = p.price.originalPrice?.single || null;
    const originalBulk10 = p.price.originalPrice?.bulk10 || null;
    const originalBulk50 = p.price.originalPrice?.bulk50 || null;
    const originalBulk200 = p.price.originalPrice?.bulk200 || null;

    // Filter metadata to avoid redundant storage
    const metadata: any = { ...p };
    delete metadata.id;
    delete metadata.category;
    delete metadata.tierSlug;
    delete metadata.tierName;
    delete metadata.price;
    delete metadata.stockCount;
    delete metadata.sortOrder;

    return {
      id: p.id,
      category_id: p.category,
      category: p.category.toUpperCase(),
      tier_slug: p.tierSlug,
      tier_name_zh: p.tierName.zh,
      tier_name_en: p.tierName.en,
      name_zh: p.name?.zh || p.tierName.zh,
      name_en: p.name?.en || p.tierName.en,
      description_zh: p.description.zh,
      description_en: p.description.en,
      
      // Standard schema pricing columns
      price_single: p.price.single,
      price_bulk10: p.price.bulk10,
      price_bulk50: p.price.bulk50,
      price_bulk200: p.price.bulk200,
      original_price_single: originalSingle,
      original_price_bulk10: originalBulk10,
      original_price_bulk50: originalBulk50,
      original_price_bulk200: originalBulk200,

      // USDT counterparts
      price_usdt: p.price.single,
      price_old_usdt: originalSingle || 0,
      price_bulk_10: p.price.bulk10,
      price_bulk_50: p.price.bulk50,
      price_bulk_200: p.price.bulk200,
      price_old_bulk_10: originalBulk10 || 0,
      price_old_bulk_50: originalBulk50 || 0,
      price_old_bulk_200: originalBulk200 || 0,

      // Other fields
      features: JSON.stringify(p.features || []),
      warranty_zh: p.warranty?.zh || '',
      warranty_en: p.warranty?.en || '',
      delivery_time_zh: p.deliveryTime?.zh || '',
      delivery_time_en: p.deliveryTime?.en || '',
      stock_count: p.stockCount,
      popular: p.popular || false,
      badge_zh: p.badge?.zh || null,
      badge_en: p.badge?.en || null,
      sort_order: p.sortOrder,
      
      slug: p.slug || p.id,
      subcategory: p.subcategory || null,
      type: p.type || 'account',
      compare_at_price: originalSingle,
      includes: p.includes || null,
      requirements: p.requirements ? (p.requirements.list || null) : null,
      delivery_method: p.deliveryMethod || 'auto',
      delivery_time: p.deliveryTime?.zh || null,
      is_published: p.isPublished !== false,
      seo_title: p.seoTitle || null,
      seo_description: p.seoDescription || null,
      featured_image: p.featuredImage || null,
      og_image: p.ogImage || null,
      
      metadata: metadata,
      is_active: true
    };
  });

  const { error: prodError } = await supabase.from('products').upsert(productsData, { onConflict: 'id' });
  if (prodError) console.error("❌ Error seeding products:", prodError);
  else console.log(`✅ successfully upserted ${productsData.length} products.`);

  console.log("\n🚀 Seeding Complete! Your Supabase database is now populated.");
}

seedDatabase().catch(console.error);
