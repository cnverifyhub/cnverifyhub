'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Clock, ShoppingCart, Zap, Users } from 'lucide-react';
import { Badge } from './Badge';
import { StockBadge } from './StockBadge';
import type { Product } from '@/types';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

interface PricingCardProps {
    product: Product;
    lang: Lang;
}

const BRAND_CONFIG: Record<string, { color: string; bg: string; iconBg: string; shadow: string }> = {
    wechat:      { color: '#07C160', bg: 'from-emerald-500/10 to-emerald-600/5', iconBg: '#07C160', shadow: 'shadow-emerald-500/20' },
    alipay:      { color: '#1677ff', bg: 'from-blue-500/10 to-blue-600/5', iconBg: '#1677ff', shadow: 'shadow-blue-500/20' },
    douyin:      { color: '#fe2c55', bg: 'from-slate-900/10 to-slate-800/5', iconBg: '#161823', shadow: 'shadow-slate-500/20' },
    qq:          { color: '#12B7F5', bg: 'from-sky-500/10 to-sky-600/5', iconBg: '#12B7F5', shadow: 'shadow-sky-500/20' },
    xianyu:      { color: '#FFB300', bg: 'from-amber-400/10 to-amber-500/5', iconBg: '#FFB300', shadow: 'shadow-amber-500/20' },
    taobao:      { color: '#FF5000', bg: 'from-orange-500/10 to-orange-600/5', iconBg: '#FF5000', shadow: 'shadow-orange-500/20' },
    xiaohongshu: { color: '#ff2442', bg: 'from-red-500/10 to-red-600/5', iconBg: '#ff2442', shadow: 'shadow-red-500/20' },
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

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className={`bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-800 ${product.popular ? 'ring-1 ring-[#FF5000]/10' : ''}`}
        >
            <Link 
                href={getLocalizedPath(`/product/${product.id}`, lang)} 
                className={`relative aspect-[4/3] w-full block overflow-hidden bg-gradient-to-br ${config.bg}`}
            >
                {product.badge && (
                    <div className="absolute top-3 left-0 bg-gradient-to-r from-[#FF5000] to-[#FF8C00] text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-r-xl z-20 shadow-md">
                        {product.badge[lang]}
                    </div>
                )}
                {product.popular && !product.badge && (
                    <div className="absolute top-3 left-0 bg-gradient-to-r from-red-600 to-[#FF5000] text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-r-xl z-20 shadow-md">
                        {t('pricing.popular', lang)}
                    </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
                    <div 
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[22.5%] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110 flex items-center justify-center p-2.5`}
                        style={{ backgroundColor: config.iconBg }}
                    >
                        <img 
                            src={`https://play-lh.googleusercontent.com/${product.category === 'wechat' ? 'QbSSiRcodmWx6HlezOtNu3vmZeuFqkQZQQO5Y2-Zg_jBRm-mXjhlXX5yFj8iphfqzQ' : product.category === 'alipay' ? 'quzvssC112NXIlt4YBkclEo7f9ZnhaNtZ5fvaCs_P19X7KL71DiUqd2ysR8ZHsTaRTY' : product.category === 'douyin' ? 'xey8dXOB53LtCR97JhDH7T-6np_sUBBE9iF7WP4Sp6T55oO28e6hic1LFTklCELw9Iw' : product.category === 'qq' ? '2U-E-AGFKKEI-k6oRndaHvAsOpYZmBWm5hgpP0pVP5MTClOhk3fL3f_Sbl--9dnbUh0' : product.category === 'xianyu' ? 'eaX5GSrLgAvCTKAe8N0baDkKA0gJ3siyG9X28sfmSO8yBmKVfPDQyJ3y_AvcCr8DSYU' : product.category === 'taobao' ? '6F3ONMR_UowQyqKud-bqqz5iWHGtleHEWTPZEoUiWPJj02R9hPL-agPCt_C3KYQLYi8' : 'c6Ipks61J7b4qgJMxo965UqsSo0M7ZwTDzQrmLKeBNneCk2gub-RitqSC-fnrmLGXTk3mNEceiBN5N3i26BmYHc'}`}
                            alt={product.tierName[lang]}
                            className="w-full h-full object-contain brightness-0 invert"
                        />
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-2 px-4 flex justify-between items-end text-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-80 mb-0.5">{lang === 'zh' ? '历史成交' : 'HISTORY'}</span>
                        <span className="text-xs font-bold whitespace-nowrap">
                            {lang === 'zh' ? `已售 ${100 + (product.id.charCodeAt(0) * 10)}+ 件` : `${100 + (product.id.charCodeAt(0) * 10)}+ sold`}
                        </span>
                    </div>
                    <StockBadge count={product.stockCount} lang={lang} />
                </div>
            </Link>

            <div className="p-4 flex-grow flex flex-col pt-5">
                <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="mb-3 block group/title">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="bg-[#FF5000] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm flex items-center uppercase letter tracking-tighter">
                            {lang === 'zh' ? '官方自营' : 'Official'}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover/title:text-[#FF5000] transition-colors">
                            {product.tierName[lang]}
                        </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed opacity-80">
                        {product.description[lang]}
                    </p>
                </Link>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 transition-colors hover:bg-[#FF5000]/5 hover:text-[#FF5000] hover:border-[#FF5000]/20">
                            {feature[lang]}
                        </span>
                    ))}
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {product.warranty[lang]}{lang === 'zh' ? '质保' : ' Warranty'}
                    </span>
                </div>

                {product.popular && !isOutOfStock && (
                    <div className="mb-4 relative group/sale overflow-hidden rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 group-hover/sale:scale-105 transition-transform duration-700" />
                        <div className="relative flex items-stretch">
                            <div className="bg-gradient-to-br from-red-600 to-[#FF5000] text-white text-[10px] font-black px-3 py-1.5 flex flex-col justify-center italic tracking-wider shrink-0 shadow-lg">
                                <Zap className="w-3 h-3 mb-0.5 fill-current" />
                                {lang === 'zh' ? '抢!' : 'SALE'}
                            </div>
                            <div className="flex-1 px-3 py-1.5 flex items-center justify-between bg-white/40 dark:bg-black/20 backdrop-blur-sm">
                                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">
                                    {lang === 'zh' ? '距秒杀结束' : 'Flash ends in'}
                                </span>
                                <span className="text-xs font-black text-red-700 dark:text-red-400 font-mono tabular-nums bg-red-100/50 dark:bg-red-900/30 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-800/50">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-2">
                    <div className="flex items-end justify-between mb-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                {lang === 'zh' ? '当前单价 (USDT)' : 'SINGLE PRICE'}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">
                                    <span className="text-lg mr-0.5">$</span>
                                    {formatYuan(product.price.single)}
                                </span>
                                {product.price.originalPrice && product.price.originalPrice.single > product.price.single && (
                                    <span className="text-sm text-slate-400 line-through font-bold opacity-70">
                                        {formatYuan(product.price.originalPrice.single)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter mb-1 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 rounded-full">
                                {lang === 'zh' ? '多买更省' : 'SAVE MORE'}
                            </span>
                            <div className="text-[11px] font-black text-slate-600 dark:text-slate-400">
                                <span className="text-[#FF5000]">50x</span> <span className="opacity-60">@</span> ${formatYuan(product.price.bulk50)}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-dark-900/50 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold group-hover:bg-[#FF5000]/5 group-hover:border-[#FF5000]/10 transition-colors">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Users className="w-3.5 h-3.5" />
                            <span>10+ {lang === 'zh' ? '批发' : 'Bulk'}</span>
                        </div>
                        <span className="text-[#FF5000]">${formatYuan(product.price.bulk10)}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 pt-1 bg-white dark:bg-[#1c1c1e] relative">
                {isOutOfStock ? (
                    <button disabled className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 py-3 rounded-2xl text-sm font-black uppercase tracking-widest cursor-not-allowed">
                        {lang === 'zh' ? '库存告急 · 已售罄' : 'Sold Out'}
                    </button>
                ) : (
                    <div className="flex gap-2.5">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem(product.id, 1);
                            }}
                            className="w-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-[#FF5000] hover:text-white py-3 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95"
                            title={lang === 'zh' ? '加入购物车' : 'Add to cart'}
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <Link
                            href={getLocalizedPath(`/product/${product.id}`, lang)}
                            className="flex-1 relative group/buy overflow-hidden bg-gradient-to-r from-[#FF8C00] to-[#FF5000] text-white py-3 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                            <div className="absolute inset-0 hero-shine opacity-0 group-hover/buy:opacity-100 transition-opacity" />
                            <span className="relative z-10">{lang === 'zh' ? '立即抢购 · BUY NOW' : 'Buy Now'}</span>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

const STOCK_LEVELS = {
    LOW: 10,
    CRITICAL: 5
};
