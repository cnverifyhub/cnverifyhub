import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '实名认证服务 - 微信护照实名·支付宝人脸·KYC资料包',
    description: 'CNWePro 提供专业的中国平台实名认证协助服务：包括微信护照实名、支付宝海外用户认证、KYC 资料包及远程人脸辅助。合规通过风控，USDT支付极速处理。',
    keywords: '微信实名认证, 支付宝实名, 护照实名微信, KYC资料购买, 人脸核验辅助, 微信解封服务',
    alternates: {
        canonical: `${SITE_URL}/verification/`,
        languages: { 'zh-CN': `${SITE_URL}/verification/`, 'en': `${SITE_URL}/en/verification/` },
    },
    openGraph: {
        title: '实名认证协助服务 - 微信/支付宝/KYC | CNWePro',
        description: `实名认证服务${formatYuan(getLowestPrice('verification'))}起 | 护照认证·资料包·人脸辅助 | USDT支付`,
    },
};

function getVerificationJsonLd() {
    const products = getProductsByCategory('verification');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '实名认证服务',
        description: '微信、支付宝、KYC实名认证协助服务',
        url: `${SITE_URL}/verification/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features.map(f => f.zh).join(', '),
                url: `${SITE_URL}/verification/`,
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

export default function VerificationPage() {
    const jsonLd = getVerificationJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="verification" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        实名认证服务说明
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        随着中国互联网风控升级，许多海外用户在使用微信、支付宝或交易平台时常遇到 **“请完成实名认证”** 的限制。
                        CNWePro 提供一站式认证协助，帮助您合规、快速地开通支付、转账、红包等核心功能。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        我们的核心优势
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>专业护照通道：</strong>支持使用非中国大陆护照开通微信支付。</li>
                        <li><strong>真人辅助验证：</strong>针对高难度的真人扫脸核验，提供实时远程指导或资料包。</li>
                        <li><strong>隐私资料加密：</strong>所有 KYC 资料均进行单次授权使用，服务完成后立即物理删除。</li>
                        <li><strong>认证通过保障：</strong>如因资料质量问题导致认证失败，承诺全额退款或免费重做。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <p className="text-sm text-indigo-800 dark:text-indigo-300">
                            ⚠️ <strong>认证须知：</strong>实名认证属于服务类产品，需用户配合提供部分信息。
                            请在下单后第一时间联系客服，或在订单备注中留下您的联系方式（Telegram/WeChat）。
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="verification" lang="zh" />
        </>
    );
}
