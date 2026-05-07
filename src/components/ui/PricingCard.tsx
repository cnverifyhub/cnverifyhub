'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Clock, ShoppingCart, Zap, Users, ArrowRight, BadgeCheck } from 'lucide-react';
import { Badge } from './Badge';
import { StockBadge } from './StockBadge';
import type { Product } from '@/types';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { calculateYuan, formatYuan } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { 
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, 
    BundleIcon, VerificationIcon, FintechIcon,
    PassportVerifyIcon, FaceVerifyIcon, KycPackageIcon, WechatRealnameIcon, AlipayRealnameIcon,
    XmIcon, HfmIcon, NetellerIcon, SkrillIcon, PayoneerIcon, WiseIcon
} from './BrandIcons';

const ICON_COMPONENTS: Record<string, React.ElementType> = {
    // Categories
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
    bundle: BundleIcon,
    verification: VerificationIcon,
    trading: FintechIcon,
    
    // Specific Products (Verification)
    'verify-passport': PassportVerifyIcon,
    'verify-face': FaceVerifyIcon,
    'verify-kyc': KycPackageIcon,
    'verify-wechat': WechatRealnameIcon,
    'verify-alipay': AlipayRealnameIcon,
    
    // Specific Products (Trading)
    'xm-account': XmIcon,
    'hfm-account': HfmIcon,
    'neteller-account': NetellerIcon,
    'skrill-account': SkrillIcon,
    'payoneer-account': PayoneerIcon,
    'wise-account': WiseIcon,
    wise: WiseIcon
};

interface PricingCardProps {
    product: Product;
    lang: Lang;
}

const BRAND_CONFIG: Record<string, { color: string; bg: string; iconBg: string; shadow: string; glow: string }> = {
    wechat:      { color: '#07C160', bg: 'bg-[#07C160]/5', iconBg: '#07C160', shadow: 'shadow-emerald-500/20', glow: 'group-hover:shadow-emerald-500/30' },
    alipay:      { color: '#1677ff', bg: 'bg-[#1677ff]/5', iconBg: '#1677ff', shadow: 'shadow-blue-500/20', glow: 'group-hover:shadow-blue-500/30' },
    douyin:      { color: '#000000', bg: 'bg-slate-900/5', iconBg: '#161823', shadow: 'shadow-slate-500/20', glow: 'group-hover:shadow-slate-500/30' },
    qq:          { color: '#12B7F5', bg: 'bg-[#12B7F5]/5', iconBg: '#12B7F5', shadow: 'shadow-sky-500/20', glow: 'group-hover:shadow-sky-500/30' },
    xianyu:      { color: '#FFB300', bg: 'bg-[#FFB300]/10', iconBg: '#FFB300', shadow: 'shadow-amber-500/20', glow: 'group-hover:shadow-amber-500/30' },
    taobao:      { color: '#FF5000', bg: 'bg-[#FF5000]/5', iconBg: '#FF5000', shadow: 'shadow-orange-500/20', glow: 'group-hover:shadow-orange-500/30' },
    xiaohongshu: { color: '#ff2442', bg: 'bg-[#ff2442]/5', iconBg: '#ff2442', shadow: 'shadow-red-500/20', glow: 'group-hover:shadow-red-500/30' },
    bundle:      { color: '#8b5cf6', bg: 'bg-[#8b5cf6]/5', iconBg: '#8b5cf6', shadow: 'shadow-purple-500/20', glow: 'group-hover:shadow-purple-500/30' },
    verification:{ color: '#6366f1', bg: 'bg-[#6366f1]/5', iconBg: '#6366f1', shadow: 'shadow-indigo-500/20', glow: 'group-hover:shadow-indigo-500/30' },
    trading:     { color: '#f59e0b', bg: 'bg-[#f59e0b]/10', iconBg: '#f59e0b', shadow: 'shadow-amber-500/20', glow: 'group-hover:shadow-amber-500/30' },
    wise:        { color: '#9FE870', bg: 'bg-[#9FE870]/10', iconBg: '#9FE870', shadow: 'shadow-[#9FE870]/20', glow: 'group-hover:shadow-[#9FE870]/30' },
};

export function PricingCard({ product, lang }: PricingCardProps) {
    const isOutOfStock = product.stockCount === 0;
    const addItem = useCartStore((state) => state.addItem);
    const config = BRAND_CONFIG[product.category] || BRAND_CONFIG.wechat;

    const [timeLeft, setTimeLeft] = useState(() => {
        const idSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 7200 + (idSum % 3600);
    });

    useEffect(() => {
        if (!product.popular || isOutOfStock) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [product.popular, isOutOfStock]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const soldCount = (product as any).sold ?? (product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 3 % 1500 + 5);

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.tierName[lang],
        description: product.description[lang],
        image: `https://cnwepro.com/images/categories/${product.category}.webp`,
        brand: {
            '@type': 'Brand',
            'name': 'CNWePro'
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USDT',
            price: product.price.single,
            itemCondition: 'https://schema.org/NewCondition',
            availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            url: `https://cnwepro.com/product/${product.id}`
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (product as any).rating || '4.9',
            reviewCount: (product as any).review_count || Math.max(120, soldCount)
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`group bg-white dark:bg-[#1c1c1e] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col h-full border border-slate-100 dark:border-white/5 relative`}
        >
            <Link 
                href={getLocalizedPath(`/product/${product.id}`, lang)} 
                className={`relative aspect-[5/4] w-full block overflow-hidden ${config.bg} p-6`}
            >
                {/* Visual Flair */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white dark:from-[#1c1c1e] to-transparent z-10" />
                
                {product.badge && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FF5000] to-[#FF8C00] text-white text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full z-20 shadow-lg shadow-orange-500/30">
                        {product.badge[lang]}
                    </div>
                )}
                
                {/* Pro Max Image Area */}
                <div className="relative w-full h-full flex items-center justify-center z-0">
                    <div 
                        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-[22.5%] overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center p-0`}
                        style={{ backgroundColor: config.iconBg }}
                    >
                        {product.image ? (
                            <Image 
                                src={product.image} 
                                alt={product.tierName[lang]} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 112px, 128px"
                                priority={product.popular}
                            />
                        ) : (() => {
                            const Icon = ICON_COMPONENTS[product.id] || ICON_COMPONENTS[product.category] || WeChatIcon;
                            return <Icon className="w-full h-full" />;
                        })()}
                    </div>
                    {/* Shadow underneath */}
                    <div className={`absolute bottom-4 w-20 h-4 bg-black/10 dark:bg-black/40 blur-xl rounded-full scale-x-150 transition-transform duration-500 group-hover:scale-x-110`} />
                </div>

                <div className="absolute bottom-6 inset-x-0 px-6 flex justify-between items-end text-slate-900 dark:text-white z-20">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{lang === 'zh' ? '成交量' : 'VOLUME'}</span>
                        <span className="text-sm font-black tracking-tight whitespace-nowrap bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg">
                            {(() => {
                                // Derive a stable unique sold count based on product ID + category seed
                                const categorySeed = product.category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                const idSeed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                const soldCount = (product as any).sold ?? ((idSeed * 7 + categorySeed * 3) % 1800 + 120);
                                
                                if (soldCount > 1000) return lang === 'zh' ? `已售 ${(soldCount/1000).toFixed(1)}k+` : `${(soldCount/1000).toFixed(1)}k+ sold`;
                                return lang === 'zh' ? `已售 ${soldCount}` : `${soldCount} sold`;
                            })()}
                        </span>
                    </div>
                    <StockBadge count={product.stockCount} lang={lang} />
                </div>
            </Link>

            <div className="px-6 pb-6 pt-2 flex-grow flex flex-col">
                <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="mb-4 block">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span 
                            className="text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tight"
                            style={{ backgroundColor: `${config.color}15`, color: config.color }}
                        >
                            {lang === 'zh' ? '官方特选' : 'PREMIUM'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#FF5000] transition-colors">
                            {product.name?.[lang] || product.tierName[lang]}
                        </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                        {product.description[lang]}
                    </p>
                </Link>

                <div className="flex flex-wrap gap-2 mb-6">
                    {product.features?.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-[10px] font-bold bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-white/5">
                            {feature[lang]}
                        </span>
                    ))}
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {product.warranty?.[lang]}{lang === 'zh' ? '质保' : ' Warranty'}
                    </span>
                    {product.category === 'verification' && (
                        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-1.5">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            {lang === 'zh' ? '99% 成功率' : '99% Success Rate'}
                        </span>
                    )}
                </div>

                {product.popular && !isOutOfStock && (
                    <div className="mb-6 relative group/sale overflow-hidden rounded-2xl border border-red-50 dark:border-red-500/20 shadow-sm bg-red-50/30 dark:bg-red-500/5">
                        <div className="flex items-center">
                            <div className="bg-gradient-to-br from-[#ff2442] to-[#ff5000] text-white text-[10px] font-black px-4 py-2 flex flex-col justify-center italic tracking-widest shrink-0">
                                <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1 px-4 py-2 flex items-center justify-between">
                                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">
                                    {lang === 'zh' ? '热卖倒计时' : 'FLASH SALE'}
                                </span>
                                <span className="text-xs font-black text-red-600 dark:text-red-400 font-mono">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    <div className="flex flex-col mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">
                            {lang === 'zh' ? '专属价格' : 'EXCLUSIVE PRICE'}
                        </span>
                        <div className="flex items-end gap-2 px-0.5">
                            <span className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">
                                {formatYuan(product.price.single)}
                            </span>
                            {product.price.originalPrice && product.price.originalPrice.single > product.price.single && (
                                <span className="text-base text-slate-300 dark:text-slate-600 line-through font-bold mb-1.5">
                                    {formatYuan(product.price.originalPrice.single)}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-[#f8f9fb] dark:bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-slate-100 dark:border-white/5 group-hover:border-[#ff5000]/20 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                                <Users className="w-4 h-4 text-[#ff5000]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">50+ {lang === 'zh' ? '批量下单' : 'BULK ORDER'}</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300">{formatYuan(product.price.bulk50)} <span className="text-[10px] opacity-40 ml-1">each</span></span>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#ff5000] group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 pt-0">
                {isOutOfStock ? (
                    <button disabled className="w-full bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 py-4 rounded-2xl text-sm font-black uppercase tracking-widest cursor-not-allowed border border-slate-200 dark:border-white/5">
                        {lang === 'zh' ? '库存已售罄' : 'SOLD OUT'}
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem(product.id, 1);
                                // GTM tracking
                                if (typeof window !== 'undefined' && (window as any).dataLayer) {
                                    (window as any).dataLayer.push({
                                        event: 'add_to_cart',
                                        ecommerce: {
                                            currency: 'USDT',
                                            value: product.price.single,
                                            items: [{
                                                item_id: product.id,
                                                item_name: product.tierName.en,
                                                item_category: product.category,
                                                price: product.price.single,
                                                quantity: 1
                                            }]
                                        }
                                    });
                                }
                            }}
                            className="w-16 h-14 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-2xl flex items-center justify-center transition-all duration-300 border border-slate-200 dark:border-white/5 active:scale-90"
                        >
                            <ShoppingCart className="w-6 h-6" />
                        </button>
                        <Link
                            href={getLocalizedPath(`/product/${product.id}`, lang)}
                            className="flex-1 h-14 bg-gradient-to-r from-[#ff8c00] to-[#ff5000] text-white rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-[0.1em] shadow-xl shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-95 relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-12" />
                            {lang === 'zh' ? '立刻抢购' : 'BUY NOW'}
                        </Link>
                    </div>
                )}
            </div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        </motion.div>
    );
}

const STOCK_LEVELS = {
    LOW: 10,
    CRITICAL: 5
};
