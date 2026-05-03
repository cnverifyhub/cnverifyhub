import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Buy Taobao Account - Verified Buyer & VIP Aged | Taobao for Sale',
    description: 'Professional Taobao account marketplace. Buy fresh buyer accounts, VIP aged accounts, and high Taoqi score accounts for shopping in China. Instant USDT delivery.',
    keywords: 'buy taobao account, taobao for sale, verified taobao, aged taobao, chinese shopping account, taobao usdt payment',
    alternates: {
        canonical: `${SITE_URL}/en/taobao/`,
        languages: { 'en': `${SITE_URL}/en/taobao/`, 'zh-CN': `${SITE_URL}/taobao/` },
    },
    openGraph: {
        title: 'Buy Taobao Account - Verified & VIP Aged | CNWePro',
        description: `Verified Taobao buyer accounts starting from ${formatYuan(getLowestPrice('taobao'))}. VIP aged accounts available. Instant delivery via USDT.`,
        url: `${SITE_URL}/en/taobao/`,
    },
};

function getTaobaoJsonLd() {
    const products = getProductsByCategory('taobao');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy Taobao Accounts',
        description: 'Fresh and VIP aged Taobao buyer accounts for sale.',
        url: `${SITE_URL}/en/taobao/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features.map(f => f.en).join(', '),
                url: `${SITE_URL}/en/taobao/`,
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

export default function TaobaoPageEn() {
    const jsonLd = getTaobaoJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="taobao" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Taobao Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Taobao is the primary portal to China's e-commerce world. CNWePro provides high-quality Taobao buyer accounts, 
                        ranging from fresh "white" accounts to premium VIP aged accounts with high Taoqi scores. 
                        Every account is verified for immediate use. Use with our <strong>Golden 72 Hours Anti-Ban Protocol</strong> for best results. 
                        We accept <strong>USDT</strong> and offer <strong>automated instant delivery</strong>.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Selecting Your Account
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Basic Buyer Account:</strong> Competitively priced, perfect for bulk tasks or initial shopping tests.</li>
                        <li><strong>VIP Aged Account:</strong> Higher platform trust with history and high Taoqi value, much more resistant to automated bans.</li>
                        <li><strong>Strict QC:</strong> Each account undergoes quality checks before being listed in our automated inventory.</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="taobao" lang="en" />
        </>
    );
}
