# Project: CNVerifyHub / CNWePro Monorepo

## Architecture
- Next.js 14 App Router, Supabase (PostgreSQL), Tailwind CSS v3
- Multi-tenancy: `tenant_id` scoping in Supabase database tables (`cnverifyhub` vs `cnwepro`)
- Shared codebase with domain-based tenant resolution (`getTenantConfig(hostname)`)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1_db_multitenancy | Multi-tenancy migration & RLS policies | None | DONE |
| 2 | M2_inventory_delivery | Inventory table & auto-delivery pipeline API | M1 | DONE |
| 3 | M3_rate_limiting | Per-endpoint rate limiting in middleware | None | DONE |
| 4 | M4_seo_infrastructure | Dynamic sitemap, robots, llms.txt route | M1 | DONE |
| 5 | M5_tenant_frontend | Tenant-differentiated frontend layout & cards | M1 | DONE |
| 6 | M6_payment_gating | Alipay & WeChat Pay gating for CNVerifyHub | M5 | DONE |

## Interface Contracts
### Database ↔ Backend API
- All multi-tenant tables contain `tenant_id VARCHAR(50) DEFAULT 'cnverifyhub'`.
- `inventory` table schema: `(id UUID PRIMARY KEY DEFAULT gen_random_uuid(), product_id UUID REFERENCES products(id), tenant_id VARCHAR(50) DEFAULT 'cnverifyhub', credentials_encrypted TEXT NOT NULL, status VARCHAR(20) DEFAULT 'available', order_id UUID REFERENCES orders(id), sold_at TIMESTAMPTZ)`.
- `POST /api/orders/[id]/deliver`: accepts order ID parameter, returns `{ status: 'delivered' | 'manual_queue' | 'already_delivered', credentials?: string[] }`.

### Tenant Config Interface
- `getTenantConfig(hostname: string)` returns `TenantConfig` object (`id`, `branding`, `ui`, `payments`, etc.).

## Code Layout
- Migrations: `migrations/`
- API routes: `src/app/api/`
- Components: `src/components/`
- Tenant config: `src/lib/tenant-config.ts`
- Middleware: `src/middleware.ts`
