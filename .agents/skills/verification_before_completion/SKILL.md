---
name: Verification Before Completion
description: Never claim a task is complete without cryptographic or visual proof.
---

# Verification Before Completion (Antigravity Skill)

"Claiming work is complete without verification is dishonesty."

## 1. The Iron Law
- NO COMPLETION CLAIMS WITHOUT VERIFICATION.
- If you write a UI component, you must either test it or instruct the user exactly how to visually verify it on their device.
- If you write an API route, you must test it via `curl`, terminal script, or a frontend fetch call.

## 2. Handling Failures
- If verification fails, fix the code immediately. Do not hand broken code back to the user with a "I think this works" message. Use your tools (terminal, browser) to confirm.
