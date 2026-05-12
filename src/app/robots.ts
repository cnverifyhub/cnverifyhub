import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
        sitemap: 'https://cnverifyhub.com/sitemap.xml',
    };
}
