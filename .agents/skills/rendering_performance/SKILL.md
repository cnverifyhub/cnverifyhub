---
name: Rendering Performance
description: Optimizing React render cycles to prevent UI sluggishness during complex state updates.
---

# Rendering Performance Playbook (Antigravity Skill)

Marketplace apps with live tickers and timers can become laggy. Stop unnecessary renders.

## 1. Component Memoization
- Wrap high-frequency UI components (like individual product cards in a list of 100+) in `React.memo()`.
- Use `useMemo` for heavy formatting logic (like complex crypto-to-fiat calculations).

## 2. Hook Stability (`useCallback`)
- Wrap functions passed down to multiple children (like `onAddToCart`) in `useCallback` to prevent child re-renders on every state change.

## 3. Throttled Tickers
- For live-data components (like the "Recent Purchases" ticker), throttle the updates to once every 5-10 seconds instead of real-time to save CPU cycles on mobile devices.
