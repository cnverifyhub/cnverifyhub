import { PricingCard } from '@/components/ui/PricingCard';
import { Flame } from 'lucide-react';
import { allProducts } from '@/data/products';
import { t, type Lang } from '@/lib/i18n';

export function PopularProducts({ lang }: { lang: Lang }) {
    // Select top 4 popular products
    const popularProducts = allProducts
        .filter(p => p.popular)
        .slice(0, 4);

    return (
        <section id="pricing" className="py-16 md:py-20 bg-slate-50 dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800">
            <div className="section-container">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2 md:gap-3">
                        <Flame className="w-8 h-8 md:w-10 md:h-10 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
                        {t('home.popular.title', lang)}
                        <Flame className="w-8 h-8 md:w-10 md:h-10 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse scale-x-[-1]" />
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('home.popular.subtitle', lang)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:px-2">
                    {popularProducts.map((product) => (
                        <PricingCard key={product.id} product={product} lang={lang} />
                    ))}
                </div>
            </div>
        </section>
    );
}
