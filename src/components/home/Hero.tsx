'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, Headset, Award, Lock, ChevronRight, Gift, X, Crown, TrendingUp, MessageSquare, Star, Truck, BadgeCheck } from 'lucide-react';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { categories } from '@/data/products';

const logoUrls: Record<string, string> = {
    wechat: 'https://play-lh.googleusercontent.com/QbSSiRcodmWx6HlezOtNu3vmZeuFqkQZQQO5Y2-Zg_jBRm-mXjhlXX5yFj8iphfqzQ',
    alipay: 'https://play-lh.googleusercontent.com/quzvssC112NXIlt4YBkclEo7f9ZnhaNtZ5fvaCs_P19X7KL71DiUqd2ysR8ZHsTaRTY',
    douyin: 'https://play-lh.googleusercontent.com/xey8dXOB53LtCR97JhDH7T-6np_sUBBE9iF7WP4Sp6T55oO28e6hic1LFTklCELw9Iw=w600-h300-pc0xffffff-pd',
    qq: 'https://play-lh.googleusercontent.com/2U-E-AGFKKEI-k6oRndaHvAsOpYZmBWm5hgpP0pVP5MTClOhk3fL3f_Sbl--9dnbUh0',
};

/* ============================================
   Danmu (弹幕) floating comments
   ============================================ */
const danmuMessages = {
    zh: [
        '账号已收到，质量很好！', '发货速度超快👍', '第三次购买了，非常靠谱',
        '客服态度很好，售后有保障', '微信号登录正常，好评！', '批量购买价格很实惠',
        '支付宝号秒发货', '抖音号粉丝数量真实', 'QQ号质量很好',
        '资金担保交易很安心', '老客户了，品质一直稳定', '推荐给朋友了',
        '第一次买就成功了', '客服回复很快', '价格比同行便宜很多',
    ],
    en: [
        'Account received, great quality!', 'Super fast delivery 👍', 'Third purchase, very reliable',
        'Customer service is excellent', 'WeChat logged in fine, A+', 'Bulk prices are amazing',
        'Alipay delivered instantly', 'Douyin followers are real', 'QQ account quality is solid',
        'Escrow payment feels safe', 'Regular customer, always consistent', 'Recommended to friends',
        'First buy was a success', 'Support replied fast', 'Prices much cheaper than competitors',
    ],
};

function DanmuLayer({ lang }: { lang: Lang }) {
    const [bullets, setBullets] = useState<{ id: number; text: string; top: number; delay: number; duration: number }[]>([]);

    useEffect(() => {
        const msgs = danmuMessages[lang];
        let counter = 0;
        const spawn = () => {
            const text = msgs[Math.floor(Math.random() * msgs.length)];
            const top = 5 + Math.random() * 80; // 5%-85% height
            const duration = 12 + Math.random() * 10; // 12-22s
            const id = counter++;
            setBullets(prev => [...prev.slice(-12), { id, text, top, delay: 0, duration }]);
        };
        spawn(); // first one immediately
        const intervalId = setInterval(spawn, 2500 + Math.random() * 2000);
        return () => clearInterval(intervalId);
    }, [lang]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5" aria-hidden="true">
            {bullets.map(b => (
                <span
                    key={b.id}
                    className="absolute whitespace-nowrap text-[11px] sm:text-xs font-medium text-slate-400/40 dark:text-slate-500/30"
                    style={{
                        top: `${b.top}%`,
                        right: '-300px',
                        animation: `danmu-scroll ${b.duration}s linear forwards`,
                    }}
                >
                    {b.text}
                </span>
            ))}
        </div>
    );
}

/* ============================================
   Live Purchase Waterfall (实时成交瀑布流)
   ============================================ */
const purchasePool = {
    zh: [
        { user: '138****9021', item: '微信实名号', time: '刚刚' },
        { user: '159****3347', item: '支付宝花呗号', time: '1分钟前' },
        { user: '186****7712', item: '抖音千粉号', time: '2分钟前' },
        { user: '177****4405', item: 'QQ太阳号', time: '3分钟前' },
        { user: '135****8890', item: '微信企业号', time: '5分钟前' },
        { user: '150****2218', item: '支付宝绑卡号', time: '6分钟前' },
        { user: '188****6633', item: '微信老号3年', time: '8分钟前' },
        { user: '166****4419', item: '抖音万粉号', time: '10分钟前' },
        { user: '139****7755', item: 'QQ靓号', time: '12分钟前' },
        { user: '155****3301', item: '支付宝企业号', time: '15分钟前' },
    ],
    en: [
        { user: '138****9021', item: 'WeChat Verified', time: 'Just now' },
        { user: '159****3347', item: 'Alipay Huabei', time: '1 min ago' },
        { user: '186****7712', item: 'Douyin 1K+', time: '2 min ago' },
        { user: '177****4405', item: 'QQ Sun Acc', time: '3 min ago' },
        { user: '135****8890', item: 'WeChat Business', time: '5 min ago' },
        { user: '150****2218', item: 'Alipay Bank-Linked', time: '6 min ago' },
        { user: '188****6633', item: 'WeChat 3yr Aged', time: '8 min ago' },
        { user: '166****4419', item: 'Douyin 10K+', time: '10 min ago' },
        { user: '139****7755', item: 'QQ Premium', time: '12 min ago' },
        { user: '155****3301', item: 'Alipay Business', time: '15 min ago' },
    ],
};

function LivePurchaseWaterfall({ lang }: { lang: Lang }) {
    const [visibleIdx, setVisibleIdx] = useState(0);
    const pool = purchasePool[lang];

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleIdx(prev => (prev + 1) % pool.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [pool.length]);

    const visible = useMemo(() => {
        const items = [];
        for (let i = 0; i < 4; i++) {
            items.push(pool[(visibleIdx + i) % pool.length]);
        }
        return items;
    }, [visibleIdx, pool]);

    return (
        <div className="hidden lg:flex flex-col gap-2 w-56 xl:w-64">
            <div className="flex items-center gap-1.5 mb-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                    {lang === 'zh' ? '实时成交' : 'Live Orders'}
                </span>
            </div>
            <div className="space-y-1.5 overflow-hidden">
                {visible.map((p, i) => (
                    <div
                        key={`${p.user}-${i}`}
                        className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-100 dark:border-slate-700/50 shadow-sm animate-fade-in-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                            {p.user.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{p.user} <span className="text-slate-400">|</span> {p.item}</p>
                            <p className="text-[9px] text-slate-400">{p.time}</p>
                        </div>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ============================================
   Floating Coupon (红包/优惠券)
   ============================================ */
function FloatingCoupon({ lang }: { lang: Lang }) {
    const [dismissed, setDismissed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 30000);
        return () => clearTimeout(timer);
    }, []);

    if (dismissed || !isVisible) return null;

    return (
        <div className="fixed right-2 sm:right-3 top-1/3 sm:top-1/3 z-40 animate-bounce-slow scale-75 origin-right sm:scale-100">
            <div className="relative bg-gradient-to-b from-[#ff4d4f] to-[#cc0000] text-white rounded-2xl p-4 pb-5 shadow-2xl shadow-red-500/30 w-[72px] cursor-pointer group sm:hover:scale-105 transition-transform"
                onClick={() => window.location.href = '#pricing'}>
                <button
                    onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/90 text-slate-600 flex items-center justify-center text-[10px] shadow hover:bg-white"
                >
                    <X className="w-3 h-3" />
                </button>
                <Gift className="w-7 h-7 mx-auto mb-1.5 drop-shadow" />
                <p className="text-center text-[10px] font-black leading-tight">
                    {lang === 'zh' ? '新人福利' : 'NEW USER'}
                </p>
                <div className="bg-yellow-400 text-red-700 rounded-lg py-1 mt-1.5 text-center">
                    <span className="text-base font-black">20U</span>
                </div>
                <p className="text-center text-[8px] mt-1 opacity-80 font-bold">
                    {lang === 'zh' ? '点击领取' : 'CLAIM'}
                </p>
                {/* Scalloped edge */}
                <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-between px-1 overflow-hidden translate-y-1.5">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full bg-white dark:bg-dark-950 -mb-1.5" />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ============================================
   Gold Seal (假一赔十)
   ============================================ */
function GoldSeal({ lang }: { lang: Lang }) {
    return (
        <div className="hidden md:flex absolute -bottom-2 -right-4 lg:right-0 w-24 h-24 lg:w-28 lg:h-28 animate-spin-very-slow z-10">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-lg shadow-amber-500/30 flex items-center justify-center border-[3px] border-yellow-300/70 relative">
                {/* Inner decorative ring */}
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-yellow-300/50" />
                <div className="text-center z-10 animate-counter-spin-very-slow">
                    <p className="text-[11px] lg:text-xs font-black text-red-800 leading-tight">
                        {lang === 'zh' ? '假一赔十' : 'FAKE=10x'}
                    </p>
                    <p className="text-[8px] lg:text-[9px] font-bold text-red-700/80 mt-0.5">
                        {lang === 'zh' ? '品质保证' : 'REFUND'}
                    </p>
                    <Award className="w-4 h-4 text-red-700 mx-auto mt-0.5" />
                </div>
            </div>
        </div>
    );
}

/* ============================================
   Main Hero Component
   ============================================ */
export function Hero({ lang }: { lang: Lang }) {
    return (
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12 sm:pb-16 lg:pt-32 lg:pb-24">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-white dark:bg-dark-950 -z-20"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 dark:bg-primary-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-100/30 dark:bg-accent-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Danmu Layer */}
            <DanmuLayer lang={lang} />

            {/* Floating Coupon */}
            <FloatingCoupon lang={lang} />

            <div className="section-container">
                <div className="flex w-full min-w-0 gap-6 xl:gap-10">

                    {/* ===== Left: Taobao-Style Category Sidebar ===== */}
                    <div className="hidden lg:flex flex-col w-48 xl:w-52 shrink-0 pt-2">
                        <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2.5">
                                <p className="text-white text-xs font-black tracking-wider flex items-center gap-1.5">
                                    <Crown className="w-3.5 h-3.5" />
                                    {lang === 'zh' ? '全部分类' : 'CATEGORIES'}
                                </p>
                            </div>
                            {categories.map((cat, i) => (
                                <Link
                                    key={cat.id}
                                    href={getLocalizedPath(cat.href, lang)}
                                    className="flex items-center gap-2.5 px-4 py-3 hover:bg-red-50/60 dark:hover:bg-red-900/10 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 group"
                                >
                                    <div className="w-7 h-7 rounded-lg shadow-sm overflow-hidden bg-white border border-slate-100 dark:border-slate-800 shrink-0">
                                        <Image
                                            src={logoUrls[cat.icon as keyof typeof logoUrls]}
                                            alt={cat.name.en}
                                            width={28}
                                            height={28}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {cat.name[lang]}
                                        </p>
                                    </div>
                                    {i < 2 && (
                                        <span className="text-[8px] font-black bg-red-500 text-white rounded px-1 py-0.5">HOT</span>
                                    )}
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-red-400 transition-colors" />
                                </Link>
                            ))}
                            {/* VIP Bulk Banner inside sidebar */}
                            <div className="mx-3 my-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border border-amber-200/60 dark:border-amber-800/30 rounded-xl p-2.5">
                                <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {lang === 'zh' ? '批量VIP: 50+享7折' : 'VIP: 50+ = 30% OFF'}
                                </p>
                                <p className="text-[9px] text-amber-600/70 dark:text-amber-500/60 mt-0.5">
                                    {lang === 'zh' ? '联系专属客服获取最优报价' : 'Contact VIP agent for best rates'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===== Center: Main Hero Content ===== */}
                    <div className="flex-1 min-w-0 w-full flex flex-col items-center text-center relative">
                        {/* Marquee Announcement */}
                        <div className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-900/30 rounded-full py-1 sm:py-1.5 px-2 sm:px-3 flex items-center gap-2 sm:gap-3 overflow-hidden shadow-inner animate-fade-in-up">
                            <span className="bg-gradient-to-r from-[#ff4d4f] to-[#ff2a2d] text-white text-[9px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-full shrink-0 shadow-sm pr-2 sm:pr-3 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-current" />
                                <span className="hidden sm:inline">{lang === 'zh' ? '最新限时福利' : 'LATEST DEAL'}</span>
                                <span className="sm:hidden">{lang === 'zh' ? '福利' : 'DEAL'}</span>
                            </span>
                            <div className="flex-1 min-w-0 relative h-5 overflow-hidden text-[10px] sm:text-sm text-red-600 dark:text-red-400 font-bold whitespace-nowrap flex items-center">
                                <div className="animate-[pulse_3s_ease-in-out_infinite]">
                                    {lang === 'zh'
                                        ? '🔥 特惠狂欢开启！首单限量直降20U，库存有限，先到先得！平台全线支持担保交易，购买更放心！'
                                        : '🔥 Shopping Festival! Flash sale running: Save up to 20U! Escrow protected payments enabled!'}
                                </div>
                            </div>
                        </div>

                        <h1 className="w-full text-[26px] leading-[1.2] sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-6 animate-fade-in-up whitespace-normal break-words sm:px-2" style={{ animationDelay: '100ms' }}>
                            {t('hero.title.line1', lang)}{' '}
                            <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-600 inline-block">
                                {t('hero.title.highlight', lang)}
                            </span>
                        </h1>

                        <p className="w-full max-w-[100vw] text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed px-4 animate-fade-in-up md:text-balance break-words" style={{ animationDelay: '200ms' }}>
                            {t('hero.subtitle', lang)}
                        </p>

                        {/* CTA Buttons with Bounce on Primary */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link href="#pricing" className="hero-cta-bounce text-center whitespace-normal break-words w-full sm:w-auto px-4 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-black rounded-2xl transition-all duration-300 bg-gradient-to-r from-[#ff4d4f] to-[#ff2a2d] hover:from-[#ff2a2d] hover:to-[#cc0000] text-white shadow-[0_8px_20px_rgba(255,42,45,0.3)] hover:shadow-[0_12px_30px_rgba(255,42,45,0.45)] active:scale-95 border-b-4 border-[#cc0000] flex justify-center items-center relative overflow-hidden">
                                <span className="relative z-10">{t('hero.cta.primary', lang)}</span>
                                {/* Shine sweep effect */}
                                <span className="absolute inset-0 hero-shine" />
                            </Link>
                            <a
                                href={process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_USERNAME}` : 'https://t.me/Minsheng0'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline w-full sm:w-auto px-4 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-dark-900/50 backdrop-blur hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                {t('hero.cta.secondary', lang)}
                            </a>
                        </div>

                        {/* Dense Trust Cluster under CTA */}
                        <div className="w-full max-w-[100vw] flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-5 px-2 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded">
                                <ShieldCheck className="w-3.5 h-3.5" /> {lang === 'zh' ? '官方正品保护' : 'Official Verified'}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded">
                                <Zap className="w-3.5 h-3.5" /> {lang === 'zh' ? '极速发货' : 'Instant Delivery'}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded">
                                <Headset className="w-3.5 h-3.5" /> {lang === 'zh' ? '售后无忧' : '24/7 Support'}
                            </span>
                        </div>

                        {/* ===== Journey Stepper (交易流程) ===== */}
                        <div className="w-full max-w-xl mx-auto mt-8 sm:mt-10 px-2 sm:px-0 animate-fade-in-up flex min-w-0" style={{ animationDelay: '400ms' }}>
                            <div className="flex-1 min-w-0 flex items-center justify-between bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-x-auto scrolbar-hide">
                                {[
                                    { icon: <Star className="w-4 h-4" />, label: lang === 'zh' ? '选择账号' : 'Select', num: '1' },
                                    { icon: <Lock className="w-4 h-4" />, label: lang === 'zh' ? 'USDT支付' : 'Pay USDT', num: '2' },
                                    { icon: <Truck className="w-4 h-4" />, label: lang === 'zh' ? '自动发货' : 'Delivery', num: '3' },
                                    { icon: <ShieldCheck className="w-4 h-4" />, label: lang === 'zh' ? '验证使用' : 'Verify', num: '4' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                                {step.num}
                                            </div>
                                            <div className="text-left hidden text-[9px] sm:text-[10px] md:block">
                                                <p className="font-bold text-slate-700 dark:text-slate-300 leading-none whitespace-nowrap">{step.label}</p>
                                            </div>
                                        </div>
                                        {i < 3 && (
                                            <div className="flex-shrink-0 w-3 sm:w-6 lg:w-12 h-[1px] bg-gradient-to-r from-red-300 to-orange-300 dark:from-red-800 dark:to-orange-800 mx-1 sm:mx-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ===== Trust Matrix (信任矩阵) ===== */}
                        <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 mt-8 max-w-lg px-2 sm:px-0 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
                            {[
                                { icon: <Lock className="w-4 h-4" />, label: 'SSL', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' },
                                { icon: <ShieldCheck className="w-4 h-4" />, label: 'TRC-20', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/30' },
                                { icon: <Award className="w-4 h-4" />, label: lang === 'zh' ? '担保' : 'Escrow', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30' },
                                { icon: <Zap className="w-4 h-4" />, label: lang === 'zh' ? '无痕' : 'Clean', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800/30' },
                                { icon: <MessageSquare className="w-4 h-4" />, label: lang === 'zh' ? '真实' : 'Legit', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/30' },
                                { icon: <BadgeCheck className="w-4 h-4" />, label: lang === 'zh' ? '正品' : 'Auth', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400 border-teal-100 dark:border-teal-800/30' },
                            ].map((badge, i) => (
                                <div key={i} className={`flex flex-col items-center gap-1 py-2 px-3 sm:px-1 rounded-xl border ${badge.color} transition-transform hover:scale-105 shrink-0`}>
                                    {badge.icon}
                                    <span className="text-[9px] font-black">{badge.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats Bar */}
                        <div className="w-full grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-12 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 dark:border-slate-800/50 px-2 sm:px-0 animate-fade-in-up min-w-0" style={{ animationDelay: '500ms' }}>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                    <AnimatedCounter end={50} suffix="K+" duration={2500} />
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">{t('hero.stat.orders', lang)}</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                                    <AnimatedCounter end={10} suffix="K+" duration={2500} />
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">{t('hero.stat.customers', lang)}</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">30 min</p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">{t('hero.stat.delivery', lang)}</p>
                            </div>
                            <div>
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">24/7</p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">{t('hero.stat.support', lang)}</p>
                            </div>
                        </div>

                        {/* Gold Seal positioned relative to center content */}
                        <GoldSeal lang={lang} />
                    </div>

                    {/* ===== Right: Live Purchase Waterfall ===== */}
                    <LivePurchaseWaterfall lang={lang} />
                </div>
            </div>
        </section>
    );
}
