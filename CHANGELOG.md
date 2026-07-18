# CNVerifyHub — Changelog
> One line per change. Group by phase.

## [Unreleased]

### Phase 1 — Stop Bleeding
[DB] [+] Added `fraud_blocklist` and `fraud_events` tables to Supabase schema.
[DB] [+] Added `decrement_stock_on_order` trigger to Supabase schema.
[SEC] [~] Replaced in-memory rate limiting with Upstash Redis sliding window in `middleware.ts`.
[SEO] [~] Updated `sitemap.ts` to dynamically fetch `isPublished !== false` products from data source.
[SEO] [+] Added `llms.txt` route for AI crawlers.
### Phase 2 — Convert
[DB] [+] Added `cart_recoveries` and `reviews` tables to Supabase schema.
[DB] [+] Added `mark_cart_recovered` trigger to handle recovering carts upon order completion.
[+] Added `/api/cart-recovery` endpoint to persist abandoned carts.
[+] Configured Vercel cron and `/api/cron/process-cart-recovery` to send Resend email batches for abandoned carts.
[~] Refactored `CustomerReviews.tsx` to dynamically fetch user-submitted verified reviews.
[+] Added `/review` page for customers to submit verified feedback from email links.
### Phase 3 — Traffic
[SEO] [+] Injected dynamic Product JSON-LD schema into `src/app/product/[id]/page.tsx`.
[SEO] [+] Created 4 new AEO-optimized answer pages (`/zh/how-to-buy-wechat-account`, `/zh/usdt-payment-guide`, `/zh/wechat-account-types`, `/en/buy-chinese-accounts`) with HowTo and Article schemas.
[DB] [~] Rewrote `src/lib/blog.ts` to query `posts` table from Supabase instead of local markdown files.
[~] Updated blog pages (`/blog/[slug]`, `/blog/`, `sitemap.ts`) to use `await` with async blog library functions and added ISR (`revalidate = 3600`).
[SEO] [+] Implemented `POST /api/baidu-push` for server-side Baidu URL submission.
[+] Triggered Baidu Push automatically in Admin panel upon saving a product with `is_published = true`.
### Phase 4 — Scale
[DB] [+] Added `inventory`, `coupons`, and `referrals` tables to Supabase schema.
[DB] [+] Added `handle_paid_order_inventory` trigger to reserve stock automatically and queue delivery webhooks upon payment.
[+] Created Admin Inventory Upload UI (`src/app/admin/inventory/page.tsx`) for batch CSV/JSON credential loading.
[+] Implemented Telegram Bot webhook endpoint (`src/app/api/telegram-webhook/route.ts`) using Grammy for status, delivery, and inventory commands.
[+] Implemented `POST /api/coupons/validate` endpoint to check coupon limits, expiration, and apply discounts.
[~] Updated `CheckoutForm.tsx` to handle coupon states and referral discounts.
### Phase 5 — Optimize
[~] Enhanced Admin Dashboard in `page.tsx` with dynamic Conversion Funnel, Top 5 Products, Fraud Events, and Traffic Source panels.
[SEC] [+] Implemented GTM dataLayer tracking for add_to_cart, begin_checkout, purchase, coupon_used, referral_applied, and review_submitted events.
[+] Created T+0, T+1, and T+7 email sequence drip API in `cron/email-sequence/route.ts`.
[DB] [~] Updated coupons validation API to automatically detect and support referral codes starting with REF-.
## Legend
[+] Added | [~] Modified | [!] Fixed | [-] Removed | [DB] Database | [ENV] Env var | [SEC] Security | [SEO] Search | [PERF] Performance
