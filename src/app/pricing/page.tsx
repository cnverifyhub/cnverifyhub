import type { Metadata } from 'next';
import { PopularProducts } from '@/components/home/PopularProducts';
import { getLocalizedPath } from '@/lib/i18n';

export const metadata: Metadata = {
    title: '价格总览 - 全网最低价 | Pricing',
    description: '微信号、支付宝账号、抖音号、QQ号全品类价格一览表。单买·10件·50件·200件批量阶梯定价。USDT支付，量大从优。Compare prices for WeChat, Alipay, Douyin & QQ accounts — bulk pricing from $18.',
    alternates: {
        canonical: 'https://cnwepro.netlify.app/pricing/',
        languages: { 'zh-CN': 'https://cnwepro.netlify.app/pricing/', 'en': 'https://cnwepro.netlify.app/en/pricing/' },
    },
};

export default function PricingPage() {
    return (
        <div className="pt-12 pb-24">
            <div className="text-center section-container mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                    详细价格总览
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    全网最具竞争力的价格，量大从优。以下是我们的所有账号套餐。如果需要采购超过200个账号，请联系客服获取渠道特价。
                </p>
            </div>
            <PopularProducts lang="zh" />
        </div>
    );
}
