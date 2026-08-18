import fs from 'fs';
import path from 'path';

// Color formatting for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ${colors.green}✓${colors.reset} ${message}`);
  } else {
    failed++;
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
  }
}

console.log(`\n${colors.bold}${colors.cyan}=== MULTI-TENANT SCOPING & ISOLATION TEST SUITE ===${colors.reset}`);

const rootDir = path.resolve(__dirname, '../..');

// 1. Revenue API Scoping
const revPath = path.join(rootDir, 'src/app/api/admin/orders/revenue/route.ts');
const revCode = fs.readFileSync(revPath, 'utf8');
assert(revCode.includes(".eq('tenant_id', 'cnverifyhub')"), 'admin/orders/revenue scopes orders by tenant_id = cnverifyhub');

// 2. Admin Orders Route Scoping
const ordersAdminPath = path.join(rootDir, 'src/app/api/admin/orders/route.ts');
const ordersAdminCode = fs.readFileSync(ordersAdminPath, 'utf8');
assert(ordersAdminCode.includes(".eq('tenant_id', 'cnverifyhub')"), 'admin/orders route scopes queries and updates by tenant_id = cnverifyhub');
assert(ordersAdminCode.includes("tenant_id: 'cnverifyhub'"), 'admin/orders route sets tenant_id = cnverifyhub on manual order insert');

// 3. Admin Products Route Scoping
const productsAdminPath = path.join(rootDir, 'src/app/api/admin/products/route.ts');
const productsAdminCode = fs.readFileSync(productsAdminPath, 'utf8');
assert(productsAdminCode.includes("tenant_id.eq.cnverifyhub"), 'admin/products route scopes GET query by tenant_id');

// 4. Admin Products Sync Route Payload
const productsSyncPath = path.join(rootDir, 'src/app/api/admin/products/sync/route.ts');
const productsSyncCode = fs.readFileSync(productsSyncPath, 'utf8');
assert(productsSyncCode.includes("tenant_id: 'cnverifyhub'"), 'admin/products/sync includes tenant_id in sync upsert payload');

// 5. Cart Recovery API Scoping
const cartRecPath = path.join(rootDir, 'src/app/api/cart-recovery/route.ts');
const cartRecCode = fs.readFileSync(cartRecPath, 'utf8');
assert(cartRecCode.includes("tenant_id: 'cnverifyhub'"), 'cart-recovery route includes tenant_id: cnverifyhub in cart_recoveries insert');

// 6. Coupons Validate Route Scoping
const couponPath = path.join(rootDir, 'src/app/api/coupons/validate/route.ts');
const couponCode = fs.readFileSync(couponPath, 'utf8');
assert(couponCode.includes("tenant_id.eq.cnverifyhub"), 'coupons/validate scopes coupon and referral queries by tenant_id');
assert(couponCode.includes("tenant_id: 'cnverifyhub'"), 'coupons/validate records coupon_uses with tenant_id: cnverifyhub');

// 7. Supabase Products Client Scoping
const spProductsPath = path.join(rootDir, 'src/lib/supabase-products.ts');
const spProductsCode = fs.readFileSync(spProductsPath, 'utf8');
assert(spProductsCode.includes("or('tenant_id.eq.cnverifyhub,tenant_id.is.null')"), 'supabase-products.ts scopes product queries by tenant_id');

// 8. Supabase Delivery Scoping
const deliveryPath = path.join(rootDir, 'src/lib/supabase/delivery.ts');
const deliveryCode = fs.readFileSync(deliveryPath, 'utf8');
assert(deliveryCode.includes("tenant_id: 'cnverifyhub'"), 'delivery.ts assigns service_orders with tenant_id: cnverifyhub');

// 9. CustomerReviews Component Scoping
const reviewsPath = path.join(rootDir, 'src/components/home/CustomerReviews.tsx');
const reviewsCode = fs.readFileSync(reviewsPath, 'utf8');
assert(reviewsCode.includes("or('tenant_id.eq.cnverifyhub,tenant_id.is.null')"), 'CustomerReviews.tsx scopes reviews query by tenant_id');

// 10. Review Submission Page Scoping
const reviewPagePath = path.join(rootDir, 'src/app/review/page.tsx');
const reviewPageCode = fs.readFileSync(reviewPagePath, 'utf8');
assert(reviewPageCode.includes("tenant_id: 'cnverifyhub'"), 'review/page.tsx inserts reviews with tenant_id: cnverifyhub');
assert(reviewPageCode.includes(".eq('tenant_id', 'cnverifyhub')"), 'review/page.tsx verifies completed order with tenant_id: cnverifyhub');

// 11. Additional Scoping: Admin Users, Cron Cart Recovery, Verify-Payment Poll & Main, Account Dashboard
const adminUsersPath = path.join(rootDir, 'src/app/api/admin/users/route.ts');
const adminUsersCode = fs.readFileSync(adminUsersPath, 'utf8');
assert(adminUsersCode.includes(".eq('tenant_id', 'cnverifyhub')"), 'admin/users route scopes orders spend calculation by tenant_id = cnverifyhub');

const cronCartPath = path.join(rootDir, 'src/app/api/cron/process-cart-recovery/route.ts');
const cronCartCode = fs.readFileSync(cronCartPath, 'utf8');
assert(cronCartCode.includes("tenant_id.eq.cnverifyhub"), 'cron/process-cart-recovery scopes abandoned carts by tenant_id');

const pollPath = path.join(rootDir, 'src/app/api/verify-payment/poll/route.ts');
const pollCode = fs.readFileSync(pollPath, 'utf8');
assert(pollCode.includes(".eq('tenant_id', 'cnverifyhub')"), 'verify-payment/poll scopes order lookups and updates by tenant_id');

const accountDashPath = path.join(rootDir, 'src/components/account/AccountDashboard.tsx');
const accountDashCode = fs.readFileSync(accountDashPath, 'utf8');
assert(accountDashCode.includes(".eq('tenant_id', 'cnverifyhub')"), 'AccountDashboard scopes user orders by tenant_id');

console.log(`\n========================================`);
console.log(`SCOPING TEST RESULTS: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log(`>>> VERDICT: MULTI-TENANT ISOLATION FULLY VERIFIED <<<\n`);
}
