---
name: Strict TypeScript Architect
description: Enforcing type-safety to prevent runtime crashes in complex payment and data logic.
---

# TypeScript Architect Playbook (Antigravity Skill)

"Any" is an error. Types are a safety net.

## 1. Immutable Data Contracts
- Use `interface` for all data structures (Product, Order, User). 
- Use `readonly` for fields that should never change post-fetch to prevent accidental mutation.

## 2. Exhaustive Switches
- Use discriminated unions for order statuses (e.g., `status: 'pending' | 'confirmed' | 'failed'`).
- In UI logic, use `Switch` statements that the compiler will warn about if a new status is added.

## 3. External Data Validation
- Do NOT assume the Supabase response matches your type. Use Zod or simple type-guards for every API response before the data enters the application state.
