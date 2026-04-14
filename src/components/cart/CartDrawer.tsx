'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X, Minus, Plus, Trash2, ShieldCheck, Ticket } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { getProductById, getCategoryById } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, TelegramIcon, TaobaoIcon, XianyuIcon, XiaohongshuIcon } from '@/components/ui/BrandIcons';

interface CartDrawerProps {
    lang: Lang;
}

const iconMap: Record<string, React.ReactNode> = {
    wechat: <WeChatIcon className="w-full h-full" />,
    alipay: <AlipayIcon className="w-full h-full" />,
    douyin: <DouyinIcon className="w-full h-full" />,
    qq: <QQIcon className="w-full h-full" />,
    xianyu: <XianyuIcon className="w-full h-full" />,
    taobao: <TaobaoIcon className="w-full h-full" />,
    xiaohongshu: <XiaohongshuIcon className="w-full h-full" />,
    telegram: <TelegramIcon className="w-full h-full" />,
};

export function CartDrawer({ lang }: CartDrawerProps) {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotal } = useCartStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Hydration fix for Zustand persist
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-md h-full bg-white dark:bg-dark-900 shadow-2xl flex flex-col animate-slide-up md:animate-slide-up transform transition-transform">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {lang === 'zh' ? '购物车' : 'Shopping Cart'}
                        </h2>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs py-0.5 px-2 rounded-full font-bold">
                            {items.length}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-slate-500 font-medium">
                                {lang === 'zh' ? '购物车为空' : 'Your cart is empty'}
                            </p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-primary-600 font-bold hover:underline"
                            >
                                {lang === 'zh' ? '去选购商品' : 'Continue Shopping'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item: any) => {
                                const product = getProductById(item.productId);
                                if (!product) return null;
                                const category = getCategoryById(product.category);

                                const getUnitPrice = (qty: number) => {
                                    if (qty >= 200) return product.price.bulk200;
                                    if (qty >= 50) return product.price.bulk50;
                                    if (qty >= 10) return product.price.bulk10;
                                    return product.price.single;
                                };
                                const unitPrice = getUnitPrice(item.quantity);

                                return (
                                    <div key={item.productId} className="flex gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                        <div className={`w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 shadow-sm flex items-center justify-center shrink-0 overflow-hidden`}>
                                            {category && iconMap[category.id] ? iconMap[category.id] : <WeChatIcon className="w-full h-full" />}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 pr-4">
                                                    {product.tierName[lang]}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-1.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-6 text-center text-sm font-medium text-slate-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, Math.min(product.stockCount, item.quantity + 1))}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                                        {formatYuan(unitPrice * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Red Envelope & Discount Placeholder */}
                {items.length > 0 && (
                    <div className="px-5 py-3 bg-red-50 dark:bg-red-900/10 border-y border-red-100 dark:border-red-900/20 flex items-center justify-between group cursor-pointer hover:bg-red-100/50 transition-colors">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 animate-bounce" style={{ animationDuration: '3s' }}>
                               <Ticket className="w-4 h-4 text-white" />
                           </div>
                           <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">{lang === 'zh' ? '使用优惠券 / 红包代码' : 'Use Coupon / Red Envelope'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-red-500 transition-colors">NEW &gt;</span>
                    </div>
                )}

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-600 dark:text-slate-400 font-medium tracking-tight">
                                {lang === 'zh' ? '总计金额 (¥)' : 'Total Amount (¥)'}
                            </span>
                            <span className="text-2xl font-black text-red-600 dark:text-red-500 tabular-nums">
                                {formatYuan(getTotal())}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4 text-xs font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <p>{lang === 'zh' ? '资金由平台担保，确认收货后打款。' : 'Funds are held in escrow until confirmation.'}</p>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push(getLocalizedPath('/checkout', lang));
                            }}
                            className="btn-primary w-full py-3.5 text-lg justify-center relative overflow-hidden group"
                        >
                            <span className="relative z-10">{lang === 'zh' ? '去结算' : 'Checkout'}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
