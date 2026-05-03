import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'QQ号购买 - 太阳号·皇冠号·靓号特卖',
    description: '腾讯QQ号精选平台：出售高等级太阳号、星月老号、皇冠号、靓号及白号。100%防找回包售后，USDT匿名交易，一手资源批发价。',
    keywords: 'QQ号购买, 买QQ号, QQ买卖, 太阳号出售, QQ皇冠号, QQ靓号交易, QQ老号, QQ白号批发',
    alternates: {
        canonical: `${SITE_URL}/qq/`,
        languages: { 'zh-CN': `${SITE_URL}/qq/`, 'en': `${SITE_URL}/en/qq/` },
    },
    openGraph: {
        title: 'QQ高等级号·靓号现货交易 | CNWePro',
        description: '严选老号防找回，太阳号、靓号极速发货。支持USDT加密支付。',
    },
};

function getQQJsonLd() {
    const products = getProductsByCategory('qq');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'QQ账号购买',
        description: 'QQ账号批发：太阳号、老号、靓号',
        url: `${SITE_URL}/qq/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features?.map(f => f.zh).join(', ') || '',
                url: `${SITE_URL}/qq/`,
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

export default function QQPage() {
    const jsonLd = getQQJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="qq" lang="zh" />
            
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        QQ账号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNWePro 是全网信誉极佳的QQ号直供平台，常年储备各等级高防封QQ账号。
                        无论您是用于社群引流营销、游戏防沉迷绑定、还是追求极致稀有的短位靓号，
                        我们的库存都能满足。100%纯净IP注册或长期挂机活号，承诺 <strong>绝不拉回绝不二次销售</strong>。
                        5分钟系统自动发货，保障您的业务平稳不中断。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        QQ账号等级说明
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>白号小白号：</strong>注册时间短，无等级基础。适合不看重等级的批量群发脚本或小号防爆使用。</li>
                        <li><strong>太阳号（16级+）：</strong>活跃天数达标的高权账号。可以自信创建大群、上传自定义头像，抗封禁能力极强，是商用主流选择。</li>
                        <li><strong>月亮号（4-15级）：</strong>性价比之选，具备一定挂机历史，比白号安全，价格适中。</li>
                        <li><strong>皇冠号及靓号：</strong>拥有皇冠标志（64级+）的超级老号，或顺子号、生日号等特殊短位号。极具排面和商业辨识度，限量供应。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>稀有靓号预定：</strong>短位ID（6/7位）或特级密码号流转极快，
                            如有收购意向，建议添加 <a href="/contact/" className="text-blue-600 underline">客服Telegram</a> 进入内部群获取首发名录。
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="qq" lang="zh" />
        </>
    );
}
