---
name: Chinese UI Designer
description: Specialized rules for designing high-density, high-conversion Chinese e-commerce user interfaces.
---

# Chinese UI/UX Playbook (Antigravity Skill)

When tasked with UI design for this project, you MUST abandon Western minimalist design principles (lots of whitespace, hidden info) and adopt authentic Chinese "Super-App" (Taobao/WeChat/Alipay) design patterns.

## 1. Color Palette & Psychology
- **Action Colors**: Use bold Taobao Red (`#FF0036` to `#FF5000` gradients) for primary CTA buttons (e.g., "立即购买").
- **Trust Colors**: Use WeChat Green (`#07C160`) for verification seals and Alipay Blue (`#1677ff`) for secure payment blocks.
- **Auspicious Colors**: Use Gold (`#FFD700`) sparingly for VIP/Premium tiers.

## 2. Information Density
- "More is more." The user should not have to click to see vital info.
- **Product Cards**: Must contain Price, Strikethrough Original Price, Sales Volume (已售 X 件), Stock Scarcity (仅剩 X 件), and Trust Badges (现货秒发) all in one tight view.
- **Images**: Use `aspect-square` (1:1) ratios for product thumbnails, never 16:9, to maximize vertical scrolling real-estate.

## 3. Typography
- Rely on modern Chinese sans-serif fonts: `'PingFang SC', 'Source Han Sans', 'Microsoft YaHei', sans-serif`.
- Make prices mathematically bold and prominent. Use integer truncating where possible (`Math.round`) to keep prices clean.

## 4. Layout
- Use exact, thin borders (`border-slate-100` or `border-slate-200`).
- Incorporate subtle glassmorphism (translucency + blur) over dense backgrounds.
