'use client';

import { useState } from 'react';
import { useOrderStore, type Order } from '@/store/orderStore';
import { Search, Package, Clock, CheckCircle2, Copy, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ClientOrderTrackingPageEN() {
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
                setError('Please enter Order ID and Email');
                setIsSearching(false);
                return;
            }

            const foundOrder = getOrderById(orderId, email);
            if (foundOrder) {
                setOrder(foundOrder);
            } else {
                setError('Order not found. Please verify your Order ID and Email.');
            }
            setIsSearching(false);
        }, 600);
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'Pending Verification', color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800', icon: Clock };
            case 'completed': return { label: 'Completed & Delivered', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800', icon: CheckCircle2 };
            case 'cancelled': return { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', icon: AlertCircle };
            default: return { label: 'Unknown', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400', icon: Package };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col font-sans">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4 py-32">
                <div className="max-w-3xl w-full">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Order Tracking Center</h1>
                        <p className="text-slate-500 dark:text-slate-400">Enter your Order ID and registered email to check real-time status and access digital deliveries.</p>
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
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Order ID</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Package className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={orderId}
                                                onChange={(e) => setOrderId(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="e.g. CNW-12345678"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <AlertCircle className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="The email used during checkout"
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
                                            Track Order Now
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
                                            Order Details
                                        </h2>
                                        <p className="text-sm text-slate-500 mt-1 font-mono">{order.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setOrder(null)}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                                    >
                                        Track Another Order
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-dark-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <CreditCard className="w-4 h-4 text-slate-400" />
                                            {order.cryptoType.toUpperCase()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                                        <p className="font-bold text-orange-600 dark:text-orange-500">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Order Date</p>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
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
                                            <h3 className="font-black text-slate-900 dark:text-white text-lg">Delivered Accounts (Credentials)</h3>
                                            <p className="text-sm text-slate-500">Please save your credentials and change passwords immediately.</p>
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
                                                        <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-3.5 h-3.5" /> Copy Data</>
                                                    )}
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="p-4 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 text-center">
                                                Provider forgot to upload credentials. Please contact support with your Order ID.
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                        <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4" /> Security Notice
                                        </h4>
                                        <p className="text-xs text-orange-700 dark:text-orange-400/80 leading-relaxed">
                                            After obtaining your accounts, please log in on your regular device. Change passwords and security info after 24 hours. Digital goods are non-refundable once delivered. Contact support within warranty period for issues.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 mb-4 animate-pulse">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Awaiting Blockchain Confirmation...</h3>
                                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                                        Your payment is being confirmed on the blockchain network. The system will auto-deliver accounts upon receipt of funds. Please be patient (usually 2-5 minutes).
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
