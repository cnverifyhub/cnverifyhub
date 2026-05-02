import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Buy Xianyu Account - Verified & Aged | High Zhima Credit',
    description: 'Professional Xianyu account marketplace. Buy ID-verified, high Zhima credit, and aged Xianyu accounts for second-hand trading in China. Instant USDT delivery.',
    keywords: 'buy xianyu account, buy idle fish account, verified xianyu, aged xianyu, chinese second hand marketplace account, xianyu usdt payment',
    alternates: {
        canonical: `${SITE_URL}/en/xianyu/`,
        languages: { 'en': `${SITE_URL}/en/xianyu/`, 'zh-CN': `${SITE_URL}/xianyu/` },
    },
    openGraph: {
        title: 'Buy Xianyu Account - Verified & Aged | CNWePro',
        description: 'Verified Xianyu accounts from ¥351. High credit aged accounts available. Instant delivery.',
        url: `${SITE_URL}/en/xianyu/`,
    },
};

function getXianyuJsonLd() {
    const products = getProductsByCategory('xianyu');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy Xianyu Accounts',
        description: 'ID-verified, high Zhima credit, and aged Xianyu accounts for sale.',
        url: `${SITE_URL}/en/xianyu/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features.map(f => f.en).join(', '),
                url: `${SITE_URL}/en/xianyu/`,
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

export default function XianyuPageEn() {
    const jsonLd = getXianyuJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="xianyu" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Xianyu Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Xianyu is China's largest second-hand marketplace, but accessing it securely from abroad requires high-authority accounts. 
                        CNWePro provides premium Xianyu accounts with verified IDs and high Zhima Credit scores to help you trade smoothly. 
                        We support <strong>USDT</strong> payments and offer <strong>instant automated delivery</strong>.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Account Features
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>ID Verified:</strong> All accounts have completed real-name verification, allowing you to list items and chat immediately.</li>
                        <li><strong>High Credit Score:</strong> Premium aged accounts with excellent Zhima Credit scores for higher trust.</li>
                        <li><strong>Safe & Stable:</strong> Algorithmically stable accounts registered with real SIM cards to minimize ban risks.</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="xianyu" lang="en" />
        </>
    );
}
