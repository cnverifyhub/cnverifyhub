/* ============================================
   Product Catalog — Complete pricing data
   Based on competitive market research
   ============================================ */
import type { Product, Category, CategoryId } from '@/types';

/* ---------- Categories ---------- */
export const categories: Category[] = [
    {
        id: 'wechat',
        name: { zh: '微信账号', en: 'WeChat Accounts' },
        description: { zh: '微信白号、实名号、绑卡号、老号，全系列现货', en: 'Fresh, verified, bank-linked, and aged WeChat accounts' },
        icon: 'wechat',
        color: 'text-green-500',
        gradient: 'from-green-500 to-emerald-600',
        href: '/wechat',
    },
    {
        id: 'alipay',
        name: { zh: '支付宝账号', en: 'Alipay Accounts' },
        description: { zh: '支付宝白号、实名号、花呗号、绑卡号、企业号', en: 'Fresh, verified, Huabei-enabled, bank-linked Alipay accounts' },
        icon: 'alipay',
        color: 'text-blue-500',
        gradient: 'from-blue-500 to-blue-700',
        href: '/alipay',
    },
    {
        id: 'douyin',
        name: { zh: '抖音账号', en: 'Douyin Accounts' },
        description: { zh: '抖音白号、实名号、千粉号、万粉号', en: 'Fresh, verified, 1K+ and 10K+ followers Douyin accounts' },
        icon: 'douyin',
        color: 'text-pink-500',
        gradient: 'from-pink-500 to-rose-600',
        href: '/douyin',
    },
    {
        id: 'qq',
        name: { zh: 'QQ账号', en: 'QQ Accounts' },
        description: { zh: 'QQ白号、太阳号、会员号、靓号', en: 'Fresh, sun-level, VIP, and premium QQ accounts' },
        icon: 'qq',
        color: 'text-sky-500',
        gradient: 'from-sky-500 to-cyan-600',
        href: '/qq',
    },
    {
        id: 'xianyu',
        name: { zh: '闲鱼账号', en: 'Xianyu Accounts' },
        description: { zh: '高质量闲鱼实名账号', en: 'High-quality Xianyu verified accounts' },
        icon: 'xianyu',
        color: 'text-yellow-500',
        gradient: 'from-amber-400 to-amber-600',
        href: '/xianyu',
    },
    {
        id: 'taobao',
        name: { zh: '淘宝账号', en: 'Taobao Accounts' },
        description: { zh: '淘宝优质买家白号、老号', en: 'Premium Taobao buyer accounts' },
        icon: 'taobao',
        color: 'text-orange-500',
        gradient: 'from-orange-500 to-red-600',
        href: '/taobao',
    },
    {
        id: 'xiaohongshu',
        name: { zh: '小红书账号', en: 'Xiaohongshu Accounts' },
        description: { zh: '小红书老号、高权重种草营销号', en: 'Aged RED accounts for marketing' },
        icon: 'xiaohongshu',
        color: 'text-red-500',
        gradient: 'from-red-500 to-rose-700',
        href: '/xiaohongshu',
    },
    {
        id: 'bundle',
        name: { zh: '组合套装', en: 'Combo Bundles' },
        description: { zh: '多平台组合账号，一站式解决关联验证难题', en: 'Multi-platform linked accounts, solving verification hurdles' },
        icon: 'bundle',
        color: 'text-purple-500',
        gradient: 'from-purple-500 to-indigo-600',
        href: '/bundle',
    },
    {
        id: 'verification',
        name: { zh: '实名认证服务', en: 'Verification Services' },
        description: { zh: '提供支付宝、微信、及各类跨境平台护照实名代认证服务', en: 'Passport verification services for Alipay, WeChat, and trading platforms' },
        icon: 'verification',
        color: 'text-indigo-500',
        gradient: 'from-indigo-500 to-blue-600',
        href: '/verification',
    },
    {
        id: 'trading',
        name: { zh: '金融交易账户', en: 'FinTech & Trading' },
        description: { zh: '已实名认证的XM、HFM、Neteller、Payoneer等金融账户', en: 'Verified accounts for XM, HFM, Neteller, Skrill, and Payoneer' },
        icon: 'fintech',
        color: 'text-emerald-500',
        gradient: 'from-emerald-500 to-teal-600',
        href: '/trading',
    },
];

/* ---------- Helper for standard fields ---------- */
const commonFields = {
    currency: 'USDT' as const,
    deliveryMethod: 'auto' as const,
    stockStatus: 'in-stock' as const,
};

/* ---------- WeChat Products ---------- */
const wechatProducts: Product[] = [
    {
        id: 'wechat-basic',
        slug: 'wechat-basic',
        name: { zh: '微信基础白号', en: 'WeChat Basic' },
        category: 'wechat',
        type: 'account',
        tierName: { zh: '微信基础白号', en: 'WeChat Basic' },
        tierSlug: 'standard',
        description: { zh: '基础无质保微信号，发货时间30分钟-1小时', en: 'Basic WeChat account with no warranty. Shipping: 30m-1h' },
        price: { single: 28.80, bulk10: 18.80, bulk50: 18.80, bulk200: 18.80, originalPrice: { single: 44.80, bulk10: 34.80, bulk50: 34.80, bulk200: 34.80 } },
        features: [
            { zh: '无保修', en: 'No Warranty' },
            { zh: '正常接收消息', en: 'Normal messaging' },
        ],
        warranty: { zh: '无质保', en: 'No warranty' },
        deliveryTime: { zh: '30分钟 - 1小时', en: '30m - 1 hr' },
        stockCount: 14,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'wechat-premium',
        slug: 'wechat-premium',
        name: { zh: '微信高级实名号', en: 'WeChat Advanced' },
        category: 'wechat',
        type: 'account',
        tierName: { zh: '微信高级实名号', en: 'WeChat Advanced Real-Name Account' },
        tierSlug: 'premium',
        description: { zh: '高质量已实名认证的微信号', en: 'High-quality ID-verified WeChat' },
        price: { single: 38.80, bulk10: 38.80, bulk50: 38.80, bulk200: 28.80, originalPrice: { single: 48.80, bulk10: 48.80, bulk50: 48.80, bulk200: 38.80 } },
        features: [
            { zh: '实名认证完成', en: 'ID verification done' },
            { zh: '支付收款均可', en: 'Payments enabled' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 18,
        popular: true,
        badge: { zh: '最畅销', en: 'Best selling' },
        sortOrder: 2,
        ...commonFields
    },
    {
        id: 'wechat-bankcard',
        slug: 'wechat-bankcard',
        name: { zh: '微信绑卡高级实名号', en: 'WeChat Card Linked' },
        category: 'wechat',
        type: 'account',
        tierName: { zh: '微信绑卡高级实名号', en: 'WeChat Card Linked' },
        tierSlug: 'bankcard',
        description: { zh: '已实名并绑定银行实名卡', en: 'Verified with bank card linked' },
        price: { single: 58.80, bulk10: 48.80, bulk50: 48.80, bulk200: 48.80, originalPrice: { single: 72.80, bulk10: 62.80, bulk50: 62.80, bulk200: 62.80 } },
        features: [
            { zh: '实名认证 + 银行卡', en: 'ID + Bank card linked' },
            { zh: '高额支付额度', en: 'High payment limits' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '2-6小时', en: '2-6 hours' },
        stockCount: 12,
        popular: true,
        badge: { zh: '最畅销', en: 'Best selling' },
        sortOrder: 3,
        ...commonFields
    },
];

/* ---------- Alipay Products ---------- */
const alipayProducts: Product[] = [
    {
        id: 'alipay-basic',
        slug: 'alipay-basic',
        name: { zh: '支付宝基础版', en: 'Alipay Basic' },
        category: 'alipay',
        type: 'account',
        tierName: { zh: '支付宝基础版', en: 'Alipay Basic' },
        tierSlug: 'basic',
        description: { zh: '支付宝标准基础账号', en: 'Standard basic Alipay account' },
        price: { single: 48.80, bulk10: 38.80, bulk50: 38.80, bulk200: 38.80, originalPrice: { single: 52.80, bulk10: 42.80, bulk50: 42.80, bulk200: 42.80 } },
        features: [
            { zh: '全新注册', en: 'Freshly registered' },
            { zh: '即刻可用', en: 'Ready to use' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 16,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'alipay-huabei',
        slug: 'alipay-huabei',
        name: { zh: '支付宝花呗号', en: 'Alipay Huabei' },
        category: 'alipay',
        type: 'account',
        tierName: { zh: '支付宝花呗号', en: 'Alipay Huabei' },
        tierSlug: 'huabei',
        description: { zh: '已开通花呗的高级支付宝号', en: 'Alipay with Huabei enabled' },
        price: { single: 58.80, bulk10: 48.80, bulk50: 48.80, bulk200: 48.80, originalPrice: { single: 72.80, bulk10: 62.80, bulk50: 62.80, bulk200: 62.80 } },
        features: [
            { zh: '花呗可用', en: 'Huabei active' },
            { zh: '全支付开通', en: 'All payments ready' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 12,
        popular: true,
        badge: { zh: '极速号', en: 'Rapid' },
        sortOrder: 2,
        ...commonFields
    },
];

/* ---------- Douyin Products ---------- */
const douyinProducts: Product[] = [
    {
        id: 'douyin-fresh',
        slug: 'douyin-fresh',
        category: 'douyin',
        type: 'account',
        tierName: { zh: '抖音全新号', en: 'Douyin Fresh Account' },
        tierSlug: 'fresh',
        description: { zh: '全新注册，支持手机号登录，权重正常', en: 'Freshly registered standard Douyin account' },
        price: { single: 18.80, bulk10: 15.80, bulk50: 12.80, bulk200: 10.80, originalPrice: { single: 25.80, bulk10: 22.80, bulk50: 18.80, bulk200: 15.80 } },
        features: [
            { zh: '全新白号', en: 'Fresh account' },
            { zh: '无违规记录', en: 'Clean record' },
            { zh: '极速发货', en: 'Instant delivery' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 25,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'douyin-verified',
        slug: 'douyin-verified',
        category: 'douyin',
        type: 'account',
        tierName: { zh: '抖音实名号', en: 'Douyin Verified Account' },
        tierSlug: 'verified',
        description: { zh: '已完成实名认证的高质量抖音号', en: 'High-quality ID-verified Douyin' },
        price: { single: 38.80, bulk10: 38.80, bulk50: 28.80, bulk200: 28.80, originalPrice: { single: 48.80, bulk10: 48.80, bulk50: 38.80, bulk200: 38.80 } },
        features: [
            { zh: '实名认证完成', en: 'ID verification done' },
            { zh: '权重更高', en: 'Higher weight' },
            { zh: '直播功能开通', en: 'Live enabled' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 15,
        popular: true,
        badge: { zh: '最畅销', en: 'Best selling' },
        sortOrder: 2,
        ...commonFields
    },
    {
        id: 'douyin-aged',
        slug: 'douyin-aged',
        category: 'douyin',
        type: 'account',
        tierName: { zh: '抖音老号 (1年+)', en: 'Douyin Aged (1+ Year)' },
        tierSlug: 'aged',
        description: { zh: '注册满一年以上的抖音号', en: '1+ year old Douyin account' },
        price: { single: 28.80, bulk10: 26.80, bulk50: 24.80, bulk200: 22.80, originalPrice: { single: 38.80, bulk10: 36.80, bulk50: 34.80, bulk200: 32.80 } },
        features: [
            { zh: '注册1年+', en: '1+ year old' },
            { zh: '账号权重高', en: 'High weight' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '2-8小时', en: '2-8 hours' },
        stockCount: 17,
        sortOrder: 6,
        ...commonFields
    },
];

/* ---------- QQ Products ---------- */
const qqProducts: Product[] = [
    {
        id: 'qq-fresh',
        slug: 'qq-fresh',
        category: 'qq',
        type: 'account',
        tierName: { zh: 'QQ全新号', en: 'QQ Fresh Account' },
        tierSlug: 'fresh',
        description: { zh: '全新正常注册QQ号', en: 'Freshly registered standard QQ' },
        price: { single: 18.80, bulk10: 8.80, bulk50: 8.80, bulk200: 9.80, originalPrice: { single: 24.80, bulk10: 14.80, bulk50: 14.80, bulk200: 15.80 } },
        features: [
            { zh: '全新注册', en: 'Fresh account' },
            { zh: '手机号绑定', en: 'Phone bound' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 19,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'qq-aged-pro',
        slug: 'qq-aged-pro',
        category: 'qq',
        type: 'account',
        tierName: { zh: 'QQ高级老号', en: 'QQ Aged Account' },
        tierSlug: 'aged',
        description: { zh: '高质量QQ老号，权重高', en: 'High-quality aged QQ account' },
        price: { single: 38.80, bulk10: 28.80, bulk50: 28.80, bulk200: 18.80, originalPrice: { single: 48.80, bulk10: 38.80, bulk50: 38.80, bulk200: 28.80 } },
        features: [
            { zh: '16级太阳', en: 'Sun level (16+)' },
            { zh: '高等级权限', en: 'High level' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 11,
        popular: true,
        sortOrder: 2,
        ...commonFields
    },
    {
        id: 'qq-super-vip',
        slug: 'qq-super-vip',
        category: 'qq',
        type: 'account',
        tierName: { zh: 'QQ超级VIP版', en: 'QQ Super VIP Status' },
        tierSlug: 'vip',
        description: { zh: '自带超级会员的优质号码', en: 'Premium number with Super VIP included' },
        price: { single: 118.80, bulk10: 108.80, bulk50: 98.80, bulk200: 78.80, originalPrice: { single: 128.80, bulk10: 118.80, bulk50: 108.80, bulk200: 88.80 } },
        features: [
            { zh: 'QQ会员特权', en: 'VIP privileges' },
            { zh: '专属标识', en: 'VIP badge' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '2-6小时', en: '2-6 hours' },
        stockCount: 15,
        sortOrder: 3,
        ...commonFields
    },
];

/* ---------- Xianyu Products ---------- */
const xianyuProducts: Product[] = [
    {
        id: 'xianyu-standard',
        slug: 'xianyu-standard',
        category: 'xianyu',
        type: 'account',
        tierName: { zh: '闲鱼标准实名号', en: 'Xianyu Standard Verified' },
        tierSlug: 'standard',
        description: { zh: '标准闲鱼二手交易账号，安全可靠', en: 'Standard Xianyu account' },
        price: { single: 48.80, bulk10: 45.80, bulk50: 45.80, bulk200: 42.80, originalPrice: { single: 55.80, bulk10: 52.80, bulk50: 52.80, bulk200: 49.80 } },
        features: [
            { zh: '已实名认证', en: 'ID Verified' },
            { zh: '支付宝关联', en: 'Alipay Linked' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 15,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'xianyu-aged',
        slug: 'xianyu-aged',
        category: 'xianyu',
        type: 'account',
        tierName: { zh: '闲鱼优质老号', en: 'Xianyu Premium Aged' },
        tierSlug: 'aged',
        description: { zh: '高信誉分闲鱼老号', en: 'High credit score aged Xianyu account' },
        price: { single: 68.80, bulk10: 65.80, bulk50: 65.80, bulk200: 62.80, originalPrice: { single: 75.80, bulk10: 72.80, bulk50: 72.80, bulk200: 69.80 } },
        features: [
            { zh: '高芝麻信用积分', en: 'High Zhima Credit' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '2-6小时', en: '2-6 hours' },
        stockCount: 8,
        popular: true,
        sortOrder: 2,
        ...commonFields
    }
];

/* ---------- Taobao Products ---------- */
const taobaoProducts: Product[] = [
    {
        id: 'taobao-basic',
        slug: 'taobao-basic',
        category: 'taobao',
        type: 'account',
        tierName: { zh: '淘宝基础买家号', en: 'Taobao Basic Buyer' },
        tierSlug: 'basic',
        description: { zh: '淘宝购物基础白号', en: 'Fresh Taobao account' },
        price: { single: 15.80, bulk10: 12.80, bulk50: 12.80, bulk200: 10.80, originalPrice: { single: 25.80, bulk10: 22.80, bulk50: 22.80, bulk200: 18.80 } },
        stockCount: 25,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'taobao-vip',
        slug: 'taobao-vip',
        category: 'taobao',
        type: 'account',
        tierName: { zh: '淘宝VIP老号', en: 'Taobao VIP Aged Account' },
        tierSlug: 'vip-aged',
        description: { zh: '高等级淘气值老号', en: 'High Taoqi score aged account' },
        price: { single: 48.80, bulk10: 42.80, bulk50: 42.80, bulk200: 38.80, originalPrice: { single: 58.80, bulk10: 52.80, bulk50: 52.80, bulk200: 48.80 } },
        features: [
            { zh: '高淘气值', en: 'High Taoqi value' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 12,
        popular: true,
        sortOrder: 2,
        ...commonFields
    },
];

/* ---------- Xiaohongshu Products ---------- */
const xiaohongshuProducts: Product[] = [
    {
        id: 'xiaohongshu-basic',
        slug: 'xiaohongshu-basic',
        category: 'xiaohongshu',
        type: 'account',
        tierName: { zh: '小红书基础号', en: 'Xiaohongshu Basic' },
        tierSlug: 'basic',
        description: { zh: '高质量新注册账号', en: 'High-quality fresh account' },
        price: { single: 18.80, bulk10: 15.80, bulk50: 12.80, bulk200: 10.80, originalPrice: { single: 25.80, bulk10: 22.80, bulk50: 18.80, bulk200: 15.80 } },
        features: [
            { zh: '手机号注册', en: 'Phone registered' },
            { zh: '可正常点赞评论', en: 'Can like & comment' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '15-30分钟', en: '15-30 mins' },
        stockCount: 30,
        sortOrder: 1,
        ...commonFields
    },
];

/* ---------- Bundle Products ---------- */
const bundleProducts: Product[] = [
    {
        ...commonFields,
        id: 'bundle-alipay-xianyu',
        slug: 'bundle-alipay-xianyu',
        name: { zh: '支付宝+闲鱼 组合账号', en: 'Alipay + Xianyu Combo' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '支付宝+闲鱼 组合账号', en: 'Alipay + Xianyu Combo Account' },
        tierSlug: 'alipay-xianyu-bundle',
        description: { zh: '一站解决闲鱼登录难题，支付宝实名认证+闲鱼账号绑定发货', en: 'One-stop solution for Xianyu login. Verified Alipay + linked Xianyu account.' },
        price: { single: 168.00, bulk10: 144.00, bulk50: 144.00, bulk200: 144.00 },
        includes: ['支付宝实名账号', '关联闲鱼号', '使用指南'],
        requirements: { zh: '无特殊要求，到手即用', en: 'No special requirements, ready to use' },
        deliveryMethod: 'auto',
        stockCount: 47,
        popular: true,
        badge: { zh: '热门推荐', en: 'Top Pick' },
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.taobao.idlefish/512',
        sortOrder: 1,
    },
    {
        ...commonFields,
        id: 'bundle-alipay-taobao',
        slug: 'bundle-alipay-taobao',
        name: { zh: '支付宝+淘宝 购物套装', en: 'Alipay + Taobao Bundle' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '支付宝+淘宝 购物套装', en: 'Alipay + Taobao Shopping Bundle' },
        tierSlug: 'alipay-taobao-bundle',
        description: { zh: '支付宝实名认证+淘宝买家号，支持历史订单查询', en: 'Verified Alipay + Taobao buyer account with purchase history.' },
        price: { single: 192.00, bulk10: 150.00, bulk50: 150.00, bulk200: 150.00 },
        includes: ['支付宝实名', '淘宝买家号', '地址设置指南'],
        stockCount: 32,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.taobao.taobao/512',
        sortOrder: 2,
    },
    {
        ...commonFields,
        id: 'bundle-alipay-1688',
        slug: 'bundle-alipay-1688',
        name: { zh: '支付宝企业+1688 批发套装', en: 'Alipay Business + 1688 Bundle' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '支付宝企业+1688 批发套装', en: 'Alipay Business + 1688 Wholesale Bundle' },
        tierSlug: 'alipay-1688-bundle',
        description: { zh: '企业支付宝+1688卖家/买家号，适合一件代发', en: 'Enterprise Alipay + 1688 seller/buyer account.' },
        price: { single: 528.00, bulk10: 468.00, bulk50: 468.00, bulk200: 468.00 },
        stockCount: 15,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.alibaba.wireless/512',
        sortOrder: 3,
    },
    {
        ...commonFields,
        id: 'bundle-wechat-jd',
        slug: 'bundle-wechat-jd',
        name: { zh: '微信+京东 购物套装', en: 'WeChat + JD.com Bundle' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '微信+京东 购物套装', en: 'WeChat + JD.com Bundle' },
        tierSlug: 'wechat-jd-bundle',
        description: { zh: '已实名微信+京东买家号，支付已关联', en: 'Verified WeChat + JD buyer account.' },
        price: { single: 210.00, bulk10: 186.00, bulk50: 186.00, bulk200: 186.00 },
        stockCount: 22,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.jingdong.app.mall/512',
        sortOrder: 4,
    },
    {
        ...commonFields,
        id: 'bundle-full-suite',
        slug: 'bundle-full-suite',
        name: { zh: '全平台电商套装', en: 'Full E-Commerce Suite' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '全平台电商套装', en: 'Full E-Commerce Suite' },
        tierSlug: 'full-ecommerce-suite',
        description: { zh: '支付宝+微信+闲鱼+淘宝+1688 全套账号', en: 'Full suite including all major platforms.' },
        price: { single: 1728.00, bulk10: 1560.00, bulk50: 1560.00, bulk200: 1560.00 },
        stockCount: 5,
        popular: true,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.android.vending/512',
        sortOrder: 5,
    },
];

/* ---------- Verification Services ---------- */
const verificationProducts: Product[] = [
    {
        ...commonFields,
        id: 'verify-passport',
        slug: 'verify-passport',
        name: { zh: '护照实名认证服务', en: 'Passport KYC Verification' },
        category: 'verification',
        type: 'service',
        tierName: { zh: '护照实名代认证', en: 'Passport KYC' },
        tierSlug: 'passport-kyc',
        description: { zh: '提供支付宝、微信及各类跨境平台护照实名代办', en: 'Assisted KYC verification using global passports.' },
        price: { single: 90.00, bulk10: 90.00, bulk50: 90.00, bulk200: 90.00 },
        requirements: { zh: '需要提供护照清晰照片', en: 'Clear passport photo required' },
        deliveryMethod: 'manual',
        stockCount: 99,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/org.jmrtd.scanner/512',
        sortOrder: 1,
    },
    {
        ...commonFields,
        id: 'verify-face',
        slug: 'verify-face',
        name: { zh: '人脸识别验证', en: 'Face Recognition Verification' },
        category: 'verification',
        type: 'service',
        tierName: { zh: '人脸验证服务', en: 'Face Verify' },
        tierSlug: 'face-verify',
        description: { zh: '解决APP登录过程中遇到的人脸验证难题', en: 'Bypass face recognition hurdles for apps.' },
        price: { single: 48.00, bulk10: 48.00, bulk50: 48.00, bulk200: 48.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.facephi.selphi.demo/512',
        sortOrder: 2,
    },
    {
        ...commonFields,
        id: 'verify-kyc',
        slug: 'verify-kyc',
        name: { zh: '全套KYC验证包', en: 'Full KYC Package' },
        category: 'verification',
        type: 'service',
        tierName: { zh: '全套认证包', en: 'KYC Package' },
        tierSlug: 'kyc-package',
        description: { zh: '包含身份证、手持、人脸全套验证资料', en: 'Includes ID, holding ID photo, and face data.' },
        price: { single: 150.00, bulk10: 150.00, bulk50: 150.00, bulk200: 150.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.shuftipro.kyc/512',
        sortOrder: 3,
    },
    {
        ...commonFields,
        id: 'verify-wechat',
        slug: 'verify-wechat',
        name: { zh: '微信实名激活', en: 'WeChat Realname Activation' },
        category: 'verification',
        type: 'service',
        tierName: { zh: '微信实名', en: 'Wechat Realname' },
        tierSlug: 'wechat-realname',
        description: { zh: '为您的微信账号激活支付及实名功能', en: 'Activate payment and ID status for your WeChat.' },
        price: { single: 72.00, bulk10: 72.00, bulk50: 72.00, bulk200: 72.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.tencent.mm/512',
        sortOrder: 4,
    },
    {
        ...commonFields,
        id: 'verify-alipay',
        slug: 'verify-alipay',
        name: { zh: '支付宝实名激活', en: 'Alipay Realname Activation' },
        category: 'verification',
        type: 'service',
        tierName: { zh: '支付宝实名', en: 'Alipay Realname' },
        tierSlug: 'alipay-realname',
        description: { zh: '为您的支付宝账号激活全功能实名', en: 'Full feature ID activation for Alipay.' },
        price: { single: 72.00, bulk10: 72.00, bulk50: 72.00, bulk200: 72.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.eg.android.AlipayGphone/512',
        sortOrder: 5,
    },
];

/* ---------- Trading Products ---------- */
const tradingProducts: Product[] = [
    {
        ...commonFields,
        id: 'xm-account',
        slug: 'xm-account',
        name: { zh: 'XM 交易账户', en: 'XM Trading Account' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'XM 账号', en: 'XM Account' },
        tierSlug: 'xm-account',
        description: { zh: '已通过KYC认证的XM外汇交易账户', en: 'Verified XM account ready for forex trading.' },
        price: { single: 180.00, bulk10: 180.00, bulk50: 180.00, bulk200: 180.00 },
        deliveryMethod: 'manual',
        stockCount: 10,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.xm.webapp/512',
        sortOrder: 1,
    },
    {
        ...commonFields,
        id: 'hfm-account',
        slug: 'hfm-account',
        name: { zh: 'HFM 交易账户', en: 'HFM Trading Account' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'HFM 账号', en: 'HFM Account' },
        tierSlug: 'hfm-account',
        description: { zh: '已通过KYC认证的HFM(HotForex)账户', en: 'Verified HFM account.' },
        price: { single: 180.00, bulk10: 180.00, bulk50: 180.00, bulk200: 180.00 },
        deliveryMethod: 'manual',
        stockCount: 8,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.hotforex.www.hotforex/512',
        sortOrder: 2,
    },
    {
        ...commonFields,
        id: 'neteller-account',
        slug: 'neteller-account',
        name: { zh: 'Neteller 电子钱包', en: 'Neteller Wallet' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'Neteller 账号', en: 'Neteller Account' },
        tierSlug: 'neteller-account',
        description: { zh: '已实名认证的Neteller电子钱包', en: 'Verified Neteller e-wallet.' },
        price: { single: 90.00, bulk10: 90.00, bulk50: 90.00, bulk200: 90.00 },
        deliveryMethod: 'manual',
        stockCount: 15,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.moneybookers.skrillpayments.neteller/512',
        sortOrder: 3,
    },
    {
        ...commonFields,
        id: 'skrill-account',
        slug: 'skrill-account',
        name: { zh: 'Skrill 电子钱包', en: 'Skrill Wallet' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'Skrill 账号', en: 'Skrill Account' },
        tierSlug: 'skrill-account',
        description: { zh: '已实名认证的Skrill电子钱包', en: 'Verified Skrill e-wallet.' },
        price: { single: 90.00, bulk10: 90.00, bulk50: 90.00, bulk200: 90.00 },
        deliveryMethod: 'manual',
        stockCount: 12,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.moneybookers.skrillpayments/512',
        sortOrder: 4,
    },
    {
        ...commonFields,
        id: 'payoneer-account',
        slug: 'payoneer-account',
        name: { zh: 'Payoneer 账户', en: 'Payoneer Account' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'Payoneer 账号', en: 'Payoneer Account' },
        tierSlug: 'payoneer-account',
        description: { zh: '已通过KYC的Payoneer账户，支持全球收款', en: 'Verified Payoneer account for global payments.' },
        price: { single: 270.00, bulk10: 270.00, bulk50: 270.00, bulk200: 270.00 },
        deliveryMethod: 'manual',
        stockCount: 5,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.payoneer.android/512',
        sortOrder: 5,
    },
    {
        ...commonFields,
        id: 'wise-account',
        slug: 'wise-account',
        name: { zh: 'Wise 账户', en: 'Wise Account' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'Wise 账号', en: 'Wise Account' },
        tierSlug: 'wise-account',
        description: { zh: '已完成实名验证的Wise账户，支持多币种', en: 'Verified Wise multi-currency account.' },
        price: { single: 300.00, bulk10: 300.00, bulk50: 300.00, bulk200: 300.00 },
        deliveryMethod: 'manual',
        stockCount: 3,
        image: 'https://play-lh.googleusercontent.com/v3/app/icon/com.transferwise.android/512',
        sortOrder: 6,
    },
];

export const allProducts: Product[] = [
    ...wechatProducts,
    ...alipayProducts,
    ...douyinProducts,
    ...qqProducts,
    ...xianyuProducts,
    ...taobaoProducts,
    ...xiaohongshuProducts,
    ...bundleProducts,
    ...verificationProducts,
    ...tradingProducts,
];

export function getProductById(id: string): Product | undefined {
    return allProducts.find(p => p.id === id);
}

export function getProductsByCategory(category: CategoryId): Product[] {
    return allProducts.filter(p => p.category === category);
}

export function getCategoryById(id: string): Category | undefined {
    return categories.find(c => c.id === id);
}

export function getStockStatus(count: number): 'high' | 'medium' | 'low' | 'out' {
    if (count > 20) return 'high';
    if (count > 5) return 'medium';
    if (count > 0) return 'low';
    return 'out';
}

export function getTotalStock(categoryId: CategoryId): number {
    return allProducts
        .filter(p => p.category === categoryId)
        .reduce((sum, p) => sum + p.stockCount, 0);
}

export function getLowestPrice(categoryId: CategoryId): number {
    const prices = allProducts
        .filter(p => p.category === categoryId)
        .map(p => p.price.single);
    return prices.length > 0 ? Math.min(...prices) : 0;
}
