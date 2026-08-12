import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getTenantConfig } from '@/lib/tenant-config';
import { getAllSlugs } from '@/lib/blog';
import { categories as staticCategories, allProducts as staticProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';
import { mapDbProductToProduct } from '@/lib/supabase-products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const headersList = headers();
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || null;
    const config = getTenantConfig(host);
    const SITE_URL = `https://${config.domain}`.toLowerCase();

    const now = new Date().toISOString();

    // Alternate language links helper
    const getAlternates = (path: string) => ({
        languages: {
            'zh-CN': `${SITE_URL}${path}`,
            'en': `${SITE_URL}/en${path}`,
        },
    });

    // 1. Static Routes (Exclude checkout/track to protect crawl budget)
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0, alternates: getAlternates('/') },
        { url: `${SITE_URL}/en/`, lastModified: now, changeFrequency: 'daily', priority: 1.0, alternates: getAlternates('/') },

        { url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.8, alternates: getAlternates('/blog/') },
        { url: `${SITE_URL}/en/blog/`, lastModified: now, changeFrequency: 'daily', priority: 0.8, alternates: getAlternates('/blog/') },

        { url: `${SITE_URL}/how-to-buy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, alternates: getAlternates('/how-to-buy/') },
        { url: `${SITE_URL}/en/how-to-buy/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8, alternates: getAlternates('/how-to-buy/') },

        { url: `${SITE_URL}/pricing/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8, alternates: getAlternates('/pricing/') },
        { url: `${SITE_URL}/en/pricing/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8, alternates: getAlternates('/pricing/') },

        { url: `${SITE_URL}/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates: getAlternates('/faq/') },
        { url: `${SITE_URL}/en/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6, alternates: getAlternates('/faq/') },

        { url: `${SITE_URL}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: getAlternates('/contact/') },
        { url: `${SITE_URL}/en/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5, alternates: getAlternates('/contact/') },

        { url: `${SITE_URL}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, alternates: getAlternates('/privacy/') },
        { url: `${SITE_URL}/en/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, alternates: getAlternates('/privacy/') },

        { url: `${SITE_URL}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, alternates: getAlternates('/terms/') },
        { url: `${SITE_URL}/en/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, alternates: getAlternates('/terms/') },

        { url: `${SITE_URL}/refund-policy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, alternates: getAlternates('/refund-policy/') },
        { url: `${SITE_URL}/en/refund-policy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3, alternates: getAlternates('/refund-policy/') },
    ];

    // 2. Fetch active products from Supabase filtered by tenant_id
    let productsList = staticProducts.filter(p => p.isPublished !== false);
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .eq('is_published', true)
                .or(`tenant_id.eq.${config.id},tenant_id.is.null`);
            if (!error && data && data.length > 0) {
                productsList = data.map(mapDbProductToProduct);
            }
        } catch (err) {
            console.warn('[sitemap] Supabase fetch error, fallback to static products:', err);
        }
    }

    // 3. Category Routes
    const categoryRoutes: MetadataRoute.Sitemap = staticCategories.flatMap(cat => [
        { url: `${SITE_URL}/${cat.id}/`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9, alternates: getAlternates(`/${cat.id}/`) },
        { url: `${SITE_URL}/en/${cat.id}/`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.9, alternates: getAlternates(`/${cat.id}/`) },
    ]);

    // 4. Dynamic Blog Posts
    const blogSlugs = await getAllSlugs();
    const blogRoutes: MetadataRoute.Sitemap = blogSlugs.flatMap(slug => [
        { url: `${SITE_URL}/blog/${slug}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7, alternates: getAlternates(`/blog/${slug}/`) },
        { url: `${SITE_URL}/en/blog/${slug}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7, alternates: getAlternates(`/blog/${slug}/`) },
    ]);

    // 5. Product Routes
    const productRoutes: MetadataRoute.Sitemap = productsList.flatMap(product => [
        { url: `${SITE_URL}/product/${product.id}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7, alternates: getAlternates(`/product/${product.id}/`) },
        { url: `${SITE_URL}/en/product/${product.id}/`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7, alternates: getAlternates(`/product/${product.id}/`) },
    ]);

    return [
        ...staticRoutes,
        ...categoryRoutes,
        ...blogRoutes,
        ...productRoutes,
    ];
}

