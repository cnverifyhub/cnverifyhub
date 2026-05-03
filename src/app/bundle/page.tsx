import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory, getLowestPrice } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { calculateYuan, formatYuan } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '超级组合套餐 - 支付宝+闲鱼/淘宝/1688 全套账号现货',
    description: 'CNWePro 独家组合套餐：支付宝+闲鱼、支付宝+淘宝、支付宝+1688等全实名账号组合。多号联通更稳定，出海电商/个人代购首选，USDT支付秒发货。',
    keywords: '支付宝闲鱼套餐, 支付宝淘宝组合, 1688账号购买, 京东账号, 电商账号包, 超级组合套餐',
    alternates: {
        canonical: `${SITE_URL}/bundle/`,
        languages: { 'zh-CN': `${SITE_URL}/bundle/`, 'en': `${SITE_URL}/en/bundle/` },
    },
    openGraph: {
        title: '全平台组合套餐 - 支付宝/闲鱼/淘宝/JD现货 | CNWePro',
        description: `超级组合套餐${formatYuan(getLowestPrice('bundle'))}起 | 多号联通·稳定防封 | USDT支付`,
    },
};

function getBundleJsonLd() {
    const products = getProductsByCategory('bundle');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '组合套餐购买',
        description: '多平台账号组合套餐：支付宝、闲鱼、淘宝、1688、京东',
        url: `${SITE_URL}/bundle/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features.map(f => f.zh).join(', '),
                url: `${SITE_URL}/bundle/`,
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

export default function BundlePage() {
    const jsonLd = getBundleJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="bundle" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        组合套餐购买优势
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        为了降低用户在多平台切换时的封号风险，CNWePro 推出了 **“全链路直通车”** 组合套餐。
                        这些套餐包含相互关联且已经过联调测试的账号（如支付宝+闲鱼），确保您在支付、收款、发布商品等
                        各环节均能流畅运行。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        为什么选择组合套餐？
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>深度绑定：</strong>支付宝与闲鱼/淘宝已完成实名信息同步，无需再次手动核验。</li>
                        <li><strong>权重叠加：</strong>多平台活跃信息互补，账号抗封等级远高于单一购买。</li>
                        <li><strong>价格更优：</strong>相比单独购买多个账号，套餐价格最高可省 20%。</li>
                        <li><strong>开盒即用：</strong>所有环境已配置完成，适合新手或追求效率的专业玩家。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                        <p className="text-sm text-purple-800 dark:text-purple-300">
                            💡 <strong>专业版需求：</strong>如果您需要定制包含 5 个以上平台的特级全家桶（如加上银行卡实名），
                            请联系 <a href="/contact/" className="text-purple-600 underline">VIP 客服</a> 进行私密定制。
                        </p>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="bundle" lang="zh" />
        </>
    );
}
