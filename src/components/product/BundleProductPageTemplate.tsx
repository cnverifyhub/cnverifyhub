'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProductById } from '@/data/products';
import { t, type Lang } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    ChevronLeft, ShieldCheck, Zap, Clock, CheckCircle2, AlertCircle, ShoppingCart, 
    Smartphone, Link as LinkIcon, Lock, ArrowRight, XCircle
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { AlipayIcon, XianyuIcon, DouyinIcon, TaobaoIcon, WeChatIcon, BundleIcon, FullSuiteIcon, WechatJdIcon } from '@/components/ui/BrandIcons';

const ICON_MAP: Record<string, React.ElementType> = {
    alipay: AlipayIcon,
    xianyu: XianyuIcon,
    douyin: DouyinIcon,
    taobao: TaobaoIcon,
    wechat: WeChatIcon,
    jd:     WechatJdIcon,
    bundle: BundleIcon,
    suite:  FullSuiteIcon
};

const COLOR_MAP: Record<string, string> = {
    alipay: 'blue',
    xianyu: 'amber',
    douyin: 'slate',
    taobao: 'orange',
    wechat: 'emerald',
    jd:     'red',
    bundle: 'purple',
    suite:  'indigo'
};

interface BundleProductPageTemplateProps {
    productId: string;
    lang: Lang;
}

export function BundleProductPageTemplate({ productId, lang }: BundleProductPageTemplateProps) {
    const router = useRouter();
    const addToCart = useCartStore((state) => state.addItem);
    const [isClient, setIsClient] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleScroll = () => setScrolled(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const product = getProductById(productId);

    if (!product || product.category !== 'bundle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-900">
                <div className="text-center p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                        {lang === 'zh' ? '组合商品未找到' : 'Bundle Product Not Found'}
                    </h1>
                    <button onClick={() => router.push(`/${lang === 'en' ? 'en/' : ''}`)} className="text-blue-500 font-medium">
                        {lang === 'zh' ? '返回首页' : 'Return Home'}
                    </button>
                </div>
            </div>
        );
    }

    const { tierName, description, price, bundleContents, whyBundle, useCases, loginMethod, requirements, risks } = product;
    const saveAmount = price.originalPrice ? Math.max(0, price.originalPrice.single - price.single).toFixed(2) : '0';

    const handleBuyNow = () => {
        addToCart(product.id, 1);
        router.push(`/${lang === 'en' ? 'en/' : ''}checkout`);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-900 pb-32">
            {/* Sticky Mobile CTA */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: scrolled ? 0 : 100 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/90 dark:bg-dark-800/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:hidden"
            >
                <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-[#FF0036] leading-none">
                            {formatYuan(price.single)}
                        </span>
                        {price.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                                {formatYuan(price.originalPrice.single)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm py-3.5 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-1"
                    >
                        {lang === 'zh' ? '立即抢购组合' : 'Buy Bundle Now'}
                    </button>
                </div>
            </motion.div>

            {/* Back Nav */}
            <nav className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <ChevronLeft className="w-5 h-5" />
                        {lang === 'zh' ? '返回' : 'Back'}
                    </button>
                    <span className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                        {lang === 'zh' ? '特惠组合套餐' : 'Special Bundle'}
                    </span>
                    <div className="w-16" />
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
                {/* Hero Section */}
                <section className="bg-white dark:bg-dark-800 rounded-3xl p-6 md:p-8 shadow-sm border border-purple-100 dark:border-purple-900/30 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        {/* Title & Price */}
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold mb-2 shadow-sm">
                                <Zap className="w-3.5 h-3.5 fill-white" />
                                {lang === 'zh' ? '一站式解决关联难题' : 'One-Stop Verification Solution'}
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                {tierName[lang]}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base">
                                {description[lang]}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> {lang === 'zh' ? '已预先绑定' : 'Pre-linked'}
                                </span>
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1">
                                    <Smartphone className="w-3.5 h-3.5" /> {lang === 'zh' ? '免中国手机号' : 'No China Phone'}
                                </span>
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="w-full md:w-80 bg-slate-50 dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shrink-0">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm text-slate-500 mb-1">{lang === 'zh' ? '组合特惠价' : 'Bundle Price'}</div>
                                    <div className="text-4xl font-black text-[#FF0036] tracking-tighter">
                                        {formatYuan(price.single)}
                                    </div>
                                    {price.originalPrice && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-slate-400 line-through">
                                                {formatYuan(price.originalPrice.single)}
                                            </span>
                                            <span className="text-xs font-bold text-white bg-[#FF0036] px-1.5 py-0.5 rounded">
                                                {lang === 'zh' ? `立省 ¥${saveAmount}` : `Save ¥${saveAmount}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleBuyNow} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                                <ShoppingCart className="w-5 h-5" />
                                {lang === 'zh' ? '立即购买该组合' : 'Purchase Bundle'}
                            </button>
                            
                            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5-15 分钟发货</span>
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 7天质保</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What's Included */}
                <section>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        {lang === 'zh' ? '组合内包含什么？' : "What's Included?"}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {bundleContents?.map((content, idx) => {
                            const iconKey = content.name[lang].toLowerCase().includes('alipay') || content.name[lang].toLowerCase().includes('支付宝') ? 'alipay' :
                                           content.name[lang].toLowerCase().includes('xianyu') || content.name[lang].toLowerCase().includes('闲鱼') ? 'xianyu' :
                                           content.name[lang].toLowerCase().includes('wechat') || content.name[lang].toLowerCase().includes('微信') ? 'wechat' :
                                           content.name[lang].toLowerCase().includes('taobao') || content.name[lang].toLowerCase().includes('淘宝') ? 'taobao' :
                                           content.name[lang].toLowerCase().includes('douyin') || content.name[lang].toLowerCase().includes('抖音') ? 'douyin' :
                                           content.name[lang].toLowerCase().includes('jd')     || content.name[lang].toLowerCase().includes('京东') ? 'jd' : 'bundle';
                            
                            const Icon = ICON_MAP[iconKey] || BundleIcon;
                            const colorKey = COLOR_MAP[iconKey] || 'slate';
                            
                            interface ColorConfig {
                                border: string;
                                bg: string;
                                text: string;
                                dot: string;
                                shadow: string;
                            }

                            const colorConfigs: Record<string, ColorConfig> = {
                                blue: {
                                    border: 'border-blue-100 dark:border-blue-900/30',
                                    bg: 'bg-blue-50/50 dark:bg-blue-900/10',
                                    text: 'text-blue-600 dark:text-blue-400',
                                    dot: 'bg-blue-500/10',
                                    shadow: 'shadow-blue-500/5'
                                },
                                amber: {
                                    border: 'border-amber-100 dark:border-amber-900/30',
                                    bg: 'bg-amber-50/50 dark:bg-amber-900/10',
                                    text: 'text-amber-500',
                                    dot: 'bg-amber-500/10',
                                    shadow: 'shadow-amber-500/5'
                                },
                                emerald: {
                                    border: 'border-emerald-100 dark:border-emerald-900/30',
                                    bg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
                                    text: 'text-emerald-600 dark:text-emerald-400',
                                    dot: 'bg-emerald-500/10',
                                    shadow: 'shadow-emerald-500/5'
                                },
                                orange: {
                                    border: 'border-orange-100 dark:border-orange-900/30',
                                    bg: 'bg-orange-50/50 dark:bg-orange-900/10',
                                    text: 'text-orange-500',
                                    dot: 'bg-orange-500/10',
                                    shadow: 'shadow-orange-500/5'
                                },
                                slate: {
                                    border: 'border-slate-100 dark:border-slate-900/30',
                                    bg: 'bg-slate-50/50 dark:bg-slate-900/10',
                                    text: 'text-slate-600 dark:text-slate-400',
                                    dot: 'bg-slate-500/10',
                                    shadow: 'shadow-slate-500/5'
                                },
                                red: {
                                    border: 'border-red-100 dark:border-red-900/30',
                                    bg: 'bg-red-50/50 dark:bg-red-900/10',
                                    text: 'text-red-500',
                                    dot: 'bg-red-500/10',
                                    shadow: 'shadow-red-500/5'
                                },
                                purple: {
                                    border: 'border-purple-100 dark:border-purple-900/30',
                                    bg: 'bg-purple-50/50 dark:bg-purple-900/10',
                                    text: 'text-purple-600 dark:text-purple-400',
                                    dot: 'bg-purple-500/10',
                                    shadow: 'shadow-purple-500/5'
                                },
                                indigo: {
                                    border: 'border-indigo-100 dark:border-indigo-900/30',
                                    bg: 'bg-indigo-50/50 dark:bg-indigo-900/10',
                                    text: 'text-indigo-600 dark:text-indigo-400',
                                    dot: 'bg-indigo-500/10',
                                    shadow: 'shadow-indigo-500/5'
                                }
                            };

                            const colors = colorConfigs[colorKey] || colorConfigs.slate;

                            return (
                                <div key={idx} className={`bg-white dark:bg-dark-800 p-5 rounded-2xl border-2 relative overflow-hidden ${colors.border}`}>
                                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none opacity-10 ${colors.bg}`}></div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.bg} ${colors.text}`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    {idx > 0 && (
                                        <div className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3" /> {lang === 'zh' ? '已关联' : 'Pre-linked'}
                                        </div>
                                    )}
                                    <h3 className={`text-lg font-bold mb-2 ${colors.text}`}>{idx + 1}. {content.name[lang]}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 h-10">
                                        {content.description?.[lang] || (lang === 'zh' ? '已实名认证，可正常收付款，即开即用。' : 'Real-name verified. Ready for immediate use.')}
                                    </p>
                                    <ul className="space-y-2">
                                        {content.includes.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                                <CheckCircle2 className={`w-4 h-4 shrink-0 ${colors.text}`} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Why This Bundle / Comparison */}
                <section className="bg-slate-50 dark:bg-dark-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {lang === 'zh' ? '为什么需要这个组合？' : 'Why Buy This Bundle?'}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                        {whyBundle?.[lang]}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-red-100 dark:border-red-900/20">
                            <h4 className="font-bold text-red-500 flex items-center gap-2 mb-3">
                                <XCircle className="w-4 h-4" /> {lang === 'zh' ? '自己单独注册/购买' : 'Buying Separately / Self-Registration'}
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>❌ {lang === 'zh' ? '必须提供中国大陆+86手机号' : 'Requires China +86 phone number'}</li>
                                <li>❌ {lang === 'zh' ? '新号跨设备绑定支付宝容易触发风控' : 'Linking across devices triggers high risk flags'}</li>
                                <li>❌ {lang === 'zh' ? '闲鱼强制要求支付宝实名扫脸' : 'Xianyu forces Alipay face verification'}</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-xl text-white">
                            <h4 className="font-bold flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-4 h-4" /> {lang === 'zh' ? 'CNVerifyHub 预定组合' : 'CNVerifyHub Pre-linked Bundle'}
                            </h4>
                            <ul className="space-y-2 text-sm font-medium text-white/90">
                                <li>✅ {lang === 'zh' ? '完全跳过中国手机号验证' : 'Bypass China phone verification completely'}</li>
                                <li>✅ {lang === 'zh' ? '底层已完成安全关联，不会被拦截' : 'Linked safely at database level, no intercepts'}</li>
                                <li>✅ {lang === 'zh' ? '收到账号直接通过支付宝授权登录闲鱼' : 'Login Xianyu instantly via Alipay auth'}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Login Flow Diagram */}
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        {lang === 'zh' ? '极致简单的登录流程' : 'Simple Login Flow'}
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-dark-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col items-center text-center max-w-[120px]">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-2">
                                <Lock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </div>
                            <span className="text-xs font-bold">{lang === 'zh' ? '获取账号' : 'Get Credentials'}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
                        <div className="flex flex-col items-center text-center max-w-[120px]">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
                                <AlipayIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{lang === 'zh' ? '登录支付宝App' : 'Login Alipay App'}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
                        <div className="flex flex-col items-center text-center max-w-[120px]">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-2">
                                <XianyuIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-amber-500">{lang === 'zh' ? '闲鱼选支付宝登录' : 'Xianyu: Login via Alipay'}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 hidden md:block" />
                        <div className="flex flex-col items-center text-center max-w-[120px]">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lang === 'zh' ? '无需手机号，成功' : 'Success! No SMS needed'}</span>
                        </div>
                    </div>
                </section>

                {/* Risks / Note */}
                <section className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/30">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-1">
                                {lang === 'zh' ? '安全与风控提醒' : 'Security & Risk Notice'}
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-500 font-medium leading-relaxed">
                                {risks?.[lang]}
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* Desktop Buy Button Duplicate for bottom of page */}
                <div className="hidden md:flex justify-center pt-8 border-t border-slate-200 dark:border-slate-800">
                    <button onClick={handleBuyNow} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg px-12 py-4 rounded-full shadow-xl hover:-translate-y-1 transition-transform flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {lang === 'zh' ? '立即抢购组合套餐' : 'Purchase Combo Bundle Now'}
                    </button>
                </div>
            </main>
        </div>
    );
}
