---
name: Baidu SEO & Chinese Growth Engine
description: Essential SEO rules for indexing and ranking high on Baidu and other Chinese search engines.
---

# Baidu SEO & Growth Engine Playbook (Antigravity Skill)

Google SEO rules do not always apply in China. Baidu, Sogou, and 360 Search have distinct crawling logic that you MUST follow when modifying this Next.js app.

## 1. Server-Side Rendering (SSR/SSG) is Mandatory
- **Baidu Spider (Baiduspider)** struggles significantly with heavily client-side rendered Single Page Applications (SPAs). 
- You MUST ensure all critical product information, headings, and pricing are rendered on the server (using Next.js Server Components or `generateMetadata`) before the HTML is sent to the client.

## 2. L10n (Localization) Keyword Density
- Inject specialized Chinese marketplace terminology directly into the DOM (e.g., "微信老号", "支付宝实名", "防封", "秒发", "高质量小红书大号").
- Ensure `alt` attributes on all images (`<Image alt="..." />`) are highly descriptive in Simplified Chinese. Baidu uses image alt text heavily for ranking.

## 3. Structural Semantics
- Use clean, flat URL structures. Nested dynamic routes (e.g., `/product/123/checkout/payment`) should be kept as shallow as possible.
- Ensure strict usage of one `<h1>` per page. 
- Use `<link rel="canonical" href="..." />` on every page to prevent Baidu from penalizing duplicate content across the `en` and `zh` locales.

## 4. Mobile & Speed Optimization (MIP)
- Baidu prioritizes mobile load speed above almost everything else. Ensure your CSS is aggressively purged and images are strictly optimized (use WebP). 
- If prompted to optimize SEO, look for opportunities to reduce main-thread JavaScript execution.
