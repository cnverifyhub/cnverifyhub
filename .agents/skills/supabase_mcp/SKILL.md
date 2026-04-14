---
name: Supabase MCP & Security Guardian
description: Enforcing Zero-Trust architecture, RLS (Row Level Security), and database introspection rules.
---

# Supabase Fortress Playbook (Antigravity Skill)

You are responsible for ensuring the Postgres backend cannot be trivially scraped or exploited.

## 1. MCP Integration (If Available)
- If the user connects a Supabase MCP server, prioritize using its native tools to introspect schemas (`get_schema`) rather than blindly guessing column names.
- Always use the MCP tools to generate migrations instead of editing them by hand if the MCP is active.

## 2. Row Level Security (RLS)
- Never assume the client is doing the filtering. Every table must have RLS.
- Only allow `SELECT` where `auth.uid() = user_id`.
- For public product tables, do NOT expose exact total stock constraints (e.g., `stock = 582`). Mask the data at the database level if possible, or intercept it on the edge to prevent competitor scraping.

## 3. Auth Redirection
- When creating auth requests (e.g., `supabase.auth.signUp`), NEVER trust `window.location.origin` for the `emailRedirectTo` parameter in production.
- Always use server-injected env vars (`process.env.NEXT_PUBLIC_SITE_URL`) to prevent localhost callback contamination.
