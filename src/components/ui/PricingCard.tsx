'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Clock, ShoppingCart, Zap } from 'lucide-react';
import { Badge } from './Badge';
import { StockBadge } from './StockBadge';
import type { Product } from '@/types';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatUsdt } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

interface PricingCardProps {
    product: Product;
    lang: Lang;
}

export function PricingCard({ product, lang }: PricingCardProps) {
    const isOutOfStock = product.stockCount === 0;
    const addItem = useCartStore((state) => state.addItem);

    // Simulate active sale countdown (2hrs + random minutes based on product id)
    const [timeLeft, setTimeLeft] = useState(() => {
        const idSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 7200 + (idSum % 3600); // Between 2 and 3 hours
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
        <div
            className={`glass-card relative flex flex-col h-full overflow-hidden transition-all duration-300 border-t-4 ${product.popular ? 'border-red-500 shadow-xl shadow-red-500/10 -translate-y-2' : 'border-t-slate-200 dark:border-t-slate-700 hover:-translate-y-1'
                }`}
        >
            {/* Popular/Badge Tag */}
            {product.badge && (
                <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-600 text-white text-[10px] font-bold px-3 py-1 pb-1.5 rounded-bl-lg tracking-wider uppercase shadow-md">
                        {product.badge[lang]}
                    </div>
                </div>
            )}
            {product.popular && !product.badge && (
                <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-gold-400 to-gold-600 text-white text-[10px] font-bold px-3 py-1 pb-1.5 rounded-bl-lg tracking-wider uppercase shadow-md">
                        {t('pricing.popular', lang)}
                    </div>
                </div>
            )}

            <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="block p-3 md:p-4 flex-grow flex flex-col group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                {/* Header */}
                <div className="mb-2">
                    <div className="flex items-start gap-1.5 mb-1">
                        <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded flex items-center shrink-0 shadow-sm mt-0.5">
                            {lang === 'zh' ? '官方自营' : 'Official'}
                        </span>
                        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            {product.tierName[lang]}
                        </h3>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 flex-1 pr-2">
                            {product.description[lang]}
                        </p>
                        <StockBadge count={product.stockCount} lang={lang} />
                    </div>
                </div>

                {/* Flash Sale Banner for Popular Items */}
                {product.popular && !isOutOfStock && (
                    <div className="mb-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-2 flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold text-[11px]">
                            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                            {lang === 'zh' ? '全网特惠秒杀' : 'Flash Sale'}
                        </div>
                        <div className="font-mono text-[10px] font-bold bg-white/60 dark:bg-dark-900/60 px-1.5 py-0.5 rounded text-red-600 dark:text-red-400 backdrop-blur-sm">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                )}

                {/* Pricing Block */}
                <div className="mb-3 bg-red-50/40 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/20 p-2.5 mt-0.5">
                    <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5 mb-1.5">
                        <div className="flex items-baseline gap-0.5 text-red-600 dark:text-red-500">
                            <span className="text-xs font-bold opacity-90">USDT</span>
                            <span className="text-3xl font-black tracking-tight drop-shadow-sm font-sans leading-none">
                                {formatUsdt(product.price.single).replace(' USDT', '')}
                            </span>
                        </div>

                        {product.price.originalPrice && (
                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 ml-1">
                                <span className="line-through text-xs font-medium decoration-slate-300 dark:decoration-slate-600">
                                    {formatUsdt(product.price.originalPrice.single)}
                                </span>
                                <span className="bg-red-500 text-white text-[9px] font-bold px-1 py-px rounded-sm">
                                    {lang === 'zh' ? '立省' : 'SAVE'} {formatUsdt(product.price.originalPrice.single - product.price.single).replace(' USDT', '')}U
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bulk Pricing Preview */}
                    <div className="flex flex-wrap gap-1.5 mt-1 border-t border-red-100/50 dark:border-red-900/20 pt-1.5">
                        <div className="text-[10px] font-bold bg-orange-100/50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded text-orange-700 dark:text-orange-400 flex items-center gap-1">
                            <span className="opacity-70">10件:</span> {formatUsdt(product.price.bulk10)}
                        </div>
                        <div className="text-[10px] font-bold bg-red-100/50 dark:bg-red-900/30 px-1.5 py-0.5 rounded text-red-700 dark:text-red-400 shadow-sm flex items-center gap-1">
                            <span className="opacity-70">50件:</span> {formatUsdt(product.price.bulk50)}
                        </div>
                    </div>
                </div>

                {/* Features List (2 Column Grid) */}
                <ul className="mb-4 grid grid-cols-2 gap-x-2 gap-y-1.5 flex-grow content-start">
                    {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                            <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-success-50 dark:bg-success-500/10 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-success-600 dark:text-success-400" />
                            </div>
                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                                {feature[lang]}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Info Rows */}
                <div className="mb-3 bg-slate-50/80 dark:bg-slate-800/50 py-2 px-2.5 rounded flex flex-col gap-y-1 border border-slate-100 dark:border-slate-700/50 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300">{t('pricing.warranty', lang)}</span>
                        </div>
                        <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[60%] text-right">{product.warranty[lang]}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300">{t('pricing.delivery', lang)}</span>
                        </div>
                        <span className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[60%] text-right">{product.deliveryTime[lang]}</span>
                    </div>
                </div>
            </Link>

            {/* CTA Button */}
            <div className="mt-auto relative z-10 p-3 md:p-4 pt-0 border-t border-slate-100 dark:border-slate-800/50 mt-1">
                {isOutOfStock ? (
                    <button
                        disabled
                        className="w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-base font-black transition-all duration-200 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    >
                        <ShoppingCart className="w-4 h-4 ml-[-4px]" />
                        <span className="tracking-widest">{lang === 'zh' ? '已售罄' : 'Sold Out'}</span>
                    </button>
                ) : (
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem(product.id, 1);
                            }}
                            className="flex-[0.4] flex items-center justify-center py-3 px-3 rounded-xl transition-all duration-200 bg-orange-100 dark:bg-orange-500/20 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 shadow-sm"
                            title={lang === 'zh' ? '加入购物车' : 'Add to cart'}
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <Link
                            href={getLocalizedPath(`/product/${product.id}`, lang)}
                            className="flex-1 w-full flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl text-base font-black transition-all duration-200 bg-gradient-to-r from-[#ff4d4f] to-[#ff2a2d] hover:from-[#ff2a2d] hover:to-[#e60000] text-white shadow-[0_6px_16px_rgba(255,42,45,0.25)] hover:shadow-[0_8px_20px_rgba(255,42,45,0.4)] hover:-translate-y-1 active:scale-95 border-b-2 border-[#cc0000] hover:border-b-0 translate-y-0.5 hover:translate-y-1 relative"
                        >
                            <span className="tracking-widest">{lang === 'zh' ? '立即抢购' : 'Buy Now'}</span>
                        </Link>
                    </div>
                )
                }
            </div>
        </div>
    );
}
