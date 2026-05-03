import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'FinTech 账户与交易号 - XM/HFM 认证账户·Neteller/Wise 电子钱包',
    description: 'CNWePro 为全球交易者提供预认证的 FinTech 账户：包括 XM、HFM 交易账户，以及 Neteller、Payoneer、Wise 等全球电子钱包。已完成 KYC 认证，即拿即用，USDT支付极速交付。',
    keywords: 'XM认证账户, HFM账号购买, Neteller账号, Wise账户购买, Payoneer认证号, 外汇交易账号',
    alternates: {
        canonical: `${SITE_URL}/fintech/`,
        languages: { 'zh-CN': `${SITE_URL}/fintech/`, 'en': `${SITE_URL}/en/fintech/` },
    },
    openGraph: {
        title: 'FinTech & 交易账户现货 - XM/HFM/Wise | CNWePro',
        description: `FinTech 账户${formatYuan(getLowestPrice('fintech'))}起 | 全认证 KYC · 稳定质保 | USDT支付`,
    },
};

function getFintechJsonLd() {
    const products = getProductsByCategory('fintech');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'FinTech 账户购买',
        description: '认证交易账户与电子钱包：XM、HFM、Neteller、Wise',
        url: `${SITE_URL}/fintech/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features.map(f => f.zh).join(', '),
                url: `${SITE_URL}/fintech/`,
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

export default function FintechPage() {
    const jsonLd = getFintechJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="fintech" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        FinTech 账户服务指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        在全球金融合规趋严的背景下，拥有一个高权重的认证账户是进行外汇交易、国际收款和资产配置的关键。
                        CNWePro 整合全球资源，为您提供 **“即拿即用”** 的全认证 FinTech 账户。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        为什么选择我们的认证账户？
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>全流程 KYC：</strong>账户已完成身份核验与地址证明，注册信息真实可查。</li>
                        <li><strong>独立安全环境：</strong>每个账户均在独立纯净 IP 环境下注册，极大降低由于关联导致的封号概率。</li>
                        <li><strong>支持全球转账：</strong>电子钱包（Wise/Neteller）支持多种主流货币转换，无额度限制。</li>
                        <li><strong>长效稳定质保：</strong>所有 FinTech 类账户均提供 7-30 天不等的稳定登录质保，售后无忧。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300">
                            📊 <strong>交易提示：</strong>为保障资金安全，建议在拿到账户后第一时间修改登录密码，
                            并开启双重身份验证（2FA）。
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="fintech" lang="zh" />
        </>
    );
}
