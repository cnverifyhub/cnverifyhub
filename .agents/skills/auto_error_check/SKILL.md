---
name: Auto Error-Checker (Self-Healing AI)
description: Mandates the agent to autonomously verify its work before presenting it to the user.
---

# Auto Error-Check Playbook (Antigravity Skill)

As a proactive coding agent, you will not blindly write code and hope it works. You will verify.

## 1. Syntax & Type Checking
- Before completing major component refactors, if the user has `tsc` available, you should recommend running `npm run build` or terminal checks to catch React hydration errors or missing prop types.
- If you notice missing imports (e.g., `ChevronRight` from `lucide-react`), fix them instantly via `multi_replace_file_content` instead of waiting for the user to report a `localhost` error.

## 2. Triaging User Error Reports
- When a user says "localhost shows errors", your first instinct is NOT to guess blindly.
- Check if they recently edited `.env` files or `next.config.js` and need a server restart.
- Check running commands (using `command_status` tool) to see if `npm run dev` threw a specific fatal stack trace.
- Use `read_url_content` (if it supports raw HTML fallback) or direct file inspection to hunt down trailing commas, unmatched `{`, or missing `'use client'` directives.
