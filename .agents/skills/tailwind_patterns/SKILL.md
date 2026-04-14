---
name: Tailwind CSS Development Patterns
description: Expert guide for building modern interfaces with Tailwind v4+ including CSS-first configuration and utility extraction.
---

# Tailwind CSS Design Patterns (Antigravity Skill)

Enforce structured, maintainable styling instead of messy, single-use utility strings.

## 1. Class Organization (Prettier Standard)
- Always group Tailwind classes in this order: `Display` -> `Position` -> `Box Model (m, p, w, h)` -> `Typography` -> `Color` -> `Effects` -> `Transitions`.
- Keep the `cn()` utility active in `src/lib/utils.ts` for all conditional formatting.

## 2. Token-First Workflows
- Do NOT use arbitrary values like `bg-[#ff0036]` in components unless absolutely necessary.
- Define them as CSS variables in `globals.css` (e.g., `--color-taobao-red`) and use them via `@theme` or Tailwind config mappings.

## 3. Responsive Extraction
- Avoid repeating complex responsive strings (e.g., `grid-cols-2 md:grid-cols-4 lg:grid-cols-6`). 
- Extract repeated layout patterns into `@layer components` in `globals.css` if they are used more than 3 times.
