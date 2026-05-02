import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local");
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
  const productsData = allProducts.map(p => ({
    id: p.id,
    category_id: p.category,
    tier_name_zh: p.tierName.zh,
    tier_name_en: p.tierName.en,
    tier_slug: p.tierSlug,
    description_zh: p.description.zh,
    description_en: p.description.en,
    price_single: p.price.single,
    price_bulk10: p.price.bulk10,
    price_bulk50: p.price.bulk50,
    price_bulk200: p.price.bulk200,
    original_price_single: p.price.originalPrice?.single || null,
    original_price_bulk10: p.price.originalPrice?.bulk10 || null,
    original_price_bulk50: p.price.originalPrice?.bulk50 || null,
    original_price_bulk200: p.price.originalPrice?.bulk200 || null,
    features: JSON.stringify(p.features),
    warranty_zh: p.warranty?.zh || null,
    warranty_en: p.warranty?.en || null,
    delivery_time_zh: p.deliveryTime?.zh || null,
    delivery_time_en: p.deliveryTime?.en || null,
    stock_count: p.stockCount,
    popular: p.popular || false,
    badge_zh: p.badge?.zh || null,
    badge_en: p.badge?.en || null,
    sort_order: p.sortOrder
  }));

  const { error: prodError } = await supabase.from('products').upsert(productsData, { onConflict: 'id' });
  if (prodError) console.error("❌ Error seeding products:", prodError);
  else console.log(`✅ successfully upserted ${productsData.length} products.`);

  console.log("\n🚀 Seeding Complete! Your Supabase database is now populated.");
}

seedDatabase().catch(console.error);
