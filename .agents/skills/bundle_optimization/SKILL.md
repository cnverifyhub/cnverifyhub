---
name: Bundle Size Optimization
description: Ensuring lightning-fast performance for mobile users by minimizing initial JavaScript payloads.
---

# Bundle Size Playbook (Antigravity Skill)

For Chinese visitors on mobile networks, every KB counts.

## 1. Dynamic Imports (`next/dynamic`)
- Heavily use `dynamic()` to load heavy UI libraries (like Framer Motion, Three.js, or complex charting) only when they enter the viewport or when the user interacts.
- This keeps the first-load JS bundle under the 100KB "mobile sweet spot."

## 2. Tree Shaking Lucide Icons
- Do NOT import all of `lucide-react`. 
- Use specific imports: `import { Zap } from 'lucide-react';` or ensure the build tool correctly treeshakes unused icons.

## 3. Asset Compression
- Only use WebP (and AVIF where possible). 
- Configure `next/image` quality to `75` or lower for non-critical banners to save bandwidth.
