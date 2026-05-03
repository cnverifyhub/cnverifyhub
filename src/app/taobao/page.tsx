import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '淘宝账号购买 - 优质买家白号·高淘气值老号现货',
    description: '淘宝账号批发平台：高质量买家白号、VIP老号、高淘气值账号现货秒发。支持USDT支付，72小时售后质保，安全稳定。',
    keywords: '淘宝账号购买, 买淘宝号, 淘宝白号, 淘宝老号, 淘宝VIP号, 淘宝买家号',
    alternates: {
        canonical: `${SITE_URL}/taobao/`,
        languages: { 'zh-CN': `${SITE_URL}/taobao/`, 'en': `${SITE_URL}/en/taobao/` },
    },
    openGraph: {
        title: '淘宝账号购买 - 优质买家老号 | CNWePro',
        description: '淘宝白号¥15起 | VIP老号¥48起 | USDT支付秒发货',
    },
};

function getTaobaoJsonLd() {
    const products = getProductsByCategory('taobao');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '淘宝账号购买',
        description: '优质淘宝买家账号批发：白号、高权重老号',
        url: `${SITE_URL}/taobao/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features?.map(f => f.zh).join(', ') || '',
                url: `${SITE_URL}/taobao/`,
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

export default function TaobaoPage() {
    const jsonLd = getTaobaoJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="taobao" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        淘宝账号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        淘宝是进入中国电商市场的门户。CNWePro 提供高质量的淘宝买家账号，包含适合批量操作的全新白号，
                        以及具备高淘气值、更强抗风险能力的VIP老号。
                        我们的账号均经过严格测试，配合 <strong>Golden 72 小时防封协议</strong> 使用，效果更佳。
                        支持 <strong>USDT</strong> 支付，<strong>系统自动发货</strong>。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        选择合适的账号
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>基础买家号：</strong>价格极具竞争力，适合普通购物、抢券或初步代购测试。</li>
                        <li><strong>VIP老号：</strong>具备历史交易记录和高淘气值，平台信誉度更高，适合长期稳定使用。</li>
                        <li><strong>稳定防风控：</strong>所有方案均包含详细的使用建议，助您规避平台风控算法。</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="taobao" lang="zh" />
        </>
    );
}
