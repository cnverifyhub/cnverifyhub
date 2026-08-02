import { NextResponse } from 'next/server';
import { getTenantConfig } from '@/lib/tenant-config';
import { getAllPosts } from '@/lib/blog';
import { allProducts } from '@/data/products';
import { submitBaiduUrls, submitIndexNow } from '@/lib/indexing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
        const config = getTenantConfig(host);
        const baseUrl = `https://${config.domain}`;

        // Gather site URLs
        const urlSet = new Set<string>();

        // Core routes
        urlSet.add(`${baseUrl}/`);
        urlSet.add(`${baseUrl}/en/`);
        urlSet.add(`${baseUrl}/blog/`);
        urlSet.add(`${baseUrl}/en/blog/`);

        // Category routes
        const categories = ['wechat', 'alipay', 'douyin', 'qq', 'xianyu', 'taobao', 'xiaohongshu', 'bundle', 'verification', 'fintech', 'trading'];
        categories.forEach(cat => {
            urlSet.add(`${baseUrl}/${cat}/`);
            urlSet.add(`${baseUrl}/en/${cat}/`);
        });

        // Product URLs
        allProducts.forEach(product => {
            if (product.id) {
                urlSet.add(`${baseUrl}/product/${product.id}/`);
            }
        });

        // Blog post URLs
        try {
            const blogPosts = await getAllPosts('zh');
            blogPosts.forEach(post => {
                if (post.slug) {
                    urlSet.add(`${baseUrl}/blog/${post.slug}/`);
                }
            });
        } catch (e) {
            console.error('Error fetching blog posts for cron push:', e);
        }

        const urls = Array.from(urlSet);

        // Submit to Baidu and IndexNow
        const [baiduResult, indexNowResult] = await Promise.all([
            submitBaiduUrls(urls, host),
            submitIndexNow(urls, host),
        ]);

        return NextResponse.json({
            success: true,
            domain: config.domain,
            totalUrls: urls.length,
            baidu: baiduResult,
            indexNow: indexNowResult,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}
