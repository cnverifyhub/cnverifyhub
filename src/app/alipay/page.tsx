import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '支付宝账号购买 - 实名号·企业号·商家号现货',
    description: '支付宝账号批发：个人实名号、企业号、商家号现货秒发。已过风控认证，USDT支付，72小时售后质保。',
    keywords: '支付宝账号购买, 买支付宝号, 支付宝实名号, 支付宝企业号, 支付宝商家号',
    alternates: {
        canonical: `${SITE_URL}/alipay/`,
        languages: { 'zh-CN': `${SITE_URL}/alipay/`, 'en': `${SITE_URL}/en/alipay/` },
    },
    openGraph: {
        title: '支付宝账号购买 - 实名·企业·商家号 | CNWePro',
        description: '支付宝个人号¥38起 | 企业号¥88起 | USDT支付秒发货',
    },
};

function getAlipayJsonLd() {
    const products = getProductsByCategory('alipay');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '支付宝账号购买',
        description: '支付宝账号批发：个人实名号、企业号、商家号',
        url: `${SITE_URL}/alipay/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features.map(f => f.zh).join(', '),
                url: `${SITE_URL}/alipay/`,
                brand: { '@type': 'Brand', name: 'CNWePro' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: p.price.single,
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNWePro' },
                },
            },
        })),
    };
}

export default function AlipayPage() {
    const jsonLd = getAlipayJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="alipay" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        支付宝账号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNWePro 提供各类支付宝账号的专业批发服务。从个人实名号到企业户，
                        所有账号均已通过风控认证，可正常使用转账、收款、扫码支付等核心功能。
                        <strong>USDT加密支付</strong>，<strong>5分钟自动发货</strong>，<strong>72小时质保</strong>。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        支付宝账号类型
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>个人实名号：</strong>已完成实名认证的支付宝账号，可正常使用转账、扫码支付等功能。适合日常商业用途。</li>
                        <li><strong>企业号：</strong>企业认证的支付宝商户账号，支持对公收款、企业转账，适合需要正规商业支付的场景。</li>
                        <li><strong>商家号：</strong>开通了商家收款功能的账号，支持花呗收款、当面付等特性，适合开店和线上线下收款。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>批量优惠：</strong>购买10个以上享受阶梯折扣。
                            查看 <a href="/pricing/" className="text-blue-600 underline">完整价格表</a> |
                            更多问题请访问 <a href="/faq/" className="text-blue-600 underline">常见问题</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="alipay" lang="zh" />
        </>
    );
}
