'use client';

import { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Clock, AlertTriangle, QrCode, Eye, Star, Zap } from 'lucide-react';
import { type Lang } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';

interface ProductPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        category: string;
        tierName: { zh: string; en: string };
        description: { zh: string; en: string };
        features: Array<{ zh: string; en: string }>;
        warranty: { zh: string; en: string };
        deliveryTime: { zh: string; en: string };
        price: {
            single: number;
            bulk10: number;
            bulk50: number;
            bulk200: number;
            originalPrice?: { single: number };
        };
        stockCount: number;
        badge?: { zh: string; en: string };
        popular?: boolean;
    };
    lang: Lang;
}

/** Simulated account details based on category + tier name */
function getAccountDetails(category: string, tierNameZh: string) {
    const isVerified = tierNameZh.includes('实名') || tierNameZh.includes('认证');
    const isBankLinked = tierNameZh.includes('绑卡') || tierNameZh.includes('花呗');
    const isAged = tierNameZh.includes('老号') || tierNameZh.includes('个月') || tierNameZh.includes('年');
    const isEnterprise = tierNameZh.includes('企业');
    const isPremium = tierNameZh.includes('高级') || tierNameZh.includes('VIP') || tierNameZh.includes('尊享');

    const ageMap: Record<string, string> = {
        '白号': '新注册 (1-3天)',
        '3年': '3年以上',
        '1年': '1年以上',
        '6个月': '6个月',
        '1个月': '1个月',
    };

    let estimatedAge = '新注册';
    for (const [key, val] of Object.entries(ageMap)) {
        if (tierNameZh.includes(key)) { estimatedAge = val; break; }
    }
    if (tierNameZh.includes('15天')) estimatedAge = '7-15天';
    if (tierNameZh.includes('基础')) estimatedAge = '新注册';

    const categoryZh: Record<string, string> = {
        wechat: '微信', alipay: '支付宝', douyin: '抖音',
        qq: 'QQ', xianyu: '闲鱼', taobao: '淘宝', xiaohongshu: '小红书',
    };

    return {
        platform: categoryZh[category] || category,
        verificationStatus: isVerified ? '已实名认证' : '未实名',
        verificationColor: isVerified ? 'emerald' : 'yellow',
        bankLinked: isBankLinked,
        estimatedAge,
        isAged,
        isEnterprise,
        isPremium,
        accountType: isPremium ? '优质账号' : isEnterprise ? '企业认证号' : isAged ? '老号' : '标准号',
    };
}

export function ProductPreview({ isOpen, onClose, product, lang }: ProductPreviewProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!isOpen || !mounted) return null;

    const details = getAccountDetails(product.category, product.tierName.zh);
    const isZh = lang === 'zh';
    const stockPercent = Math.min(100, (product.stockCount / 30) * 100);
    const stockLevel = product.stockCount === 0 ? 'out' : product.stockCount <= 3 ? 'low' : product.stockCount <= 10 ? 'medium' : 'high';
    const stockColors: Record<string, string> = {
        high: 'bg-emerald-500', medium: 'bg-yellow-500', low: 'bg-orange-500', out: 'bg-red-500',
    };
    const stockLabels: Record<string, string> = {
        high: isZh ? '充足' : 'In Stock', medium: isZh ? '较少' : 'Low', low: isZh ? '紧张' : 'Very Low', out: isZh ? '售罄' : 'Sold Out',
    };

    const featureIcons: Record<string, string> = {
        wechat: '💬', alipay: '💰', douyin: '🎵', qq: '🐧', xianyu: '🐟', taobao: '🛒', xiaohongshu: '📕',
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white dark:bg-dark-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        <span className="font-bold">{isZh ? '账号预览' : 'Account Preview'}</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Product Name + Badge */}
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">
                                {product.tierName[lang]}
                            </h3>
                            {product.badge && (
                                <span className="shrink-0 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                                    {product.badge[lang]}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {product.description[lang]}
                        </p>
                    </div>

                    {/* Account Details Card */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="text-lg">{featureIcons[product.category] || '📱'}</div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isZh ? '账号详情' : 'Account Details'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {/* Platform */}
                            <div className="bg-white dark:bg-dark-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '平台' : 'Platform'}</span>
                                <p className="font-bold text-slate-800 dark:text-white">{details.platform}</p>
                            </div>
                            {/* Account Type */}
                            <div className="bg-white dark:bg-dark-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '类型' : 'Type'}</span>
                                <p className="font-bold text-slate-800 dark:text-white">{details.accountType}</p>
                            </div>
                            {/* Registration Time */}
                            <div className="bg-white dark:bg-dark-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '注册时间' : 'Age'}</span>
                                <p className="font-bold text-slate-800 dark:text-white">{details.estimatedAge}</p>
                            </div>
                            {/* Verification */}
                            <div className="bg-white dark:bg-dark-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '认证状态' : 'Verified'}</span>
                                <p className={`font-bold ${details.verificationColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                    {details.verificationStatus}
                                </p>
                            </div>
                            {/* Bank Card */}
                            <div className="bg-white dark:bg-dark-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '绑卡状态' : 'Bank Link'}</span>
                                <p className={`font-bold ${details.bankLinked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                    {details.bankLinked ? (isZh ? '已绑卡' : 'Linked') : (isZh ? '未绑卡' : 'Not Linked')}
                                </p>
                            </div>
                            {/* Enterprise */}
                            <div className="bg-white dark:bg-dark-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '企业认证' : 'Enterprise'}</span>
                                <p className={`font-bold ${details.isEnterprise ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                                    {details.isEnterprise ? (isZh ? '已认证' : 'Yes') : (isZh ? '未认证' : 'No')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature Checklist */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {isZh ? '包含功能' : 'Included Features'}
                        </span>
                        <div className="grid grid-cols-1 gap-1.5">
                            {product.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{feature[lang]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock & Warranty Row */}
                    <div className="flex gap-3">
                        {/* Stock */}
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '库存' : 'Stock'}</span>
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${stockColors[stockLevel]}/10 text-${stockColors[stockLevel].replace('bg-', '')} ${stockColors[stockLevel] === 'bg-emerald-500' ? 'text-emerald-600' : stockColors[stockLevel] === 'bg-yellow-500' ? 'text-yellow-600' : 'text-orange-600'}`}>
                                    {stockLabels[stockLevel]}
                                </span>
                            </div>
                            <p className="font-black text-lg text-slate-900 dark:text-white">{product.stockCount}</p>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                                <div className={`h-full ${stockColors[stockLevel]} rounded-full transition-all duration-500`} style={{ width: `${stockPercent}%` }} />
                            </div>
                        </div>
                        {/* Warranty */}
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '质保' : 'Warranty'}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="font-bold text-sm text-slate-900 dark:text-white">{product.warranty[lang]}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{isZh ? '72小时内质量问题免费换号' : 'Free replacement within 72h'}</p>
                        </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/15 rounded-xl p-3 border border-blue-100 dark:border-blue-900/30">
                        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {isZh ? '预计发货：' : 'Est. Delivery: '}{product.deliveryTime[lang]}
                        </span>
                    </div>

                    {/* Price + Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{isZh ? '当前单价' : 'Unit Price'}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-red-600 dark:text-red-500">{formatYuan(product.price.single)}</span>
                                {product.price.originalPrice && (
                                    <span className="text-xs text-slate-400 line-through">{formatYuan(product.price.originalPrice.single)}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gold-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-bold">{isZh ? '全网热销' : 'Best Seller'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
