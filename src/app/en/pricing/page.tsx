import type { Metadata } from 'next';
import { PopularProducts } from '@/components/home/PopularProducts';
import { allProducts } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Pricing Overview - Best Rates for China Accounts | CNWePro',
    description: 'Complete price list for WeChat, Alipay, Douyin, and QQ accounts. Bulk discounts for 10, 50, and 200+ units. Secure USDT payment with instant delivery. Starting from ¥135.',
    alternates: {
        canonical: `${SITE_URL}/en/pricing/`,
        languages: { 'en': `${SITE_URL}/en/pricing/`, 'zh-CN': `${SITE_URL}/pricing/` },
    },
    openGraph: {
        title: 'Pricing Overview - WeChat, Alipay, Douyin, QQ | CNWePro',
        description: 'Tiered pricing for all Chinese social accounts. Instant USDT delivery from ¥135.',
        url: `${SITE_URL}/en/pricing/`,
    },
};

function getPricingJsonLd() {
    const prices = allProducts.map(p => p.price.single);
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'CNWePro China Digital Accounts',
        description: 'Marketplace for WeChat, Alipay, Douyin, and QQ accounts.',
        brand: { '@type': 'Brand', name: 'CNWePro' },
        url: `${SITE_URL}/en/pricing/`,
        offers: {
            '@type': 'AggregateOffer',
            lowPrice: (lowPrice * 7.2).toFixed(2),
            highPrice: (highPrice * 7.2).toFixed(2),
            priceCurrency: 'CNY',
            offerCount: allProducts.length,
            availability: 'https://schema.org/InStock',
        },
    };
}

export default function PricingPageEn() {
    const jsonLd = getPricingJsonLd();
    return (
        <div className="pt-12 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="text-center section-container mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                    Detailed Pricing Overview
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    The most competitive prices on the market with bulk discounts. Below are all our account packages. If you need more than 200 accounts, please contact support for wholesale rates.
                </p>
            </div>
            <PopularProducts lang="en" />
        </div>
    );
}
