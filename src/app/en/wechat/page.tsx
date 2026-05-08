import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { faqData } from '@/data/faq';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnverifyhub.com';

export const metadata: Metadata = {
    title: 'Buy WeChat Account - Verified, Aged, Bank-Linked | WeChat for Sale',
    description: 'Professional WeChat account marketplace. Buy fresh, ID-verified, bank-linked, and aged WeChat accounts here. Instant USDT delivery with 72-hour warranty. Anti-ban guarantee.',
    keywords: 'buy wechat account, wechat for sale, verified wechat, aged wechat, buy chinese wechat account, wechat usdt payment',
    alternates: {
        canonical: `${SITE_URL}/en/wechat/`,
        languages: { 'en': `${SITE_URL}/en/wechat/`, 'zh-CN': `${SITE_URL}/wechat/` },
    },
    openGraph: {
        title: 'Buy WeChat Account - Verified & Aged | CNVerifyHub',
        description: 'Fresh WeChat accounts from $18. Verified accounts from $28. Instant crypto delivery safely.',
        url: `${SITE_URL}/en/wechat/`,
    },
};

// Product JSON-LD for Google Rich Snippets (English)
function getWeChatJsonLd() {
    const products = getProductsByCategory('wechat');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Buy WeChat Accounts',
        description: 'Fresh, ID-verified, bank-linked, and aged WeChat accounts for sale.',
        url: `${SITE_URL}/en/wechat/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.en,
                description: p.features?.map(f => f.en).join(', ') || '',
                url: `${SITE_URL}/en/wechat/`,
                brand: { '@type': 'Brand', name: 'CNVerifyHub' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: p.price.single,
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNVerifyHub' },
                },
            },
        })),
    };
}

export default function WeChatPageEn() {
    const jsonLd = getWeChatJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="wechat" lang="en" />
            
            {/* English SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        WeChat Account Buying Guide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNVerifyHub is your premier destination to buy WeChat accounts. We offer a full spectrum of 
                        WeChat solutions ranging from fresh basic numbers to high-authority, ID-verified aged accounts. 
                        Every account passes our strict quality control filters to ensure maximum login stability and 
                        ban resistance. We accept <strong>USDT (TRC20)</strong> cryptocurrency for complete privacy, 
                        provide <strong>instant 5-minute automated delivery</strong>, and cover every purchase with an 
                        iron-clad <strong>72-hour warranty</strong>.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Account Types Explained
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Basic WeChat:</strong> Fresh, newly registered accounts. Best for bulk marketing, friend adding, and basic tasks.</li>
                        <li><strong>Verified WeChat:</strong> Real-name ID-verified accounts with a higher trust score, reducing the likelihood of bans. Ideal for daily operation and customer communication.</li>
                        <li><strong>Bank-Linked WeChat:</strong> Fully verified and linked with a Chinese bank card. Enables WeChat Pay, red packets, and maximum platform authority.</li>
                        <li><strong>Aged WeChat:</strong> Accounts registered over 1 year ago. Highly stable algorithmically, very difficult to block, perfect for long-term critical business use.</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>Bulk discounts available:</strong> Order 10+ accounts for tiered discounts. Need over 200 accounts? 
                            View our <a href="/en/pricing/" className="text-blue-600 underline">full price list</a> or contact support for wholesale API rates. 
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories Grid */}
            <section className="section-container pb-16">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">Related Categories</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <a href="/en/alipay/" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Buy Alipay</span>
                        </a>
                        <a href="/en/douyin/" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Buy Douyin</span>
                        </a>
                        <a href="/en/qq/" className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Buy QQ</span>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
