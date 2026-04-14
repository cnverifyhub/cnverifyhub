---
name: Auth Fortress & Security
description: Protecting the marketplace from account hijacking, bot-spam, and data leakage.
---

# Auth Fortress Playbook (Antigravity Skill)

Security is the bottom line for a marketplace selling sensitive credentials.

## 1. Zero-Trust API Routes
- ALL `/api/admin/*` routes must check for an `Authorization` header with a rotating secret.
- Check `supabase.auth.getUser()` on the server for every protected request; do NOT rely on local-state cookies which can be spoofed.

## 2. Bot-Shielding (Rate Limiting)
- Implement IP-based rate limiting on the `/auth/signup` and `/api/orders` endpoints.
- If a single IP makes >5 requests per minute, issue a 429 status and log the event for fraud review.

## 3. Credential Masking
- Never send raw account credentials in an API response unless the order status is `delivered`.
- In all other states, the `credentials` field must be `null` or `********`.
