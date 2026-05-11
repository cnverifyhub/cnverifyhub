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
        <section id="pricing" className="py-20 bg-[#060B18] border-t border-[#1E2D45]">
            <div className="section-container">
                <div className="mb-12">
                    <span className="section-eyebrow"># {lang === 'zh' ? '热销爆款' : 'TOP SELLERS'}</span>
                    <h2 className="section-title">
                        {t('home.popular.title', lang)}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
