"use client";

import { PricingCard } from '@/components/ui/PricingCard';
import { Flame } from 'lucide-react';
import { allProducts } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export function PopularProducts({ lang }: { lang: Lang }) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);

    // Select top 4 popular products
    const popularProducts = allProducts
        .filter(p => p.popular)
        .sort((a, b) => b.sortOrder - a.sortOrder)
        .slice(0, 6);

    return (
        <section id="pricing" className="py-16 md:py-24 bg-slate-50 dark:bg-dark-950/50 border-t border-slate-200 dark:border-slate-800">
            <div className="section-container">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2 md:gap-3 font-['PingFang_SC','System-ui',sans-serif]">
                        <Flame className="w-8 h-8 md:w-12 h-12 text-[#ff5000] fill-[#ff5000] drop-shadow-[0_0_12px_rgba(255,80,0,0.4)] animate-pulse" />
                        {t('home.popular.title', lang)}
                        <Flame className="w-8 h-8 md:w-12 h-12 text-[#ff5000] fill-[#ff5000] drop-shadow-[0_0_12px_rgba(255,80,0,0.4)] animate-pulse scale-x-[-1]" />
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-[1.8]">
                        {t('home.popular.subtitle', lang)}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 lg:px-2">
                    {popularProducts.map((product) => (
                        <PricingCard 
                            key={product.id} 
                            product={product}
                            lang={lang}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
