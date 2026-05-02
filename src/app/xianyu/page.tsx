import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '闲鱼账号购买 - 高权重实名号·芝麻信用老号现货',
    description: '闲鱼账号批发平台：高质量实名认证号、高芝麻信用老号、卖家号现货秒发。支持USDT支付，72小时售后质保，安全防封。',
    keywords: '闲鱼账号购买, 买闲鱼号, 闲鱼实名号, 闲鱼老号, 闲鱼芝麻信用号, 闲鱼卖家号',
    alternates: {
        canonical: `${SITE_URL}/xianyu/`,
        languages: { 'zh-CN': `${SITE_URL}/xianyu/`, 'en': `${SITE_URL}/en/xianyu/` },
    },
    openGraph: {
        title: '闲鱼账号购买 - 优质实名老号 | CNWePro',
        description: '闲鱼标准号¥351起 | 优质老号¥495起 | USDT支付秒发货',
    },
};

function getXianyuJsonLd() {
    const products = getProductsByCategory('xianyu');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '闲鱼账号购买',
        description: '高质量闲鱼账号批发：实名号、高信誉老号',
        url: `${SITE_URL}/xianyu/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features.map(f => f.zh).join(', '),
                url: `${SITE_URL}/xianyu/`,
                brand: { '@type': 'Brand', name: 'CNWePro' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'CNY',
                    price: Math.round(p.price.single * 7.2),
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNWePro' },
                },
            },
        })),
    };
}

export default function XianyuPage() {
    const jsonLd = getXianyuJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="xianyu" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        闲鱼账号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        作为中国最大的二手交易平台，闲鱼对账号权重的要求极高。CNWePro 提供经过深度养号、高芝麻信用分的优质闲鱼账号。
                        无论您是个人买家还是职业卖家，我们的账号都能助您快速起步，减少由于风控导致的封号风险。
                        支持 <strong>USDT</strong> 匿名支付，<strong>全自动秒发货</strong>。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        账号优势
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>实名认证：</strong>所有账号均已完成实名认证，可直接进行沟通、发布商品。</li>
                        <li><strong>高芝麻信用：</strong>优选高信誉分账号，增加买卖双方信任感。</li>
                        <li><strong>抗封稳定性：</strong>采用真实手机号注册，权重达标，适合长期运营。</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="xianyu" lang="zh" />
        </>
    );
}
