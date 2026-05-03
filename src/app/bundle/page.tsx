import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '组合套装账号 - 支付宝+闲鱼/淘宝/1688实名组合',
    description: 'CNWePro 多平台组合账号套装：支付宝+闲鱼、支付宝+淘宝、微信+京东等。已预先绑定，到手即用，一站式解决关联验证难题。',
    keywords: '支付宝闲鱼组合号, 淘宝实名套装, 1688批发账号, 微信京东组合',
    alternates: {
        canonical: `${SITE_URL}/bundle/`,
        languages: { 'zh-CN': `${SITE_URL}/bundle/`, 'en': `${SITE_URL}/en/bundle/` },
    },
};

export default function BundlePage() {
    return (
        <>
            <CategoryPageTemplate categoryId="bundle" lang="zh" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        多平台组合套装说明
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        为了解决跨平台登录及支付关联的复杂验证问题，我们推出了精心调试的组合套装。
                        这些账号在注册阶段即完成了跨平台绑定与实名同步，确保您在不同应用间切换时无缝衔接。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        为什么选择套装？
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>免去关联麻烦：</strong>支付宝与闲鱼、淘宝、1688已预先绑定，无需二次操作。</li>
                        <li><strong>权重更高：</strong>组合账号具有更真实的社交与电商使用链路，权重显著高于单号。</li>
                        <li><strong>性价比：</strong>相比单独购买多个账号，套装价格更具优势。</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="bundle" lang="zh" />
        </>
    );
}
