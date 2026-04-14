---
name: Playwright E2E Testing
description: Automated end-to-end browser testing to prevent regression on critical checkout and auth flows.
---

# Playwright E2E Playbook (Antigravity Skill)

Manual testing is not enough for payments. Use automated browser instances.

## 1. Checkout Verification
- Test the full user journey: Home Page -> Category Search -> Add to Cart -> TXID Submission.
- Simulate failures (invalid TXID, expired timer) and verify the "Faux-Escrow" UI correctly handles the error states.

## 2. Cross-Device Testing
- Explicitly test at `375px` (iPhone), `768px` (iPad), and `1440px` (Desktop).
- Confirm that the `MobileNav` tab bar is accessible and clickable on mobile viewports.

## 3. Auth Flow Validation
- Test signup -> email verification (mocked) -> login.
- Confirm the `NEXT_PUBLIC_SITE_URL` redirect logic works correctly across different environments.
