---
name: Mobile-First Super-App Developer
description: Rules for coding layouts optimized entirely for mobile thumb-zones and nested app routing.
---

# Mobile-First Super-App Playbook (Antigravity Skill)

This Next.js application is a "Super-App" wrapper. Assume 95% of traffic is mobile.

## 1. Thumb-Zone Engineering
- **Bottom Navigation**: Ensure the primary application nav (`MobileNav.tsx`) is fixed completely `bottom-0` with `pb-safe` (iOS safe-area padding).
- **Reachability**: Critical CTAs (like "Add to Cart" or "Checkout") on single product pages MUST be pinned to the bottom of the screen as sticky bars. Do not leave them halfway up the scrollable page.

## 2. Component Design
- Write Tailwind CSS starting with the `sm:` width, not the other way around. 
    - E.g., `flex-col md:flex-row`.
- Replace traditional "modals" with "Bottom Sheets" or "Drawers" (using Framer Motion) that slide up from the bottom edge of the screen, as this is the standard interaction model in iOS/WeChat.

## 3. Performance
- Mobile network speeds can drop. Avoid heavy client-side waterfalls. Use Next.js Server Components by default; only add `'use client'` to the deepest leaf nodes possible (like buttons or drawers).
