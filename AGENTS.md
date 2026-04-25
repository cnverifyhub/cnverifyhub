# AGENTS.md — CNWePro Codebase Guide

This guide is for agentic coding agents operating in the CNWePro repository.

## Project Overview

- **Framework**: Next.js 14 (App Router), TypeScript, Node.js >= 20
- **Styling**: Tailwind CSS v3 with custom design tokens (NOT Tailwind v4)
- **State**: Zustand with `persist` middleware (localStorage)
- **Backend**: Supabase (Auth + PostgreSQL), deployed on Vercel
- **Deployment**: 
    - **Routine Pushes**: Always include `[skip ci]` in the commit message to push to GitHub without triggering Vercel.
    - **Production Deployment**: Only push *without* `[skip ci]` when the USER explicitly asks to "deploy".
- **i18n**: Dual-language (`zh` / `en`) via in-source `{ zh, en }` objects
- **Testing**: None currently configured

---

## Build / Lint / Dev Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build (Next.js + Tailwind) |
| `npm run start` | Start production server |
| `npm run lint` | Run Next.js ESLint (`next lint`) |
| `npx tsc --noEmit` | TypeScript type check (use this for CI) |

---

## TRC20 Wallet Configuration

Only TWO TRC20 wallets are active (3rd wallet removed):
- `NEXT_PUBLIC_TRC20_WALLET` — Primary wallet
- `NEXT_PUBLIC_TRC20_WALLET_2` — Backup wallet

Wallets are shown to users via `PaymentDisplay.tsx` where they select which wallet to send to. All wallet references in `PaymentDisplay.tsx` use the `TRC20_WALLETS` array (2 items max).

---

## Architecture Patterns

### TRC20 Payment Auto-Verification (Polling)

The payment flow uses a **client-side polling loop** with the existing single-shot verification as fallback:

1. User submits TXID in `PaymentDisplay.tsx`
2. Client calls `POST /api/verify-payment/poll` every 30 seconds (up to 20 attempts = 10 min)
3. Poll endpoint calls TronGrid API to check transaction status + confirmations
4. Returns `status: 'pending' | 'confirmed' | 'failed'` with live `confirmations` count
5. UI shows live confirmation progress bar (X/19 confirmations)
6. On confirmation: auto-updates Supabase order → triggers delivery via `autoAssignAccountsToOrder()`

**Files**: `src/app/api/verify-payment/poll/route.ts`, `src/components/checkout/PaymentDisplay.tsx`

Non-TRC20 networks (BEP20, ERC20) use the existing single-shot `/api/verify-payment` endpoint.

### Fraud Detection (Rules Engine)

Local rules-based fraud detection — NO AI costs. Integrated at two points:

**Order creation** (`src/app/api/orders/route.ts`):
- Blocklist check (email, IP) → blocks critical
- Rate limiting (3 orders/email/24h, 5 orders/IP/1h)
- Bulk order flag (>50 units)
- Suspicious amount flag (high-value first orders, round numbers)

**Payment verification** (`src/app/api/verify-payment/route.ts`):
- TXID blocklist + wallet blocklist
- Short TXID detection (<10 chars = test payment pattern)
- Same-wallet velocity (>3 TXIDs from same wallet in 1h)

**Admin API** (`src/app/api/admin/fraud/route.ts`):
- `GET ?type=events` — recent fraud events
- `GET ?type=blocklist` — current blocklist
- `POST` — add to blocklist / remove from blocklist
- Auth: `Authorization: Bearer ${process.env.ADMIN_PASSWORD}` header

**DB tables**: `fraud_blocklist`, `fraud_events` (see `src/lib/supabase/schema.sql`)

### Account Preview

Product preview modal shows simulated account metadata:
- Platform, account type, estimated age, verification status, bank link status
- Feature checklist, stock bar, warranty badge, delivery time
- Integrated into `MarketplaceProductCard.tsx` (hover → "预览" button) and `ProductPageTemplate.tsx` ("预览账号详情" link)

**Files**: `src/components/product/ProductPreview.tsx`

---

## Environment Variables

Copy `.env.example` to `.env.local`. Required:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TRC20_WALLET`, `NEXT_PUBLIC_TRC20_WALLET_2`
- `NEXT_PUBLIC_BEP20_WALLET`, `NEXT_PUBLIC_ERC20_WALLET`
- `NEXT_PUBLIC_TELEGRAM_CHANNEL`, `NEXT_PUBLIC_TELEGRAM_USER`
- Client-safe vars MUST use `NEXT_PUBLIC_` prefix

**Admin password** (change in production):
- `ADMIN_PASSWORD` — server-side API auth (required in `.env.local`)
- `NEXT_PUBLIC_ADMIN_PASSWORD` — client-side login validation (fallback: `admin888`)

---

## Code Style

### TypeScript
- Strict mode enabled. Explicit types preferred over `any`.
- Import types with `import type { ... }`.
- Use `type` for data shapes; `interface` for extensible contracts.

### Imports
- Use `@/` path alias (maps to `src/`).
- Order: external libs → `@/` imports → relative.

### Components
- Server components by default. Add `'use client'` only for hooks/events/zustand.
- Named exports: `export function ComponentName`.
- Function declarations (not arrow functions) for components.

### Styling
- Use `cn()` from `@/lib/utils` for conditional classes.
- NO arbitrary values — use custom tokens: `primary-*`, `gold-*`, `accent-*`, `success-*`, `warning-*`, `danger-*`, `dark-*`.
- Dark mode: `class` strategy. Use `dark:` modifier.
- Custom animations: `animate-fade-in`, `animate-fade-in-up`, `animate-slide-up`, `animate-shimmer`, etc.

### State (Zustand)
- Persist with `name` key and `partialize` for selective persistence.
- Hydration guard: `useEffect(() => setMounted(true))` + early return.

### API Routes
- `NextResponse.json()` for all responses. `try/catch` everywhere.
- Log errors with `console.error`, return generic messages to client.
- Fraud checks run automatically in order creation and payment verification.

### i18n
- All user-facing text: `{ zh: string; en: string }` objects.
- Use `t(key, lang)` from `@/lib/i18n` for common strings.
- `getLocalizedPath(path, lang)` prepends `/en` for English.
- **Admin dashboard is English-only** (`/admin`). No zh/en split.

---

## Project Skills

- **vercel_deployment**: Expert knowledge for deploying to Vercel with Next.js.
- **nextjs_app_router_patterns**: Best practices for Next.js 14+ components.
- **auth_fortress_security**: Account hijacking and bot-spam protection.
- **chinese_ui**: High-conversion Chinese e-commerce design patterns.
- **faux_escrow**: Psychological trust engineering for payments.
- **blockchain_oracle**: Crypto payment automation logic.
- **tailwind_patterns**: Expert utility extraction and configuration.

---

## Directory Structure

```
src/
├── app/
│   ├── api/
│   │   ├── orders/              # Order creation + fraud checks
│   │   ├── verify-payment/      # Single-shot verification
│   │   │   └── poll/            # Background polling endpoint (NEW)
│   │   └── admin/
│   │       ├── orders/          # Admin order management
│   │       └── fraud/           # Fraud admin API (NEW)
│   ├── checkout/                # Checkout pages
│   ├── auth/                    # Auth pages
│   ├── track/                   # Order tracking
│   └── admin/page.tsx           # Admin dashboard (English-only)
├── components/
│   ├── checkout/                # PaymentDisplay, AlipayPaymentModal, CheckoutForm
│   ├── product/                 # ProductPageTemplate, MarketplaceProductCard
│   │                              ProductPreview (NEW)
│   ├── cart/, home/, layout/, ui/
├── data/                        # Static product catalog
├── lib/
│   ├── fraud-detection.ts       # Fraud rules engine (NEW)
│   ├── i18n.ts                  # Translations
│   ├── utils.ts                 # cn(), formatUsdt(), formatYuan()
│   └── supabase/                # Client, server, delivery, schema.sql
├── store/                       # Zustand stores (user, cart, order)
└── types/                       # Shared TypeScript types
```
