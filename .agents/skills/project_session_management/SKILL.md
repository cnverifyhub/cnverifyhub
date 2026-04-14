---
name: Project Session Management
description: Track progress across work sessions using persistent markdown files.
---

# Project Session Management (Antigravity Skill)

As context windows fill up or sessions end, you MUST maintain a persistent state.

## 1. Session Tracking
- Use a `SESSION.md` or update `.agents/workflows` to track concrete next actions.
- When resuming work, ALWAYS read this file first to restore context before asking the user "what's next?".

## 2. Checkpoints
- Establish clear git checkpoints after major feature completions.
- Write down what was just completed, any terminal commands that need to be re-run on startup (like `npm run dev`), and what the immediate next step is.
