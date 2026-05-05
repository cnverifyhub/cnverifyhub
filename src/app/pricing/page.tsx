import type { Metadata } from 'next';
import PricingTable from '@/components/pricing/PricingTable';
import { allProducts } from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '价格总览 - 全网最低价 | Pricing',
    description: '微信号、支付宝账号、抖音号、QQ号全品类价格一览表。单买·10件·50件·200件批量阶梯定价。平台全线支持支付宝及微信支付，量大从优。Compare prices for WeChat, Alipay, Douyin & QQ accounts — bulk pricing from 130¥.',
    alternates: {
        canonical: `${SITE_URL}/pricing/`,
        languages: { 'zh-CN': `${SITE_URL}/pricing/`, 'en': `${SITE_URL}/en/pricing/` },
    },
    openGraph: {
        title: '价格总览 - 微信·支付宝·抖音·QQ账号 | CNWePro',
        description: '全品类账号阶梯定价，130¥起，支付宝/微信支付秒发货',
    },
};

// AggregateOffer JSON-LD for pricing page
function getPricingJsonLd() {
    const prices = allProducts.map(p => p.price.single);
    const lowPrice = Math.min(...prices);
    const highPrice = Math.max(...prices);

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'CNWePro 中国数字账号',
        description: '微信号、支付宝账号、抖音号、QQ号批发平台',
        brand: { '@type': 'Brand', name: 'CNWePro' },
        url: `${SITE_URL}/pricing/`,
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

export default function PricingPage() {
    const jsonLd = getPricingJsonLd();
    return (
        <div className="pt-12 pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="text-center section-container mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                    详细价格总览
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    全网最具竞争力的价格，量大从优。以下是我们的所有账号套餐。如果需要采购超过200个账号，请联系客服获取渠道特价。
                </p>
            </div>
            <PricingTable lang="zh" />
        </div>
    );
}
