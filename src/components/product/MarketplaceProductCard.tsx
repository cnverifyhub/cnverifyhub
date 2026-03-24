import React from 'react';
import Image from 'next/image';
import { ShoppingCart, ShieldCheck, Zap, Star, ChevronRight } from 'lucide-react';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon } from '@/components/ui/BrandIcons';

const iconMap: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
};

interface ProductCardProps {
    title: string;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
    salesVolume?: string; // e.g., "月销 500+"
    badges?: string[];
    onBuyNow?: () => void;
}

const categoryStyleMap: Record<string, { bg: string, iconScale: string }> = {
    wechat: { bg: 'bg-[#07C160]', iconScale: 'scale-100' },
    alipay: { bg: 'bg-[#1677ff]', iconScale: 'scale-100' },
    douyin: { bg: 'bg-[#000000]', iconScale: 'scale-90' },
    qq: { bg: 'bg-[#12B7F5]', iconScale: 'scale-100' },
    xianyu: { bg: 'bg-[#FFE200]', iconScale: 'scale-110' },
    taobao: { bg: 'bg-[#FF5000]', iconScale: 'scale-110' },
    xiaohongshu: { bg: 'bg-[#ff2442]', iconScale: 'scale-100' },
    default: { bg: 'bg-slate-900', iconScale: 'scale-100' }
};

export function MarketplaceProductCard({
    title,
    price,
    originalPrice,
    stock,
    category,
    salesVolume = "500+ 件已售",
    badges = ["现货秒发", "72小时售后", "防封耐用"],
    onBuyNow
}: ProductCardProps) {
    const catKey = category.toLowerCase();
    const IconComponent = iconMap[catKey] || Zap;
    const style = categoryStyleMap[catKey] || categoryStyleMap.default;
    const taobaoRed = "#FF0036";

    return (
        <div className="group relative bg-white dark:bg-dark-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full ring-1 ring-slate-100/50 dark:ring-white/5">
            {/* 16:9 Image Container with Branding Colors */}
            <div className={`relative aspect-[16/9] ${style.bg} overflow-hidden flex items-center justify-center`}>
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] pointer-events-none"></div>
                
                {/* Icon with Dynamic Scaling */}
                <div className={`relative w-20 h-20 md:w-24 md:h-24 z-10 transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1) group-hover:scale-110 group-hover:rotate-3 ${style.iconScale}`}>
                    <IconComponent className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] filter brightness-100 invert-0" />
                </div>
                
                {/* Inner Glow / Radial Highlight */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>

                {/* Top-right "Auto Delivery" Badge */}
                <div className="absolute top-2 right-2 z-20">
                    <span className="bg-[#FF0036] text-white text-[10px] md:text-xs font-black px-2 py-1 rounded-sm shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                        <Zap className="w-3 h-3 fill-white" />
                        自动发货
                    </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-30">
                    <button className="bg-white text-[#FF0036] px-5 py-2.5 rounded-full text-sm font-black flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-xl scale-90 group-hover:scale-100 hover:bg-[#FF0036] hover:text-white">
                        查看详情
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-3 md:p-4 flex flex-col flex-1">
                {/* Product Title - Source Han Sans styled via globals.css font-chinese */}
                <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-snug mb-2 line-clamp-2 min-h-[2.5rem] tracking-tight group-hover:text-[#FF0036] transition-colors duration-300">
                    {title}
                </h3>

                {/* Trust Badges - High Density */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {badges.map((badge, idx) => (
                        <span key={idx} className="text-[10px] sm:text-[11px] bg-red-50 dark:bg-red-900/10 text-[#FF0036] px-2 py-0.5 rounded-sm border border-red-100 dark:border-red-900/20 font-bold whitespace-nowrap">
                            {badge}
                        </span>
                    ))}
                </div>

                {/* Price & Stock & Sales info */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 pb-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[#FF0036] text-sm font-bold">¥</span>
                            <span className="text-[#FF0036] text-2xl md:text-3xl font-black tabular-nums tracking-tighter drop-shadow-sm">
                                {price.toFixed(2)}
                            </span>
                            {originalPrice && (
                                <span className="text-slate-400 text-xs line-through ml-1.5 opacity-60">
                                    ¥{originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <span className="text-slate-400 text-[10px] md:text-sm font-bold italic opacity-60">
                            已售 {salesVolume}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                         <span className="text-[#fa8c16] text-[10px] md:text-xs font-black bg-orange-50 dark:bg-orange-900/10 px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/20">
                            仅剩 {stock} 件
                        </span>

                        {/* Buy Now Button - Taobao Gradient */}
                        <button
                            onClick={onBuyNow}
                            className="bg-gradient-to-r from-[#FF5000] to-[#FF0036] text-white text-xs md:text-sm font-black px-5 py-2 rounded-lg shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest hover:brightness-110 hover:-translate-y-0.5"
                        >
                            立即抢购
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
