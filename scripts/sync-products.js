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
  console.log('--- STARTING PRODUCT SYNC (Existing Schema) ---');

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

  const allProducts = [...wechat, ...alipay, ...douyin, ...qq, ...xianyu, ...taobao, ...xiaohongshu];

  console.log(`Extracted ${allProducts.length} products.`);

  // Sync Products to existing schema
  console.log('Syncing products...');
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
        console.error(`Error syncing product ${prod.id}:`, error.message);
    } else {
        console.log(`Synced: ${prod.id}`);
    }
  }

  console.log('--- SYNC COMPLETE ---');
}

sync();
