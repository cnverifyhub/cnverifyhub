---
name: Next.js App Router Patterns
description: Comprehensive patterns for Next.js 14+ Server Components, Client boundaries, and Edge performance.
---

# Next.js App Router Playbook (Antigravity Skill)

Maximize the power of the App Router's multi-layered architecture.

## 1. Server Component Supremacy
- Every file is a Server Component by default. 
- Do NOT move the `'use client'` directive to the top level unless the file uses `useEffect`, `useState`, or a context hook.
- Fetch data directly in Server Components using `async/await` instead of `useEffect` waterfalls.

## 2. Edge-Ready APIs
- Prefer `runtime: 'edge'` for simple API routes (like `ping` or `status`) to minimize latency for Chinese visitors.
- For Supabase/Database heavy routes, use the default Node.js runtime to maintain library compatibility.

## 3. Layout Optimization
- Use `loading.tsx` and `error.tsx` in every route folder.
- Utilize `Suspense` for heavy UI parts (like the `LiveTicker` or product grids) to ensure the rest of the page remains interactive during load.
