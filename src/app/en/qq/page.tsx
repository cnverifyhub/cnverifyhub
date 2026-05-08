import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: 'Buy QQ Account - VIP, Sun Level, High Grade | QQ Number for Sale',
    description: 'Buy aged QQ accounts instantly. High-grade Sun/Moon levels, VIP accounts, and premium vanity QQ numbers available. Anti-ban guarantee with USDT payment.',
    keywords: 'buy qq account, qq number for sale, qq vip account, sun level qq, aged qq account',
    alternates: {
        canonical: `${SITE_URL}/en/qq/`,
        languages: { 'en': `${SITE_URL}/en/qq/`, 'zh-CN': `${SITE_URL}/qq/` },
    },
    openGraph: {
        title: 'Buy Premium QQ Accounts | CNVerifyHub',
        description: 'Aged QQ numbers with high levels (Sun/Moon). Instant crypto delivery.',
        url: `${SITE_URL}/en/qq/`,
    },
};

function getQQJsonLd() {
    const products = getProductsByCategory('qq');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy QQ Accounts',
        description: 'Aged, high-level, and premium vanity QQ accounts.',
        url: `${SITE_URL}/en/qq/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features?.map(f => f.en).join(', ') || '',
                url: `${SITE_URL}/en/qq/`,
                brand: { '@type': 'Brand', name: 'CNVerifyHub' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: p.price.single,
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNVerifyHub' },
                },
            },
        })),
    };
}

export default function QQPageEn() {
    const jsonLd = getQQJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="qq" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        QQ Account Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        QQ is Tencent's classic instant messaging platform with hundreds of millions of active
                        users in China, deeply integrated into gaming and youth culture. CNVerifyHub offers bulk 
                        and premium aged QQ accounts at various grading levels — from basic numbers to Sun-level (16+) 
                        and premium vanity sequences. All accounts are anti-ban guaranteed. Pay with <strong>USDT</strong> and 
                        get automated instant delivery within 5 minutes.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        QQ Account Grading System
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Basic QQ:</strong> Standard fresh or slightly aged numbers. Best for mass operations, group building, and basic marketing tasks where volume is key.</li>
                        <li><strong>Sun Level (16+):</strong> Highly sought-after accounts that have reached the "Sun" icon tier (Level 16+). They have immense trust scores, allow custom avatars, and can create larger groups.</li>
                        <li><strong>Moon Level (4-15):</strong> Mid-tier accounts boasting the "Moon" icon. A perfect balance of cost-efficiency and account stability.</li>
                        <li><strong>Premium / Vanity:</strong> Short-digit QQ numbers (e.g., 6/7/8 digits) or repeating patterns. Valued highly for prestige and commercial branding.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>Need specific digits?</strong> We stock premium short-digit and repeating pattern QQ numbers not listed here. 
                            Contact our <a href="/en/contact/" className="text-blue-600 underline">support desk</a> for a private viewing catalog.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="qq" lang="en" />
        </>
    );
}
