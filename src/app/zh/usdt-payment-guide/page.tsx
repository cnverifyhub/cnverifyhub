import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'USDT 支付指南 - 如何在 CNVerifyHub 匿名购买',
    description: '学习如何使用加密货币 USDT (TRC20) 安全匿名地购买我们的服务。',
};

export default function USDTPaymentGuide() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'USDT 支付完整指南',
        description: '如何使用USDT完成订单支付的图文教程',
        author: {
            '@type': 'Organization',
            name: 'CNVerifyHub'
        }
    };

    return (
        <article className="max-w-3xl mx-auto py-24 px-4 text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <h1 className="text-4xl font-bold mb-6">USDT 支付指南</h1>
            <p className="text-gray-300 mb-4">
                为了保护客户隐私并实现全球无障碍支付，CNVerifyHub 独家支持 USDT(TRC20) 付款。
            </p>
        </article>
    );
}
