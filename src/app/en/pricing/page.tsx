import type { Metadata } from 'next';
import PricingTable from '@/components/pricing/PricingTable';
import { allProducts } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Detailed Pricing Overview | CNWePro',
    description: 'Compare prices for WeChat, Alipay, Douyin, and QQ accounts. Bulk pricing available for 10, 50, and 200+ units. Secure USDT payments with instant delivery.',
    alternates: {
        canonical: `${SITE_URL}/en/pricing/`,
        languages: { 'zh-CN': `${SITE_URL}/pricing/`, 'en': `${SITE_URL}/en/pricing/` },
    },
    openGraph: {
        title: 'Detailed Pricing Overview | CNWePro',
        description: 'Bulk pricing for premium Chinese digital assets starting from $20. Instant delivery via TRC20.',
    },
};

export default function PricingPageEn() {
    return (
        <div className="pt-12 pb-24">
            <div className="text-center section-container mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                    Detailed Pricing Overview
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    The most competitive prices on the market with bulk discounts. Below are all our account packages. If you need more than 200 accounts, please contact support for wholesale rates.
                </p>
            </div>
            <PricingTable lang="en" />
        </div>
    );
}
