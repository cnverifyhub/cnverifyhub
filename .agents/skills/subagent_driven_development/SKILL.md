---
name: Subagent-Driven Development
description: Dispatch subagents for isolated tasks to maintain code quality and prevent context pollution.
---

# Subagent-Driven Development (Antigravity Skill)

Do not attempt to rewrite an entire application in one pass. Break down tasks.

## 1. Isolation
- For complex, isolated tasks (e.g., building a new checkout widget), suggest or use a sub-agent to focus purely on that single component without muddying the main context.
- Keep the main agent as the "Architect" that reviews the sub-agent's work.

## 2. Review Protocol
- Ensure subagent output strictly complies with `chinese_ui` and `mobile_first` rules.
- Run a spec-compliance review before merging subagent work into the master plan.
