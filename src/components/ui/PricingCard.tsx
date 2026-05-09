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
import { PriceTag } from './PriceTag';
import { FlashCountdown } from './FlashCountdown';
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
                    boxShadow: `0 0 8px ${meta.color}60`,
                    opacity: 0.4,
                }}
            />
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"
                style={{ background: '#00E5FF', boxShadow: '0 0 12px rgba(0,229,255,0.5)' }}
            />

            {/* Image Container (aspect-square) */}
            <Link 
                href={getLocalizedPath(`/product/${product.id}`, lang)} 
                className="relative aspect-square w-full block overflow-hidden bg-[#060B18] p-6 border-b border-[#1E2D45]"
            >
                {/* Visual Flair */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0D1526] to-transparent z-10 pointer-events-none" />
                
                {product.badge && (
                    <div className="absolute top-3 left-4 bg-[#FF2D55]/10 text-[#FF2D55] text-[10px] font-black px-2 py-0.5 rounded border border-[#FF2D55]/30 z-20">
                        {product.badge[lang]}
                    </div>
                )}
                
                {/* Image / Icon */}
                <div className="relative w-full h-full flex items-center justify-center z-0">
                    <div 
                        className="relative w-3/4 h-3/4 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 flex items-center justify-center p-0"
                        style={{ backgroundColor: meta.color + '05', border: `1px solid ${meta.color}20` }}
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
                            return <Icon className="w-1/2 h-1/2" style={{ color: meta.color }} />;
                        })()}
                    </div>
                    {/* Shadow underneath */}
                    <div className="absolute bottom-[10%] w-1/2 h-2 bg-black/40 blur-xl rounded-full scale-x-150 transition-transform duration-500 group-hover:scale-x-110" />
                    
                    {/* Google Play Store Badge */}
                    {product.hasGooglePlay && (
                        <div className="absolute bottom-2 right-2 bg-[#0D1526] p-1.5 rounded-lg shadow-lg border border-[#1E2D45] z-20">
                            <GooglePlayIcon className="w-6 h-6" />
                        </div>
                    )}
                </div>

                <div className="absolute bottom-3 inset-x-0 px-4 flex justify-between items-end text-white z-20">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-[#7B91B0] uppercase tracking-wider mb-0.5">{lang === 'zh' ? '已售' : 'SOLD'}</span>
                        <span className="text-xs font-bold text-[#F0F4FF] bg-[#060B18]/80 px-1.5 py-0.5 rounded border border-[#1E2D45] backdrop-blur-sm">
                            {soldCount > 1000 ? `${(soldCount/1000).toFixed(1)}k+` : soldCount}
                        </span>
                    </div>
                    {isLowStock && !isOutOfStock && (
                        <span className="text-[10px] font-bold text-[#FF2D55] bg-[#FF2D55]/10 border border-[#FF2D55]/20 px-1.5 py-0.5 rounded animate-pulse backdrop-blur-sm">
                            仅剩 {product.stockCount}件
                        </span>
                    )}
                </div>
            </Link>

            {/* Card Body */}
            <div className="pl-5 pr-4 pt-4 pb-4 flex flex-col flex-1 relative z-20">
                {/* Header row: category + discount */}
                <div className="flex items-center gap-2 mb-2">
                    <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-current"
                        style={{ color: meta.color, background: `${meta.color}05` }}
                    >
                        {meta.label}
                    </span>
                    {discount && (
                        <span className="text-[9px] font-black text-white bg-[#FF2D55] px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(255,45,85,0.4)]">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link href={getLocalizedPath(`/product/${product.id}`, lang)} className="mb-3 block">
                    <h3 className="text-sm font-semibold text-[#F0F4FF] leading-snug line-clamp-2 group-hover:text-[#00E5FF] transition-colors">
                        {product.name?.[lang] || product.tierName[lang]}
                    </h3>
                </Link>

                {/* Price block */}
                <div className="flex items-end justify-between mb-4 mt-auto">
                    <PriceTag 
                        price={product.price.single} 
                        originalPrice={product.price.originalPrice?.single}
                    />
                    {discount && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-[#FF0036] bg-[#FF0036]/10 px-1.5 py-0.5 rounded border border-[#FF0036]/20">
                                {discount}% OFF
                            </span>
                        </div>
                    )}
                </div>

                {/* Data row */}
                <div className="grid grid-cols-3 gap-0 border border-white/5 rounded-lg mb-4 overflow-hidden text-center bg-black/40 backdrop-blur-md">
                    <div className="py-2 border-r border-white/5">
                        <p className="text-[8px] text-white/30 uppercase tracking-widest mb-0.5">{product.stockCount >= 1000 ? 'Stock' : 'Qty'}</p>
                        <p className={`text-[12px] font-black font-mono-price ${isOutOfStock ? 'text-[#FF2D55]' : 'text-white'}`}>
                            {product.stockCount > 999 ? '999+' : product.stockCount}
                        </p>
                    </div>
                    <div className="py-2 border-r border-white/5">
                        <p className="text-[8px] text-white/30 uppercase tracking-widest mb-0.5">Sold</p>
                        <p className="text-[12px] font-black font-mono-price text-white">{soldCount > 999 ? '999+' : soldCount}</p>
                    </div>
                    <div className="py-2">
                        <p className="text-[8px] text-white/30 uppercase tracking-widest mb-0.5">Ship</p>
                        <p className="text-[12px] font-black font-mono-price text-[#07C160]">⚡</p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {product.warranty && (
                        <span className="text-[9px] font-bold text-[#07C160] border border-[#07C160]/20 bg-[#07C160]/5 px-2 py-0.5 rounded-full">
                            {product.warranty[lang]} {lang === 'zh' ? '质保' : 'Warranty'}
                        </span>
                    )}
                    <span className="text-[9px] font-bold text-white/40 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                        {lang === 'zh' ? '自动发货' : 'Auto-Delivery'}
                    </span>
                </div>

                {/* Flash Sale Banner */}
                {product.popular && !isOutOfStock && (
                    <div className="mb-4">
                        <FlashCountdown />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    {isOutOfStock ? (
                        <button disabled className="w-full bg-[#1E2D45] text-[#7B91B0] py-2.5 rounded text-xs font-bold uppercase tracking-wider cursor-not-allowed">
                            {lang === 'zh' ? '已售罄' : 'SOLD OUT'}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addItem(product.id, 1);
                                }}
                                className="flex items-center justify-center w-10 py-2.5 rounded text-xs font-medium border border-[#1E2D45] text-[#7B91B0] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-colors relative z-20 cursor-pointer"
                            >
                                <ShoppingCart className="w-4 h-4 pointer-events-none" />
                            </button>
                            <Link
                                href={getLocalizedPath(`/product/${product.id}`, lang)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 relative z-20 cursor-pointer overflow-hidden group/btn"
                                style={{
                                    background: 'linear-gradient(135deg, #FF2D55 0%, #FF5000 100%)',
                                    boxShadow: '0 2px 12px rgba(255,45,85,0.25)',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(255,45,85,0.5)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 12px rgba(255,45,85,0.25)'; }}
                            >
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-12" />
                                <Zap className="w-3.5 h-3.5" />
                                {lang === 'zh' ? '立刻抢购' : 'BUY NOW'}
                            </Link>
                        </>
                    )}
                </div>
            </div>

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
