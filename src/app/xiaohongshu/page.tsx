import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '小红书账号购买 - 高权重种草号·实名老号·千粉号现货',
    description: '小红书账号批发平台：高质量种草营销号、实名认证老号、千粉/万粉号现货秒发。支持USDT支付，安全防封，助力品牌营销。',
    keywords: '小红书账号购买, 买小红书号, 小红书实名号, 小红书老号, 小红书种草号, 小红书营销号',
    alternates: {
        canonical: `${SITE_URL}/xiaohongshu/`,
        languages: { 'zh-CN': `${SITE_URL}/xiaohongshu/`, 'en': `${SITE_URL}/en/xiaohongshu/` },
    },
    openGraph: {
        title: '小红书账号购买 - 优质老号·高权重营销号现货 | CNWePro',
        description: `小红书号${formatYuan(getLowestPrice('xiaohongshu'))}起 | USDT支付秒发货`,
    },
};

function getXiaohongshuJsonLd() {
    const products = getProductsByCategory('xiaohongshu');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '小红书账号购买',
        description: '高权重小红书账号批发：实名号、种草号、粉丝号',
        url: `${SITE_URL}/xiaohongshu/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features.map(f => f.zh).join(', '),
                url: `${SITE_URL}/xiaohongshu/`,
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

export default function XiaohongshuPage() {
    const jsonLd = getXiaohongshuJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="xiaohongshu" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        小红书账号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        小红书是中国领先的种草和生活方式平台。CNWePro 提供高质量的小红书账号，
                        包含适合日常互动的全新基础号，以及具备历史权重、适合品牌宣传和种草营销的高粉丝量老号。
                        所有账号均采用真实环境模拟养号，权重达标，抗封能力强。 
                        支持 <strong>USDT</strong> 支付，<strong>系统秒发货</strong>。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        账号类型说明
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>基础交互号：</strong>适合日常点赞、收藏和评论，模拟真实用户行为。</li>
                        <li><strong>高权重种草号：</strong>具备千粉/万粉量级，权重极高，发布笔记更易进入流量池。</li>
                        <li><strong>品牌营销利器：</strong>协助品牌方快速建立矩阵，覆盖精准受众。</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="xiaohongshu" lang="zh" />
        </>
    );
}
