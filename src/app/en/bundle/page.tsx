import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Super Bundle Packages - Alipay + Xianyu/Taobao/1688 | Accounts for Sale',
    description: 'Exclusive account bundles from CNWePro: Alipay + Xianyu, Alipay + Taobao, Alipay + 1688. Pre-linked and verified account sets for smooth China e-commerce operations. Instant crypto delivery.',
    keywords: 'alipay xianyu bundle, alipay taobao combo, buy 1688 account, jd account bundle, ecommerce account sets',
    alternates: {
        canonical: `${SITE_URL}/en/bundle/`,
        languages: { 'en': `${SITE_URL}/en/bundle/`, 'zh-CN': `${SITE_URL}/bundle/` },
    },
    openGraph: {
        title: 'Multi-Platform Account Bundles | CNWePro',
        description: `Super bundles starting from ${formatYuan(getLowestPrice('bundle'))}. Pre-linked, stable, and anti-ban account sets. Instant USDT delivery.`,
        url: `${SITE_URL}/en/bundle/`,
    },
};

function getBundleJsonLd() {
    const products = getProductsByCategory('bundle');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy Account Bundles',
        description: 'Multi-platform account bundles: Alipay, Xianyu, Taobao, 1688, JD.',
        url: `${SITE_URL}/en/bundle/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features.map(f => f.en).join(', '),
                url: `${SITE_URL}/en/bundle/`,
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

export default function BundlePageEn() {
    const jsonLd = getBundleJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="bundle" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Why Choose Account Bundles?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Navigating the Chinese digital ecosystem often requires multiple accounts working in harmony. 
                        CNWePro's **"Direct Pass"** bundles provide pre-linked and tested account sets (e.g., Alipay + Xianyu) 
                        to ensure you can handle payments, listings, and communications without the typical friction 
                        of foreign verification.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Key Benefits of Bundles
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Deep Integration:</strong> Alipay and secondary platforms (Xianyu/Taobao) are already synced with matching ID verification.</li>
                        <li><strong>Higher Authority:</strong> Cross-platform activity signals high trust to AI algorithms, significantly reducing ban risks.</li>
                        <li><strong>Cost Efficiency:</strong> Save up to 20% compared to purchasing individual accounts separately.</li>
                        <li><strong>Ready to Trade:</strong> Skip the complex setup process. These sets are configured for immediate use in global environments.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                        <p className="text-sm text-purple-800 dark:text-purple-300">
                            💡 <strong>Custom Enterprise Sets:</strong> Need a customized bundle with 5+ platforms including bank-linked status? 
                            Contact our <a href="/en/contact/" className="text-purple-600 underline">VIP Support</a> for a private consultation.
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="bundle" lang="en" />
        </>
    );
}
