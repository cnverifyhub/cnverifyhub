# CNWePro Agent Guide (v2.0 - Brain Layer Active)

## Brain Layer (MANDATORY)
- **Resilience**: Use `resilience-guardian` to checkpoint state after major actions.
- **Reasoning**: Use `hermes-cognition` for post-task reflection & recursive improvement.
- **Memory**: Persistent cross-session state via `agent-memory` + `task_graph.json`.
- **Efficiency**: Use high-density "Caveman" syntax in all instructions/artifacts.

## Project Core
- **Stack**: Next.js 14 (App), TS, Node 20+, Supabase.
- **Style**: Tailwind v3 (Custom tokens). NO v4.
- **i18n**: zh/en objects. Admin: en-only.
- **Deploy**: Push to GitHub ONLY. **NO automatic Vercel build/deploy**.

## Commands
| Cmd | Result |
|---|---|
| `npm run dev` | Localhost:3000 |
| `npm run build` | Prod build |
| `npm run start` | Start prod |
| `npm run lint` | Next lint |
| `npx tsc --noEmit` | Type check |

## Critical Patterns
### Payment Polling (TRC20)
- Client: `PaymentDisplay.tsx` polling `POST /api/verify-payment/poll`.
- Status: `pending` | `confirmed` | `failed`. Auto-delivery on confirmation.

### Fraud Engine (No-AI)
- **Order**: Blocklist (email/IP), rate limits (3/24h), bulk/high-value flags.
- **Payment**: TXID blocklist, velocity checks, short-TXID detection.

### Environment
- Wallets: `NEXT_PUBLIC_TRC20_WALLET`, `NEXT_PUBLIC_TRC20_WALLET_2`.
- Auth: `ADMIN_PASSWORD` (Server), `NEXT_PUBLIC_ADMIN_PASSWORD` (Client).

## Code Standards
- **TS**: Strict types. Explicit > any.
- **Components**: Server-first. `use client` only for hooks/events.
- **CSS**: `cn()` helper. Use design tokens: `primary-*`, `gold-*`, `dark-*`.

## Project Skills
- **Brain**: `resilience-guardian`, `hermes-cognition`, `agent-memory`.
- **UI/UX**: `chinese_ui`, `gsap-animations`, `vision-ui-architect`.
- **Security**: `auth_fortress_security`, `cyber-security`.
- **Blockchain**: `blockchain_oracle`, `finance-verification`.
- **DevOps**: `vercel_deployment`, `devops-swarm-ci`.

---
