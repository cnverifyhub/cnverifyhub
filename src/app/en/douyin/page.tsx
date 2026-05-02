import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Buy Douyin Account - Followers, Blue V, Aged | TikTok China',
    description: 'Buy verified Douyin (TikTok China) accounts for marketing and streaming. Aged accounts, 1K/10K real followers, and Blue V enterprise accounts available. Instant USDT delivery.',
    keywords: 'buy douyin account, buy tiktok china account, douyin followers, verified douyin, enterprise douyin, douyin live streaming',
    alternates: {
        canonical: `${SITE_URL}/en/douyin/`,
        languages: { 'en': `${SITE_URL}/en/douyin/`, 'zh-CN': `${SITE_URL}/douyin/` },
    },
    openGraph: {
        title: 'Buy Verified Douyin Accounts | CNWePro',
        description: 'Verified Douyin accounts from ¥135. Real followers and high authority. Instant USDT delivery.',
        url: `${SITE_URL}/en/douyin/`,
    },
};

function getDouyinJsonLd() {
    const products = getProductsByCategory('douyin');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy Douyin Accounts',
        description: 'Verified Douyin accounts with followers and live streaming enabled.',
        url: `${SITE_URL}/en/douyin/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features.map(f => f.en).join(', '),
                url: `${SITE_URL}/en/douyin/`,
                brand: { '@type': 'Brand', name: 'CNWePro' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'CNY',
                    price: Math.round(p.price.single * 7.2),
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNWePro' },
                },
            },
        })),
    };
}

export default function DouyinPageEn() {
    const jsonLd = getDouyinJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="douyin" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Douyin Account Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Douyin is China's original and most popular short-video platform (the sister app to TikTok).
                        CNWePro offers high-authority, verified Douyin accounts with real followers, perfect for
                        marketing campaigns, live-streaming e-commerce, and brand promotion in the lucrative
                        Chinese market. Pay securely with <strong>USDT crypto</strong> and receive credentials 
                        instantly with our <strong>72-hour quality guarantee</strong>.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Available Account Types
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Basic Douyin:</strong> Freshly registered accounts with baseline authority. Best for farming, testing, and matrix operations.</li>
                        <li><strong>10K+ Followers:</strong> Accounts with over 10,000 real followers. Reaches the threshold required for opening product showcases (e-commerce window) and advanced live-streaming features.</li>
                        <li><strong>Blue V Verified:</strong> Enterprise verified accounts featuring the official blue badge. Offers the highest level of trust, elevated algorithm recommendations, and premium marketing tools.</li>
                        <li><strong>Aged Douyin:</strong> Accounts with long registration history. They hold significant algorithm weight, making it easier for new organic content to go viral.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>Need more followers?</strong> For custom follower counts or specific niche/demographic targeting, 
                            please contact our <a href="/en/contact/" className="text-blue-600 underline">support team</a> for a custom quote.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="douyin" lang="en" />
        </>
    );
}
