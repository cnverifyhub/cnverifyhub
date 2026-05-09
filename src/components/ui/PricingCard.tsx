'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, TrendingDown } from 'lucide-react';
import { StockBadge } from './StockBadge';
import type { Product } from '@/types';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { 
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, 
    BundleIcon, VerificationIcon, FintechIcon,
    PassportVerifyIcon, FaceVerifyIcon, KycPackageIcon, WechatRealnameIcon, AlipayRealnameIcon,
    XmIcon, HfmIcon, NetellerIcon, SkrillIcon, PayoneerIcon, WiseIcon, RevolutIcon, GooglePlayIcon
} from './BrandIcons';

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
    // Categories
    wechat: WeChatIcon, alipay: AlipayIcon, douyin: DouyinIcon,
    qq: QQIcon, xianyu: XianyuIcon, taobao: TaobaoIcon, xiaohongshu: XiaohongshuIcon,
    bundle: BundleIcon, verification: VerificationIcon, trading: FintechIcon,
    // Specific Products
    'verify-passport': PassportVerifyIcon, 'verify-face': FaceVerifyIcon, 'verify-kyc': KycPackageIcon,
    'verify-wechat': WechatRealnameIcon, 'verify-alipay': AlipayRealnameIcon,
    'xm-account': XmIcon, 'hfm-account': HfmIcon, 'neteller-account': NetellerIcon,
    'skrill-account': SkrillIcon, 'payoneer-account': PayoneerIcon, 'wise-account': WiseIcon,
    wise: WiseIcon, 'revolut-account': RevolutIcon
};

const BRAND_META: Record<string, { color: string; label: string }> = {
    wechat:       { color: '#07C160', label: 'WeChat' },
    alipay:       { color: '#1677ff', label: 'Alipay' },
    douyin:       { color: '#ffffff', label: 'Douyin' },
    qq:           { color: '#12B7F5', label: 'QQ' },
    xianyu:       { color: '#FFB300', label: 'Xianyu' },
    taobao:       { color: '#FF5000', label: 'Taobao' },
    xiaohongshu:  { color: '#ff2442', label: 'XHS' },
    bundle:       { color: '#8b5cf6', label: 'Bundle' },
    verification: { color: '#00E5FF', label: 'KYC' },
    trading:      { color: '#FFB800', label: 'Trading' },
    wise:         { color: '#9FE870', label: 'Wise' },
    default:      { color: '#7B91B0', label: 'Digital' },
};

interface PricingCardProps {
    product: Product;
    lang: Lang;
}

export function PricingCard({ product, lang }: PricingCardProps) {
    const isOutOfStock = product.stockCount === 0;
    const addItem = useCartStore((state) => state.addItem);
    const meta = BRAND_META[product.category] || BRAND_META.default;

    const [timeLeft, setTimeLeft] = useState(() => {
        const idSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 7200 + (idSum % 3600);
    });

    useEffect(() => {
        if (!product.popular || isOutOfStock) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [product.popular, isOutOfStock]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Derive stable sold count
    const categorySeed = product.category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const idSeed = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const soldCount = (product as any).sold ?? ((idSeed * 7 + categorySeed * 3) % 1800 + 120);

    const discount = product.price.originalPrice && product.price.originalPrice.single > product.price.single
        ? Math.round((1 - product.price.single / product.price.originalPrice.single) * 100)
        : null;

    const isLowStock = product.stockCount > 0 && product.stockCount <= 10;

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.tierName[lang],
        description: product.description[lang],
        image: `https://CNVerifyHub.com/images/categories/${product.category}.webp`,
        brand: {
            '@type': 'Brand',
            'name': 'CNVerifyHub'
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USDT',
            price: product.price.single,
            itemCondition: 'https://schema.org/NewCondition',
            availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            url: `https://CNVerifyHub.com/product/${product.id}`
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: (product as any).rating || '4.9',
            reviewCount: (product as any).review_count || Math.max(120, soldCount)
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="group relative flex flex-col bg-[#0D1526] border border-[#1E2D45] hover:border-[#00E5FF]/30 transition-all duration-250 overflow-hidden"
            style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.03)' }}
        >
            {/* Left accent stripe */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 z-10 pointer-events-none"
                style={{
                    background: meta.color,
                    boxShadow: `0 0 10px ${meta.color}80`,
                    opacity: 0.6,
                }}
            />
            <div
                className="absolute left-0 top-0 bottom-0 w-[4px] opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none"
                style={{ background: '#00E5FF', boxShadow: '0 0 15px rgba(0,229,255,0.7)' }}
            />

            {/* Image Container (aspect-square) */}
            <Link 
                href={getLocalizedPath(`/product/${product.id}`, lang)} 
                className="relative aspect-square w-full block overflow-hidden bg-[#060B18] p-5 border-b border-[#1E2D45]"
            >
                {/* Visual Flair: Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-cyber-grid pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0D1526] to-transparent z-10 pointer-events-none" />
                
                {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#FF2D55] text-white text-[10px] font-black px-2 py-0.5 rounded-sm shadow-[0_0_12px_rgba(255,45,85,0.5)] z-20 animate-pulse">
                        {product.badge[lang]}
                    </div>
                )}

                {discount && (
                    <div className="absolute top-3 right-3 bg-[#00E5FF] text-[#060B18] text-[10px] font-black px-1.5 py-0.5 rounded-sm z-20 shadow-neon-cyan-sm">
                        -{discount}%
                    </div>
                )}
                
                {/* Image / Icon */}
                <div className="relative w-full h-full flex items-center justify-center z-0">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="relative w-3/5 h-3/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 flex items-center justify-center"
                        style={{ backgroundColor: meta.color + '08', border: `1px solid ${meta.color}30` }}
                    >
                        {product.image ? (
                            <Image 
                                src={product.image} 
                                alt={product.tierName[lang]} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 200px, 300px"
                                priority={product.popular}
                            />
                        ) : (() => {
                            const Icon = ICON_COMPONENTS[product.id] || ICON_COMPONENTS[product.category] || WeChatIcon;
                            return <Icon className="w-1/2 h-1/2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ color: meta.color }} />;
                        })()}
                    </motion.div>
                    
                    {/* Floating Glow */}
                    <div className="absolute inset-0 bg-radial-gradient from-[#00E5FF10] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Google Play Store Badge */}
                    {product.hasGooglePlay && (
                        <div className="absolute bottom-2 right-2 bg-[#0D1526]/80 backdrop-blur-md p-1 rounded border border-[#1E2D45] z-20 shadow-lg">
                            <GooglePlayIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {/* Bottom stats row */}
                <div className="absolute bottom-2.5 inset-x-3.5 flex justify-between items-end z-20">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-[#7B91B0] uppercase tracking-widest leading-none mb-1 opacity-70">
                            {lang === 'zh' ? '累积已售' : 'TOTAL SOLD'}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#07C160] animate-pulse" />
                            <span className="text-xs font-black text-[#F0F4FF] tabular-nums">
                                {soldCount > 999 ? `${(soldCount/1000).toFixed(1)}k+` : soldCount}
                            </span>
                        </div>
                    </div>
                    {isLowStock && !isOutOfStock && (
                        <div className="flex flex-col items-end">
                             <span className="text-[8px] font-bold text-[#FF2D55] uppercase tracking-widest leading-none mb-1">
                                {lang === 'zh' ? '抢购中' : 'HURRY'}
                            </span>
                            <span className="text-[10px] font-black text-[#FF2D55] bg-[#FF2D55]/10 border border-[#FF2D55]/30 px-1.5 py-0.5 rounded-sm animate-pulse">
                                {lang === 'zh' ? `仅剩${product.stockCount}件` : `${product.stockCount} LEFT`}
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Card Body */}
            <div className="px-5 pt-5 pb-5 flex flex-col flex-1 relative z-20 bg-[#0D1526]">
                {/* Meta Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="text-[10px] font-black text-[#7B91B0] uppercase tracking-widest">{meta.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#07C160]">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>{lang === 'zh' ? '秒发' : 'INSTANT'}</span>
                    </div>
                </div>

                {/* Title */}
                <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="mb-4 block">
                    <h3 className="text-sm md:text-base font-bold text-[#F0F4FF] leading-tight line-clamp-2 group-hover:text-[#00E5FF] transition-colors duration-300">
                        {product.name?.[lang] || product.tierName[lang]}
                    </h3>
                </Link>

                {/* Price block - HD Design */}
                <div className="flex flex-col gap-1 mb-5 mt-auto">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-[#FF2D55]">¥</span>
                        <span className="font-mono-price text-3xl font-black text-white tracking-tighter">
                            {product.price.single}
                        </span>
                        {product.price.originalPrice && product.price.originalPrice.single > product.price.single && (
                            <span className="font-mono-price text-xs text-[#7B91B0] line-through opacity-50 ml-1">
                                ¥{product.price.originalPrice.single}
                            </span>
                        )}
                    </div>
                    {discount && (
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-[#07C160] bg-[#07C160]/10 px-1.5 py-0.5 rounded-sm">
                                <TrendingDown className="w-3 h-3" />
                                {lang === 'zh' ? '立省' : 'SAVE'} ¥{Math.round(product.price.originalPrice!.single - product.price.single)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Key Benefits Grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="bg-[#060B18] border border-[#1E2D45] rounded-lg p-2 flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-[#7B91B0] uppercase tracking-tighter opacity-60">
                            {lang === 'zh' ? '售后保障' : 'WARRANTY'}
                        </span>
                        <span className="text-[10px] font-black text-[#F0F4FF] truncate">
                            {product.warranty?.[lang] || '72H'} {lang === 'zh' ? '质保' : 'Warr.'}
                        </span>
                    </div>
                    <div className="bg-[#060B18] border border-[#1E2D45] rounded-lg p-2 flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-[#7B91B0] uppercase tracking-tighter opacity-60">
                            {lang === 'zh' ? '库存状态' : 'STOCK'}
                        </span>
                        <span className={cn(
                            "text-[10px] font-black truncate",
                            isOutOfStock ? "text-[#FF2D55]" : "text-[#00E5FF]"
                        )}>
                            {isOutOfStock ? (lang === 'zh' ? '抢光了' : 'SOLD OUT') : (product.stockCount > 500 ? '999+' : product.stockCount)}
                        </span>
                    </div>
                </div>

                {/* Flash Sale Countdown (if popular) */}
                {product.popular && !isOutOfStock && (
                    <div className="mb-5 relative group/timer">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2D55] to-[#FF5000] opacity-10 blur-md rounded-xl" />
                        <div className="relative border border-[#FF2D55]/30 bg-[#060B18]/50 backdrop-blur-md rounded-xl overflow-hidden p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF2D55] to-[#FF5000] flex items-center justify-center shadow-neon-red-sm">
                                    <Zap className="w-3.5 h-3.5 text-white fill-current" />
                                </div>
                                <span className="text-[10px] font-black text-white tracking-widest">
                                    {lang === 'zh' ? '限时抢购' : 'FLASH SALE'}
                                </span>
                            </div>
                            <div className="flex gap-1 items-center">
                                {formatTime(timeLeft).split(':').map((unit, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="w-6 h-7 bg-[#0D1526] border border-[#1E2D45] rounded flex items-center justify-center text-[11px] font-black text-[#FF2D55] font-mono">
                                            {unit}
                                        </div>
                                        {i < 2 && <span className="text-[#FF2D55] font-black text-xs animate-pulse">:</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    {isOutOfStock ? (
                        <button disabled className="w-full bg-[#1E2D45] text-[#7B91B0] py-3.5 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed border border-[#1E2D45]">
                            {lang === 'zh' ? '暂时缺货' : 'OUT OF STOCK'}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addItem(product.id, 1);
                                }}
                                className="w-12 h-12 rounded-xl border border-[#1E2D45] text-[#7B91B0] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all duration-300 flex items-center justify-center active:scale-95 group/cart"
                            >
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <Link
                                href={getLocalizedPath(`/product/${product.id}`, lang)}
                                className="flex-1 cyber-btn-primary rounded-xl flex items-center justify-center gap-2 group/buy active:scale-[0.98]"
                            >
                                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-black tracking-widest">
                                    {lang === 'zh' ? '立刻抢购' : 'GET IT NOW'}
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Shine effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]" />
            
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        </motion.div>


            {/* Hover shimmer overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(0,229,255,0.02) 100%)' }}
            />
            
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        </motion.div>
    );
}

const STOCK_LEVELS = {
    LOW: 10,
    CRITICAL: 5
};
