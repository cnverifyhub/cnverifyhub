'use client';

import Link from 'next/link';
import { ArrowRight, Flame, Star } from 'lucide-react';
import { categories, getTotalStock, getLowestPrice } from '@/data/products';
import type { CategoryId } from '@/types';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon,
    XianyuIcon, TaobaoIcon, XiaohongshuIcon,
    BundleIcon, VerificationIcon, FintechIcon
} from '@/components/ui/BrandIcons';

const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
    wechat:       { icon: <WeChatIcon className="w-full h-full" />,       color: '#07C160' },
    alipay:       { icon: <AlipayIcon className="w-full h-full" />,       color: '#1677ff' },
    douyin:       { icon: <DouyinIcon className="w-full h-full" />,       color: '#ffffff' },
    qq:           { icon: <QQIcon className="w-full h-full" />,           color: '#12B7F5' },
    xianyu:       { icon: <XianyuIcon className="w-full h-full" />,       color: '#FFB300' },
    taobao:       { icon: <TaobaoIcon className="w-full h-full" />,       color: '#FF5000' },
    xiaohongshu:  { icon: <XiaohongshuIcon className="w-full h-full" />, color: '#ff2442' },
    bundle:       { icon: <BundleIcon className="w-full h-full" />,       color: '#8b5cf6' },
    verification: { icon: <VerificationIcon className="w-full h-full" />, color: '#00E5FF' },
    trading:      { icon: <FintechIcon className="w-full h-full" />,      color: '#FFB800' },
};

const FEATURED_ID = 'wechat'; // first category gets the large bento slot

export function CategoryCards({ lang }: { lang: Lang }) {
    const featured = categories.find(c => c.id === FEATURED_ID)!;
    const rest = categories.filter(c => c.id !== FEATURED_ID);

    const featuredMeta = iconMap[featured.id];
    const featuredStock = getTotalStock(featured.id as CategoryId);
    const featuredPrice = getLowestPrice(featured.id as CategoryId);

    return (
        <section id="categories" className="py-20 bg-[#060B18]">
            <div className="section-container">

                {/* Section header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="section-eyebrow"># {lang === 'zh' ? '全部分类' : 'ALL CATEGORIES'}</span>
                        <h2 className="section-title">
                            {t('home.categories.title', lang)}
                        </h2>
                    </div>
                    <div className="h-px flex-1 bg-[#1E2D45] ml-8 mb-2 hidden md:block" />
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[160px] gap-4">

                    {/* Featured card — spans 2×2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="col-span-2 row-span-2"
                    >
                        <Link
                            href={getLocalizedPath(featured.href, lang)}
                            className="group relative flex flex-col justify-end h-full border border-[#1E2D45] hover:border-[#00E5FF]/40 bg-[#0D1526] overflow-hidden transition-all duration-300"
                            style={{ boxShadow: '0 0 0 0 rgba(0,229,255,0)' }}
                        >
                            {/* Big icon watermark */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 opacity-10 group-hover:opacity-15 group-hover:scale-110 transition-all duration-500"
                                style={{ filter: `drop-shadow(0 0 30px ${featuredMeta.color})` }}
                            >
                                {featuredMeta.icon}
                            </div>
                            {/* Glow overlay on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `radial-gradient(ellipse at 50% 50%, ${featuredMeta.color}10 0%, transparent 70%)` }}
                            />
                            {/* Left accent bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
                                style={{ background: featuredMeta.color, opacity: 0.5 }}
                            />
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ background: '#00E5FF', boxShadow: '0 0 12px rgba(0,229,255,0.6)' }}
                            />
                            {/* Top badges */}
                            <div className="absolute top-4 right-4 flex flex-col gap-1.5">
                                <span className="flex items-center gap-1 text-[9px] font-black text-white bg-[#FF2D55] px-2 py-0.5 rounded self-end">
                                    <Flame className="w-2.5 h-2.5 fill-current" />HOT #1
                                </span>
                                <span className="text-[9px] font-mono text-[#07C160] bg-[#07C160]/10 border border-[#07C160]/20 px-2 py-0.5 rounded self-end">
                                    库存 {featuredStock}+
                                </span>
                            </div>
                            {/* Bottom info */}
                            <div className="relative z-10 p-5 bg-gradient-to-t from-[#060B18]/90 to-transparent">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-[#7B91B0] mb-0.5">{featured.name['en']}</p>
                                        <p className="text-lg font-syne font-bold text-white">{featured.name['zh']}</p>
                                        <p className="font-mono-price text-2xl font-black mt-1" style={{ color: featuredMeta.color }}>
                                            {formatYuan(featuredPrice)}
                                            <span className="text-xs font-normal text-[#7B91B0] ml-1">起</span>
                                        </p>
                                        <p className="text-[10px] text-[#07C160] font-medium mt-1">
                                            {lang === 'zh' ? '已售 ' : 'Sold '}
                                            <span className="font-bold">{(featuredPrice * 123) % 1000 + 500}+</span>
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 flex items-center justify-center border border-[#1E2D45] group-hover:border-[#00E5FF]/40 group-hover:bg-[#00E5FF]/5 rounded transition-all">
                                        <ArrowRight className="w-4 h-4 text-[#7B91B0] group-hover:text-[#00E5FF] group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Regular cards */}
                    {rest.map((cat, i) => {
                        const meta = iconMap[cat.id] || { icon: null, color: '#7B91B0' };
                        const stock = getTotalStock(cat.id as CategoryId);
                        const price = getLowestPrice(cat.id as CategoryId);
                        const isNew = cat.id === 'verification' || cat.id === 'trading';
                        const isVip = cat.id === 'bundle';

                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <Link
                                    href={getLocalizedPath(cat.href, lang)}
                                    className="group relative flex flex-col justify-between h-full border border-[#1E2D45] hover:border-[#00E5FF]/35 bg-[#0D1526] overflow-hidden transition-all duration-250 p-4"
                                >
                                    {/* Hover glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ background: `radial-gradient(circle at 50% 0%, ${meta.color}0D 0%, transparent 70%)` }}
                                    />
                                    {/* Left accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
                                        style={{ background: meta.color, opacity: 0.35 }}
                                    />
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100"
                                        style={{ background: '#00E5FF', boxShadow: '0 0 8px rgba(0,229,255,0.5)' }}
                                    />
                                    {/* Badge */}
                                    {(isNew || isVip) && (
                                        <div className="absolute top-2.5 right-2.5">
                                            {isNew && (
                                                <span className="text-[8px] font-black text-[#00E5FF] border border-[#00E5FF]/30 bg-[#00E5FF]/8 px-1.5 py-0.5 rounded">NEW</span>
                                            )}
                                            {isVip && (
                                                <span className="flex items-center gap-0.5 text-[8px] font-black text-[#FFB800] border border-[#FFB800]/30 bg-[#FFB800]/8 px-1.5 py-0.5 rounded">
                                                    <Star className="w-2 h-2 fill-current" />VIP
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="w-8 h-8 mb-2.5 group-hover:scale-110 transition-transform duration-300">{meta.icon}</div>
                                        <p className="text-xs font-semibold text-[#F0F4FF] leading-tight">{cat.name['zh']}</p>
                                        <p className="text-[9px] text-[#7B91B0] mt-0.5 leading-tight">{cat.name['en']}</p>
                                    </div>
                                    {/* Bottom price */}
                                    <div className="relative z-10 flex items-end justify-between">
                                        <div>
                                            <p className="text-[9px] text-[#7B91B0] mb-0.5">起售价</p>
                                            <p className="font-mono-price text-sm font-bold" style={{ color: meta.color }}>
                                                {formatYuan(price)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className={`text-[9px] font-mono ${stock < 50 ? 'text-[#FF2D55] animate-pulse' : 'text-[#07C160]'}`}>
                                                {stock > 999 ? '999+' : stock}
                                            </p>
                                            <p className="text-[8px] text-[#7B91B0] mt-0.5">
                                                {lang === 'zh' ? '已售' : 'Sold'} {(price * 47) % 500 + 100}+
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View all link */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href={getLocalizedPath('/bundle', lang)}
                        className="cyber-btn-ghost flex items-center gap-2 px-6 py-2.5 rounded text-sm"
                    >
                        {lang === 'zh' ? '查看全部套餐' : 'View All Bundles'}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
