'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, Eye, ShieldCheck, Clock } from 'lucide-react';
import { formatYuan } from '@/lib/utils';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, BundleIcon, VerificationIcon, FintechIcon } from '@/components/ui/BrandIcons';

interface ProductCardProps {
    title: string;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
    salesVolume?: string;
    badges?: string[];
    onBuyNow?: () => void;
    onPreview?: () => void;
}

// Flat brand icon components — local .webp assets, no CDN
const BRAND_ICON_MAP: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
    bundle: BundleIcon,
    verification: VerificationIcon,
    fintech: FintechIcon
};

// Per-platform gradient backgrounds for the card image area
const BRAND_GRADIENTS: Record<string, { from: string; via?: string; to: string; pattern: string }> = {
    wechat:      { from: '#07C160', to: '#04a050', pattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
    alipay:      { from: '#1677ff', via: '#0f5ae0', to: '#0a40b8', pattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 50%)' },
    douyin:      { from: '#161823', via: '#2d2d3b', to: '#000000', pattern: 'radial-gradient(ellipse at 70% 30%, rgba(254,44,85,0.3) 0%, transparent 60%)' },
    qq:          { from: '#12B7F5', via: '#0ea5d9', to: '#0880b0', pattern: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 60%)' },
    xianyu:      { from: '#FFB300', via: '#FFC107', to: '#FF8F00', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)' },
    taobao:      { from: '#FF5000', via: '#FF6B00', to: '#E64500', pattern: 'radial-gradient(circle at 80% 80%, rgba(255,220,0,0.2) 0%, transparent 50%)' },
    xiaohongshu: { from: '#ff2442', via: '#ff1a35', to: '#d4001a', pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)' },
    bundle:      { from: '#8b5cf6', via: '#7c3aed', to: '#6d28d9', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)' },
    verification: { from: '#3f51b5', via: '#3949ab', to: '#303f9f', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)' },
    fintech:      { from: '#10b981', via: '#059669', to: '#047857', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)' },
    default:     { from: '#1e293b', to: '#0f172a', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)' },
};

const categoryStyleMap: Record<string, { bg: string, chipColor: string, chipText: string, textColor: string }> = {
    wechat: { bg: 'bg-[#07C160]', chipColor: 'bg-[#07C160]', chipText: 'text-white', textColor: 'text-[#07C160]' },
    alipay: { bg: 'bg-[#1677ff]', chipColor: 'bg-[#1677ff]', chipText: 'text-white', textColor: 'text-[#1677ff]' },
    douyin: { bg: 'bg-black', chipColor: 'bg-black', chipText: 'text-white', textColor: 'text-black' },
    qq: { bg: 'bg-[#12B7F5]', chipColor: 'bg-[#12B7F5]', chipText: 'text-white', textColor: 'text-[#12B7F5]' },
    xianyu: { bg: 'bg-[#FFE200]', chipColor: 'bg-[#FFE200]', chipText: 'text-black', textColor: 'text-[#996600]' },
    taobao: { bg: 'bg-[#FF5000]', chipColor: 'bg-[#FF5000]', chipText: 'text-white', textColor: 'text-[#FF5000]' },
    xiaohongshu: { bg: 'bg-[#ff2442]', chipColor: 'bg-[#ff2442]', chipText: 'text-white', textColor: 'text-[#ff2442]' },
    bundle: { bg: 'bg-purple-500', chipColor: 'bg-purple-500', chipText: 'text-white', textColor: 'text-purple-600' },
    verification: { bg: 'bg-indigo-500', chipColor: 'bg-indigo-500', chipText: 'text-white', textColor: 'text-indigo-600' },
    fintech: { bg: 'bg-emerald-500', chipColor: 'bg-emerald-500', chipText: 'text-white', textColor: 'text-emerald-600' },
    default: { bg: 'bg-slate-900', chipColor: 'bg-slate-900', chipText: 'text-white', textColor: 'text-slate-900' }
};

const categoryNameMap: Record<string, { zh: string, en: string }> = {
    wechat: { zh: '微信', en: 'WeChat' },
    alipay: { zh: '支付宝', en: 'Alipay' },
    douyin: { zh: '抖音', en: 'Douyin' },
    qq: { zh: 'QQ', en: 'QQ' },
    xianyu: { zh: '闲鱼', en: 'Xianyu' },
    taobao: { zh: '淘宝', en: 'Taobao' },
    xiaohongshu: { zh: '小红书', en: 'Xiaohongshu' },
    bundle: { zh: '组合套装', en: 'Bundle' },
    verification: { zh: '实名代办', en: 'Verification' },
    fintech: { zh: '金融交易', en: 'FinTech' },
};

export function MarketplaceProductCard({
    title,
    price,
    originalPrice,
    stock,
    category,
    salesVolume = "500+件",
    badges = ["现货", "72H售后", "防封"],
    onBuyNow,
    onPreview
}: ProductCardProps) {
    const catKey = category.toLowerCase();
    const isBundle = catKey === 'bundle';
    const style = categoryStyleMap[catKey] || categoryStyleMap.default;
    const catName = categoryNameMap[catKey] || { zh: category, en: category };
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
    const saveAmount = originalPrice ? Math.max(0, originalPrice - price).toFixed(2) : '0';

    // Bundles use a generic generic star/gift icon or fallback to first item
    const BrandIcon = BRAND_ICON_MAP[catKey] || BRAND_ICON_MAP.xianyu;
    const gradient = BRAND_GRADIENTS[catKey] || BRAND_GRADIENTS.default;
    const stockPct = Math.min(100, Math.max(0, (stock / 50) * 100));
    const stockColor = stock > 20 ? '#07C160' : stock > 5 ? '#FF8C00' : '#FF0036';

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.18)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="group relative bg-white dark:bg-dark-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full ring-1 ring-slate-100/50 dark:ring-white/5"
            style={{ willChange: 'transform' }}
        >
            {/* ── Image Area: Brand Gradient Background ── */}
            <div
                className="relative aspect-[3/2.2] overflow-hidden flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)` }}
            >
                {/* Radial highlight overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: gradient.pattern }} />

                {/* Subtle dot grid pattern for depth */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '18px 18px'
                    }}
                />

                {/* Top-left Category + Discount chips */}
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    <span className="bg-black/20 backdrop-blur-sm text-white text-[10px] md:text-xs font-black px-2 py-1 rounded-xl shadow flex items-center gap-1 uppercase tracking-tighter">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {catName.zh}
                    </span>
                    {isBundle && originalPrice ? (
                        <span className="bg-[#FF0036]/90 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg shadow border border-red-500/30">
                            立省 ¥{saveAmount}
                        </span>
                    ) : discount > 0 ? (
                        <span className="bg-white/90 text-[#FF0036] text-[10px] font-black px-1.5 py-0.5 rounded-lg shadow">
                            -{discount}%
                        </span>
                    ) : null}
                </div>

                {/* Top-right Auto Delivery Badge */}
                <div className="absolute top-2 right-2 z-20">
                    <span className="bg-white/90 text-[#FF0036] text-[10px] md:text-xs font-black px-2 py-1 rounded-xl shadow flex items-center gap-1 uppercase tracking-tighter">
                        <Zap className="w-3 h-3 fill-[#FF0036]" />
                        自动发货
                    </span>
                </div>

                {/* Flat Brand Icon Bubble — iOS App Icon style */}
                <div
                    className="relative z-10 bg-white rounded-[18px] shadow-lg p-2 md:p-2.5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                    style={{ width: 72, height: 72 }}
                >
                    <BrandIcon className="w-full h-full" />
                </div>

                {/* Bottom: delivery time chip */}
                <div className="absolute bottom-2 right-2 z-20">
                    <span className="bg-black/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        极速发货
                    </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center z-30 gap-3">
                    {onPreview && (
                        <motion.button
                            initial={{ y: 16, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={(e) => { e.stopPropagation(); onPreview(); }}
                            className="bg-white/90 text-slate-800 px-4 py-2.5 rounded-full text-sm font-black flex items-center gap-1.5 shadow-xl"
                        >
                            <Eye className="w-4 h-4" />
                            预览
                        </motion.button>
                    )}
                    <motion.button
                        initial={{ y: 16, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white text-[#FF0036] px-5 py-2.5 rounded-full text-sm font-black flex items-center gap-2 shadow-xl"
                    >
                        详情
                        <ChevronRight className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* ── Content Section ── */}
            <div className="p-3 flex flex-col flex-1">
                {/* Product Title */}
                <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-white leading-snug mb-1.5 line-clamp-2 min-h-[2.1rem] tracking-tight">
                    {title}
                </h3>
                
                {isBundle && (
                    <div className="flex flex-col gap-1 mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                            <span className="flex items-center gap-1"><span className="text-green-500">✓</span> 支付宝</span>
                            <span className="text-slate-300 dark:text-slate-600">+</span>
                            <span className="flex items-center gap-1"><span className="text-green-500">✓</span> 闲鱼</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            已预先绑定 (Pre-linked)
                        </div>
                    </div>
                )}

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {badges.map((badge, idx) => (
                        <span
                            key={idx}
                            className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap"
                            style={{
                                color: gradient.from,
                                backgroundColor: `${gradient.from}12`,
                                borderColor: `${gradient.from}30`,
                            }}
                        >
                            {badge}
                        </span>
                    ))}
                </div>

                {/* Price Section */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-0.5">
                        <span className="text-xl md:text-2xl font-black tabular-nums tracking-tighter" style={{ color: gradient.from }}>
                            {formatYuan(price)}
                        </span>
                        {originalPrice && (
                            <span className="text-slate-400 text-[10px] line-through ml-1">
                                {formatYuan(originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Sales & Stock Row */}
                    <div className="flex items-center justify-between text-[10px] md:text-xs mb-1.5">
                        <span className="text-slate-400 font-medium">{salesVolume}</span>
                        <span className="font-bold" style={{ color: stockColor }}>
                            仅剩 {stock} 件
                        </span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stockPct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: stockColor }}
                        />
                    </div>

                    {/* Buy Button with shimmer */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ opacity: 0.92 }}
                        onClick={onBuyNow}
                        className="relative w-full py-2.5 rounded-xl font-black text-sm text-white shadow-lg overflow-hidden flex items-center justify-center gap-1.5"
                        style={{ background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)` }}
                    >
                        {/* Shimmer sweep */}
                        <span
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer-sweep 2.4s ease-in-out infinite',
                            }}
                        />
                        <span className="relative z-10 text-base">立即购买</span>
                        <ChevronRight className="relative z-10 w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
