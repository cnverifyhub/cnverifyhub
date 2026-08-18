# Project: CNVerifyHub Implementation Plan Execution

## Architecture
- Framework: Next.js 14 App Router, TypeScript, Tailwind CSS v3
- Database & Auth: Supabase (`tenant_id = 'cnverifyhub'`), PostgreSQL
- Caching / Rate Limiting: Upstash Redis
- Multi-tenancy: Shared monorepo with `cnwepro`, resolved via `getTenantConfig(hostname)`

## Feature Inventory
| # | Feature | Description | Milestone | Status | Source |
|---|---------|-------------|-----------|--------|--------|
| 1 | `_job_queue` schema | Create missing `_job_queue` table, indexes, and RLS for auto-delivery triggers | M1 | DONE | R1 |
| 2 | Route Hardening | Add `export const dynamic = 'force-dynamic'` to high-risk API routes in `src/app/api/` | M1 | DONE | R1 |
| 3 | LocalInitialAvatar | Replace all external avatar calls (Dicebear/Gravatar) with deterministic local avatar badge | M1 | DONE | R2 |
| 4 | CSP Cleanup | Remove `api.dicebear.com` from `next.config.js` CSP | M1 | DONE | R2 |
| 5 | Tenant Copy & Bulk Config | Update hero headline & psychology copy in `tenant-config.ts` and enable `bulkPricingEnabled: true` + `bulkTiers` | M1 | DONE | R2 |
| 6 | Newsletter Lead Capture | Create `newsletter_subscribers` table, `NewsletterCapture.tsx` component, and `POST /api/newsletter/subscribe` with Upstash rate limit and Resend confirmation | M2 | DONE | R3 |
| 7 | Verified Reviews & Flags | Enhance & seed `reviews` table migration and update `CustomerReviews.tsx` with country flags | M2 | DONE | R3 |
| 8 | Cart Recovery & RECOVER5 | Enhance cart recoveries with reminder counts and seed `RECOVER5` coupon | M2 | DONE | R3 |
| 9 | Bulk Pricing Matrix | Expose bulk pricing tier badges on product cards and full matrix on `PricingTable.tsx` | M2 | DONE | R3 |
| 10 | 5 Bilingual Articles | Seed 5 bilingual articles in `posts` table with complete metadata and JSON-LD Article schemas | M2 | DONE | R4 |
| 11 | CategoryContentBlock & FAQ | Add `CategoryContentBlock` with FAQ JSON-LD across all 7 category pages | M2 | DONE | R4 |
| 12 | Multi-Tenant Scoping Hardening | Harden 11 database query/insert locations with explicit `tenant_id = 'cnverifyhub'` scoping | M2 | DONE | R5 |
| 13 | TypeScript & Build Verification | Verify `npx tsc --noEmit` clean 0 errors, full test suite pass, and forensic audit | M3 | DONE | R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 0 | Survey | Codebase reconnaissance & survey (R1-R5) | none | DONE |
| 1 | M1: Silent Blockers, Route Hardening & Trust Architecture | R1 & R2 verification & integrity check | M0 | DONE |
| 2 | M2: Multi-Tenant Scoping & Revenue/SEO Hardening | R3, R4, and 11 multi-tenant scoping hardenings | M1 | DONE |
| 3 | M3: Testing, Build Verification & Forensic Audit | `npx tsc --noEmit`, test suites, 2 Reviewers, 2 Challengers, Forensic Auditor | M2 | DONE |

## Code Layout
- `src/app/api/`: API route handlers (29 routes with `export const dynamic = 'force-dynamic'`)
- `src/components/home/`: Home sections including `CustomerReviews.tsx`, `NewsletterCapture.tsx`
- `src/components/pricing/` / `src/components/product/`: `PricingTable.tsx`, `PricingCard.tsx`, `MarketplaceProductCard.tsx`
- `src/components/category/`: `CategoryPageTemplate.tsx`, `CategoryContentBlock.tsx` (across 7 category routes)
- `src/lib/`: `tenant-config.ts`, `ratelimit.ts`, `encryption.ts`, `blog.ts`, `supabase-products.ts`
- `supabase/migrations/`: `20260816_01_job_queue_and_revenue.sql`, `20260816_02_seed_seo_posts.sql`
