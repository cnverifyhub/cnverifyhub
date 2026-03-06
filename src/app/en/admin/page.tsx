'use client';

import { useState, useEffect } from 'react';
import { useOrderStore, type Order } from '@/store/orderStore';
import { Lock, LayoutDashboard, Package, Settings, LogOut, CheckCircle2, Clock, AlertCircle, ChevronRight, Copy } from 'lucide-react';
import { getProductById } from '@/data/products';

export default function AdminDashboardPageEN() {
    const { isAdminAuthenticated, loginAdmin, logoutAdmin, orders, deliverAccountsToOrder, updateOrderStatus } = useOrderStore();

    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [accountsInput, setAccountsInput] = useState('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-dark-950"></div>;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = loginAdmin(password);
        if (!success) {
            setLoginError('Incorrect password, please try again.');
        } else {
            setLoginError('');
        }
    };

    const handleDeliver = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        const parsedAccounts = accountsInput.split('\n').map(l => l.trim()).filter(l => l !== '');
        if (parsedAccounts.length === 0) {
            alert('Please enter at least one account credential');
            return;
        }

        deliverAccountsToOrder(selectedOrder.id, parsedAccounts);
        setSelectedOrder(null);
        setAccountsInput('');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"><Clock className="w-3.5 h-3.5" /> Pending</span>;
            case 'completed': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
            case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3.5 h-3.5" /> Cancelled</span>;
            default: return null;
        }
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-2xl shadow-blue-900/5 border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Admin Control Panel</h1>
                        <p className="text-slate-500 text-sm">Log in to process payments and deliver goods</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {loginError && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-900/30 rounded-xl text-sm text-center font-medium">
                                {loginError}
                            </div>
                        )}
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Admin Password"
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white font-mono text-center tracking-widest text-lg"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Secure Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-dark-950 flex font-sans">
            <aside className="w-64 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-blue-600" />
                        Admin CRM
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold rounded-xl transition-colors">
                        <Package className="w-5 h-5" /> Orders
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium rounded-xl transition-colors opacity-50 cursor-not-allowed">
                        <Settings className="w-5 h-5" /> Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={logoutAdmin}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Global Orders</h2>
                        <p className="text-slate-500 text-sm">{orders.length} total transaction(s) tracked.</p>
                    </div>
                </header>

                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">Order ID</th>
                                    <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">Payment</th>
                                    <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">Items</th>
                                    <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                                    <th className="px-6 py-4 font-bold border-b border-slate-200 dark:border-slate-800 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-mono text-sm font-bold text-slate-900 dark:text-white mb-1">{order.id}</div>
                                            <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)} {order.cryptoType.toUpperCase()}</div>
                                            <div className="text-xs text-slate-500 font-mono truncate max-w-[150px]" title={order.txid}>{order.txid}</div>
                                            <div className="text-xs text-slate-500 mt-1">{order.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {order.items.map((item, idx) => {
                                                    const productInfo = getProductById(item.productId);
                                                    return (
                                                        <div key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                                                            <span className="font-medium">{productInfo?.tierName.en || item.productId}</span>
                                                            <span className="text-slate-400 mx-2">x{item.quantity}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {order.status === 'pending' ? (
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                >
                                                    Fulfill Order <ChevronRight className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <div className="text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 inline-block px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    Fulfilled ({order.deliveredAccounts.length})
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Package className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                                                <p>No orders recorded yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Fulfill Order: {selectedOrder.id}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Close</button>
                        </div>
                        <form onSubmit={handleDeliver} className="p-6">

                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 text-sm text-blue-800 dark:text-blue-300">
                                <strong>Admin Notice:</strong> Ensure the crypto TXID (<code>{selectedOrder.txid}</code>) has been confirmed on the blockchain explorer.
                                <br /><br />
                                <span className="text-xs text-slate-500">Input one set of account credentials per line.</span>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Account Credentials ({selectedOrder.items.reduce((acc, curr) => acc + curr.quantity, 0)} Pcs)</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={accountsInput}
                                    onChange={(e) => setAccountsInput(e.target.value)}
                                    placeholder="user1----pass1&#10;user2----pass2"
                                    className="w-full p-4 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-300"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setSelectedOrder(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-bold rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20">
                                    Deliver Goods
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
