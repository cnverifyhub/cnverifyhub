'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Flame } from 'lucide-react';
import { categories, getTotalStock, getLowestPrice } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon,
    XianyuIcon, TaobaoIcon, XiaohongshuIcon,
    BundleIcon, VerificationIcon, FintechIcon
} from '@/components/ui/BrandIcons';

const iconMap: Record<string, { icon: React.ReactNode; accentColor: string; textColor: string }> = {
    wechat:       { icon: <WeChatIcon className="w-full h-full" />,       accentColor: '#07c160', textColor: 'text-[#07c160]' },
    alipay:       { icon: <AlipayIcon className="w-full h-full" />,       accentColor: '#1677ff', textColor: 'text-[#1677ff]' },
    douyin:       { icon: <DouyinIcon className="w-full h-full" />,       accentColor: '#ffffff', textColor: 'text-white' },
    qq:           { icon: <QQIcon className="w-full h-full" />,           accentColor: '#12b7f5', textColor: 'text-[#12b7f5]' },
    xianyu:       { icon: <XianyuIcon className="w-full h-full" />,       accentColor: '#ffe400', textColor: 'text-yellow-300' },
    taobao:       { icon: <TaobaoIcon className="w-full h-full" />,       accentColor: '#ff5000', textColor: 'text-[#ff5000]' },
    xiaohongshu:  { icon: <XiaohongshuIcon className="w-full h-full" />, accentColor: '#ff2442', textColor: 'text-rose-400' },
    bundle:       { icon: <BundleIcon className="w-full h-full" />,       accentColor: '#8b5cf6', textColor: 'text-violet-400' },
    verification: { icon: <VerificationIcon className="w-full h-full" />, accentColor: '#6366f1', textColor: 'text-indigo-400' },
    trading:      { icon: <FintechIcon className="w-full h-full" />,      accentColor: '#f59e0b', textColor: 'text-amber-400' },
};

export function CategoryCards({ lang }: { lang: Lang }) {
    const accountCategories = categories.filter(c => !['bundle', 'verification', 'trading'].includes(c.id));
    const bundleCategories = categories.filter(c => c.id === 'bundle');
    const serviceCategories = categories.filter(c => ['verification', 'trading'].includes(c.id));

    const renderGrid = (list: typeof categories, title: string, label?: string) => (
        <div className="mb-20 last:mb-0">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    {label && (
                        <span className="text-[10px] font-black text-[#FF0036] bg-[#FF0036]/10 border border-[#FF0036]/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                            {label}
                        </span>
                    )}
                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-[0.2em]">{title}</h3>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {list.map((cat, i) => {
                    const stock = getTotalStock(cat.id);
                    const lowestPrice = getLowestPrice(cat.id);
                    const cfg = iconMap[cat.id] || iconMap.wechat;
                    const isHot = i < 2;
                    const isNew = i >= 2 && i < 4;
                    return (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07, duration: 0.5 }}
                        >
                            <Link
                                href={getLocalizedPath(cat.href, lang)}
                                className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-white/8 bg-white/[0.04] backdrop-blur hover:-translate-y-1.5 transition-all duration-300 overflow-hidden h-full"
                            >
                                {/* Hover radial glow */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                                    style={{ background: `radial-gradient(circle at 50% 0%, ${cfg.accentColor}20 0%, transparent 70%)` }}
                                />
                                {/* Badges */}
                                {isHot && (
                                    <span className="absolute top-2 right-2 text-[8px] font-black bg-gradient-to-r from-[#FF0036] to-[#FF5000] text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10">
                                        <Flame className="w-2.5 h-2.5 fill-current" />HOT
                                    </span>
                                )}
                                {isNew && !isHot && (
                                    <span className="absolute top-2 right-2 text-[8px] font-black bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full border border-white/15 z-10">NEW</span>
                                )}
                                {/* Icon */}
                                <div className="w-14 h-14 mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">{cfg.icon}</div>
                                {/* Name */}
                                <p className={`text-sm font-black mb-0.5 relative z-10 ${cfg.textColor}`}>{cat.name['zh']}</p>
                                <p className="text-[10px] text-white/40 font-medium mb-3 relative z-10">{cat.name['en']}</p>
                                {/* Stats block */}
                                <div className="w-full bg-white/5 rounded-xl p-2.5 mt-auto relative z-10">
                                    <p className="text-[9px] text-white/40 uppercase tracking-wider mb-0.5">起售价</p>
                                    <p className="text-base font-black text-white tabular-nums">{formatYuan(lowestPrice)}</p>
                                    <p className="text-[9px] text-emerald-400 mt-0.5">库存 {stock}+</p>
                                </div>
                                {/* Arrow */}
                                <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <section id="categories" className="py-20" style={{ background: 'linear-gradient(180deg, #0d0d14 0%, #111118 100%)' }}>
            <div className="section-container">
                {/* Section title */}
                <div className="text-center mb-16">
                    <p className="text-[11px] font-black text-[#FF0036] uppercase tracking-[0.4em] mb-3">
                        🔥 {lang === 'zh' ? '全部分类' : 'ALL CATEGORIES'}
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                        {t('home.categories.title', lang)}
                    </h2>
                    <p className="text-base text-white/50 max-w-2xl mx-auto font-medium">
                        {t('home.categories.subtitle', lang)}
                    </p>
                </div>

                {renderGrid(accountCategories, lang === 'zh' ? '全球数字账号' : 'GLOBAL ACCOUNTS', lang === 'zh' ? '热销' : 'POPULAR')}
                {renderGrid(bundleCategories,  lang === 'zh' ? '多平台组合包' : 'COMBO BUNDLES',   'VIP')}
                {renderGrid(serviceCategories, lang === 'zh' ? '专业认证服务' : 'PRO SERVICES',     lang === 'zh' ? '新品' : 'NEW')}
            </div>
        </section>
    );
}
