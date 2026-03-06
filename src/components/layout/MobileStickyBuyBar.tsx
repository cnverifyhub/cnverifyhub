'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { type Lang, getLocalizedPath, t } from '@/lib/i18n';

interface MobileStickyBuyBarProps {
    productId: string;
    lang: Lang;
    price: number;
    isOutOfStock?: boolean;
}

export function MobileStickyBuyBar({ productId, lang, price, isOutOfStock }: MobileStickyBuyBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show the sticky bar after scrolling down past the main hero/intro
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="md:hidden fixed bottom-[60px] left-0 w-full z-40 animate-slide-up">
            <div className="bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === 'zh' ? '总计' : 'Total'}
                    </span>
                    <span className="text-xl font-extrabold text-red-600 dark:text-red-500">
                        USDT {price}
                    </span>
                </div>

                <Link
                    href={isOutOfStock ? '#' : getLocalizedPath(`/checkout?product=${productId}`, lang)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-full text-base font-bold transition-all ${isOutOfStock
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25 active:scale-95'
                        }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock ? (lang === 'zh' ? '已售罄' : 'Sold Out') : t('pricing.buyNow', lang)}
                </Link>
            </div>
        </div>
    );
}
