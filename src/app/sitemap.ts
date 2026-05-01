import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

const blogSlugs = [
    'wechat-security-guide',
    'alipay-verification-tutorial',
    'douyin-marketing-2026',
    'account-care-guide',
    'qq-account-guide',
    'xiaohongshu-marketing-guide',
    'xianyu-taobao-purchasing-guide',
    'usdt-anonymous-digital-identity',
    'high-quality-aged-accounts-anti-ban-guide',
    'verified-alipay-cross-border-ecommerce',
    'how-to-buy-wechat-account',
    'how-to-buy-alipay-account',
    'chinese-accounts-international-business',
    'buy-chinese-accounts-usdt-crypto',
    'xianyu-account-guide-foreigners',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString();

    const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) => [
        { url: `${SITE_URL}/blog/${slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
        { url: `${SITE_URL}/en/blog/${slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    ]);

    return [
        // Homepage
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${SITE_URL}/en/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },

        // Blog Index
        { url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/en/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },

        // Category Pages
        { url: `${SITE_URL}/wechat/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/en/wechat/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/alipay/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/en/alipay/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/douyin/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/en/douyin/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/qq/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/en/qq/`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },

        // Other Pages
        { url: `${SITE_URL}/pricing/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/faq/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/track/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/terms/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

        // All blog posts (ZH + EN)
        ...blogEntries,
    ];
}
