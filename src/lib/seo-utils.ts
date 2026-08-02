import { getTenantConfig } from './tenant-config';

export interface SeoAlternates {
    canonical: string;
    languages: {
        'zh-CN': string;
        'en': string;
        'x-default': string;
    };
}

/**
 * Generates canonical URL and hreflang alternate dictionary for SEO compliance.
 * Normalizes hostnames and pathnames to lowercase to prevent duplicate content penalties on Baidu & Google.
 */
export function getSeoAlternates(host?: string | null, pathname: string = ''): SeoAlternates {
    const config = getTenantConfig(host);
    const domain = config.domain.toLowerCase();

    // Clean and normalize pathname: ensure lowercase
    let cleanPath = (pathname || '').toLowerCase().trim();
    if (!cleanPath.startsWith('/')) {
        cleanPath = '/' + cleanPath;
    }

    // Strip leading /en prefix if provided to determine base route
    let basePath = cleanPath;
    if (basePath.startsWith('/en/')) {
        basePath = basePath.slice(3);
    } else if (basePath === '/en') {
        basePath = '/';
    }

    // Standardize trailing slash for subpaths (except root '/')
    if (basePath !== '/' && !basePath.endsWith('/')) {
        basePath = basePath + '/';
    }

    const baseUrl = `https://${domain}`;
    const canonical = `${baseUrl}${basePath === '/' ? '' : basePath}`;
    const enUrl = `${baseUrl}/en${basePath === '/' ? '' : basePath}`;
    const zhUrl = canonical;

    return {
        canonical,
        languages: {
            'zh-CN': zhUrl,
            'en': enUrl,
            'x-default': canonical,
        },
    };
}
