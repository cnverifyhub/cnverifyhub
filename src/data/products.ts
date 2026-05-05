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
        price: { single: 20.54, bulk10: 18.00, bulk50: 16.00, bulk200: 14.00, originalPrice: { single: 35.00, bulk10: 30.00, bulk50: 25.00, bulk200: 20.00 } },
        features: [
            { zh: '全新白号', en: 'Fresh account' },
            { zh: '无违规记录', en: 'Clean record' },
            { zh: '极速发货', en: 'Instant delivery' },
        ],
        warranty: { zh: '24小时首登质保', en: '24h first-login warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 80,
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
        price: { single: 50.44, bulk10: 38.80, bulk50: 28.80, bulk200: 28.80, originalPrice: { single: 48.80, bulk10: 48.80, bulk50: 38.80, bulk200: 38.80 } },
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
        price: { single: 37.44, bulk10: 26.80, bulk50: 24.80, bulk200: 22.80, originalPrice: { single: 38.80, bulk10: 36.80, bulk50: 34.80, bulk200: 32.80 } },
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
        description: { zh: '全新正常注册QQ号，安全检查通过', en: 'Freshly registered standard QQ, safety checked' },
        price: { single: 33.54, bulk10: 28.00, bulk50: 25.00, bulk200: 22.00, originalPrice: { single: 50.00, bulk10: 45.00, bulk50: 40.00, bulk200: 35.00 } },
        features: [
            { zh: '全新注册', en: 'Fresh account' },
            { zh: '手机号绑定', en: 'Phone bound' },
            { zh: '支持改资料', en: 'Profile editable' },
        ],
        warranty: { zh: '24小时首登质保', en: '24h first-login warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 100,
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
        price: { single: 50.44, bulk10: 28.80, bulk50: 28.80, bulk200: 18.80, originalPrice: { single: 48.80, bulk10: 38.80, bulk50: 38.80, bulk200: 28.80 } },
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
        price: { single: 154.44, bulk10: 108.80, bulk50: 98.80, bulk200: 78.80, originalPrice: { single: 128.80, bulk10: 118.80, bulk50: 108.80, bulk200: 88.80 } },
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
        tierName: { zh: '淘宝基础买家号', en: 'Taobao Basic' },
        tierSlug: 'basic',
        description: { zh: '高质量新注册买家账号，已过实名', en: 'High-quality fresh buyer account, verified' },
        price: { single: 29.12, bulk10: 25.00, bulk50: 22.00, bulk200: 20.00, originalPrice: { single: 45.00, bulk10: 40.00, bulk50: 35.00, bulk200: 30.00 } },
        features: [
            { zh: '已过实名', en: 'KYC Verified' },
            { zh: '可立即下单', en: 'Ready to order' },
            { zh: '白号权重', en: 'Fresh authority' },
        ],
        warranty: { zh: '24小时首登质保', en: '24h first-login warranty' },
        deliveryTime: { zh: '15-30分钟', en: '15-30 mins' },
        stockCount: 40,
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
        price: { single: 63.44, bulk10: 42.80, bulk50: 42.80, bulk200: 38.80, originalPrice: { single: 58.80, bulk10: 52.80, bulk50: 52.80, bulk200: 48.80 } },
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
        description: { zh: '高质量新注册账号，适合日常互动', en: 'High-quality fresh account for daily interaction' },
        price: { single: 32.14, bulk10: 21.31, bulk50: 19.50, bulk200: 16.90, originalPrice: { single: 63.38, bulk10: 50.56, bulk50: 42.61, bulk200: 37.56 } },
        features: [
            { zh: '手机号注册', en: 'Phone registered' },
            { zh: '权重达标', en: 'Standard authority' },
            { zh: '支持改资料', en: 'Profile editable' },
        ],
        warranty: { zh: '24小时首登质保', en: '24h first-login warranty' },
        deliveryTime: { zh: '15-30分钟', en: '15-30 mins' },
        stockCount: 50,
        sortOrder: 1,
        ...commonFields
    },
    {
        id: 'xiaohongshu-verified',
        slug: 'xiaohongshu-verified',
        category: 'xiaohongshu',
        type: 'account',
        tierName: { zh: '小红书实名号', en: 'Xiaohongshu Verified' },
        tierSlug: 'verified',
        description: { zh: '已完成实名认证，权重更高，不易封号', en: 'Verified account with higher authority and anti-ban' },
        price: { single: 41.39, bulk10: 38.00, bulk50: 35.00, bulk200: 32.00, originalPrice: { single: 68.00, bulk10: 62.00, bulk50: 58.00, bulk200: 52.00 } },
        features: [
            { zh: '实名认证', en: 'KYC Verified' },
            { zh: '高存活率', en: 'High survival rate' },
            { zh: '适合引流', en: 'Great for traffic' },
        ],
        warranty: { zh: '48小时质保', en: '48h warranty' },
        deliveryTime: { zh: '30-60分钟', en: '30-60 mins' },
        stockCount: 30,
        sortOrder: 2,
        ...commonFields
    },
    {
        id: 'xiaohongshu-aged',
        slug: 'xiaohongshu-aged',
        category: 'xiaohongshu',
        type: 'account',
        tierName: { zh: '小红书老号', en: 'Xiaohongshu Aged' },
        tierSlug: 'aged',
        description: { zh: '注册时间1年以上老号，权重极高', en: '1+ year aged account with extremely high authority' },
        price: { single: 53.89, bulk10: 50.00, bulk50: 45.00, bulk200: 40.00, originalPrice: { single: 88.00, bulk10: 82.00, bulk50: 75.00, bulk200: 68.00 } },
        features: [
            { zh: '老号权重', en: 'Aged authority' },
            { zh: '发帖易推荐', en: 'Easy to get featured' },
            { zh: '抗封性极强', en: 'Strong anti-ban' },
        ],
        warranty: { zh: '72小时质保', en: '72h warranty' },
        deliveryTime: { zh: '1-2小时', en: '1-2 hours' },
        stockCount: 20,
        sortOrder: 3,
        ...commonFields
    },
    {
        id: 'xiaohongshu-1k',
        slug: 'xiaohongshu-1k',
        category: 'xiaohongshu',
        type: 'account',
        tierName: { zh: '小红书千粉号', en: 'Xiaohongshu 1K Followers' },
        tierSlug: '1k-followers',
        description: { zh: '自带1000+真实粉丝，适合快速起号', en: '1000+ real followers, perfect for fast growth' },
        price: { single: 81.67, bulk10: 75.00, bulk50: 70.00, bulk200: 65.00, originalPrice: { single: 128.00, bulk10: 118.00, bulk50: 108.00, bulk200: 98.00 } },
        features: [
            { zh: '1000+粉丝', en: '1000+ followers' },
            { zh: '自带作品', en: 'Existing posts' },
            { zh: '流量池入场券', en: 'Traffic pool entry' },
        ],
        warranty: { zh: '3天质保', en: '3-day warranty' },
        deliveryTime: { zh: '2-4小时', en: '2-4 hours' },
        stockCount: 15,
        sortOrder: 4,
        ...commonFields
    },
    {
        id: 'xiaohongshu-10k',
        slug: 'xiaohongshu-10k',
        category: 'xiaohongshu',
        type: 'account',
        tierName: { zh: '小红书万粉号', en: 'Xiaohongshu 10K Followers' },
        tierSlug: '10k-followers',
        description: { zh: '自带10000+真实粉丝，高曝光权重', en: '10000+ real followers, high exposure authority' },
        price: { single: 177.78, bulk10: 165.00, bulk50: 150.00, bulk200: 140.00, originalPrice: { single: 258.00, bulk10: 238.00, bulk50: 218.00, bulk200: 198.00 } },
        features: [
            { zh: '10000+粉丝', en: '10000+ followers' },
            { zh: '高曝光率', en: 'High exposure' },
            { zh: '商业价值高', en: 'High commercial value' },
        ],
        warranty: { zh: '5天质保', en: '5-day warranty' },
        deliveryTime: { zh: '4-8小时', en: '4-8 hours' },
        stockCount: 10,
        sortOrder: 5,
        ...commonFields
    },
    {
        id: 'xiaohongshu-brand',
        slug: 'xiaohongshu-brand',
        category: 'xiaohongshu',
        type: 'account',
        tierName: { zh: '小红书品牌店', en: 'Xiaohongshu Brand Store' },
        tierSlug: 'brand-store',
        description: { zh: '已开通品牌号权限，适合企业直接运营', en: 'Brand account enabled, ready for corporate operation' },
        price: { single: 400.00, bulk10: 380.00, bulk50: 350.00, bulk200: 320.00, originalPrice: { single: 588.00, bulk10: 538.00, bulk50: 498.00, bulk200: 458.00 } },
        features: [
            { zh: '品牌认证', en: 'Brand Certified' },
            { zh: '开通店铺', en: 'Store Enabled' },
            { zh: '企业营销权限', en: 'Corporate Marketing' },
        ],
        warranty: { zh: '72小时质保', en: '72h warranty' },
        deliveryTime: { zh: '12-24小时', en: '12-24 hours' },
        stockCount: 5,
        sortOrder: 6,
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
        price: { single: 65.00, bulk10: 60.00, bulk50: 55.00, bulk200: 50.00, originalPrice: { single: 168.00, bulk10: 144.00, bulk50: 144.00, bulk200: 144.00 } },
        includes: ['支付宝实名账号', '关联闲鱼号', '使用指南'],
        requirements: { zh: '无特殊要求，到手即用', en: 'No special requirements, ready to use' },
        deliveryMethod: 'auto',
        stockCount: 47,
        popular: true,
        badge: { zh: '热门推荐', en: 'Top Pick' },
        image: 'https://play-lh.googleusercontent.com/eaX5GSrLgAvCTKAe8N0baDkKA0gJ3siyG9X28sfmSO8yBmKVfPDQyJ3y_AvcCr8DSYU=s512-rw',
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
        price: { single: 60.00, bulk10: 55.00, bulk50: 50.00, bulk200: 45.00, originalPrice: { single: 192.00, bulk10: 150.00, bulk50: 150.00, bulk200: 150.00 } },
        includes: ['支付宝实名', '淘宝买家号', '地址设置指南'],
        stockCount: 32,
        image: 'https://play-lh.googleusercontent.com/6F3ONMR_UowQyqKud-bqqz5iWHGtleHEWTPZEoUiWPJj02R9hPL-agPCt_C3KYQLYi8=s512-rw',
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
        price: { single: 75.00, bulk10: 70.00, bulk50: 65.00, bulk200: 60.00, originalPrice: { single: 528.00, bulk10: 468.00, bulk50: 468.00, bulk200: 468.00 } },
        includes: ['企业支付宝', '1688批发号', '代发权限指南'],
        stockCount: 15,
        image: 'https://play-lh.googleusercontent.com/0QjGmfF5AG7R3APWO60g_Nx3Et_XUEEMnngxln-GJx7HLz6lV5Hu2im8mP2UzKIalhmN=s512-rw',
        sortOrder: 3,
    },
    {
        ...commonFields,
        id: 'bundle-wechat-jd',
        slug: 'bundle-wechat-jd',
        name: { zh: '微信+京东 购物套装', en: 'WeChat + JD.com Bundle' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '微信+京东 组合账号', en: 'WeChat + JD.com Combo' },
        tierSlug: 'wechat-jd-bundle',
        description: { zh: '已实名微信账号+京东白条号，购物无忧', en: 'Verified WeChat + JD.com account with baitiao ready.' },
        price: { single: 85.00, bulk10: 80.00, bulk50: 75.00, bulk200: 70.00, originalPrice: { single: 258.00, bulk10: 218.00, bulk50: 198.00, bulk200: 178.00 } },
        includes: ['实名微信', '京东账号', '京东白条额度说明'],
        stockCount: 22,
        image: 'https://play-lh.googleusercontent.com/LWaIZ0sOjW3gUC0yNXIrPGZe9jxNDDpqv9TI-IguAcHvtX30bCTlcNhDaXpu1s5ZBiQ=s512-rw',
        sortOrder: 4,
    },
    {
        ...commonFields,
        id: 'bundle-full-suite',
        slug: 'bundle-full-suite',
        name: { zh: '全能电商全家桶', en: 'Full E-commerce Suite' },
        category: 'bundle',
        type: 'bundle',
        tierName: { zh: '全能电商全家桶', en: 'Full E-commerce Suite' },
        tierSlug: 'full-ecommerce-suite',
        description: { zh: '包含微信、支付宝、淘宝、拼多多全套实名资料', en: 'Complete suite of WeChat, Alipay, Taobao, and PDD accounts.' },
        price: { single: 150.00, bulk10: 140.00, bulk50: 130.00, bulk200: 120.00, originalPrice: { single: 450.00, bulk10: 400.00, bulk50: 380.00, bulk200: 350.00 } },
        includes: ['四平台全通号', '独立实名资料', '长期维护教程'],
        stockCount: 10,
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
        name: { zh: '护照实名代认证', en: 'Passport Verification Service' },
        category: 'verification',
        type: 'service',
        tierName: { zh: '护照认证', en: 'Passport Verify' },
        tierSlug: 'passport',
        description: { zh: '支持支付宝、微信、跨境平台护照实名认证', en: 'Passport verification for major platforms.' },
        price: { single: 80.00, bulk10: 80.00, bulk50: 80.00, bulk200: 80.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
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
        price: { single: 50.00, bulk10: 50.00, bulk50: 50.00, bulk200: 50.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
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
        price: { single: 120.00, bulk10: 120.00, bulk50: 120.00, bulk200: 120.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
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
        price: { single: 45.00, bulk10: 45.00, bulk50: 45.00, bulk200: 45.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
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
        price: { single: 45.00, bulk10: 45.00, bulk50: 45.00, bulk200: 45.00 },
        deliveryMethod: 'manual',
        stockCount: 99,
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
        tierName: { zh: 'XM 交易账号', en: 'XM Trading Account' },
        tierSlug: 'xm-account',
        description: { zh: '已完成实名验证的XM交易账户，支持MT4/MT5', en: 'Verified XM trading account, MT4/MT5 ready.' },
        price: { single: 28.80, bulk10: 28.80, bulk50: 28.80, bulk200: 28.80, originalPrice: { single: 150.00, bulk10: 150.00, bulk50: 150.00, bulk200: 150.00 } },
        deliveryMethod: 'manual',
        stockCount: 5,
        image: 'https://play-lh.googleusercontent.com/RpHrO7HPONgaIf95gQ1RIvAf0TpG-QJksy-9QKCyd_hEP3UMY8SwlyqIhkrM1R0mO0ph6ZdkRlKr9jKbuL3U=s512-rw',
        sortOrder: 1,
    },
    {
        ...commonFields,
        id: 'hfm-account',
        slug: 'hfm-account',
        name: { zh: 'HFM 交易账户', en: 'HFM Trading Account' },
        category: 'trading',
        type: 'account',
        tierName: { zh: 'HFM 交易账号', en: 'HFM Trading Account' },
        tierSlug: 'hfm-account',
        description: { zh: '已完成实名验证的HFM账户，极低点差', en: 'Verified HFM account, ultra-low spread.' },
        price: { single: 26.80, bulk10: 26.80, bulk50: 26.80, bulk200: 26.80, originalPrice: { single: 120.00, bulk10: 120.00, bulk50: 120.00, bulk200: 120.00 } },
        deliveryMethod: 'manual',
        stockCount: 8,
        image: 'https://play-lh.googleusercontent.com/0XuuQxrd59d3zjF_pcVIKYomU_qVm5q94ITYrPyx8KT6RCZ0DjausMLKy7W2PFgAWQ=s512-rw',
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
        price: { single: 32.40, bulk10: 32.40, bulk50: 32.40, bulk200: 32.40, originalPrice: { single: 90.00, bulk10: 90.00, bulk50: 90.00, bulk200: 90.00 } },
        deliveryMethod: 'manual',
        stockCount: 15,
        image: 'https://play-lh.googleusercontent.com/ijDhJYBK12iYXNvuAABa_nMc-WGTKGWoDzg3NRy-KjXXqxNVZIOC3jP9jpg-lXMO_HhZqVCwasxW455CpNULsg=s512-rw',
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
        image: 'https://play-lh.googleusercontent.com/XiQe-KRLN5tckY8lTU_9Zz3328cDuuk-8bkniQgJaGikwrIoNgr6n3t8VIz6oR1DbLA=s512-rw',
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
        price: { single: 50.50, bulk10: 50.50, bulk50: 50.50, bulk200: 50.50, originalPrice: { single: 270.00, bulk10: 270.00, bulk50: 270.00, bulk200: 270.00 } },
        deliveryMethod: 'manual',
        stockCount: 5,
        image: 'https://play-lh.googleusercontent.com/e6la-fdbXc3m60Jh0zLsZn-YHYqipHMB3q_yGqnkt_Z0K9J_r4RefEn1kq49wPDHuT0=s512-rw',
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
        price: { single: 45.80, bulk10: 45.80, bulk50: 45.80, bulk200: 45.80, originalPrice: { single: 300.00, bulk10: 300.00, bulk50: 300.00, bulk200: 300.00 } },
        deliveryMethod: 'manual',
        stockCount: 3,
        image: 'https://play-lh.googleusercontent.com/SuO-_SDMbY15BPZt6EshX_8ivk0_BCOq4qdb7r5PcdmsuA3cbGm6_cJAuwiNuPY3jhlvfXLH6m1UahEERdAX9A=s512-rw',
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
