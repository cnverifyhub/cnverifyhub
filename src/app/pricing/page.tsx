import { PopularProducts } from '@/components/home/PopularProducts';
import { getLocalizedPath } from '@/lib/i18n';

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
