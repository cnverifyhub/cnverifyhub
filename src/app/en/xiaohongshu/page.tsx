import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { calculateYuan } from '@/lib/utils';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Buy Xiaohongshu Account - Verified, Aged, 1K+ Followers | RED Accounts',
    description: 'Professional Xiaohongshu account marketplace. Buy high-authority marketing accounts, ID-verified aged accounts, and 1K+/10K+ follower RED accounts. Instant USDT delivery.',
    keywords: 'buy xiaohongshu account, buy red account, verified xiaohongshu, aged xiaohongshu, chinese social media marketing, xiaohongshu usdt payment',
    alternates: {
        canonical: `${SITE_URL}/en/xiaohongshu/`,
        languages: { 'en': `${SITE_URL}/en/xiaohongshu/`, 'zh-CN': `${SITE_URL}/xiaohongshu/` },
    },
    openGraph: {
        title: 'Buy Xiaohongshu Account - Verified & Aged | CNWePro',
        description: 'RED/Xiaohongshu accounts from $18. High-follower marketing accounts available. Instant delivery.',
        url: `${SITE_URL}/en/xiaohongshu/`,
    },
};

function getXiaohongshuJsonLd() {
    const products = getProductsByCategory('xiaohongshu');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy Xiaohongshu Accounts',
        description: 'High-authority Xiaohongshu accounts for social media marketing.',
        url: `${SITE_URL}/en/xiaohongshu/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features?.map(f => f.en).join(', ') || p.description.en,
                url: `${SITE_URL}/en/xiaohongshu/`,
                brand: { '@type': 'Brand', name: 'CNWePro' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'CNY',
                    price: calculateYuan(p.price.single),
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNWePro' },
                },
            },
        })),
    };
}

export default function XiaohongshuPageEn() {
    const jsonLd = getXiaohongshuJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="xiaohongshu" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Xiaohongshu Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Xiaohongshu (RED) is China's leading lifestyle and social commerce platform. 
                        CNWePro provides premium Xiaohongshu accounts ranging from fresh basic profiles to high-authorityaged accounts with 1K+ or 10K+ followers. 
                        Every account is simulation-warmed for high trust and ban resistance. 
                        We support <strong>USDT</strong> payments and offer <strong>instant automated delivery</strong>.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Marketing Advantage
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>High Authority:</strong> Aged accounts provide a higher chance of your posts hitting the explore feed (Landing page).</li>
                        <li><strong>Verified Options:</strong> Real-name ID-verified accounts available for advanced features.</li>
                        <li><strong>Instant Growth:</strong> High-follower accounts help brands establish credibility instantly.</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="xiaohongshu" lang="en" />
        </>
    );
}
