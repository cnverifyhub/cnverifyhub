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
        icon: 'package',
        color: 'text-purple-500',
        gradient: 'from-purple-500 to-indigo-600',
        href: '/bundle',
    },
    {
        id: 'verification',
        name: { zh: '实名认证服务', en: 'Verification Services' },
        description: { zh: '提供支付宝、微信、及各类跨境平台护照实名代认证服务', en: 'Passport verification services for Alipay, WeChat, and trading platforms' },
        icon: 'shield-check',
        color: 'text-indigo-500',
        gradient: 'from-indigo-500 to-blue-600',
        href: '/verification',
    },
    {
        id: 'fintech',
        name: { zh: '金融交易账户', en: 'FinTech & Trading' },
        description: { zh: '已实名认证的XM、HFM、Neteller、Payoneer等金融账户', en: 'Verified accounts for XM, HFM, Neteller, Skrill, and Payoneer' },
        icon: 'landmark',
        color: 'text-emerald-500',
        gradient: 'from-emerald-500 to-teal-600',
        href: '/fintech',
    },
];

/* ---------- WeChat Products ---------- */
const wechatProducts: Product[] = [
    {
        id: 'wechat-basic',
        category: 'wechat',
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
    },
    {
        id: 'wechat-premium',
        category: 'wechat',
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
    },
    {
        id: 'wechat-bankcard',
        category: 'wechat',
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
    },
    {
        id: 'wechat-aged-15d',
        category: 'wechat',
        tierName: { zh: '微信实名绑卡老号(7-15天)', en: 'Real Name + Card Linked (7-15 days)' },
        tierSlug: 'aged-15d',
        description: { zh: '注册满7-15天的实名号', en: '7-15 days aged verified account' },
        price: { single: 78.80, bulk10: 68.80, bulk50: 68.80, bulk200: 68.80, originalPrice: { single: 96.80, bulk10: 86.80, bulk50: 86.80, bulk200: 86.80 } },
        features: [
            { zh: '实名+绑卡', en: 'ID + Card' },
            { zh: '活跃7-15天', en: 'Active 7-15 Days' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 15,
        sortOrder: 4,
    },
    {
        id: 'wechat-aged-1m-1',
        category: 'wechat',
        tierName: { zh: '微信实名绑卡(1个月)', en: 'Real Name + Card Linked (1 Month)' },
        tierSlug: 'aged-1m-1',
        description: { zh: '注册满1个月的标准老号', en: '1-Month aged account' },
        price: { single: 88.80, bulk10: 78.80, bulk50: 78.80, bulk200: 78.80, originalPrice: { single: 100.80, bulk10: 90.80, bulk50: 90.80, bulk200: 90.80 } },
        features: [
            { zh: '满1个月注册', en: '1 Month Aged' },
            { zh: '稳定防风控', en: 'Stable & Safe' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 11,
        sortOrder: 5,
    },
    {
        id: 'wechat-aged-1m-2',
        category: 'wechat',
        tierName: { zh: '微信实名绑卡(1个月 优选)', en: 'Real Name + Card Linked (1 Month Premium)' },
        tierSlug: 'aged-1m-2',
        description: { zh: '1个月高存活率高质量账号', en: '1-Month Premium High Quality Account' },
        price: { single: 98.80, bulk10: 98.80, bulk50: 88.80, bulk200: 88.80, originalPrice: { single: 104.80, bulk10: 104.80, bulk50: 94.80, bulk200: 94.80 } },
        features: [
            { zh: '优选1个月账号', en: '1 Month Premium' },
            { zh: '极高安全权重', en: 'High Trust Auth' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 19,
        sortOrder: 6,
    },
    {
        id: 'wechat-aged-6m',
        category: 'wechat',
        tierName: { zh: '微信实名绑卡(6个月)', en: 'Real Name + Card Linked (6 Months)' },
        tierSlug: 'aged-6m',
        description: { zh: '半年老号，适合商务工作', en: '6-Months aged, great for business' },
        price: { single: 118.80, bulk10: 118.80, bulk50: 108.80, bulk200: 98.80, originalPrice: { single: 128.80, bulk10: 128.80, bulk50: 118.80, bulk200: 108.80 } },
        features: [
            { zh: '半年活跃老号', en: '6 Months Aged' },
            { zh: '抗封抗风控', en: 'High Anti-Ban' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '2-4小时', en: '2-4 hours' },
        stockCount: 13,
        sortOrder: 7,
    },
    {
        id: 'wechat-aged-1y',
        category: 'wechat',
        tierName: { zh: '微信实名绑卡(1年)', en: 'Real Name + Card Linked (1 Year)' },
        tierSlug: 'aged-1y',
        description: { zh: '1年私人老号', en: '1-Year private aged account' },
        price: { single: 158.80, bulk10: 158.80, bulk50: 148.80, bulk200: 138.80, originalPrice: { single: 176.80, bulk10: 176.80, bulk50: 166.80, bulk200: 156.80 } },
        features: [
            { zh: '1年以上老号', en: '1+ Year Aged' },
            { zh: '企业私人皆可', en: 'Business/Private' },
        ],
        warranty: { zh: '7天质保', en: '7 Days Warranty' },
        deliveryTime: { zh: '2-4小时', en: '2-4 hours' },
        stockCount: 16,
        sortOrder: 8,
    },
    {
        id: 'wechat-aged-3y',
        category: 'wechat',
        tierName: { zh: '微信实名绑卡(3年+)', en: 'Real Name + Card Linked (3+ Years)' },
        tierSlug: 'aged-3y',
        description: { zh: '顶级权重三年以上微信老号', en: 'Top-tier 3+ Years aged account' },
        price: { single: 278.80, bulk10: 268.80, bulk50: 248.80, bulk200: 228.80, originalPrice: { single: 288.80, bulk10: 278.80, bulk50: 258.80, bulk200: 238.80 } },
        features: [
            { zh: '3年以上历史', en: '3+ Years History' },
            { zh: '发朋友圈不限', en: 'Safe Moments' },
        ],
        warranty: { zh: '14天质保', en: '14 Days Warranty' },
        deliveryTime: { zh: '4-8小时', en: '4-8 hours' },
        stockCount: 10,
        sortOrder: 9,
    },
    {
        id: 'wechat-enterprise',
        category: 'wechat',
        tierName: { zh: '微信企业号', en: 'WeChat Enterprise' },
        tierSlug: 'enterprise',
        description: { zh: '企业号标准版', en: 'WeChat Enterprise Standard' },
        price: { single: 118.80, bulk10: 118.80, bulk50: 108.80, bulk200: 108.80, originalPrice: { single: 128.80, bulk10: 128.80, bulk50: 118.80, bulk200: 118.80 } },
        features: [
            { zh: '企业认证主体', en: 'Enterprise Entity' },
            { zh: '客户管理功能', en: 'CRM tools' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '4-12小时', en: '4-12 hours' },
        stockCount: 17,
        sortOrder: 10,
    },
    {
        id: 'wechat-enterprise-pro',
        category: 'wechat',
        tierName: { zh: '微信企业尊享版', en: 'WeChat Enterprise Premium Edition' },
        tierSlug: 'enterprise-pro',
        description: { zh: '顶级企业认证微信尊享版', en: 'Top-tier WeChat Enterprise Premium Edition' },
        price: { single: 168.80, bulk10: 158.80, bulk50: 158.80, bulk200: 148.80, originalPrice: { single: 180.80, bulk10: 170.80, bulk50: 170.80, bulk200: 160.80 } },
        features: [
            { zh: '企业顶级认证', en: 'Premium verified' },
            { zh: '高级API接入', en: 'Advanced API access' },
        ],
        warranty: { zh: '7天质保', en: '7-day warranty' },
        deliveryTime: { zh: '12-24小时', en: '12-24 hours' },
        stockCount: 11,
        badge: { zh: '限量版', en: 'Limited Edition' },
        sortOrder: 11,
    },
];

/* ---------- Alipay Products ---------- */
const alipayProducts: Product[] = [
    {
        id: 'alipay-basic',
        category: 'alipay',
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
    },
    {
        id: 'alipay-huabei',
        category: 'alipay',
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
    },
    {
        id: 'alipay-bankcard',
        category: 'alipay',
        tierName: { zh: '支付宝实名绑卡', en: 'Alipay Card Linked' },
        tierSlug: 'bankcard',
        description: { zh: '最高权限实名认证绑卡号', en: 'Verified with bank card linked' },
        price: { single: 68.80, bulk10: 58.80, bulk50: 58.80, bulk200: 58.80, originalPrice: { single: 76.80, bulk10: 66.80, bulk50: 66.80, bulk200: 66.80 } },
        features: [
            { zh: '实名认证+绑卡', en: 'ID verified + Card' },
            { zh: '高额度无忧', en: 'High transaction limits' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '2-6小时', en: '2-6 hours' },
        stockCount: 19,
        popular: true,
        sortOrder: 3,
    },
];

/* ---------- Douyin Products ---------- */
const douyinProducts: Product[] = [
    {
        id: 'douyin-viewer',
        category: 'douyin',
        tierName: { zh: '抖音浏览号', en: 'Douyin Viewer Account' },
        tierSlug: 'viewer',
        description: { zh: '适合高质量日常浏览和点赞', en: 'Perfect for high-quality daily viewing and interaction' },
        price: { single: 18.80, bulk10: 18.80, bulk50: 14.80, bulk200: 12.80, originalPrice: { single: 28.80, bulk10: 28.80, bulk50: 24.80, bulk200: 22.80 } },
        features: [
            { zh: '全新注册', en: 'Fresh account' },
            { zh: '手机号绑定', en: 'Phone bound' },
            { zh: '可正常使用', en: 'Fully functional' },
            { zh: '可自行认证', en: 'Can verify' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 18,
        sortOrder: 1,
    },
    {
        id: 'douyin-verified',
        category: 'douyin',
        tierName: { zh: '抖音实名号', en: 'Douyin Verified Account' },
        tierSlug: 'verified',
        description: { zh: '已实名认证的抖音号', en: 'ID-verified Douyin account' },
        price: { single: 48.80, bulk10: 46.80, bulk50: 44.80, bulk200: 42.80, originalPrice: { single: 58.80, bulk10: 56.80, bulk50: 54.80, bulk200: 52.80 } },
        features: [
            { zh: '实名认证', en: 'ID verified' },
            { zh: '直播功能', en: 'Live streaming' },
            { zh: '橱窗功能', en: 'Showcase enabled' },
            { zh: '可开通抖店', en: 'Can open Doudian' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 14,
        popular: true,
        badge: { zh: '热门', en: 'Popular' },
        sortOrder: 2,
    },
    {
        id: 'douyin-1k',
        category: 'douyin',
        tierName: { zh: '抖音千粉号', en: 'Douyin 1K+ Followers' },
        tierSlug: '1k-followers',
        description: { zh: '1000+粉丝的抖音号，可开通商品橱窗', en: '1000+ followers, can open product showcase' },
        price: { single: 38.80, bulk10: 36.80, bulk50: 34.80, bulk200: 32.80, originalPrice: { single: 48.80, bulk10: 46.80, bulk50: 44.80, bulk200: 42.80 } },
        features: [
            { zh: '1000+真实粉丝', en: '1000+ real followers' },
            { zh: '橱窗已开通', en: 'Showcase enabled' },
            { zh: '直播带货可用', en: 'Live commerce ready' },
            { zh: '实名认证', en: 'ID verified' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '4-12小时', en: '4-12 hours' },
        stockCount: 12,
        sortOrder: 3,
    },
    {
        id: 'douyin-10k',
        category: 'douyin',
        tierName: { zh: '抖音万粉号', en: 'Douyin 10K+ Followers' },
        tierSlug: '10k-followers',
        description: { zh: '10000+高权重粉丝，适合品牌起号', en: '10000+ high authority followers, great for brands' },
        price: { single: 158.80, bulk10: 148.80, bulk50: 138.80, bulk200: 128.80, originalPrice: { single: 178.80, bulk10: 168.80, bulk50: 158.80, bulk200: 148.80 } },
        features: [
            { zh: '10000+真实优质粉丝', en: '10000+ real premium followers' },
            { zh: '高权重账号', en: 'High authority account' },
            { zh: '支持所有电商功能', en: 'All commerce features supported' },
            { zh: '已实名认证', en: 'ID verified' },
        ],
        warranty: { zh: '7天质保', en: '7-day warranty' },
        deliveryTime: { zh: '12-24小时', en: '12-24 hours' },
        stockCount: 4,
        badge: { zh: '稀缺', en: 'Rare' },
        sortOrder: 4,
    },
    {
        id: 'douyin-bluev',
        category: 'douyin',
        tierName: { zh: '抖音企业蓝V号', en: 'Douyin Blue V Enterprise' },
        tierSlug: 'blue-v',
        description: { zh: '官方认证企业尊享带货蓝V号', en: 'Officially verified Enterprise Blue V for commerce' },
        price: { single: 128.80, bulk10: 124.80, bulk50: 118.80, bulk200: 108.80, originalPrice: { single: 148.80, bulk10: 144.80, bulk50: 138.80, bulk200: 128.80 } },
        features: [
            { zh: '10000+粉丝', en: '10000+ followers' },
            { zh: '高权重账号', en: 'High authority' },
            { zh: '全功能开通', en: 'All features open' },
            { zh: '带货权限', en: 'Commerce enabled' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '12-24小时', en: '12-24 hours' },
        stockCount: 18,
        badge: { zh: '限量', en: 'Limited' },
        sortOrder: 5,
    },
    {
        id: 'douyin-aged',
        category: 'douyin',
        tierName: { zh: '抖音老号 (1年+)', en: 'Douyin Aged (1+ Year)' },
        tierSlug: 'aged',
        description: { zh: '注册满一年以上的抖音号', en: '1+ year old Douyin account' },
        price: { single: 28.80, bulk10: 26.80, bulk50: 24.80, bulk200: 22.80, originalPrice: { single: 38.80, bulk10: 36.80, bulk50: 34.80, bulk200: 32.80 } },
        features: [
            { zh: '注册1年+', en: '1+ year old' },
            { zh: '账号权重高', en: 'High weight' },
            { zh: '不易被限流', en: 'Less throttling' },
            { zh: '实名可选', en: 'Verification optional' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '2-8小时', en: '2-8 hours' },
        stockCount: 17,
        sortOrder: 6,
    },
];

/* ---------- QQ Products ---------- */
const qqProducts: Product[] = [
    {
        id: 'qq-fresh',
        category: 'qq',
        tierName: { zh: 'QQ全新号', en: 'QQ Fresh Account' },
        tierSlug: 'fresh',
        description: { zh: '全新正常注册QQ号', en: 'Freshly registered standard QQ' },
        price: { single: 18.80, bulk10: 8.80, bulk50: 8.80, bulk200: 9.80, originalPrice: { single: 24.80, bulk10: 14.80, bulk50: 14.80, bulk200: 15.80 } },
        features: [
            { zh: '全新注册', en: 'Fresh account' },
            { zh: '手机号绑定', en: 'Phone bound' },
            { zh: '可加好友', en: 'Can add friends' },
            { zh: '可加群', en: 'Can join groups' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '5-15分钟', en: '5-15 minutes' },
        stockCount: 19,
        sortOrder: 1,
    },
    {
        id: 'qq-aged-pro',
        category: 'qq',
        tierName: { zh: 'QQ高级老号', en: 'QQ Aged Account' },
        tierSlug: 'aged',
        description: { zh: '高质量QQ老号，权重高', en: 'High-quality aged QQ account, high authority' },
        price: { single: 38.80, bulk10: 28.80, bulk50: 28.80, bulk200: 18.80, originalPrice: { single: 48.80, bulk10: 38.80, bulk50: 38.80, bulk200: 28.80 } },
        features: [
            { zh: '16级太阳', en: 'Sun level (16+)' },
            { zh: '高等级权限', en: 'High level perks' },
            { zh: '群管理权限', en: 'Group admin OK' },
            { zh: '不易被冻结', en: 'Less likely frozen' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 11,
        popular: true,
        badge: { zh: '热门', en: 'Popular' },
        sortOrder: 2,
    },
    {
        id: 'qq-super-vip',
        category: 'qq',
        tierName: { zh: 'QQ超级VIP版', en: 'QQ Super VIP Status' },
        tierSlug: 'vip',
        description: { zh: '自带超级会员的优质号码', en: 'Premium number with Super VIP included' },
        price: { single: 118.80, bulk10: 108.80, bulk50: 98.80, bulk200: 78.80, originalPrice: { single: 128.80, bulk10: 118.80, bulk50: 108.80, bulk200: 88.80 } },
        features: [
            { zh: 'QQ会员特权', en: 'VIP privileges' },
            { zh: '专属标识', en: 'VIP badge' },
            { zh: '更多功能', en: 'Extra features' },
            { zh: '高等级', en: 'High level' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '2-6小时', en: '2-6 hours' },
        stockCount: 15,
        sortOrder: 3,
    },
    {
        id: 'qq-premium',
        category: 'qq',
        tierName: { zh: 'QQ靓号', en: 'QQ Premium Number' },
        tierSlug: 'premium',
        description: { zh: '短位/顺子/豹子靓号', en: 'Short/sequential/repeating premium numbers' },
        price: { single: 18.80, bulk10: 18.80, bulk50: 8.80, bulk200: 8.80, originalPrice: { single: 24.80, bulk10: 24.80, bulk50: 14.80, bulk200: 14.80 } },
        features: [
            { zh: '靓号号码', en: 'Premium number' },
            { zh: '短位号/顺子号', en: 'Short/sequential' },
            { zh: '收藏价值', en: 'Collectible value' },
            { zh: '高等级可选', en: 'High level option' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '4-12小时', en: '4-12 hours' },
        stockCount: 13,
        badge: { zh: '精选', en: 'Premium' },
        sortOrder: 4,
    },
];

/* ---------- Xianyu Products ---------- */
const xianyuProducts: Product[] = [
    {
        id: 'xianyu-standard',
        category: 'xianyu',
        tierName: { zh: '闲鱼标准实名号', en: 'Xianyu Standard Verified' },
        tierSlug: 'standard',
        description: { zh: '标准闲鱼二手交易账号，安全可靠', en: 'Standard Xianyu account for second-hand trading' },
        price: { single: 48.80, bulk10: 45.80, bulk50: 45.80, bulk200: 42.80, originalPrice: { single: 55.80, bulk10: 52.80, bulk50: 52.80, bulk200: 49.80 } },
        features: [
            { zh: '已实名认证', en: 'ID Verified' },
            { zh: '支付宝关联', en: 'Alipay Linked' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 15,
        sortOrder: 1,
    },
    {
        id: 'xianyu-aged',
        category: 'xianyu',
        tierName: { zh: '闲鱼优质老号', en: 'Xianyu Premium Aged' },
        tierSlug: 'aged',
        description: { zh: '高信誉分闲鱼老号', en: 'High credit score aged Xianyu account' },
        price: { single: 68.80, bulk10: 65.80, bulk50: 65.80, bulk200: 62.80, originalPrice: { single: 75.80, bulk10: 72.80, bulk50: 72.80, bulk200: 69.80 } },
        features: [
            { zh: '高芝麻信用积分', en: 'High Zhima Credit' },
            { zh: '历史交易好评', en: 'Good trade history' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '2-6小时', en: '2-6 hours' },
        stockCount: 8,
        popular: true,
        sortOrder: 2,
    }
];

/* ---------- Taobao Products ---------- */
const taobaoProducts: Product[] = [
    {
        id: 'taobao-basic',
        category: 'taobao',
        tierName: { zh: '淘宝基础买家号', en: 'Taobao Basic Buyer' },
        tierSlug: 'basic',
        description: { zh: '淘宝购物基础白号', en: 'Fresh Taobao shopping account' },
        price: { single: 15.80, bulk10: 12.80, bulk50: 12.80, bulk200: 10.80, originalPrice: { single: 25.80, bulk10: 22.80, bulk50: 22.80, bulk200: 18.80 } },
        stockCount: 25,
        sortOrder: 1,
    },
    {
        id: 'taobao-vip',
        category: 'taobao',
        tierName: { zh: '淘宝VIP老号', en: 'Taobao VIP Aged Account' },
        tierSlug: 'vip-aged',
        description: { zh: '高等级淘气值老号', en: 'High Taoqi score aged account' },
        price: { single: 48.80, bulk10: 42.80, bulk50: 42.80, bulk200: 38.80, originalPrice: { single: 58.80, bulk10: 52.80, bulk50: 52.80, bulk200: 48.80 } },
        features: [
            { zh: '高淘气值', en: 'High Taoqi value' },
            { zh: '抗扫号风控', en: 'Strict Anti-ban' },
        ],
        warranty: { zh: '72小时质保', en: '72-hour warranty' },
        deliveryTime: { zh: '1-4小时', en: '1-4 hours' },
        stockCount: 12,
        popular: true,
        sortOrder: 2,
    }
];

/* ---------- Xiaohongshu Products ---------- */
const xiaohongshuProducts: Product[] = [
    {
        id: 'xiaohongshu-basic',
        category: 'xiaohongshu',
        tierName: { zh: '小红书基础号', en: 'Xiaohongshu Basic' },
        tierSlug: 'basic',
        description: { zh: '高质量新注册账号', en: 'High-quality freshly registered account' },
        price: { single: 18.80, bulk10: 15.80, bulk50: 12.80, bulk200: 10.80, originalPrice: { single: 25.80, bulk10: 22.80, bulk50: 18.80, bulk200: 15.80 } },
        features: [
            { zh: '手机号注册', en: 'Phone registered' },
            { zh: '可正常点赞评论', en: 'Can like & comment' },
        ],
        warranty: { zh: '24小时质保', en: '24-hour warranty' },
        deliveryTime: { zh: '15-30分钟', en: '15-30 mins' },
        stockCount: 30,
        sortOrder: 1,
    },
    {
        id: 'xiaohongshu-1k',
        category: 'xiaohongshu',
        tierName: { zh: '小红书千粉号', en: 'Xiaohongshu 1K+ Followers' },
        tierSlug: '1k-followers',
        description: { zh: '1000+真实粉丝种草号', en: '1000+ real followers account' },
        price: { single: 68.80, bulk10: 62.80, bulk50: 58.80, bulk200: 52.80, originalPrice: { single: 78.80, bulk10: 72.80, bulk50: 68.80, bulk200: 62.80 } },
        features: [
            { zh: '高权重种草', en: 'High marketing auth' },
            { zh: '直播功能', en: 'Live feature enabled' },
        ],
        warranty: { zh: '48小时质保', en: '48-hour warranty' },
        deliveryTime: { zh: '4-8小时', en: '4-8 hours' },
        stockCount: 6,
        badge: { zh: '稀缺', en: 'Rare' },
        sortOrder: 2,
    }
];

/* ---------- Bundle Products ---------- */
const bundleProducts: Product[] = [
    {
        id: 'bundle-alipay-xianyu-001',
        category: 'bundle',
        tierName: { zh: '支付宝+闲鱼 组合账号', en: 'Alipay + Xianyu Combo Account' },
        tierSlug: 'alipay-xianyu-bundle',
        description: { zh: '一站解决闲鱼登录难题，支付宝实名认证+闲鱼账号绑定发货', en: 'One-stop solution for Xianyu login. Verified Alipay + linked Xianyu account.' },
        price: { single: 280.00, bulk10: 240.00, bulk50: 240.00, bulk200: 240.00, originalPrice: { single: 350.00, bulk10: 300.00, bulk50: 300.00, bulk200: 300.00 } },
        features: [
            { zh: '包含实名支付宝', en: 'Includes verified Alipay' },
            { zh: '包含关联闲鱼号', en: 'Includes linked Xianyu' },
            { zh: '无需中国手机号', en: 'No China phone needed' },
            { zh: '24小时质保', en: '24h Warranty' },
        ],
        warranty: { zh: '7天登录质保', en: '7-day login warranty' },
        deliveryTime: { zh: '5-15 分钟', en: '5-15 mins' },
        stockCount: 47,
        popular: true,
        badge: { zh: '入门推荐', en: 'Starter Pick' },
        sortOrder: 1,
        bundleContents: [
            {
                item: 'alipay',
                name: '支付宝实名账号',
                description: '已实名认证，可正常收付款，支持闲鱼/淘宝一键登录',
                verificationLevel: 'real-name-verified',
                includes: ['实名信息', '已绑银行卡', '已开启花呗(可选)', '安全邮箱']
            },
            {
                item: 'xianyu',
                name: '闲鱼卖家账号',
                description: '已与支付宝绑定，可直接发布商品，信用分良好',
                linkStatus: 'pre-linked-to-alipay',
                includes: ['已绑定支付宝', '芝麻信用授权', '可立即发布', '无违规记录']
            }
        ],
        whyBundle: {
            zh: '闲鱼必须使用中国大陆手机号注册，且必须绑定实名支付宝。单独购买账号后自行绑定成功率低、易封号。本组合已预先绑定完成，到手即用。',
            en: 'Xianyu requires a China mainland number AND real-name Alipay. Self-linking after purchase has high failure/flag risk. This bundle is pre-linked and ready to use.'
        },
        useCases: [
            '海外卖家在闲鱼出售二手商品或代购',
            '跨境电商测试闲鱼流量',
            '需要支付宝收款但无法实名认证的外国人',
            '批量运营多个闲鱼店铺'
        ],
        loginMethod: {
            primary: 'Alipay QR scan or password login',
            secondary: 'Xianyu auto-login via Alipay authorization',
            note: 'No China phone number needed after initial setup'
        },
        requirements: {
            buyerNeeds: 'No China ID or phone number required. Works with overseas IP using our guide.',
            technical: 'Smartphone with Alipay app (iOS/Android), Xianyu app'
        },
        risks: {
            zh: '首次登录建议在常用设备稳定使用3-5天，不要立即修改绑定信息或大额交易。',
            en: 'First login: use on same device for 3-5 days. Do NOT change binding info or make large transactions immediately.'
        }
    },
    {
        id: 'bundle-alipay-taobao-001',
        category: 'bundle',
        tierName: { zh: '支付宝+淘宝 购物套装', en: 'Alipay + Taobao Shopping Bundle' },
        tierSlug: 'alipay-taobao-bundle',
        description: { zh: '支付宝实名认证+淘宝买家号，支持历史订单查询与地址设置', en: 'Verified Alipay + Taobao buyer account with purchase history and address setup guide.' },
        price: { single: 320.00, bulk10: 250.00, bulk50: 250.00, bulk200: 250.00, originalPrice: { single: 450.00, bulk10: 380.00, bulk50: 380.00, bulk200: 380.00 } },
        features: [
            { zh: '支付宝实名认证', en: 'Verified Alipay' },
            { zh: '淘宝优质买家号', en: 'Premium Taobao Buyer' },
            { zh: '包含地址设置指南', en: 'Address setup guide' },
            { zh: '支持支付绑定', en: 'Payment binding ready' },
        ],
        warranty: { zh: '3天登录质保', en: '3-day login warranty' },
        deliveryTime: { zh: '15-30 分钟', en: '15-30 mins' },
        stockCount: 32,
        sortOrder: 2,
    },
    {
        id: 'bundle-alipay-1688-001',
        category: 'bundle',
        tierName: { zh: '支付宝企业+1688 批发套装', en: 'Alipay Business + 1688 Wholesale Bundle' },
        tierSlug: 'alipay-1688-bundle',
        description: { zh: '企业支付宝+1688卖家/买家号，适合一件代发与大宗采购', en: 'Enterprise Alipay + 1688 seller/buyer account for dropshippers and wholesalers.' },
        price: { single: 880.00, bulk10: 780.00, bulk50: 780.00, bulk200: 780.00, originalPrice: { single: 1200.00, bulk10: 1000.00, bulk50: 1000.00, bulk200: 1000.00 } },
        features: [
            { zh: '企业支付宝认证', en: 'Business Alipay' },
            { zh: '1688 高权重账号', en: '1688 High Authority' },
            { zh: '适合跨境电商', en: 'Perfect for Cross-border' },
            { zh: '包含供应商沟通技巧', en: 'Supplier tips included' },
        ],
        warranty: { zh: '15天售后支持', en: '15-day support' },
        deliveryTime: { zh: '2-6 小时', en: '2-6 hours' },
        stockCount: 15,
        badge: { zh: '专业版', en: 'Pro Choice' },
        sortOrder: 3,
    },
    {
        id: 'bundle-wechat-jd-001',
        category: 'bundle',
        tierName: { zh: '微信+京东 购物套装', en: 'WeChat + JD.com Bundle' },
        tierSlug: 'wechat-jd-bundle',
        description: { zh: '已实名微信+京东买家号，支付已关联', en: 'Verified WeChat + JD buyer account with payment pre-linked.' },
        price: { single: 350.00, bulk10: 310.00, bulk50: 310.00, bulk200: 310.00, originalPrice: { single: 480.00, bulk10: 420.00, bulk50: 420.00, bulk200: 420.00 } },
        features: [
            { zh: '微信已绑卡实名', en: 'Verified WeChat' },
            { zh: '京东账号历史活跃', en: 'Active JD history' },
            { zh: '极速发货', en: 'Fast Delivery' },
        ],
        warranty: { zh: '72小时质保', en: '72h warranty' },
        deliveryTime: { zh: '1-3 小时', en: '1-3 hours' },
        stockCount: 22,
        sortOrder: 4,
    },
    {
        id: 'bundle-full-suite',
        category: 'bundle',
        tierName: { zh: '全平台电商套装', en: 'Full E-Commerce Suite' },
        tierSlug: 'full-ecommerce-suite',
        description: { zh: '支付宝+微信+闲鱼+淘宝+1688 全套账号', en: 'Full suite including Alipay, WeChat, Xianyu, Taobao, and 1688.' },
        price: { single: 2880.00, bulk10: 2600.00, bulk50: 2600.00, bulk200: 2600.00, originalPrice: { single: 3500.00, bulk10: 3200.00, bulk50: 3200.00, bulk200: 3200.00 } },
        features: [
            { zh: '全套实名资料', en: 'Full Identity Set' },
            { zh: '多平台互通', en: 'Inter-platform login' },
            { zh: 'VIP 专属客服', en: 'VIP Dedicated Support' },
            { zh: '终身维护指导', en: 'Lifetime Guidance' },
        ],
        warranty: { zh: '30天超长保障', en: '30-day extended' },
        deliveryTime: { zh: '12-24 小时', en: '12-24 hours' },
        stockCount: 5,
        popular: true,
        badge: { zh: '大咖首选', en: 'Executive' },
        sortOrder: 5,
    },
];

/* ---------- Verification Products ---------- */
const verificationProducts: Product[] = [
    {
        id: 'verify-alipay-passport',
        category: 'verification',
        tierName: { zh: '支付宝护照实名认证', en: 'Alipay Passport Verification' },
        tierSlug: 'alipay-verification',
        description: { zh: '使用您的海外护照协助开通支付宝实名权限', en: 'Assist in verifying your Alipay account using your overseas passport (Tour Pass or full).' },
        price: { single: 150.00, bulk10: 150.00, bulk50: 150.00, bulk200: 150.00 },
        features: [
            { zh: '支持全球护照', en: 'Global passport support' },
            { zh: '代办 1-2 小时完成', en: '1-2 hour turnaround' },
            { zh: '100% 成功率保障', en: '100% Success rate' },
        ],
        warranty: { zh: '认证失效包重做', en: 'Re-do if failed' },
        deliveryTime: { zh: '1-2 小时', en: '1-2 hours' },
        stockCount: 99,
        sortOrder: 1,
    },
    {
        id: 'verify-wechat-passport',
        category: 'verification',
        tierName: { zh: '微信护照实名认证', en: 'WeChat Passport Verification' },
        tierSlug: 'wechat-verification',
        description: { zh: '绑定外国护照到微信，开通支付及红包功能', en: 'Bind foreign passport to WeChat to enable payment and Red Packet features.' },
        price: { single: 180.00, bulk10: 180.00, bulk50: 180.00, bulk200: 180.00 },
        features: [
            { zh: '开通微信支付', en: 'Enable WeChat Pay' },
            { zh: '收发红包权限', en: 'Red Packet enabled' },
            { zh: '专业流程指导', en: 'Professional Guidance' },
        ],
        warranty: { zh: '认证失效包重做', en: 'Re-do if failed' },
        deliveryTime: { zh: '1-2 小时', en: '1-2 hours' },
        stockCount: 99,
        sortOrder: 2,
    },
    {
        id: 'verify-kyc-package',
        category: 'verification',
        tierName: { zh: 'KYC 资料包', en: 'KYC Document Package' },
        tierSlug: 'kyc-package',
        description: { zh: '提供匹配的 POI+POA+手持拍照资料集', en: 'Matched POI + POA + Selfie set for trading platform verification.' },
        price: { single: 200.00, bulk10: 180.00, bulk50: 180.00, bulk200: 180.00 },
        features: [
            { zh: '高清手持自拍', en: 'HD Selfie with ID' },
            { zh: '匹配地址证明', en: 'Matching Address Proof' },
            { zh: '支持各大交易平台', en: 'All major platforms' },
        ],
        warranty: { zh: '资料失效包换', en: 'Replacement warranty' },
        deliveryTime: { zh: '1-4 小时', en: '1-4 hours' },
        stockCount: 50,
        sortOrder: 3,
    },
    {
        id: 'verify-face-assist',
        category: 'verification',
        tierName: { zh: '人脸核验辅助', en: 'Face Verification Assistance' },
        tierSlug: 'face-assist',
        description: { zh: '远程协助平台人脸验证 (支付宝/微信/银行App)', en: 'Remote assistance for platform face verification.' },
        price: { single: 120.00, bulk10: 120.00, bulk50: 120.00, bulk200: 120.00 },
        features: [
            { zh: '实时远程连线', en: 'Live remote connection' },
            { zh: '支持主流 App', en: 'Mainstream Apps support' },
            { zh: '隐私安全保护', en: 'Privacy Protected' },
        ],
        warranty: { zh: '单次服务保障', en: 'Per session warranty' },
        deliveryTime: { zh: '预约时间', en: 'Scheduled time' },
        stockCount: 99,
        sortOrder: 4,
    },
];

/* ---------- FinTech Products ---------- */
const fintechProducts: Product[] = [
    {
        id: 'fintech-xm',
        category: 'fintech',
        tierName: { zh: 'XM 认证交易账户', en: 'XM Verified Trading Account' },
        tierSlug: 'xm-account',
        description: { zh: '已完成 KYC 认证的 XM 交易账户，即刻开市', en: 'Pre-verified XM account (Micro/Standard/Ultra Low), ready to trade.' },
        price: { single: 80.00, bulk10: 70.00, bulk50: 70.00, bulk200: 70.00 },
        features: [
            { zh: '全实名认证', en: 'Full KYC verified' },
            { zh: '包含验证邮箱', en: 'Verified email included' },
            { zh: '支持快速出入金', en: 'Fast deposit/withdrawal' },
        ],
        warranty: { zh: '7天稳定质保', en: '7-day stability' },
        deliveryTime: { zh: '2-4 小时', en: '2-4 hours' },
        stockCount: 12,
        sortOrder: 1,
    },
    {
        id: 'fintech-hfm',
        category: 'fintech',
        tierName: { zh: 'HFM 认证交易账户', en: 'HFM Verified Trading Account' },
        tierSlug: 'hfm-account',
        description: { zh: '已完成实名认证的 HFM (HotForex) 账户', en: 'Pre-verified HFM (HotForex) account, fully functional.' },
        price: { single: 90.00, bulk10: 80.00, bulk50: 80.00, bulk200: 80.00 },
        features: [
            { zh: '顶级监管平台', en: 'Top-tier regulated' },
            { zh: '资料完整匹配', en: 'Full document match' },
            { zh: '即拿即用', en: 'Ready to use' },
        ],
        warranty: { zh: '7天稳定质保', en: '7-day stability' },
        deliveryTime: { zh: '2-4 小时', en: '2-4 hours' },
        stockCount: 10,
        sortOrder: 2,
    },
    {
        id: 'fintech-neteller',
        category: 'fintech',
        tierName: { zh: 'Neteller 认证账户', en: 'Neteller Verified Account' },
        tierSlug: 'neteller-account',
        description: { zh: '全认证 Neteller 电子钱包，支持大额转账', en: 'Fully verified Neteller e-wallet, ready for deposits/transfers.' },
        price: { single: 90.00, bulk10: 80.00, bulk50: 80.00, bulk200: 80.00 },
        features: [
            { zh: '银级/金级权重', en: 'Silver/Gold tier weight' },
            { zh: '无转账额度限制', en: 'No transfer limits' },
            { zh: '全球通用', en: 'Global usage' },
        ],
        warranty: { zh: '30天售后保障', en: '30-day warranty' },
        deliveryTime: { zh: '4-12 小时', en: '4-12 hours' },
        stockCount: 8,
        popular: true,
        sortOrder: 3,
    },
    {
        id: 'fintech-payoneer',
        category: 'fintech',
        tierName: { zh: 'Payoneer 认证账户', en: 'Payoneer Verified Account' },
        tierSlug: 'payoneer-account',
        description: { zh: '自带美/欧/英收款账户的 Payoneer 认证号', en: 'Verified Payoneer with US/EU/UK receiving accounts.' },
        price: { single: 120.00, bulk10: 110.00, bulk50: 110.00, bulk200: 110.00 },
        features: [
            { zh: '包含多币种收款账号', en: 'Multi-currency accounts' },
            { zh: '支持提现到本地', en: 'Local withdrawal enabled' },
            { zh: '独立资料注册', en: 'Unique ID registered' },
        ],
        warranty: { zh: '15天稳定质保', en: '15-day stability' },
        deliveryTime: { zh: '12-24 小时', en: '12-24 hours' },
        stockCount: 6,
        badge: { zh: '大额首选', en: 'High Limit' },
        sortOrder: 5,
    },
];

/* ---------- All Products ---------- */
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
    ...fintechProducts,
];

/* ---------- Helpers ---------- */
export function getProductsByCategory(category: CategoryId): Product[] {
    return allProducts
        .filter((p) => p.category === category)
        .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProductById(id: string): Product | undefined {
    return allProducts.find((p) => p.id === id);
}

export function getCategoryById(id: CategoryId): Category | undefined {
    return categories.find((c) => c.id === id);
}

export function getLowestPrice(category: CategoryId): number {
    const products = getProductsByCategory(category);
    if (products.length === 0) return 0;
    return Math.min(...products.map((p) => p.price.single));
}

export function getTotalStock(category: CategoryId): number {
    return getProductsByCategory(category).reduce((sum, p) => sum + p.stockCount, 0);
}

export function getStockStatus(count: number): 'high' | 'medium' | 'low' | 'out' {
    if (count === 0) return 'out';
    if (count <= 2) return 'low';
    if (count <= 10) return 'medium';
    return 'high';
}
