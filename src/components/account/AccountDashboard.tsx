'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { t, type Lang } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { User, Shield, Star, Crown, ChevronRight, LogOut, Package, Wallet, Gift, Diamond, Loader2, RefreshCw, Clock, CheckCircle2, AlertCircle, Truck, Eye } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AccountDashboardProps {
    lang: Lang;
}

type VIPTier = 'bronze' | 'silver' | 'gold' | 'diamond';

const tierConfig: Record<VIPTier, { color: string, icon: any, zh: string, en: string, minSpend: number }> = {
    bronze: { color: 'from-amber-700 to-amber-900', icon: Star, zh: '青铜会员', en: 'Bronze', minSpend: 0 },
    silver: { color: 'from-slate-300 to-slate-500', icon: Shield, zh: '白银会员', en: 'Silver', minSpend: 100 },
    gold: { color: 'from-yellow-400 to-yellow-600', icon: Crown, zh: '黄金VIP', en: 'Gold VIP', minSpend: 500 },
    diamond: { color: 'from-cyan-300 to-blue-500', icon: Diamond, zh: '黑钻至尊', en: 'Diamond', minSpend: 1000 },
};

const statusConfig: Record<string, { color: string, icon: any, zh: string, en: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock, zh: '待付款', en: 'Pending' },
    paid: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle2, zh: '已付款', en: 'Paid' },
    processing: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck, zh: '处理中', en: 'Processing' },
    completed: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2, zh: '已完成', en: 'Completed' },
    cancelled: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle, zh: '已取消', en: 'Cancelled' },
};

function calculateTier(spent: number): VIPTier {
    if (spent >= 1000) return 'diamond';
    if (spent >= 500) return 'gold';
    if (spent >= 100) return 'silver';
    return 'bronze';
}

function getNextTierTarget(spent: number): number {
    if (spent >= 1000) return 1000;
    if (spent >= 500) return 1000;
    if (spent >= 100) return 500;
    return 100;
}

export function AccountDashboard({ lang }: AccountDashboardProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // Fetch user session and data
    const fetchData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/auth/login');
                return;
            }

            setUser(session.user);

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
            }

            // Fetch orders — try user_id first, then email fallback
            const { data: userOrders } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .or(`user_id.eq.${session.user.id},email.eq.${session.user.email}`)
                .order('created_at', { ascending: false })
                .limit(50);

            if (userOrders) {
                setOrders(userOrders);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/auth/login');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Auto-refresh orders every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => fetchData(), 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                    <p className="text-slate-500 font-medium">{lang === 'zh' ? '加载中...' : 'Loading...'}</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const totalSpent = profile?.total_spent || orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.total_amount || 0) : sum, 0);
    const vipTier = calculateTier(totalSpent);
    const tier = tierConfig[vipTier];
    const TierIcon = tier.icon;
    const nextTarget = getNextTierTarget(totalSpent);
    const progress = vipTier === 'diamond' ? 100 : (totalSpent / nextTarget) * 100;

    const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-8 md:pt-8 animate-fade-in-up">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    {lang === 'zh' ? '个人中心' : 'My Account'}
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchData(true)}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {lang === 'zh' ? '刷新' : 'Refresh'}
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors">
                        <LogOut className="w-4 h-4" />
                        {lang === 'zh' ? '退出' : 'Logout'}
                    </button>
                </div>
            </div>

            {/* VIP Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-3xl p-6 md:p-8 mb-8 text-white shadow-2xl bg-gradient-to-br ${tier.color}`}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                            <TierIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-medium opacity-80 mb-1">{user.email}</div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                                {lang === 'zh' ? tier.zh : tier.en}
                                {vipTier === 'diamond' && <span className="text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">MAX</span>}
                            </h2>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span>{lang === 'zh' ? '累计消费' : 'Total Spent'}</span>
                            <span className="text-yellow-300">{formatYuan(totalSpent)}</span>
                        </div>
                        <div className="h-3 bg-black/40 rounded-full overflow-hidden mb-2 relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                            />
                        </div>
                        <div className="text-xs opacity-80 text-right">
                            {vipTier === 'diamond'
                                ? (lang === 'zh' ? '已达到最高等级！' : 'Maximum Tier!')
                                : (lang === 'zh' ? `距离升级还差 ${formatYuan(nextTarget - totalSpent)}` : `${formatYuan(nextTarget - totalSpent)} to upgrade`)}
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                    <div className="text-center">
                        <div className="text-2xl font-black">{orders.length}</div>
                        <div className="text-xs font-bold opacity-70">{lang === 'zh' ? '总订单' : 'Orders'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-emerald-300">{paidOrders}</div>
                        <div className="text-xs font-bold opacity-70">{lang === 'zh' ? '已完成' : 'Completed'}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-yellow-300">{pendingOrders}</div>
                        <div className="text-xs font-bold opacity-70">{lang === 'zh' ? '待处理' : 'Pending'}</div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { icon: Wallet, zh: '我的钱包', en: 'Wallet', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                    { icon: Gift, zh: '优惠券', en: 'Coupons', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
                    { icon: Shield, zh: '安全中心', en: 'Security', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
                ].map((item, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${item.color} transition-all hover:scale-105 active:scale-95`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs font-bold">{lang === 'zh' ? item.zh : item.en}</span>
                    </motion.button>
                ))}
            </div>

            {/* Order History */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-500" />
                    {lang === 'zh' ? '我的订单' : 'Order History'}
                </h3>
                {orders.length > 0 && (
                    <span className="text-xs text-slate-400">
                        {lang === 'zh' ? '每30秒自动刷新' : 'Auto-refreshes every 30s'}
                    </span>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 font-medium mb-4">{lang === 'zh' ? '暂无订单记录' : 'No orders yet'}</p>
                    <Link href={`/${lang === 'en' ? 'en' : ''}`} className="text-red-500 font-bold hover:underline">
                        {lang === 'zh' ? '去挑选商品 →' : 'Start Shopping →'}
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order, i) => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        const isExpanded = expandedOrder === order.public_id;

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                            >
                                <button
                                    onClick={() => setExpandedOrder(isExpanded ? null : order.public_id)}
                                    className="w-full p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{order.public_id}</span>
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {lang === 'zh' ? status.zh : status.en}
                                            </span>
                                            {order.tx_verified && (
                                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                                                    ✓ {lang === 'zh' ? '链上验证' : 'Verified'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(order.created_at).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-lg text-red-600 dark:text-red-500">{formatYuan(order.total_amount)}</span>
                                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                                <div className="grid grid-cols-2 gap-3 text-xs">
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                                        <span className="text-slate-500 block mb-1">{lang === 'zh' ? '支付方式' : 'Payment'}</span>
                                                        <span className="font-bold">{order.crypto_type || 'USDT'}</span>
                                                    </div>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                                        <span className="text-slate-500 block mb-1">TXID</span>
                                                        <span className="font-mono text-[10px] break-all">{order.txid ? `${order.txid.slice(0, 12)}...` : '—'}</span>
                                                    </div>
                                                    {order.email && (
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                                            <span className="text-slate-500 block mb-1">Email</span>
                                                            <span className="font-bold text-[11px]">{order.email}</span>
                                                        </div>
                                                    )}
                                                    {order.telegram && (
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                                            <span className="text-slate-500 block mb-1">Telegram</span>
                                                            <span className="font-bold text-[11px]">{order.telegram}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Order Items */}
                                                {order.order_items && order.order_items.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-bold text-slate-500">{lang === 'zh' ? '订单商品' : 'Items'}:</span>
                                                        {order.order_items.map((item: any) => (
                                                            <div key={item.id} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg">
                                                                <span className="font-medium">{item.product_id} × {item.quantity}</span>
                                                                <span className="font-bold text-red-600">{formatYuan(item.price_at_time * item.quantity)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Verification Details */}
                                                {order.verification_details && (
                                                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/40 text-xs">
                                                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            {lang === 'zh' ? '区块链验证详情' : 'Blockchain Verification'}
                                                        </span>
                                                        <div className="text-emerald-600 dark:text-emerald-400/80 space-y-0.5 font-mono text-[10px]">
                                                            <div>Amount: {order.verification_details.amount} {order.verification_details.token}</div>
                                                            {order.verification_details.from && <div>From: {order.verification_details.from.slice(0, 20)}...</div>}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Delivery Details */}
                                                {order.delivery_details && (
                                                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 shadow-sm mt-3">
                                                        <h4 className="font-black text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                                            <Package className="w-4 h-4" />
                                                            {lang === 'zh' ? '发货详情 (账号密码)' : 'Delivery Details (Account Info)'}
                                                        </h4>
                                                        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                                            {order.delivery_details.mobile && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">Mobile:</span><span className="font-bold select-all">{order.delivery_details.mobile}</span></div>}
                                                            {order.delivery_details.email && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">Email:</span><span className="font-bold select-all">{order.delivery_details.email}</span></div>}
                                                            {order.delivery_details.emailPass && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">Email Pass:</span><span className="font-bold text-red-600 dark:text-red-400 select-all">{order.delivery_details.emailPass}</span></div>}
                                                            {order.delivery_details.accountPass && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">Account Pass:</span><span className="font-bold text-red-600 dark:text-red-400 select-all">{order.delivery_details.accountPass}</span></div>}
                                                            {order.delivery_details.pin && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">PIN:</span><span className="font-bold select-all">{order.delivery_details.pin}</span></div>}
                                                            {order.delivery_details.passportNo && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">Passport No:</span><span className="font-bold select-all">{order.delivery_details.passportNo}</span></div>}
                                                            {order.delivery_details.realName && <div className="flex justify-between border-b border-blue-100 dark:border-blue-800/50 pb-1"><span className="opacity-70">Real Name:</span><span className="font-bold select-all">{order.delivery_details.realName}</span></div>}
                                                            {order.delivery_details.other && <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg text-[11px] font-mono select-all whitespace-pre-wrap">{order.delivery_details.other}</div>}
                                                        </div>
                                                    </div>
                                                )}

                                                <Link
                                                    href={lang === 'en' ? `/en/track?id=${order.public_id}` : `/track?id=${order.public_id}`}
                                                    className="flex items-center justify-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 py-2"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    {lang === 'zh' ? '追踪订单' : 'Track Order'}
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
