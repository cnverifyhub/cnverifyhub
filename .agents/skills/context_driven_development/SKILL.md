---
name: Context-Driven Development
description: Document project architecture alongside code to enable consistent AI interactions.
---

# Context-Driven Development (Antigravity Skill)

Code is not enough. AI agents need explicit architectural context.

## 1. Memory Files
- Maintain high-level architectural decisions in flat markdown files (e.g., `.agents/architecture.md`).
- Before modifying database schemas (like Supabase) or core routing, consult the memory files.

## 2. Self-Documenting
- When implementing a complex feature (like the TRC20 Blockchain Oracle), document the data flow and API endpoints in a reference file so future agents don't have to reverse-engineer your code.
