export interface Post {
    slug: string;
    title: { zh: string; en: string };
    excerpt: { zh: string; en: string };
    content: { zh: string; en: string };
    date: string;
    category: 'security' | 'tutorial' | 'marketing';
    image: string;
}

export const posts: Post[] = [
    {
        slug: 'wechat-security-guide',
        title: {
            zh: '微信账号安全指南：如何防止账号被封',
            en: 'WeChat Security Guide: How to Prevent Your Account from Being Banned'
        },
        excerpt: {
            zh: '购买微信账号后，首要任务是确保其长期稳定。本文将为您详细介绍如何避开腾讯的风控系统。',
            en: 'After purchasing a WeChat account, your top priority is stability. This guide explains how to avoid Tencent\'s risk control.'
        },
        content: {
            zh: `
# 微信账号安全指南

购买微信账号后，请务必遵守以下操作规范，以最大限度降低被封风险：

## 1. 登录环境建议
- **首选移动流量**：不要立即在公共Wi-Fi或频繁切换机房IP的环境下登录。
- **一机一号**：尽量避免在同一台手机上频繁切换多个新购买的账号。

## 2. 账号养护（养号）
- **不要立即群发**：新登录后的前24小时内，不要大量添加好友或加群。
- **完善信息**：设置微信号、修改头像、上传3-5张朋友圈。
- **真实互动**：与老友进行正常的文字聊天和语音通话。

## 3. 资金安全
- **小额先行**：开通支付功能后，先进行几笔1元的小额捐赠或充值。
- **绑定实名**：如果购买的是非实名号，请尽快按要求完成实名认证。
            `,
            en: `
# WeChat Security Guide

After purchasing a WeChat account, follow these best practices to minimize the risk of being banned:

## 1. Login Environment
- **Use Mobile Data**: Avoid logging in on public Wi-Fi or switching between data center IPs initially.
- **One Device, One Account**: Avoid frequently switching multiple newly purchased accounts on the same phone.

## 2. Account "Warming"
- **No Mass Messaging**: Within the first 24 hours, do not add many friends or join many groups.
- **Complete Profile**: Set a WeChat ID, change the avatar, and post 3-5 updates to Moments.
- **Human Interaction**: Conduct normal text chats and voice calls with established contacts.

## 3. Financial Safety
- **Small Transactions First**: After enabling payments, make a few small donations or top-ups (e.g., $0.15).
- **Verify Identity**: If you bought an unverified account, complete the real-name verification as soon as possible.
            `
        },
        date: '2026-03-12',
        category: 'security',
        image: '/images/blog/wechat-security.webp'
    },
    {
        slug: 'alipay-verification-tutorial',
        title: {
            zh: '2026 支付宝实名认证全流程（海外用户适用）',
            en: '2026 Alipay Real-Name Verification Guide for Overseas Users'
        },
        excerpt: {
            zh: '没有中国银行卡也能使用支付宝吗？是的！本文教你如何使用护照完成支付宝实名认证。',
            en: 'Can you use Alipay without a Chinese bank card? Yes! Learn how to use your passport for verification.'
        },
        content: {
            zh: `...`, // Content omitted for brevity, but structure is here
            en: `...`
        },
        date: '2026-03-10',
        category: 'tutorial',
        image: '/images/blog/alipay-guide.webp'
    },
    {
        slug: 'douyin-marketing-2026',
        title: {
            zh: '抖音（中国版TikTok）海外营销新趋势',
            en: 'Modern Douyin (China TikTok) Marketing Trends for Foreign Brands'
        },
        excerpt: {
            zh: '如何利用国内抖音号进行跨境引流？揭秘万粉号背后的算法推荐逻辑。',
            en: 'How to use Douyin accounts for cross-border traffic? revealing the algorithm behind viral accounts.'
        },
        content: {
            zh: `...`,
            en: `...`
        },
        date: '2026-03-08',
        category: 'marketing',
        image: '/images/blog/douyin-trends.webp'
    }
];
