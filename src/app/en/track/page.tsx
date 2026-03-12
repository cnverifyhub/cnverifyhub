'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n';
import { Search, Package, Clock, CheckCircle, ShieldCheck, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useOrderStore, type Order } from '@/store/orderStore';
import { getProductById } from '@/data/products';

const statusConfig: Record<string, { color: string; icon: any; labelEn: string }> = {
    pending: { color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20', icon: Clock, labelEn: 'Pending Payment' },
    paid: { color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', icon: ShieldCheck, labelEn: 'Paid · Verified' },
    completed: { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle, labelEn: 'Completed' },
    cancelled: { color: 'text-red-600 bg-red-50 dark:bg-red-900/20', icon: AlertCircle, labelEn: 'Cancelled' },
};

function TrackContent({ lang }: { lang: Lang }) {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id') || '';
    const [orderId, setOrderId] = useState(initialId);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<Order | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const { getOrderById, getAllOrders } = useOrderStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (mounted) {
            setRecentOrders(getAllOrders().slice(0, 5));
        }
    }, [mounted, getAllOrders]);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!orderId.trim()) return;
        setIsSearching(true);
        setNotFound(false);
        setResult(null);
        setTimeout(() => {
            const order = getOrderById(orderId.trim());
            if (order) { setResult(order); } else { setNotFound(true); }
            setIsSearching(false);
        }, 600);
    };

    useEffect(() => {
        if (initialId && mounted) handleSearch();
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
                <button type="submit" disabled={!orderId.trim() || isSearching} className="btn-primary py-4 px-8 rounded-2xl whitespace-nowrap">
                    {isSearching ? t('common.loading', lang) : t('track.search', lang)}
                </button>
            </form>

            {result && (
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 animate-fade-in-up mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{t('checkout.orderId', lang)}</p>
                            <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white">{result.id}</h2>
                            <div className="mt-3 space-y-1">
                                <p className="text-sm text-slate-600 dark:text-slate-400">Created: {new Date(result.createdAt).toLocaleString()}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Contact: {result.email}</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Total: ${result.totalAmount.toFixed(2)} USDT</p>
                            </div>
                        </div>
                        {(() => {
                            const config = statusConfig[result.status] || statusConfig.pending;
                            const Icon = config.icon;
                            return (
                                <div className={`px-4 py-2 rounded-full ${config.color} font-bold text-sm flex items-center gap-2 shrink-0`}>
                                    <Icon className="w-4 h-4" /> {config.labelEn}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Order Items</h3>
                        <div className="space-y-2">
                            {result.items.map((item, idx) => {
                                const product = getProductById(item.productId);
                                return (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {product ? product.tierName.en : item.productId}
                                        </span>
                                        <span className="text-sm font-mono text-slate-500">×{item.quantity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Blockchain verification */}
                    {result.txid && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Payment Info</h3>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    {result.txVerified
                                        ? <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                        : <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                                    }
                                    <span className={`text-sm font-semibold ${result.txVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                        {result.txVerified ? 'Blockchain Verified ✓' : 'Pending Manual Confirmation'}
                                    </span>
                                </div>
                                <p className="text-xs font-mono text-slate-500 break-all">TXID: {result.txid}</p>
                                {result.verificationDetails && (
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                        <div><span className="text-slate-400">Amount</span><p className="font-semibold text-slate-700 dark:text-slate-300">${result.verificationDetails.amount} USDT</p></div>
                                        <div><span className="text-slate-400">Token</span><p className="font-semibold text-slate-700 dark:text-slate-300">{result.verificationDetails.token} (TRC20)</p></div>
                                    </div>
                                )}
                                <a href={`https://tronscan.org/#/transaction/${result.txid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary-500 hover:underline mt-1">
                                    <ExternalLink className="w-3 h-3" /> View on TronScan
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700">
                        <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        {result.status === 'completed' && result.deliveredAccounts.length > 0 ? (
                            <>
                                <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2">Account Delivered ✓</h3>
                                <p className="text-slate-500 text-sm mb-4">Account credentials have been sent via Telegram</p>
                            </>
                        ) : (
                            <>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Preparing your account</h3>
                                <p className="text-slate-500 text-sm">Payment received. The system is extracting account credentials. It will be sent via Telegram shortly, please allow 1-15 minutes.</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {notFound && (
                <div className="text-center py-8 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 animate-fade-in-up mb-8">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Order Not Found</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">Please check if the order ID is correct. If you just completed payment, please wait a moment and try again.</p>
                </div>
            )}

            {recentOrders.length > 0 && !result && !notFound && (
                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {recentOrders.map((order) => {
                            const config = statusConfig[order.status] || statusConfig.pending;
                            const Icon = config.icon;
                            return (
                                <button key={order.id} onClick={() => { setOrderId(order.id); setResult(order); setNotFound(false); }}
                                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                                    <div>
                                        <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{order.id}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">${order.totalAmount.toFixed(2)} USDT · {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full ${config.color} text-xs font-semibold flex items-center gap-1`}>
                                        <Icon className="w-3 h-3" /> {config.labelEn}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackPageEn() {
    return (
        <Suspense fallback={<div className="py-32 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>}>
            <TrackContent lang="en" />
        </Suspense>
    );
}
