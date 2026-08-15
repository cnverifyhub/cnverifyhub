'use client';

import React from 'react';
import { allProducts, categories } from '@/data/products';
import { PricingCard } from '@/components/ui/PricingCard';
import { t, type Lang } from '@/lib/i18n';
import { getTenantConfig } from '@/lib/tenant-config';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, Zap, Send, Sparkles, TrendingDown } from 'lucide-react';

interface PricingTableProps {
    lang: Lang;
}

export default function PricingTable({ lang }: PricingTableProps) {
    const isZh = lang === 'zh';
    const tenantConfig = getTenantConfig();
    const bulkTiers = tenantConfig.pricing.bulkTiers || [];

    return (
        <div className="space-y-16">
            {/* Wholesale Bulk Tier Matrix Section */}
            {bulkTiers.length > 0 && (
                <section className="section-container">
                    <div className="rounded-2xl bg-[#0D1526] border border-[#1E2D45] p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#FF0036]/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Accent Stripe */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#FF0036]" />

                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 border-b border-[#1E2D45] pb-6">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-3">
                                    <Layers className="w-3.5 h-3.5" />
                                    {isZh ? '阶梯批发矩阵 · 批量更省' : 'TIERED WHOLESALE PRICING MATRIX'}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-[#F0F4FF] tracking-tight">
                                    {isZh ? '大额采购与多账号批发折扣' : 'Bulk & Wholesale Volume Discounts'}
                                </h2>
                                <p className="text-sm text-[#7B91B0] mt-1 max-w-2xl">
                                    {isZh
                                        ? '支持跨品类混合采购与单品批量下单，系统结算时自动应用最优折扣阶梯。200+ 数量支持 Telegram VIP 专属定制发货。'
                                        : 'Automated tiered discounts applied directly during checkout for multi-unit and cross-category orders. 200+ bulk orders include VIP agent routing.'}
                                </p>
                            </div>

                            <a
                                href="https://t.me/CNVerifyHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                            >
                                <Send className="w-3.5 h-3.5" />
                                {isZh ? '联系批发大额客服' : 'Contact Wholesale Support'}
                            </a>
                        </div>

                        {/* Bulk Tier Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {bulkTiers.map((tier, idx) => {
                                const discountPercent = Math.round(tier.discount * 100);
                                const isMaxTier = tier.min >= 200;

                                return (
                                    <div
                                        key={tier.min}
                                        className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                                            isMaxTier
                                                ? 'bg-[#060B18] border-[#FF0036]/40 shadow-[0_0_20px_rgba(255,0,54,0.15)]'
                                                : 'bg-[#060B18]/70 border-[#1E2D45] hover:border-[#00E5FF]/30'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono font-bold text-[#7B91B0]">
                                                    TIER 0{idx + 1}
                                                </span>
                                                {isMaxTier && (
                                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF0036]/20 text-[#FF2D55] border border-[#FF0036]/30">
                                                        {isZh ? '最大折扣' : 'MAX VIP'}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-2xl font-black font-mono text-white mb-1">
                                                {tier.min}+ <span className="text-xs font-normal text-[#7B91B0]">{isZh ? '件/起' : 'units'}</span>
                                            </div>

                                            <div className="text-lg font-extrabold text-[#00E5FF] mb-3 flex items-center gap-1.5">
                                                <TrendingDown className="w-4 h-4 text-[#07C160]" />
                                                <span>{isZh ? `立减 ${discountPercent}% (${10 - discountPercent / 10}折)` : `${discountPercent}% OFF`}</span>
                                            </div>

                                            <p className="text-xs text-[#7B91B0] leading-relaxed">
                                                {isMaxTier
                                                    ? (isZh ? '出厂特惠 · 专属卡密池 · VIP技术支持' : 'Factory rate • Dedicated card pool • VIP support')
                                                    : (isZh ? '即买即减 · 5分钟全自动发货' : 'Instant discount • 5min auto-delivery')}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-[#1E2D45]/60 flex items-center gap-1.5 text-[11px] text-[#07C160]">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>{isZh ? '全套 72H 售后质保' : '72H Warranty Included'}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Category Products */}
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
