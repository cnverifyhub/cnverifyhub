import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/blog/', '/en/blog/', '/en/'],
                disallow: ['/admin/', '/api/', '/gate/', '/auth/'],
            },
            {
                userAgent: 'Baiduspider',
                allow: ['/', '/blog/', '/en/blog/'],
                disallow: ['/admin/', '/api/', '/auth/'],
            },
            {
                userAgent: 'Googlebot',
                allow: ['/', '/blog/', '/en/blog/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
