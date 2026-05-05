'use client';

import { allProducts, categories } from '@/data/products';
import { PricingCard } from '@/components/ui/PricingCard';
import { t, type Lang } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface PricingTableProps {
    lang: Lang;
}

export default function PricingTable({ lang }: PricingTableProps) {
    return (
        <div className="space-y-20">
            {categories.map((category) => {
                const categoryProducts = allProducts.filter(p => p.category === category.id);
                
                if (categoryProducts.length === 0) return null;

                return (
                    <section key={category.id} className="section-container">
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 dark:border-white/5 pb-6">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-white shadow-lg`}>
                                <span className="text-xl font-bold">{categoryProducts.length}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {category.name[lang]}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {category.description[lang]}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryProducts
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((product) => (
                                    <PricingCard key={product.id} product={product} lang={lang} />
                                ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
