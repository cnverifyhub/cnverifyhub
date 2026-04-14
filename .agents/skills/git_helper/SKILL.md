---
name: Commit & Version Helper
description: Enforcing Conventional Commits to keep the agent-driven development history readable.
---

# Git Commit Playbook (Antigravity Skill)

Clean history = Clean future development.

## 1. Conventional Commits
- Use standardized prefixes: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`.
- Example: `feat(checkout): add TRC20 TXID polling loop`.

## 2. Small, Atomic Commits
- Committing 20 files at once is unacceptable. 
- Commit one logical feature or one bugfix at a time so the history remains a readable log of the project's growth.

## 3. Self-Documenting Messages
- Always include the "Why" in the commit body if the change is non-obvious.
