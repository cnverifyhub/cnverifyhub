import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { faqData } from '@/data/faq';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: '微信号购买 - 实名老号·绑卡号·企业号现货',
    description: '微信账号批发平台：白号、实名号、绑卡号、老号、企业微信号现货秒发。高权重防封号，USDT支付，72小时售后质保。',
    keywords: '微信号购买, 买微信号, 微信账号出售, 微信老号, 微信实名号, 微信绑卡号, 微信企业号',
    alternates: {
        canonical: `${SITE_URL}/wechat/`,
        languages: { 'zh-CN': `${SITE_URL}/wechat/`, 'en': `${SITE_URL}/en/wechat/` },
    },
    openGraph: {
        title: '微信号购买 - 实名·绑卡·企业号现货 | CNVerifyHub',
        description: '微信白号¥28起 | 实名号¥38起 | 绑卡号¥58起 | USDT支付秒发货',
    },
};

// Product JSON-LD for Search Engines
function getWeChatJsonLd() {
    const products = getProductsByCategory('wechat');
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '微信号购买',
        description: '微信账号批发：白号、实名号、绑卡号、老号、企业微信号',
        url: `${SITE_URL}/wechat/`,
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Product',
                name: p.tierName.zh,
                description: p.features?.map(f => f.zh).join(', ') || '',
                url: `${SITE_URL}/wechat/`,
                brand: { '@type': 'Brand', name: 'CNVerifyHub' },
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: p.price.single,
                    availability: 'https://schema.org/InStock',
                    seller: { '@type': 'Organization', name: 'CNVerifyHub' },
                },
            },
        })),
    };
}

export default function WeChatPage() {
    const jsonLd = getWeChatJsonLd();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryPageTemplate categoryId="wechat" lang="zh" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        微信号购买指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNVerifyHub 是专业的微信号批发平台，提供从白号到高权重实名老号的全品类微信账号。
                        我们所有微信号均经过严格质量筛选，确保登录稳定、权重达标。支持
                        <strong>USDT (TRC20)</strong> 匿名支付，付款后
                        <strong>5分钟内自动发货</strong>，所有账号享受 <strong>72小时售后质保</strong>。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        微信账号类型说明
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>微信白号：</strong>新注册的空白微信号，适合批量营销、群发、养号等用途。价格最低，适合量大需求。</li>
                        <li><strong>微信实名号：</strong>已完成实名认证的微信号，权重较高，不易被封。适合日常运营和客户沟通。</li>
                        <li><strong>微信绑卡号：</strong>已绑定银行卡的实名微信号，可使用微信支付、红包等功能，权重最高。</li>
                        <li><strong>微信老号：</strong>注册时间超过1年的微信号，账号稳定性极强，适合长期使用。</li>
                        <li><strong>企业微信号：</strong>企业认证微信号，适合商业推广、客户管理等专业用途。</li>
                    </ul>

                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            💡 <strong>批量优惠：</strong>购买10个以上微信号可享受阶梯折扣。200个以上请联系客服获取渠道特价。
                            查看 <a href="/pricing/" className="text-blue-600 underline">完整价格表</a> |
                            更多问题请访问 <a href="/faq/" className="text-blue-600 underline">常见问题</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Categories */}
            <RelatedCategories currentCategory="wechat" lang="zh" />
        </>
    );
}
