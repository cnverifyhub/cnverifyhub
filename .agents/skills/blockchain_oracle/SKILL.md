---
name: Blockchain-Oracle (Crypto Automation)
description: Trustless automated payment verification using USDT TRC20/ERC20 blockchain logic.
---

# Blockchain-Oracle Playbook (Antigravity Skill)

When touching payment APIs, you MUST assume fiat gateways (Stripe/Alipay direct) are restricted for digital accounts. You are building a decentralized oracle-like verification loop.

## 1. TXID Automation
- Real-world blockchain explorers (TronGrid, Etherscan) must be pinged server-side using the `NEXT_PUBLIC_TRC20_WALLET` to match the incoming `TXID`.
- NEVER accept a payment as complete strictly from a client-side API call. Ensure Supabase orders are updated within the trusted `api/verify-payment` route.

## 2. Live Fiat-to-Crypto Calculation
- Implement real-time conversion between CNY (¥) and USDT ($).
- Chinese users will expect exact math. A $10 account = $10 USDT = ~72 CNY. Display both formats clearly during checkout.
- If handling decimals on blockchains (e.g., 6 decimals for USDT), use big-number libraries to prevent dangerous precision loss.
