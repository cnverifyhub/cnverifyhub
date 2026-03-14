import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString();

    return [
        // Homepage
        {
            url: `${SITE_URL}/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/en/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },

        // Category Pages
        {
            url: `${SITE_URL}/wechat/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/en/wechat/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/alipay/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/en/alipay/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/douyin/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/en/douyin/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/qq/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/en/qq/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.9,
        },

        // Pricing
        {
            url: `${SITE_URL}/pricing/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },

        // FAQ
        {
            url: `${SITE_URL}/faq/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },

        // Order Tracking
        {
            url: `${SITE_URL}/track/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },

        // Contact
        {
            url: `${SITE_URL}/contact/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },

        // Terms
        {
            url: `${SITE_URL}/terms/`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
