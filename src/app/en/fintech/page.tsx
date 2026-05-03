import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'FinTech & Trading Accounts - XM, HFM, Neteller, Wise | Verified E-Wallets',
    description: 'Buy pre-verified FinTech and trading accounts from CNWePro. High-authority XM and HFM trading accounts, fully KYC-verified Neteller, Payoneer, and Wise e-wallets. Instant USDT delivery.',
    keywords: 'buy xm account, verified hfm account, buy neteller account, wise account for sale, verified payoneer, trading account kyc',
    alternates: {
        canonical: `${SITE_URL}/en/fintech/`,
        languages: { 'en': `${SITE_URL}/en/fintech/`, 'zh-CN': `${SITE_URL}/fintech/` },
    },
    openGraph: {
        title: 'Verified FinTech & Trading Accounts | CNWePro',
        description: `Premium FinTech accounts starting from ${formatYuan(getLowestPrice('fintech'))}. Full KYC verification, stable logins, and instant crypto delivery.`,
        url: `${SITE_URL}/en/fintech/`,
    },
};

function getFintechJsonLd() {
    const products = getProductsByCategory('fintech');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy FinTech Accounts',
        description: 'Verified trading accounts and global e-wallets: XM, HFM, Neteller, Wise.',
        url: `${SITE_URL}/en/fintech/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features.map(f => f.en).join(', '),
                url: `${SITE_URL}/en/fintech/`,
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

export default function FintechPageEn() {
    const jsonLd = getFintechJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="fintech" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        FinTech Account Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        In an era of strict global financial compliance, having a verified account on major trading and payment platforms is essential for seamless capital movement. 
                        CNWePro provides **"Ready-to-Use"** FinTech accounts that have already passed identity and address verification (KYC).
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Advantages of Our Verified Accounts
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Complete KYC:</strong> Accounts are verified with authentic documentation and proof of address.</li>
                        <li><strong>Isolated Environments:</strong> Each account is registered under a unique, clean IP address to prevent cross-account correlation bans.</li>
                        <li><strong>Global Payments:</strong> E-wallets like Wise and Neteller support high-limit transfers and multiple currency conversions.</li>
                        <li><strong>Extended Warranty:</strong> All FinTech accounts come with a 7 to 30-day stability guarantee for login and initial transactions.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300">
                            📊 <strong>Security Tip:</strong> To protect your assets, we strongly recommend changing your login password and enabling Two-Factor Authentication (2FA) immediately after delivery.
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="fintech" lang="en" />
        </>
    );
}
