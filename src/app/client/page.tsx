'use client';

import { useState } from 'react';
import { useOrderStore, type Order } from '@/store/orderStore';
import { Search, Package, Clock, CheckCircle2, Copy, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ClientOrderTrackingPage() {
    const { getOrderById } = useOrderStore();

    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSearching(true);

        setTimeout(() => {
            if (!orderId || !email) {
                setError('请输入订单号和邮箱');
                setIsSearching(false);
                return;
            }

            const foundOrder = getOrderById(orderId, email);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setError('未找到该订单，请检查订单号和邮箱是否正确');
            }
            setIsSearching(false);
        }, 600); // Simulate network request for realism
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { label: '待处理 / 验证中', color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800', icon: Clock };
            case 'completed': return { label: '已完成 / 已发货', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800', icon: CheckCircle2 };
            case 'cancelled': return { label: '已取消', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', icon: AlertCircle };
            default: return { label: '未知', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', icon: Package };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col font-sans">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4 py-32">
                <div className="max-w-3xl w-full">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">订单查询中心</h1>
                        <p className="text-slate-500 dark:text-slate-400">输入您的订单号和预留邮箱，即可实时获取发货状态和账号信息</p>
                    </div>

                    {!order ? (
                        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                            <form onSubmit={handleSearch} className="space-y-6">
                                {error && (
                                    <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800/50">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">订单编号 (Order ID)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Package className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={orderId}
                                                onChange={(e) => setOrderId(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="例如: CNW-12345678"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">联系邮箱 (Email)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <AlertCircle className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="下单时填写的邮箱地址"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSearching ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            立即查询订单
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                            {/* Order Header Card */}
                            <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10"></div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            订单详情
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-1 font-mono">{order.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setOrder(null)}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                    >
                                        查询其他订单
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-dark-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">支付方式</p>
                                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                            {order.cryptoType.toUpperCase()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">总金额</p>
                                        <p className="font-bold text-orange-600 dark:text-orange-500">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">下单时间</p>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">当前状态</p>
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusConfig(order.status).color}`}>
                                            {(() => {
                                                const StatusIcon = getStatusConfig(order.status).icon;
                                                return <StatusIcon className="w-3.5 h-3.5" />;
                                            })()}
                                            {getStatusConfig(order.status).label}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Delivery Card Core View */}
                            {order.status === 'completed' ? (
                                <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border-2 border-green-500/20 shadow-lg shadow-green-500/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white text-lg">发货清单 (账号密卡)</h3>
                                            <p className="text-sm text-slate-500">请尽快保存您的账号信息并修改密码</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.deliveredAccounts.length > 0 ? order.deliveredAccounts.map((acc, idx) => (
                                            <div key={idx} className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                                <code className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all pr-4">
                                                    {acc}
                                                </code>
                                                <button
                                                    onClick={() => copyToClipboard(acc, idx)}
                                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> 已复制</>
                                                    ) : (
                                                        <><Copy className="w-3.5 h-3.5" /> 复制卡密</>
                                                    )}
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="p-4 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 text-center">
                                                客服忘记上传卡密信息，请联系售后凭订单号获取。
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                        <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4" /> 安全提示
                                        </h4>
                                        <p className="text-xs text-orange-700 dark:text-orange-400/80 leading-relaxed">
                                            获取账号后，建议立即在常用设备登录，并在24小时后修改密码和密保信息。虚拟商品发货后不支持退换，如有异常请在质保期内联系客服。
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 mb-4 animate-pulse">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">区块链网络确认中...</h3>
                                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                                        您的支付正在区块链网络上确认。系统会在收到资金后自动发货，请您保留此页面耐心等待 (通常需要2-5分钟)。
                                    </p>
                                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono text-slate-600 dark:text-slate-400">
                                        <span>TXID:</span>
                                        <span className="truncate max-w-[200px] inline-block">{order.txid}</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
