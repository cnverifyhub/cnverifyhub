import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getTenantConfig } from '@/lib/tenant-config';

export default function robots(): MetadataRoute.Robots {
    const headersList = headers();
    const host = headersList.get('host') || headersList.get('x-forwarded-host') || null;
    const config = getTenantConfig(host);

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/_next/'],
            },
            {
                userAgent: ['GPTBot', 'Claude-Web', 'Google-Extended', 'CCBot', 'PerplexityBot'],
                allow: ['/', '/api/agent/premium'],
                disallow: ['/admin/'],
            }
        ],
        sitemap: `https://${config.domain}/sitemap.xml`,
    };
}

