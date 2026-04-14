'use client';

import { useState, useEffect, useMemo } from 'react';
import { useOrderStore, type Order } from '@/store/orderStore';
import {
    Lock, LayoutDashboard, Package, ShieldAlert, LogOut,
    CheckCircle2, Clock, AlertCircle, ChevronRight,
    Search, RefreshCw, X, DollarSign, ShoppingCart,
    Plus, Trash2
} from 'lucide-react';
import { getProductById } from '@/data/products';
import { cn } from '@/lib/utils';

type Tab = 'orders' | 'fraud';
type StatusFilter = 'all' | 'pending' | 'completed' | 'cancelled';
type FraudTab = 'blocklist' | 'events';

const PAGE_SIZE = 20;

interface FraudBlocklistItem {
    id: string;
    type: string;
    value: string;
    reason: string | null;
    added_by: string | null;
    created_at: string;
}

interface FraudEventItem {
    id: string;
    event_type: string;
    severity: string;
    email: string | null;
    ip_address: string | null;
    txid: string | null;
    wallet_address: string | null;
    order_id: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

const SEVERITY_COLORS: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
    rapid_fire_orders: 'Rapid Fire Orders',
    bulk_order: 'Bulk Order',
    test_payment: 'Test Payment',
    blocked_wallet: 'Blocked Wallet',
    blocked_ip: 'Blocked IP',
    blocked_email: 'Blocked Email',
    suspicious_amount: 'Suspicious Amount',
    rate_limit: 'Rate Limit',
    unknown_source: 'Unknown Source',
};

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin888';

const BLOCK_TYPE_LABELS: Record<string, string> = {
    txid: 'TXID',
    wallet: 'Wallet',
    ip: 'IP Address',
    email: 'Email',
};

export default function AdminDashboardPage() {
    const { isAdminAuthenticated, loginAdmin, logoutAdmin } = useOrderStore();
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const [activeTab, setActiveTab] = useState<Tab>('orders');
    const [activeFraudTab, setActiveFraudTab] = useState<FraudTab>('blocklist');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [accountsInput, setAccountsInput] = useState('');
    const [delivering, setDelivering] = useState(false);

    const [blocklist, setBlocklist] = useState<FraudBlocklistItem[]>([]);
    const [fraudEvents, setFraudEvents] = useState<FraudEventItem[]>([]);
    const [isLoadingFraud, setIsLoadingFraud] = useState(false);

    const [newBlockType, setNewBlockType] = useState<'txid' | 'wallet' | 'ip' | 'email'>('email');
    const [newBlockValue, setNewBlockValue] = useState('');
    const [newBlockReason, setNewBlockReason] = useState('');
    const [addingBlock, setAddingBlock] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchOrders();
            fetchFraudData();
        }
    }, [isAdminAuthenticated]);

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': 'Bearer ${ADMIN_PASS}' },
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
                setCurrentPage(1);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const fetchFraudData = async () => {
        setIsLoadingFraud(true);
        try {
            const [blockRes, eventsRes] = await Promise.all([
                fetch('/api/admin/fraud?type=blocklist', { headers: { 'Authorization': 'Bearer ${ADMIN_PASS}' } }),
                fetch('/api/admin/fraud?type=events&limit=100', { headers: { 'Authorization': 'Bearer ${ADMIN_PASS}' } }),
            ]);
            if (blockRes.ok) {
                const d = await blockRes.json();
                setBlocklist(d.blocklist || []);
            }
            if (eventsRes.ok) {
                const d = await eventsRes.json();
                setFraudEvents(d.events || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingFraud(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = loginAdmin(password);
        if (!success) {
            setLoginError('Incorrect password, please try again.');
        } else {
            setLoginError('');
        }
    };

    const handleDeliver = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        const parsedAccounts = accountsInput.split('\n').map(l => l.trim()).filter(l => l !== '');
        if (parsedAccounts.length === 0) {
            alert('Please enter at least one account credential.');
            return;
        }
        setDelivering(true);
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${ADMIN_PASS}' },
                body: JSON.stringify({ orderPublicId: selectedOrder.id, accounts: parsedAccounts }),
            });
            if (res.ok) {
                setSelectedOrder(null);
                setAccountsInput('');
                fetchOrders();
            } else {
                alert('Delivery failed, please retry.');
            }
        } catch (e) {
            alert('Network error.');
        } finally {
            setDelivering(false);
        }
    };

    const handleAddBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBlockValue.trim()) return;
        setAddingBlock(true);
        try {
            const res = await fetch('/api/admin/fraud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${ADMIN_PASS}' },
                body: JSON.stringify({ type: newBlockType, value: newBlockValue.trim(), reason: newBlockReason.trim() }),
            });
            if (res.ok) {
                setNewBlockValue('');
                setNewBlockReason('');
                fetchFraudData();
            } else {
                alert('Failed to add entry.');
            }
        } catch (e) {
            alert('Error occurred.');
        } finally {
            setAddingBlock(false);
        }
    };

    const handleRemoveBlock = async (id: string) => {
        if (!confirm('Remove this entry from blocklist?')) return;
        try {
            const res = await fetch('/api/admin/fraud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${ADMIN_PASS}' },
                body: JSON.stringify({ action: 'remove', id }),
            });
            if (res.ok) fetchFraudData();
        } catch (e) {
            console.error(e);
        }
    };

    const stats = useMemo(() => {
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'pending').length;
        const completed = orders.filter(o => o.status === 'completed').length;
        const today = orders.filter(o => {
            const d = new Date(o.createdAt);
            const now = new Date();
            return d.toDateString() === now.toDateString() && o.status === 'completed';
        }).length;
        const revenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0);
        return { total, pending, completed, today, revenue };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let list = [...orders];
        if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(o =>
                o.id.toLowerCase().includes(q) ||
                o.email.toLowerCase().includes(q) ||
                (o.txid && o.txid.toLowerCase().includes(q))
            );
        }
        return list;
    }, [orders, searchQuery, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [totalPages, currentPage]);

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-dark-950" />;

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm">Enter admin password to continue</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {loginError && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-900/30 rounded-xl text-sm text-center font-medium">
                                {loginError}
                            </div>
                        )}
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-mono text-center tracking-widest text-lg"
                            required
                        />
                        <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-dark-950 flex font-sans">
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={cn(
                'w-64 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 z-50 transition-transform',
                isMobile && 'fixed left-0 top-0 h-full -translate-x-full',
                isMobile && sidebarOpen && 'translate-x-0'
            )}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-blue-600" />
                        Admin Dashboard
                    </h1>
                    {isMobile && (
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <button
                        onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                        className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors',
                            activeTab === 'orders'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                    >
                        <Package className="w-5 h-5" /> Orders
                    </button>
                    <button
                        onClick={() => { setActiveTab('fraud'); setSidebarOpen(false); }}
                        className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors',
                            activeTab === 'fraud'
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                    >
                        <ShieldAlert className="w-5 h-5" /> Fraud Control
                    </button>
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

            <main className="flex-1 min-w-0">
                {isMobile && (
                    <div className="sticky top-0 z-30 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <span className="font-bold text-slate-900 dark:text-white">Admin Dashboard</span>
                    </div>
                )}

                {activeTab === 'orders' ? (
                    <div className="p-4 md:p-8">
                        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Order Management</h2>
                                <p className="text-slate-500 text-sm mt-0.5">Manage all orders and process deliveries</p>
                            </div>
                            <button onClick={fetchOrders} className="btn-secondary rounded-xl px-4 py-2 text-sm flex gap-2 items-center shrink-0">
                                {isLoadingOrders ? <Clock className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Refresh
                            </button>
                        </header>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Orders', value: stats.total, icon: ShoppingCart, color: 'blue' },
                                { label: 'Pending', value: stats.pending, icon: Clock, color: 'orange' },
                                { label: 'Completed Today', value: stats.today, icon: CheckCircle2, color: 'green' },
                                { label: 'Revenue (USDT)', value: stats.revenue.toFixed(1), icon: DollarSign, color: 'purple' },
                            ].map(s => (
                                <div key={s.label} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={cn('w-10 h-10 rounded-xl flex items-center justify-center',
                                            s.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
                                            s.color === 'orange' && 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
                                            s.color === 'green' && 'bg-green-100 dark:bg-green-900/30 text-green-600',
                                            s.color === 'purple' && 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
                                        )}>
                                            <s.icon className="w-5 h-5" />
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        placeholder="Search order / email / TXID..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {(['all', 'pending', 'completed', 'cancelled'] as StatusFilter[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                                            className={cn(
                                                'px-3 py-2 rounded-xl text-xs font-bold transition-colors capitalize',
                                                statusFilter === s
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            )}
                                        >
                                            {s === 'all' ? 'All' : s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Order ID</th>
                                            <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Payment</th>
                                            <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800 hidden sm:table-cell">Items</th>
                                            <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Status</th>
                                            <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {isLoadingOrders && orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                                    <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
                                                    <p>Loading...</p>
                                                </td>
                                            </tr>
                                        ) : paginatedOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                                    <Package className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                                                    <p>No orders found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{order.id}</div>
                                                        <div className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)} {order.cryptoType.toUpperCase()}</div>
                                                        <div className="text-xs text-slate-500 font-mono truncate max-w-[120px]" title={order.txid}>{order.txid || '—'}</div>
                                                        <div className="text-xs text-slate-400 mt-0.5">{order.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5 hidden sm:table-cell">
                                                        <div className="flex flex-col gap-0.5">
                                                            {order.items.map((item, idx) => {
                                                                const info = getProductById(item.productId);
                                                                return (
                                                                    <div key={idx} className="text-xs text-slate-700 dark:text-slate-300">
                                                                        <span className="font-medium">{info?.tierName.en || info?.tierName.zh || item.productId}</span>
                                                                        <span className="text-slate-400 mx-1">x{item.quantity}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        {order.status === 'pending' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"><Clock className="w-3 h-3" /> Pending</span>}
                                                        {order.status === 'completed' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
                                                        {order.status === 'cancelled' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3 h-3" /> Cancelled</span>}
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            {order.status === 'pending' ? 'Process' : 'View'} <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 1 && (
                                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">
                                        {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Prev
                                        </button>
                                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                            const page = i + 1;
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={cn(
                                                        'px-3 py-1.5 text-xs font-bold rounded-lg transition-colors',
                                                        currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 md:p-8">
                        <header className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Fraud Control</h2>
                                <p className="text-slate-500 text-sm mt-0.5">Blocklist & risk event monitoring</p>
                            </div>
                            <button onClick={fetchFraudData} className="btn-secondary rounded-xl px-4 py-2 text-sm flex gap-2 items-center">
                                {isLoadingFraud ? <Clock className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Refresh
                            </button>
                        </header>

                        <div className="flex gap-2 mb-6">
                            {([['blocklist', 'Blocklist'], ['events', 'Risk Events']] as [FraudTab, string][]).map(([tab, label]) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFraudTab(tab)}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-sm font-bold transition-colors',
                                        activeFraudTab === tab
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {activeFraudTab === 'blocklist' ? (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                                    <h3 className="font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-blue-600" /> Add to Blocklist
                                    </h3>
                                    <form onSubmit={handleAddBlock} className="flex flex-col sm:flex-row gap-3">
                                        <select
                                            value={newBlockType}
                                            onChange={e => setNewBlockType(e.target.value as typeof newBlockType)}
                                            className="px-3 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="email">Email</option>
                                            <option value="ip">IP Address</option>
                                            <option value="txid">TXID</option>
                                            <option value="wallet">Wallet</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={newBlockValue}
                                            onChange={e => setNewBlockValue(e.target.value)}
                                            placeholder="Enter value..."
                                            className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                            required
                                        />
                                        <input
                                            type="text"
                                            value={newBlockReason}
                                            onChange={e => setNewBlockReason(e.target.value)}
                                            placeholder="Reason (optional)"
                                            className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={addingBlock}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
                                        >
                                            {addingBlock ? 'Adding...' : 'Add'}
                                        </button>
                                    </form>
                                </div>

                                <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                                    <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Type</th>
                                                    <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Value</th>
                                                    <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800 hidden sm:table-cell">Reason</th>
                                                    <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Added</th>
                                                    <th className="px-4 py-3.5 font-bold border-b border-slate-800 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                                {isLoadingFraud && blocklist.length === 0 ? (
                                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500"><Clock className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                                                ) : blocklist.length === 0 ? (
                                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No blocklist entries</td></tr>
                                                ) : (
                                                    blocklist.map(item => (
                                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                                            <td className="px-4 py-3.5">
                                                                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-bold">
                                                                    {BLOCK_TYPE_LABELS[item.type] || item.type}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3.5">
                                                                <span className="font-mono text-xs text-slate-700 dark:text-slate-300 max-w-[200px] block truncate" title={item.value}>{item.value}</span>
                                                            </td>
                                                            <td className="px-4 py-3.5 hidden sm:table-cell">
                                                                <span className="text-xs text-slate-500">{item.reason || '—'}</span>
                                                            </td>
                                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                                <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                                                            </td>
                                                            <td className="px-4 py-3.5 text-right">
                                                                <button
                                                                    onClick={() => handleRemoveBlock(item.id)}
                                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 text-xs font-bold rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-3 h-3" /> Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                                <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Event</th>
                                                <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Severity</th>
                                                <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Email / IP</th>
                                                <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800 hidden lg:table-cell">TXID</th>
                                                <th className="px-4 py-3.5 font-bold border-b border-slate-200 dark:border-slate-800">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                            {isLoadingFraud && fraudEvents.length === 0 ? (
                                                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500"><Clock className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                                            ) : fraudEvents.length === 0 ? (
                                                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No fraud events recorded</td></tr>
                                            ) : (
                                                fraudEvents.map(evt => (
                                                    <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                                        <td className="px-4 py-3.5">
                                                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                                {EVENT_TYPE_LABELS[evt.event_type] || evt.event_type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <span className={cn('px-2 py-1 rounded-lg text-xs font-bold capitalize', SEVERITY_COLORS[evt.severity] || SEVERITY_COLORS.low)}>
                                                                {evt.severity}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3.5">
                                                            <div className="text-xs text-slate-700 dark:text-slate-300">
                                                                {evt.email && <div className="truncate max-w-[150px]">{evt.email}</div>}
                                                                {evt.ip_address && <div className="text-slate-500">{evt.ip_address}</div>}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3.5 hidden lg:table-cell">
                                                            <span className="font-mono text-xs text-slate-500 truncate max-w-[120px] block">{evt.txid || evt.wallet_address || '—'}</span>
                                                        </td>
                                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                                            <span className="text-xs text-slate-500">{new Date(evt.created_at).toLocaleString()}</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Order Details</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Order ID</div>
                                    <div className="font-mono text-sm font-bold text-slate-900 dark:text-white break-all">{selectedOrder.id}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Status</div>
                                    <div>
                                        {selectedOrder.status === 'pending' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"><Clock className="w-3 h-3" /> Pending</span>}
                                        {selectedOrder.status === 'completed' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
                                        {selectedOrder.status === 'cancelled' && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><AlertCircle className="w-3 h-3" /> Cancelled</span>}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Email</div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{selectedOrder.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Amount</div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">${selectedOrder.totalAmount.toFixed(2)} {selectedOrder.cryptoType.toUpperCase()}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-slate-500 mb-1">TXID</div>
                                    <div className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">{selectedOrder.txid || '—'}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="text-xs text-slate-500 mb-1">Items</div>
                                    <div className="space-y-1 mt-1">
                                        {selectedOrder.items.map((item, idx) => {
                                            const info = getProductById(item.productId);
                                            return (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-slate-900 dark:text-white">{info?.tierName.en || info?.tierName.zh || item.productId}</span>
                                                    <span className="text-slate-400">x{item.quantity}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {selectedOrder.deliveredAccounts.length > 0 && (
                                    <div className="col-span-2">
                                        <div className="text-xs text-slate-500 mb-1">Delivered Accounts ({selectedOrder.deliveredAccounts.length})</div>
                                        <div className="space-y-1 mt-1">
                                            {selectedOrder.deliveredAccounts.map((acc, idx) => (
                                                <div key={idx} className="text-xs font-mono bg-slate-50 dark:bg-dark-950 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300">{acc}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedOrder.status === 'pending' && (
                                <form onSubmit={handleDeliver} className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-300">
                                        Verify TXID <code className="font-mono">{selectedOrder.txid}</code> on-chain before delivering.
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Account Credentials ({selectedOrder.items.reduce((a, c) => a + c.quantity, 0)} units)
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={accountsInput}
                                            onChange={e => setAccountsInput(e.target.value)}
                                            placeholder="account1----pass1&#10;account2----pass2"
                                            className="w-full p-3 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-slate-300"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setSelectedOrder(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-bold rounded-xl transition-colors text-sm">Cancel</button>
                                        <button type="submit" disabled={delivering} className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-500/20 text-sm">
                                            {delivering ? 'Delivering...' : 'Confirm Delivery'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
