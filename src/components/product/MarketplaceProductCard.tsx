import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, ShieldCheck, Clock, TrendingDown, Timer } from 'lucide-react';
import { formatYuan } from '@/lib/utils';
import { useTenantConfig } from '@/components/providers/TenantProvider';
import {
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon,
    XianyuIcon, TaobaoIcon, XiaohongshuIcon,
    BundleIcon, VerificationIcon, FintechIcon
} from '@/components/ui/BrandIcons';

interface ProductCardProps {
    title: string;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
    salesVolume?: string;
    badges?: string[];
    deliveryTime?: string;
    type?: string;
    onBuyNow?: () => void;
    onPreview?: () => void;
}

const BRAND_ICON_MAP: Record<string, React.ElementType> = {
    wechat: WeChatIcon, alipay: AlipayIcon, douyin: DouyinIcon,
    qq: QQIcon, xianyu: XianyuIcon, taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon, bundle: BundleIcon,
    verification: VerificationIcon, trading: FintechIcon,
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
    default:      { color: '#7B91B0', label: 'Digital' },
};

export function MarketplaceProductCard({
    title, price, originalPrice, stock, category,
    salesVolume, badges = [], deliveryTime,
    onBuyNow, onPreview,
}: ProductCardProps) {
    const tenantConfig = useTenantConfig();
    const Icon = BRAND_ICON_MAP[category] || BRAND_ICON_MAP.bundle;
    const meta = BRAND_META[category] || BRAND_META.default;
    
    const showDiscount = tenantConfig.pricing.showDiscountPercent && originalPrice && originalPrice > price;
    const showOriginalPrice = tenantConfig.pricing.showOriginalPrice && originalPrice && originalPrice > price;
    const discount = showDiscount ? Math.round((1 - price / originalPrice!) * 100) : null;
    const isLowStock = stock <= 10;

    const showStock = tenantConfig.ui.showStockCount;
    const showSold = tenantConfig.ui.showSoldCount;
    const showProductCountdown = tenantConfig.ui.countdownPosition === 'product';
    const bulkTiers = tenantConfig.pricing.bulkTiers || [];
    const isMinimal = tenantConfig.ui.productCard === 'minimal';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`group relative flex flex-col bg-[#0D1526] border border-[#1E2D45] hover:border-[#00E5FF]/30 transition-all duration-250 overflow-hidden ${
                isMinimal ? 'rounded-lg' : 'rounded-xl'
            }`}
            style={{
                boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
            }}
            whileHover={{ y: -2 }}
        >
            {/* Left accent stripe */}
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
                style={{
                    background: meta.color,
                    boxShadow: `0 0 8px ${meta.color}60`,
                    opacity: 0.4,
                }}
            />
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: tenantConfig.branding.primary, boxShadow: `0 0 12px ${tenantConfig.branding.primary}80` }}
            />

            {/* Card body */}
            <div className="pl-5 pr-4 pt-4 pb-3 flex flex-col flex-1">
                {/* Header row: icon + category + badge */}
                <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 shrink-0">
                        <Icon className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{ color: meta.color, background: `${meta.color}18` }}
                            >
                                {meta.label}
                            </span>
                            {showStock && isLowStock && (
                                <span className="text-[9px] font-bold text-[#FF2D55] bg-[#FF2D55]/10 px-1.5 py-0.5 rounded animate-pulse">
                                    仅剩 {stock}件
                                </span>
                            )}
                            {showProductCountdown && (
                                <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded animate-pulse">
                                    <Timer className="w-3 h-3" /> 限时特惠
                                </span>
                            )}
                        </div>
                    </div>
                    {discount && (
                        <span className="shrink-0 text-[9px] font-black text-white bg-[#FF2D55] px-1.5 py-0.5 rounded">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#F0F4FF] leading-snug mb-3 line-clamp-2">
                    {title}
                </h3>

                {/* Price block */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-mono-price text-xl font-bold text-[#F0F4FF]">
                        {tenantConfig.pricing.currencySymbol}{Math.round(price)}
                    </span>
                    {showOriginalPrice && (
                        <span className="font-mono-price text-xs text-[#7B91B0] line-through">
                            {tenantConfig.pricing.currencySymbol}{Math.round(originalPrice!)}
                        </span>
                    )}
                    {discount && (
                        <span className="ml-auto flex items-center gap-0.5 text-[10px] font-bold text-[#07C160]">
                            <TrendingDown className="w-3 h-3" />省{formatYuan(originalPrice! - price)}
                        </span>
                    )}
                </div>

                {/* Bulk Pricing Tier Table (CNWePro) */}
                {bulkTiers.length > 0 && (
                    <div className="mb-3 p-2 bg-[#060B18] border border-[#1E2D45] rounded text-[10px]">
                        <p className="font-bold text-[#7B91B0] mb-1">批发优惠 (Bulk Tiers):</p>
                        <div className="space-y-0.5">
                            {bulkTiers.map((tier, idx) => (
                                <div key={idx} className="flex items-center justify-between text-slate-300">
                                    <span>{tier.label}</span>
                                    <span className="font-mono font-bold text-emerald-400">
                                        {tenantConfig.pricing.currencySymbol}{Math.round(price * (1 - tier.discount))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Data row (conditional counts) */}
                {(showStock || showSold) && (
                    <div className="grid grid-cols-3 gap-0 border border-[#1E2D45] rounded mb-3 overflow-hidden text-center">
                        {showStock ? (
                            <div className="py-1.5 border-r border-[#1E2D45]">
                                <p className="text-[9px] text-[#7B91B0] mb-0.5">{stock >= 1000 ? '充足' : '库存'}</p>
                                <p className="text-[11px] font-mono font-bold text-[#F0F4FF]">{stock > 999 ? '999+' : stock}</p>
                            </div>
                        ) : (
                            <div className="py-1.5 border-r border-[#1E2D45]">
                                <p className="text-[9px] text-[#7B91B0] mb-0.5">状态</p>
                                <p className="text-[11px] font-mono font-bold text-[#07C160]">现货</p>
                            </div>
                        )}
                        {showSold ? (
                            <div className="py-1.5 border-r border-[#1E2D45]">
                                <p className="text-[9px] text-[#7B91B0] mb-0.5">已售</p>
                                <p className="text-[11px] font-mono font-bold text-[#F0F4FF]">{salesVolume || '500+'}</p>
                            </div>
                        ) : (
                            <div className="py-1.5 border-r border-[#1E2D45]">
                                <p className="text-[9px] text-[#7B91B0] mb-0.5">质保</p>
                                <p className="text-[11px] font-mono font-bold text-[#F0F4FF]">72小时</p>
                            </div>
                        )}
                        <div className="py-1.5">
                            <p className="text-[9px] text-[#7B91B0] mb-0.5">发货</p>
                            <p className="text-[11px] font-mono font-bold text-[#07C160]">{deliveryTime || tenantConfig.delivery.promiseText}</p>
                        </div>
                    </div>
                )}

                {/* Trust badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {['正品保障', '72H质保', '秒发'].map((b) => (
                        <span key={b} className="text-[9px] text-[#7B91B0] border border-[#1E2D45] px-1.5 py-0.5 rounded">
                            {b}
                        </span>
                    ))}
                    {badges.slice(0, 2).map((b) => (
                        <span key={b} className="text-[9px] text-[#00E5FF] border border-[#00E5FF]/20 bg-[#00E5FF]/5 px-1.5 py-0.5 rounded">
                            {b}
                        </span>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                    {onPreview && (
                        <button
                            onClick={onPreview}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-xs font-medium border border-[#1E2D45] text-[#7B91B0] hover:text-white hover:border-[#00E5FF]/30 transition-colors"
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button
                        onClick={onBuyNow}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider text-white transition-all duration-200"
                        style={{
                            background: `linear-gradient(135deg, ${tenantConfig.branding.primary} 0%, ${tenantConfig.branding.accent || '#FF5000'} 100%)`,
                            boxShadow: `0 2px 12px ${tenantConfig.branding.primary}40`,
                        }}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        {tenantConfig.psychology.ctaText || '立即购买'}
                    </button>
                </div>
            </div>

            {/* Hover shimmer overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(0,229,255,0.02) 100%)' }}
            />
        </motion.div>
    );
}

// Default export for backward compatibility
export default MarketplaceProductCard;

