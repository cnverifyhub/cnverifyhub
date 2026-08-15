import React from 'react';
import { getProductsByCategory, getCategoryById } from '@/data/products';
import NextImage from 'next/image';
import { PricingCard } from '@/components/ui/PricingCard';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { CategoryContentBlock, type CategoryContentSection } from '@/components/category/CategoryContentBlock';
import { categoryFaqMap, getCategoryFaqs } from '@/data/category-faqs';
import { faqData } from '@/data/faq';
import { t, type Lang } from '@/lib/i18n';
import type { CategoryId, FAQItem } from '@/types';
import { Shield, ShieldCheck, CheckCircle2, Zap, Clock, Info, MessageCircle, Wallet, Music, Tv2, ShoppingBag, Store, Heart, Camera, Package, Landmark } from 'lucide-react';
import { MobileStickyBuyBar } from '@/components/layout/MobileStickyBuyBar';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, VerificationIcon, FintechIcon } from '@/components/ui/BrandIcons';

const iconMap: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
    bundle: Package,
    verification: VerificationIcon,
    trading: FintechIcon
};

const iconColors: Record<string, string> = {
    wechat: "text-emerald-500",
    alipay: "text-blue-500",
    douyin: "text-slate-800 dark:text-white",
    qq: "text-sky-500",
    xianyu: "text-amber-500",
    taobao: "text-orange-500",
    xiaohongshu: "text-red-500",
    bundle: "text-purple-500",
    verification: "text-indigo-500",
    trading: "text-amber-500"
};

const watermarkMap: Record<string, React.ElementType> = {
    wechat: MessageCircle,
    alipay: Wallet,
    douyin: Music,
    qq: Tv2,
    xianyu: ShoppingBag,
    taobao: Store,
    xiaohongshu: Camera,
    bundle: Package,
    verification: ShieldCheck,
    trading: Landmark
};

interface CategoryPageTemplateProps {
    categoryId: CategoryId;
    lang: Lang;
}

export function CategoryPageTemplate({ categoryId, lang }: CategoryPageTemplateProps) {
    const category = getCategoryById(categoryId);
    const products = getProductsByCategory(categoryId);

    if (!category) return null;

    const isZh = lang === 'zh';
    const WatermarkIcon = watermarkMap[category.id] || MessageCircle;
    const rawFaqs = getCategoryFaqs(category.id, lang);

    // Format category-specific FAQs for FAQAccordion
    const categoryFaqData = categoryFaqMap[category.id] || categoryFaqMap.wechat;
    const formattedFaqItems: FAQItem[] = (categoryFaqData.zh || []).map((zhFaq, idx) => ({
        id: `faq-${category.id}-${idx}`,
        category: category.id,
        question: {
            zh: zhFaq.question,
            en: categoryFaqData.en[idx]?.question || zhFaq.question,
        },
        answer: {
            zh: zhFaq.answer,
            en: categoryFaqData.en[idx]?.answer || zhFaq.answer,
        },
    }));

    // Generate descriptive guide sections based on category
    const guideSections: CategoryContentSection[] = [
        {
            title: isZh ? '账号交付与安全防封 SOP' : 'Account Delivery & Anti-Ban Warming SOP',
            content: isZh
                ? '所有账号交付均包含完整初始凭据与解密密钥。新设备登录后建议在纯净固定的网络环境下静置 24-48 小时，进行自然基础操作，切勿立即进行频繁批量操作或大额转账。'
                : 'All account deliveries include full initial credentials and security keys. After first login, keep the session on a clean residential IP for 24-48 hours before conducting high-frequency operations.',
            listItems: isZh
                ? [
                    '使用干净的静态独享住宅代理，避免公共免费 VPN',
                    '登录后前 3 天保持正常浏览与低频交互',
                    '稳定 3-5 天后前往安全中心换绑手机与设置 2FA',
                ]
                : [
                    'Use clean static residential proxies; avoid shared datacenter VPNs',
                    'Maintain regular, low-frequency browsing for the first 3 days',
                    'Safely update phone bindings and enable 2FA after 3-5 days of stability',
                ],
            callout: {
                type: 'success',
                text: isZh
                    ? '🛡️ 72小时全额换号质保：若在质保期内遭遇非人为违规引起的登录异常或封禁，平台免费更换全新账号。'
                    : '🛡️ 72-Hour Full Warranty: If you encounter login issues not caused by user violation, we provide a free replacement.',
            },
        },
        {
            title: isZh ? 'USDT 担保交易与秒级发卡机制' : 'USDT Escrow & Instant Automated Dispatch',
            content: isZh
                ? 'CNVerifyHub 采用智能链上监听与自动化卡密解密系统。当 TRC20/BEP20 网络确认区块后，系统在 5 分钟内自动派发账号明细，并在控制台与预留邮箱同步生成凭证档案。'
                : 'CNVerifyHub utilizes real-time blockchain transaction listeners and automated credential decryption. Upon block confirmation, your credentials are automatically dispatched in < 5 minutes.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pb-24">
            {/* Category Header */}
            <section className="bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-14 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 bottom-0 bg-white dark:bg-dark-900 pointer-events-none z-0"></div>
                {/* Right Side Image Watermark */}
                <div className="absolute top-0 right-0 bottom-0 w-[55%] hidden sm:block pointer-events-none z-0 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-5 dark:opacity-10 skew-x-[-12deg] origin-top translate-x-16 rounded-l-3xl`}></div>
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[400px] md:h-[400px] opacity-[0.06] dark:opacity-[0.15] mix-blend-multiply dark:mix-blend-screen pointer-events-none select-none z-10 rotate-12 transition-transform duration-1000 saturate-0">
                        {(() => {
                            const BrandIcon = iconMap[category.id] || MessageCircle;
                            return <BrandIcon className="w-full h-full" />;
                        })()}
                    </div>
                </div>

                <div className="section-container relative z-10">
                    <div className="max-w-4xl flex items-center gap-6 md:gap-8">
                        {/* App Icon Container - Matches homepage style */}
                        <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shrink-0 transition-transform duration-500 hover:scale-110 rounded-2xl overflow-hidden">
                            {(() => {
                                const BrandIcon = iconMap[category.id] || WeChatIcon;
                                return <BrandIcon className="w-full h-full" />;
                            })()}
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                                {category.name[lang]}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 max-w-xl font-medium">
                                {category.description[lang]}
                            </p>

                            <div className="flex flex-wrap gap-2.5 text-xs md:text-sm mb-6">
                                <div className="flex items-center gap-1 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-md font-bold shadow-sm">
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    {lang === 'zh' ? '现货秒发' : 'Instant Delivery'}
                                </div>
                                <div className="flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md font-bold shadow-sm">
                                    <Shield className="w-3.5 h-3.5" />
                                    {lang === 'zh' ? '售后质保' : 'Warranty Included'}
                                </div>
                                <div className="flex items-center gap-1 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold shadow-sm">
                                    <Clock className="w-3.5 h-3.5" />
                                    {lang === 'zh' ? '7*24h 在线' : '24/7 Support'}
                                </div>
                            </div>

                            {/* Premium Trust Banner */}
                            <div className="inline-flex flex-wrap items-center gap-3 md:gap-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30">
                                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm font-bold">
                                    <ShieldCheck className="w-4 h-4 fill-current text-white dark:text-red-900 stroke-red-600 dark:stroke-red-400" />
                                    {lang === 'zh' ? '官方平台担保交易' : 'Platform Guaranteed'}
                                </div>
                                <div className="w-1 h-1 rounded-full bg-red-300 dark:bg-red-700 hidden sm:block"></div>
                                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 text-sm font-bold">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {lang === 'zh' ? '找回包赔 · 安全无忧' : 'Full Recovery Compensation'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="section-container mt-12 mb-16">
                <div className="flex items-center gap-2 mb-8">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white font-bold`}>
                        {products.length}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {lang === 'zh' ? '选择账号套餐' : 'Select Account Plan'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6">
                    {products.map((product) => (
                        <PricingCard key={product.id} product={product} lang={lang} />
                    ))}
                </div>
            </section>

            {/* Category Content & SEO Guide Block */}
            <CategoryContentBlock
                categoryId={category.id}
                lang={lang}
                h2Title={isZh ? `${category.name.zh} 购买与使用指南` : `${category.name.en} Buying & Account Guide`}
                leadParagraph={
                    isZh
                        ? `CNVerifyHub 为全球用户提供专业、高权重的 ${category.name.zh} 现货直供。平台采用 USDT 担保交易体系与全自动发货引擎，5 分钟内完成卡密派发，并享受全套 72 小时无忧售后保障。`
                        : `CNVerifyHub provides verified, aged, and KYC-compliant ${category.name.en} accounts with instant crypto delivery. Backed by an escrow system and a 72-hour warranty.`
                }
                sections={guideSections}
                faqItems={rawFaqs}
            />

            {/* Info Notice */}
            <section className="section-container my-16">
                <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-2xl p-6 md:p-8 flex gap-4 md:items-center flex-col md:flex-row">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                        <Info className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            {lang === 'zh' ? '批量采购注意事项' : 'Bulk Purchase Notice'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {lang === 'zh'
                                ? '如需一次性采购超过200个账号，请直接通过底部悬浮按钮联系我们在 Telegram 上的专属批发客服，以获取最低出厂折扣及定制发货安排。'
                                : 'If you need to purchase more than 200 accounts at once, please contact our wholesale support directly via Telegram using the floating button for maximum factory discounts and custom delivery.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Category-Specific FAQ */}
            <section className="section-container max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {lang === 'zh' ? `${category.name.zh} 常见问题解答` : `${category.name.en} Frequently Asked Questions`}
                    </h2>
                </div>
                <FAQAccordion items={formattedFaqItems} lang={lang} />
            </section>

            {/* Quick Buy Mobile Bar (selects first product by default) */}
            {
                products.length > 0 && (
                    <MobileStickyBuyBar
                        productId={products[0].id}
                        lang={lang}
                        price={products[0].price.single}
                        isOutOfStock={products[0].stockCount === 0}
                    />
                )
            }
        </div>
    );
}
