import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';
import { categories, allProducts } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date().toISOString();

    // Alternate language links helper
    const getAlternates = (path: string) => ({
        languages: {
            'zh-CN': `${SITE_URL}${path}`,
            'en': `${SITE_URL}/en${path}`,
        },
    });

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0, alternates: getAlternates('/') },
        { url: `${SITE_URL}/en/`, lastModified: now, changeFrequency: 'daily', priority: 1.0, alternates: getAlternates('/') },

        { url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.8, alternates: getAlternates('/blog/') },
        { url: `${SITE_URL}/en/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.8, alternates: getAlternates('/blog/') },

        { url: `${SITE_URL}/checkout/`, lastModified: now, changeFrequency: 'never', priority: 0.6, alternates: getAlternates('/checkout/') },
        { url: `${SITE_URL}/en/checkout/`, lastModified: now, changeFrequency: 'never', priority: 0.6, alternates: getAlternates('/checkout/') },

        { url: `${SITE_URL}/track/`, lastModified: now, changeFrequency: 'weekly', priority: 0.5, alternates: getAlternates('/track/') },
        { url: `${SITE_URL}/en/track/`, lastModified: now, changeFrequency: 'weekly', priority: 0.5, alternates: getAlternates('/track/') },

        { url: `${SITE_URL}/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates: getAlternates('/faq/') },
        { url: `${SITE_URL}/en/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates: getAlternates('/faq/') },

        { url: `${SITE_URL}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: getAlternates('/contact/') },
        { url: `${SITE_URL}/en/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: getAlternates('/contact/') },
    ];

    // 2. Category Routes
    const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap(cat => [
        { url: `${SITE_URL}/${cat.id}/`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9, alternates: getAlternates(`/${cat.id}/`) },
        { url: `${SITE_URL}/en/${cat.id}/`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9, alternates: getAlternates(`/${cat.id}/`) },
    ]);

    // 3. Product Routes
    const productRoutes: MetadataRoute.Sitemap = allProducts.flatMap(prod => [
        { url: `${SITE_URL}/product/${prod.id}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8, alternates: getAlternates(`/product/${prod.id}/`) },
        { url: `${SITE_URL}/en/product/${prod.id}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8, alternates: getAlternates(`/product/${prod.id}/`) },
    ]);

    // 4. Dynamic Blog Posts
    const blogSlugs = getAllSlugs();
    const blogRoutes: MetadataRoute.Sitemap = blogSlugs.flatMap(slug => [
        { url: `${SITE_URL}/blog/${slug}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7, alternates: getAlternates(`/blog/${slug}/`) },
        { url: `${SITE_URL}/en/blog/${slug}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7, alternates: getAlternates(`/blog/${slug}/`) },
    ]);

    return [
        ...staticRoutes,
        ...categoryRoutes,
        ...productRoutes,
        ...blogRoutes,
    ];
}
