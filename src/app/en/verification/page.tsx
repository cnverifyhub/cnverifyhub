import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Verification Services - WeChat Passport, Alipay Real-Name, KYC Packages',
    description: 'Expert verification assistance for Chinese platforms: WeChat passport verification, Alipay ID verification for foreigners, KYC document packages, and face verification support. Instant crypto delivery.',
    keywords: 'wechat verification service, buy alipay verification, passport wechat, kyc document package, face verification assistance',
    alternates: {
        canonical: `${SITE_URL}/en/verification/`,
        languages: { 'en': `${SITE_URL}/en/verification/`, 'zh-CN': `${SITE_URL}/verification/` },
    },
    openGraph: {
        title: 'Real-Name Verification Services | CNWePro',
        description: `Verification assistance starting from ${formatYuan(getLowestPrice('verification'))}. Passport support, KYC sets, and live face-verify assistance.`,
        url: `${SITE_URL}/en/verification/`,
    },
};

function getVerificationJsonLd() {
    const products = getProductsByCategory('verification');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Verification Services',
        description: 'Assistance for WeChat, Alipay, and global KYC verification.',
        url: `${SITE_URL}/en/verification/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features.map(f => f.en).join(', '),
                url: `${SITE_URL}/en/verification/`,
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

export default function VerificationPageEn() {
    const jsonLd = getVerificationJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="verification" lang="en" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Real-Name Verification Assistance
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        As security protocols tighten across Chinese platforms, many international users find themselves locked out due to **"Real-Name Verification"** requirements. 
                        CNWePro provides professional assistance to help you verify your accounts legally and securely, enabling features like WeChat Pay, bank transfers, and balance withdrawals.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Our Core Solutions
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Passport Integration:</strong> Specialized guidance for binding international passports to WeChat and Alipay.</li>
                        <li><strong>Live Face Assistance:</strong> Remote support for platforms requiring real-time face scanning and biometric verification.</li>
                        <li><strong>Encrypted KYC Data:</strong> Professional document sets for trading platforms, handled with strict privacy protocols.</li>
                        <li><strong>Success Guarantee:</strong> If verification fails due to document quality, we offer full replacements or a 100% refund.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                            ⚠️ <strong>Important Note:</strong> Verification is a service-based product that requires active user cooperation. 
                            Please contact us via Telegram after placing your order to begin the process.
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="verification" lang="en" />
        </>
    );
}
