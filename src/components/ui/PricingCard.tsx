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
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-800">
            {/* Visual Header Block (Simulating Product Image) */}
            <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="relative aspect-[4/3] w-full block overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                {product.badge && (
                    <div className="absolute top-2 left-0 bg-gradient-to-r from-[#FF5000] to-[#FF8C00] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-r-full z-10 shadow-sm">
                        {product.badge[lang]}
                    </div>
                )}
                {product.popular && !product.badge && (
                    <div className="absolute top-2 left-0 bg-gradient-to-r from-red-600 to-[#FF5000] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-r-full z-10 shadow-sm">
                        {t('pricing.popular', lang)}
                    </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 bg-white">
                        <img 
                            src={`/images/categories/${product.category}.webp`}
                            alt={product.tierName[lang]}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Simulated Stock / Sales banner at bottom of image */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent pt-6 pb-1.5 px-3 flex justify-between items-center text-white">
                    <span className="text-[10px] font-medium opacity-90">
                        {lang === 'zh' ? `已售 ${100 + (product.id.charCodeAt(0) * 10)}+ 件` : `${100 + (product.id.charCodeAt(0) * 10)}+ sold`}
                    </span>
                    <StockBadge count={product.stockCount} lang={lang} />
                </div>
            </Link>

            <div className="p-3 flex-grow flex flex-col group">
                {/* Title Section */}
                <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="mb-2 block">
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                        <span className="bg-[#FF5000] text-white text-[10px] font-bold px-1 rounded-sm flex items-center">
                            {lang === 'zh' ? '官方自营' : 'Official'}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-[#FF5000] transition-colors inline">
                            {product.tierName[lang]}
                        </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {product.description[lang]}
                    </p>
                </Link>

                {/* Taobao Style Spec Tags (Pills) */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 4).map((feature, i) => (
                        <span key={i} className="text-[9px] sm:text-[10px] bg-[#FF5000]/10 text-[#FF5000] dark:bg-[#FF5000]/20 px-1.5 py-0.5 rounded-sm line-clamp-1 max-w-[100%] break-all">
                            {feature[lang]}
                        </span>
                    ))}
                    <span className="text-[9px] sm:text-[10px] border border-green-500 text-green-600 dark:text-green-400 px-1 rounded-sm line-clamp-1">
                        {product.warranty[lang]} {lang === 'zh' ? '质保' : 'Warranty'}
                    </span>
                </div>

                {/* Flash Sale Banner */}
                {product.popular && !isOutOfStock && (
                    <div className="mb-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded overflow-hidden flex items-stretch border border-red-100 dark:border-red-900/30">
                        <div className="bg-gradient-to-r from-red-600 to-[#FF5000] text-white text-[10px] font-bold px-2 py-0.5 flex flex-col justify-center italic tracking-wide shrink-0">
                            {lang === 'zh' ? '限时秒杀' : 'Flash Sale'}
                        </div>
                        <div className="flex-1 px-2 py-0.5 flex items-center gap-1 text-[10px] text-red-600 font-medium justify-between font-mono bg-white/50 dark:bg-black/20">
                            <span>{lang === 'zh' ? '距结束' : 'Ends in'}</span>
                            <span className="font-bold">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                )}

                {/* Pricing Block */}
                <div className="mt-auto pt-1">
                    <div className="flex items-baseline gap-1 break-all flex-wrap">
                        <span className="text-[#FF5000] text-xs font-bold leading-none">USDT</span>
                        <span className="text-[#FF5000] text-xl sm:text-2xl font-black leading-none drop-shadow-sm flex-shrink-0">
                            {formatUsdt(product.price.single).replace(' USDT', '')}
                        </span>
                        
                        {product.price.originalPrice && (
                            <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1 shrink-0">
                                {formatUsdt(product.price.originalPrice.single)}
                            </span>
                        )}
                    </div>
                    {/* Multi-tier pricing inline indicator */}
                    <div className="text-[9px] sm:text-[10px] text-gray-400 mt-1 pb-2 border-b border-gray-100 dark:border-gray-800 border-dashed">
                        {lang === 'zh' ? '多件优惠:' : 'Bulk discount:'} <span className="text-[#FF5000] font-medium">10件 {formatUsdt(product.price.bulk10).replace(' USDT', 'U')} / 50件 {formatUsdt(product.price.bulk50).replace(' USDT', 'U')}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons (Fixed Bottom) */}
            <div className="px-3 pb-3 pt-1 bg-white dark:bg-[#1c1c1e]">
                {isOutOfStock ? (
                    <button disabled className="w-full bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 py-2 sm:py-2.5 rounded-full text-sm font-bold cursor-not-allowed">
                        {lang === 'zh' ? '已售罄' : 'Sold Out'}
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem(product.id, 1);
                            }}
                            className="flex-[0.35] bg-orange-100 dark:bg-[#FF5000]/20 text-[#FF5000] hover:bg-orange-200 dark:hover:bg-[#FF5000]/30 py-2 sm:py-2.5 rounded-full flex items-center justify-center transition-colors"
                            title={lang === 'zh' ? '加入购物车' : 'Add to cart'}
                        >
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <Link
                            href={getLocalizedPath(`/product/${product.id}`, lang)}
                            className="flex-1 bg-gradient-to-r from-[#FF8C00] to-[#FF5000] hover:from-[#FF9D2E] hover:to-[#FF6B26] text-white py-2 sm:py-2.5 rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-[#FF5000]/20 transition-all hover:shadow-[#FF5000]/40"
                        >
                            {lang === 'zh' ? '立即抢购' : 'Buy Now'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
