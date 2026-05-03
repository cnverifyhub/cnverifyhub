import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Buy Alipay Account - Personal, Verified, Enterprise | Alipay for Sale',
    description: 'Buy verified Alipay accounts for China business. Personal ID verified, enterprise, and merchant accounts with Huabei enabled. Instant crypto delivery with warranty.',
    keywords: 'buy alipay account, verified alipay account, alipay for sale, buy chinese alipay, enterprise alipay',
    alternates: {
        canonical: `${SITE_URL}/en/alipay/`,
        languages: { 'en': `${SITE_URL}/en/alipay/`, 'zh-CN': `${SITE_URL}/alipay/` },
    },
    openGraph: {
        title: 'Buy Verified Alipay Accounts | CNWePro',
        description: 'Verified Alipay personal & enterprise accounts. Instant USDT delivery.',
        url: `${SITE_URL}/en/alipay/`,
    },
};

function getAlipayJsonLd() {
    const products = getProductsByCategory('alipay');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy Alipay Accounts',
        description: 'Verified personal, enterprise, and merchant Alipay accounts.',
        url: `${SITE_URL}/en/alipay/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features?.map(f => f.en).join(', ') || '',
                url: `${SITE_URL}/en/alipay/`,
                brand: { '@type': 'Brand', name: 'CNWePro' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: p.price.single,
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNWePro' },
                },
            },
        })),
    };
}

export default function AlipayPageEn() {
    const jsonLd = getAlipayJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="alipay" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Alipay Account Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Buy verified Alipay accounts securely at CNWePro. All accounts have passed
                        Alipay's rigorous risk control checks and support core features like bank transfers, QR code
                        payments, online purchasing, and balance management. We specialize in providing the international 
                        market with stable payment tools for China. Pay anonymously with <strong>USDT cryptocurrency</strong> and
                        receive your account credentials within 5 minutes. 72-hour quality guarantee included.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Types of Alipay Accounts
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Personal Verified:</strong> The standard ID-verified Alipay account. Allows for normal daily transfers, scanning to pay, and receiving funds safely.</li>
                        <li><strong>Enterprise / Corporate:</strong> Business-registered Alipay merchant accounts supporting corporate banking, B2B transfers, and regulated commercial payments.</li>
                        <li><strong>Merchant Enabled:</strong> Accounts activated with merchant receipt tools (like Huabei / Ant Credit Pay support) directly out of the box — perfect for e-commerce.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>Bulk discounts:</strong> Volume discounts apply automatically for 10+ accounts. 
                            View our <a href="/en/pricing/" className="text-blue-600 underline">price list</a> or check our <a href="/en/faq/" className="text-blue-600 underline">FAQ</a>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="alipay" lang="en" />
        </>
    );
}
