import { PopularProducts } from '@/components/home/PopularProducts';

export default function PricingPageEn() {
    return (
        <div className="pt-12 pb-24">
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
