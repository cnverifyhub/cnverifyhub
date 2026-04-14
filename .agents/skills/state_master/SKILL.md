---
name: State-Master (Zustand)
description: Rules for managing complex client-side application state without Redux overhead.
---

# State-Master Playbook (Antigravity Skill)

Complex marketplaces need robust state (cart, auth, theme, current locale) but without the heavy boilerplate of Redux. We strictly use `Zustand`.

## 1. LocalStorage Persistence (`persist`)
- The `cartStore` and `userStore` MUST wrap their configuration in Zustand's `persist` middleware.
- Users navigating away (or switching between `/zh` and `/en`) should NEVER lose their cart items.

## 2. Hydration Mismatch Safety
- Next.js will crash with a 500/Hydration Error if SSR HTML doesn't match the client's cached Zustand state on mount.
- You MUST wait for a `useEffect` to trigger a `setMounted(true)` before rendering Zustand `persist` values. 

## 3. Optimistic Updates
- Immediately respond visually when a user clicks "Add to Cart" or "Delete" by mutating Zustand local state *before* waiting on any API/Supabase response (where applicable for UX). This makes the interface feel lightning-fast.
