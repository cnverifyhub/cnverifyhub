---
name: Social-Share (KOL / KOC Ready)
description: Ensuring the app's components are highly shareable inside deep Chinese social eco-systems.
---

# Social-Share Playbook (Antigravity Skill)

This application must grow virally through Chinese Key Opinion Consumers (KOCs) and direct messaging (WeChat, Telegram).

## 1. Ubiquitous QR Codes
- Every unique product page, checkout invoice, and payment address MUST have a 1-click generation to a clean QR Code.
- Mobile users expect to screenshot a QR code to send to someone else or to pay via another device.

## 2. OpenGraph & Meta Real-Estate
- When someone drops a URL into Telegram (`t.me/cnwepro`) or WeChat, the exact product image (in `aspect-square`), Chinese title, and current dynamic price must populate the rich-link preview.
- Ensure `metadata` exports in Next.js dynamically pull the product title and image.

## 3. Clipboard API 
- Implement reliable 1-click "Copy to Clipboard" buttons (`navigator.clipboard`) for TRC20 Wallet Addresses, TXIDs, Order Tracking IDs, and raw account credentials using bold success toast notifications.
