import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: 'FinTech & Trading Accounts - Verified XM, HFM, Payoneer, Wise',
    description: 'Verified accounts for global trading and payments: XM, HFM, Neteller, Skrill, Payoneer, Wise. Secure USDT payments, instant delivery, 24/7 support.',
    keywords: 'Buy XM account, HFM verified account, Payoneer KYC account, Buy Wise account, Trading account marketplace',
    alternates: {
        canonical: `${SITE_URL}/en/trading/`,
        languages: { 'zh-CN': `${SITE_URL}/trading/`, 'en': `${SITE_URL}/en/trading/` },
    },
};

export default function EnglishTradingPage() {
    return (
        <>
            <CategoryPageTemplate categoryId="trading" lang="en" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Global Trading & FinTech Account Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNVerifyHub provides secure, verified financial and payment accounts for global traders. 
                        Our accounts are KYC-verified by real individuals, suitable for forex trading, 
                        cross-border payments, and global e-wallet usage. We support <strong>USDT</strong> payments 
                        to ensure your privacy and secure transaction flow.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Supported Account Types
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Forex Brokers:</strong> Verified trading accounts for XM, HFM (HotForex), and more.</li>
                        <li><strong>E-Wallets:</strong> Fully verified Neteller and Skrill accounts for global transactions.</li>
                        <li><strong>Payment Solutions:</strong> Payoneer and Wise accounts for multi-currency receiving and exchange.</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="trading" lang="en" />
        </>
    );
}
