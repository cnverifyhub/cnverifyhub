---
name: Netlify Edge & Next.js Router
description: Best practices for getting a Next.js App Router project to compile perfectly on Netlify.
---

# Netlify Edge Playbook (Antigravity Skill)

Netlify handles Next.js App Router differently than Vercel. Adhere to these strict rules to prevent production 500s.

## 1. next.config.js Rules
- Do NOT use `output: 'export'` if you are using Next.js Server Actions, API routes (`/api/*`), or Supabase SSR. Netlify requires dynamic runtime capabilities for these.
- Always whitelist external image domains (like `play-lh.googleusercontent.com` or `images.unsplash.com`) in `remotePatterns`. Remember: updating this requires restarting the `npm run dev` server locally.

## 2. Build Stability
- Next.js is aggressively strict about `'use client'` boundaries. If a component imports an interactive hook (`useState`, `useRouter`, `useCartStore`), the file MUST start with `'use client';` on line 1.
- Avoid passing non-serializable objects (like class instances or functions) from Server Components to Client Components.
