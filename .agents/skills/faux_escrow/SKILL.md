---
name: Faux-Escrow (Payment Trust Engineering)
description: UI patterns designed to mimic the psychological safety of Alipay Escrow (担保交易).
---

# Faux-Escrow Playbook (Antigravity Skill)

Chinese commerce heavily relies on Alipay's "Escrow" (担保交易). When buying anonymous digital accounts with crypto, trust is basically zero. We must engineer it.

## 1. The "Vault" Mental Model
- Instead of "Send Crypto directly", frame the checkout as sending funds to a secure platform vault ("平台资金担保").
- Use loading spinners and checkmarks sequentially: 
  - `[x] Checking TXID Blockchain Confirmation (1/19)` -> `[x] Locking Funds` -> `[ ] Delivering Account Credentials`.

## 2. Artificial Timers & Tension
- Implement a ~15 minute countdown timer during the checkout phase.
- This creates massive urgency but also a feeling of a "locked" secure session that the user cannot casually refresh out of.

## 3. Post-Purchase Transparency
- If a TXID fails verification, provide instantly accessible Telegram support links (`t.me/cnwepro`). Instead of a generic "Failed" message, say "Blockchain Confirmation Delayed - Contact Support" to maintain trust.
