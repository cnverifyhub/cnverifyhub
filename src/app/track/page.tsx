'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n';
import { Search, Package, Clock, CheckCircle, ShieldCheck, AlertCircle, ExternalLink, Loader2, Check } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/orderStore';
import { getProductById } from '@/data/products';

const statusConfig: Record<string, { color: string; icon: any; labelZh: string; labelEn: string }> = {
    pending: { color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20', icon: Clock, labelZh: '待付款', labelEn: 'Pending Payment' },
    paid: { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', icon: ShieldCheck, labelZh: '已付款 · 已验证', labelEn: 'Paid · Verified' },
    completed: { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle, labelZh: '已完成', labelEn: 'Completed' },
    cancelled: { color: 'text-red-600 bg-red-50 dark:bg-red-900/20', icon: AlertCircle, labelZh: '已取消', labelEn: 'Cancelled' },
};

function TrackContent({ lang }: { lang: Lang }) {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id') || '';
    const [orderId, setOrderId] = useState(initialId);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!orderId.trim()) return;

        setIsSearching(true);
        setNotFound(false);
        setResult(null);

        try {
            const res = await fetch(`/api/orders/${orderId.trim()}`);
            if (res.ok) {
                const orderData = await res.json();
                setResult(orderData);
            } else {
                setNotFound(true);
            }
        } catch (error) {
            console.error(error);
            setNotFound(true);
        } finally {
            setIsSearching(false);
        }
    };

    // Auto search if ID from URL
    useEffect(() => {
        if (initialId && mounted) {
            handleSearch();
        }
    }, [initialId, mounted]);

    if (!mounted) return <div className="py-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

    return (
        <div className="max-w-3xl mx-auto section-container py-12 md:py-24 min-h-[70vh]">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    {t('track.title', lang)}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    {t('track.subtitle', lang)}
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 relative max-w-xl mx-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder={t('track.placeholder', lang)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm text-lg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!orderId.trim() || isSearching}
                    className="btn-primary py-4 px-8 rounded-2xl whitespace-nowrap"
                >
                    {isSearching ? t('common.loading', lang) : t('track.search', lang)}
                </button>
            </form>

            {/* Search Result */}
            {result && (
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 animate-fade-in-up mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{t('checkout.orderId', lang)}</p>
                            <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white">{result.id}</h2>
                            <div className="mt-3 space-y-1">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {lang === 'zh' ? '下单时间' : 'Created'}: {new Date(result.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {lang === 'zh' ? '联系方式' : 'Contact'}: {result.email}
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {lang === 'zh' ? '总计' : 'Total'}: ${result.totalAmount.toFixed(2)} USDT
                                </p>
                            </div>
                        </div>
                        {(() => {
                            const config = statusConfig[result.status] || statusConfig.pending;
                            const Icon = config.icon;
                            return (
                                <div className={`px-4 py-2 rounded-full ${config.color} font-bold text-sm flex items-center gap-2 shrink-0`}>
                                    <Icon className="w-4 h-4" />
                                    {lang === 'zh' ? config.labelZh : config.labelEn}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            {lang === 'zh' ? '订单商品' : 'Order Items'}
                        </h3>
                        <div className="space-y-2">
                            {result.items.map((item, idx) => {
                                const product = getProductById(item.productId);
                                return (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {product
                                                ? (lang === 'zh' ? product.tierName.zh : product.tierName.en)
                                                : item.productId
                                            }
                                        </span>
                                        <span className="text-sm font-mono text-slate-500">×{item.quantity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Blockchain Verification */}
                    {result.txid && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                {lang === 'zh' ? '支付信息' : 'Payment Info'}
                            </h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    {result.txVerified ? (
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                                    )}
                                    <span className={`text-sm font-semibold ${result.txVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                        {result.txVerified
                                            ? (lang === 'zh' ? '区块链已验证 ✓' : 'Blockchain Verified ✓')
                                            : (lang === 'zh' ? '待人工确认' : 'Pending Manual Confirmation')
                                        }
                                    </span>
                                </div>
                                <p className="text-xs font-mono text-slate-500 break-all">
                                    TXID: {result.txid}
                                </p>
                                {result.verificationDetails && (
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                        <div>
                                            <span className="text-slate-400">{lang === 'zh' ? '金额' : 'Amount'}</span>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">${result.verificationDetails.amount} USDT</p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">{lang === 'zh' ? '代币' : 'Token'}</span>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{result.verificationDetails.token} (TRC20)</p>
                                        </div>
                                    </div>
                                )}
                                <a
                                    href={`https://tronscan.org/#/transaction/${result.txid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-primary-500 hover:underline mt-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    {lang === 'zh' ? '在TronScan上查看' : 'View on TronScan'}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Status Message (Taobao Style Logistics Timeline) */}
                    <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF5000] to-orange-400"></div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                            {lang === 'zh' ? '订单物流追踪' : 'Order Logistics Tracking'}
                        </h3>
                        
                        <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                            {/* Step 1: Order Placed */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-dark-900 bg-[#FF5000] shadow absolute left-0 -translate-x-1/2 md:translate-x-0 md:mx-auto">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl bg-orange-50 dark:bg-[#FF5000]/10 border border-orange-100 dark:border-orange-500/20">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-[#FF5000]">
                                            {lang === 'zh' ? '订单已揽件 (下单成功)' : 'Order Placed'}
                                        </h4>
                                        <time className="text-xs text-orange-500 dark:text-orange-400">{new Date(result.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</time>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {lang === 'zh' ? '系统已接单，等待支付验证' : 'System received the order, awaiting payment validation'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Step 2: Payment Validating */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-dark-900 absolute left-0 -translate-x-1/2 md:translate-x-0 md:mx-auto transition-colors ${result.txVerified || result.status === 'paid' || result.status === 'completed' ? 'bg-[#FF5000] shadow' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                    {(!result.txVerified && result.status === 'pending') && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
                                </div>
                                <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl transition-colors ${result.txVerified || result.status === 'paid' || result.status === 'completed' ? 'bg-orange-50 dark:bg-[#FF5000]/10 border border-orange-100 dark:border-orange-500/20' : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'}`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-bold ${result.txVerified || result.status === 'paid' || result.status === 'completed' ? 'text-[#FF5000]' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {lang === 'zh' ? '运输中 (支付验证)' : 'Payment Validating'}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {lang === 'zh' ? '区块链USDT交易确认中' : 'Blockchain USDT transaction confirming'}
                                    </p>
                                </div>
                            </div>

                            {/* Step 3: Account Preparing */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-4 border-white dark:border-dark-900 absolute left-0 -translate-x-1/2 md:translate-x-0 md:mx-auto transition-colors ${result.status === 'paid' || result.status === 'completed' ? 'bg-[#FF5000] shadow' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                    {result.status === 'paid' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>}
                                </div>
                                <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl transition-colors ${result.status === 'paid' || result.status === 'completed' ? 'bg-orange-50 dark:bg-[#FF5000]/10 border border-orange-100 dark:border-orange-500/20' : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'}`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-bold ${result.status === 'paid' || result.status === 'completed' ? 'text-[#FF5000]' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {lang === 'zh' ? '派送中 (提取账号)' : 'Account Preparing'}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {lang === 'zh' ? '系统正在从库存提取账号密码' : 'System is extracting credentials from inventory'}
                                    </p>
                                </div>
                            </div>

                            {/* Step 4: Completed & Warranty Active */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-dark-900 absolute left-[-4px] -translate-x-1/2 md:translate-x-0 md:mx-auto z-10 transition-colors duration-500 ${result.status === 'completed' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-300 dark:bg-gray-700 w-6 h-6 left-0'}`}>
                                    {result.status === 'completed' && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                </div>
                                <div className={`w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl transition-all duration-500 ${result.status === 'completed' ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 ring-2 ring-green-500/20' : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800'}`}>
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-bold ${result.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {lang === 'zh' ? '已签收 (72H质保生效)' : 'Completed & Warranty Active'}
                                        </h4>
                                    </div>
                                    <p className={`text-xs mt-1 ${result.status === 'completed' ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {result.status === 'completed'
                                            ? (lang === 'zh' ? '账号已通过Telegram发送，防封守则生效中。' : 'Account sent via Telegram. Anti-ban rules active.')
                                            : (lang === 'zh' ? '等待交付完成' : 'Waiting for final delivery')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Not Found */}
            {notFound && (
                <div className="text-center py-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 animate-fade-in-up mb-8">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                        {lang === 'zh' ? '未找到订单' : 'Order Not Found'}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        {lang === 'zh'
                            ? '请检查订单号是否正确。如果刚刚完成付款，请稍等片刻后再试。'
                            : 'Please check if the order ID is correct. If you just completed payment, please wait a moment and try again.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={<div className="py-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>}>
            <TrackContent lang="zh" />
        </Suspense>
    );
}
