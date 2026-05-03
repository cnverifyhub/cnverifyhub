import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '抖音号购买 - 千粉号·万粉号·蓝V企业号出售',
    description: '抖音账号批发交易网：提供千粉号、万粉号、白号及蓝V企业号。带橱窗直播权限，高权重账号防限流，USDT担保交易秒发货。',
    keywords: '抖音号购买, 抖音账号出售, 买抖音号, 抖音千粉号, 抖音万粉号, 抖音蓝V认证, 抖音老号',
    alternates: {
        canonical: `${SITE_URL}/douyin/`,
        languages: { 'zh-CN': `${SITE_URL}/douyin/`, 'en': `${SITE_URL}/en/douyin/` },
    },
    openGraph: {
        title: '抖音号购买 - 千粉万粉号·蓝V企业号 | CNWePro',
        description: '高权重抖音号批发，带橱窗直播权限。USDT支付，72小时质保。',
    },
};

function getDouyinJsonLd() {
    const products = getProductsByCategory('douyin');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '抖音账号购买',
        description: '抖音账号批发：千粉号、万粉号、蓝V企业号',
        url: `${SITE_URL}/douyin/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features?.map(f => f.zh).join(', ') || '',
                url: `${SITE_URL}/douyin/`,
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

export default function DouyinPage() {
    const jsonLd = getDouyinJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="douyin" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        抖音号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNWePro 是国内领先的抖音账号交易服务商，专为直播带货、短视频矩阵运营、企业营销提供
                        高纯净度的抖音号源。我们的账号均经过养号测试，不限流、不异常。支持使用 
                        <strong>USDT加密货币</strong> 全球支付，付款后系统 <strong>24小时自动发货</strong>，
                        助您快速抢占流量红利。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        抖音账号等级与用途
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>基础白号：</strong>新注册纯净号，适合专业团队自养号、做矩阵引流或基础粉丝沉淀。</li>
                        <li><strong>千粉/万粉号：</strong>真实粉丝账号，已过风控期。达到开通商品橱窗、团购达人和直播带货的门槛要求，上手即用。</li>
                        <li><strong>蓝V企业号：</strong>官方企业认证，享有企业营销特权、搜索置顶、不限流等高阶权益。适合品牌推广。</li>
                        <li><strong>高权重老号：</strong>注册历史较长，系统判定为优质活跃用户。发布新作品初始推荐流量池大，极易上热门。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>定制需求：</strong>如果您需要特定领域的粉丝标签属性或特殊权重账号，
                            请随时联系 <a href="/contact/" className="text-blue-600 underline">客服定制</a> 获取报价。
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="douyin" lang="zh" />
        </>
    );
}
