'use client';

import { useState, useEffect, useMemo } from 'react';
import { useOrderStore, type Order } from '@/store/orderStore';
import {
    Lock, LayoutDashboard, Package, ShieldAlert, LogOut,
    CheckCircle2, Clock, AlertCircle, ChevronRight,
    Search, RefreshCw, X, DollarSign, ShoppingCart,
    Plus, Trash2, Users, Box, Settings, ClipboardList, Send, Loader2, Database
} from 'lucide-react';
import { getProductById } from '@/data/products';
import { cn, formatYuan } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

type Tab = 'orders' | 'services' | 'fraud' | 'users' | 'products' | 'settings';
type StatusFilter = 'all' | 'pending' | 'paid' | 'completed' | 'cancelled';
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

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Sawmik888';

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

    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [deliveryType, setDeliveryType] = useState<'vault' | 'manual'>('manual');
    const [manualFields, setManualFields] = useState({
        mobile: '',
        email: '',
        emailPass: '',
        accountPass: '',
        pin: '',
        passportNo: '',
        realName: '',
        other: ''
    });
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userFetchError, setUserFetchError] = useState<string | null>(null);
    const [dbProducts, setDbProducts] = useState<any[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [editingStock, setEditingStock] = useState<{id: string, count: number} | null>(null);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [isSyncingProducts, setIsSyncingProducts] = useState(false);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    const [newOrder, setNewOrder] = useState({
        email: '',
        telegram: '',
        productId: '',
        quantity: 1,
        status: 'pending'
    });
    const [newUser, setNewUser] = useState({
        email: '',
        telegram: '',
        vipTier: 'bronze'
    });
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
    const [serviceOrders, setServiceOrders] = useState<any[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [serviceStatusFilter, setServiceStatusFilter] = useState<string>('all');
    const [saveStatus, setSaveStatus] = useState<{msg: string; ok: boolean} | null>(null);

    const notify = (msg: string, ok = true) => {
        setSaveStatus({ msg, ok });
        setTimeout(() => setSaveStatus(null), 3000);
    };

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
            fetchUsers();
            fetchProducts();
            fetchFraudEvents();
            fetchServiceOrders();
        }
    }, [isAdminAuthenticated]);

    const fetchServiceOrders = async () => {
        setIsLoadingServices(true);
        try {
            const res = await fetch('/api/orders/service', {
                headers: { 'Authorization': `Bearer ${ADMIN_PASS}` },
            });
            if (res.ok) {
                const data = await res.json();
                setServiceOrders(data.services || []);
            }
        } catch (e) {
            console.error('Fetch Service Orders Error:', e);
        } finally {
            setIsLoadingServices(false);
        }
    };

    const handleUpdateServiceStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/orders/service/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                notify('✅ Service status updated');
                fetchServiceOrders();
            }
        } catch (e) {
            notify('❌ Failed to update status', false);
        }
    };

    const fetchFraudEvents = async () => {
        setIsLoadingFraud(true);
        try {
            const res = await fetch('/api/admin/fraud?type=events', {
                headers: { 'Authorization': `Bearer ${ADMIN_PASS}` },
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Admin Dashboard: Fetched fraud events:', data);
                if (Array.isArray(data)) {
                    setFraudEvents(data);
                } else {
                    console.error('Admin Dashboard: Expected array for fraud events, got:', typeof data);
                    setFraudEvents([]);
                }
            }
        } catch (e) {
            console.error('Fetch Fraud Events Error:', e);
        } finally {
            setIsLoadingFraud(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const res = await fetch('/api/admin/products', {
                headers: { 'Authorization': `Bearer ${ADMIN_PASS}` },
            });
            if (res.ok) {
                const data = await res.json();
                setDbProducts(data);
            }
        } catch (e) {
            console.error('Fetch Products Error:', e);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleUpdateStock = async (id: string, count: number) => {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify({ id, stockCount: count })
            });
            if (res.ok) {
                notify('✅ Stock updated');
                setEditingStock(null);
                fetchProducts();
            } else {
                const d = await res.json();
                notify(`❌ ${d.error || 'Failed to update stock'}`, false);
            }
        } catch (e) {
            console.error(e);
            notify('❌ Network error updating stock', false);
        }
    };

    const handleSyncProducts = async () => {
        setIsSyncingProducts(true);
        try {
            const res = await fetch('/api/admin/products/sync', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${ADMIN_PASS}` }
            });
            const data = await res.json();
            if (res.ok) {
                notify(`✅ Synced ${data.count ?? '?'} products from code!`);
                fetchProducts();
            } else {
                notify(`❌ Sync failed: ${data.error || 'Unknown error'}`, false);
            }
        } catch (e) {
            console.error(e);
            notify('❌ Sync network error', false);
        } finally {
            setIsSyncingProducts(false);
        }
    };

    const handleFullUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify({ 
                    id: editingProduct.id, 
                    stockCount: editingProduct.stock_count,
                    priceUsdt: editingProduct.price_usdt,
                    isActive: editingProduct.is_active,
                    nameEn: editingProduct.name_en,
                    nameZh: editingProduct.name_zh,
                    descEn: editingProduct.description_en,
                    descZh: editingProduct.description_zh,
                    soldCount: editingProduct.sold_count,
                    rating: editingProduct.rating,
                    reviewCount: editingProduct.review_count,
                    isPublished: editingProduct.is_published
                })
            });
            const d = await res.json();
            if (res.ok) {
                notify('✅ Product updated successfully');
                setEditingProduct(null);
                fetchProducts();
            } else {
                notify(`❌ ${d.error || 'Failed to update product'}`, false);
            }
        } catch (e) {
            console.error(e);
            notify('❌ Network error — product not saved', false);
        }
    };

    const handleCreateOrder = async () => {
        const product = dbProducts.find(p => p.id === newOrder.productId);
        if (!product) return alert('Select a product');

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify({
                    action: 'create',
                    email: newOrder.email,
                    telegram: newOrder.telegram,
                    status: newOrder.status,
                    totalAmount: product.price_usdt * newOrder.quantity,
                    items: [{
                        productId: product.id,
                        quantity: newOrder.quantity,
                        price: product.price_usdt
                    }]
                }),
            });
            if (res.ok) {
                setIsCreateOrderOpen(false);
                fetchOrders();
                setNewOrder({ email: '', telegram: '', productId: '', quantity: 1, status: 'pending' });
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (e) {
            alert('Failed to create order');
        }
    };

    const handleCreateUser = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify(newUser),
            });
            if (res.ok) {
                setIsCreateUserOpen(false);
                fetchUsers();
                setNewUser({ email: '', telegram: '', vipTier: 'bronze' });
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (e) {
            alert('Failed to create user');
        }
    };

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        setUserFetchError(null);
        try {
            const res = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${ADMIN_PASS}` },
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(Array.isArray(data) ? data : []);
            } else {
                const msg = data?.details || data?.error || `HTTP ${res.status}`;
                setUserFetchError(msg);
                console.error('[Admin] Fetch Users Failed:', res.status, data);
            }
        } catch (e: any) {
            setUserFetchError(e?.message || 'Network error');
            console.error('[Admin] Fetch Users Error:', e);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${ADMIN_PASS}` },
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Admin Dashboard: Fetched orders:', data);
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error('Admin Dashboard: Expected array for orders, got:', typeof data);
                    setOrders([]);
                }
                setCurrentPage(1);
            } else {
                console.error('Admin Dashboard: Fetch orders failed:', res.status);
            }
        } catch (e) {
            console.error('Admin Dashboard: Fetch orders error:', e);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const fetchFraudData = async () => {
        setIsLoadingFraud(true);
        try {
            const [blockRes, eventsRes] = await Promise.all([
                fetch('/api/admin/fraud?type=blocklist', { headers: { 'Authorization': `Bearer ${ADMIN_PASS}` } }),
                fetch('/api/admin/fraud?type=events&limit=100', { headers: { 'Authorization': `Bearer ${ADMIN_PASS}` } }),
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
        
        let payload: any = {
            orderPublicId: selectedOrder.id,
            deliveryType: deliveryType
        };

        if (deliveryType === 'vault') {
            const parsedAccounts = accountsInput.split('\n').map(l => l.trim()).filter(l => l !== '');
            if (parsedAccounts.length === 0) {
                alert('Please enter at least one account credential.');
                return;
            }
            payload.accounts = parsedAccounts;
        } else {
            // Validate manual fields - at least one field should be filled
            if (!manualFields.mobile && !manualFields.email && !manualFields.accountPass && !manualFields.other) {
                alert('Please fill at least one delivery field.');
                return;
            }
            payload.manualDetails = manualFields;
        }

        setDelivering(true);
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setSelectedOrder(null);
                setAccountsInput('');
                setManualFields({ mobile: '', email: '', emailPass: '', accountPass: '', pin: '', passportNo: '', realName: '', other: '' });
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
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
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
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
        const paid = orders.filter(o => o.status === 'paid').length;
        const today = orders.filter(o => {
            const d = new Date(o.createdAt);
            const now = new Date();
            return d.toDateString() === now.toDateString();
        }).length;
        const revenue = orders.filter(o => o.status === 'completed' || o.status === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
        const revenueRMB = revenue * 7.2; // ~7.2 CNY per USDT
        const verified = orders.filter(o => o.txVerified).length;
        const uniqueEmails = new Set(orders.map(o => o.email)).size;
        const repeatCustomers = orders.length - uniqueEmails;

        // Calculate 7-day revenue trend
        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(now.getDate() - (6 - i));
            const dayStr = d.toDateString();
            const dayRevenue = orders
                .filter(o => (o.status === 'completed' || o.status === 'paid') && new Date(o.createdAt).toDateString() === dayStr)
                .reduce((sum, o) => sum + o.totalAmount, 0);
            return { day: d.toLocaleDateString(undefined, { weekday: 'short' }), revenue: dayRevenue };
        });

        return { total, pending, completed, paid, today, revenue, revenueRMB, verified, uniqueEmails, repeatCustomers, last7Days };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let list = [...orders];
        if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(o =>
                o.id.toLowerCase().includes(q) ||
                o.email.toLowerCase().includes(q) ||
                (o.txid && o.txid.toLowerCase().includes(q)) ||
                (o.telegram && o.telegram.toLowerCase().includes(q)) ||
                (o.paymentWallet && o.paymentWallet.toLowerCase().includes(q))
            );
        }
        return list;
    }, [orders, searchQuery, statusFilter]);

    // ── Admin: Quick status update ──
    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify({ orderPublicId: orderId, status: newStatus }),
            });
            if (res.ok) fetchOrders();
            else alert('Status update failed');
        } catch { alert('Network error'); }
    };

    // ── Admin: Manual TXID verification ──
    const handleManualVerify = async (orderId: string) => {
        if (!confirm('Verify this TXID on the blockchain?')) return;
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                body: JSON.stringify({ orderPublicId: orderId }),
            });
            const data = await res.json();
            if (data.verified || data.alreadyVerified) {
                alert('✅ Payment verified on blockchain!');
                fetchOrders();
            } else if (data.canForceVerify) {
                if (confirm(`Blockchain verification failed: ${data.error}\n\nForce-mark as verified?`)) {
                    await handleStatusUpdate(orderId, 'paid');
                    await fetch('/api/admin/orders', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASS}` },
                        body: JSON.stringify({ orderPublicId: orderId, txVerified: true }),
                    });
                    fetchOrders();
                }
            } else {
                alert(`❌ Verification failed: ${data.error || 'Unknown error'}`);
            }
        } catch { alert('Network error during verification'); }
    };

    // ── Wallet label helper ──
    const getWalletLabel = (wallet: string, network: string) => {
        const w1 = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';
        const w2 = process.env.NEXT_PUBLIC_TRC20_WALLET_2 || 'TH2mdXf9wkddGSpynCTLJcS4CcHSLHSv4E';
        if (wallet === w1) return 'Main TRC20';
        if (wallet === w2) return 'Backup TRC20';
        if (network?.startsWith('bep20')) return 'BEP20';
        if (network?.startsWith('erc20')) return 'ERC20';
        if (network === 'trc20') return 'TRC20';
        return network?.toUpperCase() || '—';
    };

    // ── Explorer link helper ──
    const getExplorerUrl = (txid: string, network: string) => {
        if (!txid) return '';
        if (network === 'trc20') return `https://tronscan.org/#/transaction/${txid}`;
        if (network?.startsWith('bep20')) return `https://bscscan.com/tx/${txid}`;
        if (network?.startsWith('erc20')) return `https://etherscan.io/tx/${txid}`;
        return `https://tronscan.org/#/transaction/${txid}`;
    };

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(1);
    }, [totalPages, currentPage]);

    if (!isMounted) return <div className="min-h-screen bg-slate-50 dark:bg-dark-950" />;

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-[#070711] flex flex-col items-center justify-center p-4">
                <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}} className="backdrop-blur-xl rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-violet-500/30">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-white mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400 text-sm">CNVerifyHub Control Center</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center font-medium">
                                {loginError}
                            </div>
                        )}
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••••"
                            style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                            className="w-full px-5 py-4 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-white font-mono text-center tracking-widest text-lg placeholder:text-slate-600"
                            required
                        />
                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5">
                            Access Dashboard
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-600 mt-6">Secured · CNVerifyHub Admin v2.0</p>
                </div>
            </div>
        );
    }

    const navItems: { id: Tab; Icon: React.ElementType; label: string; color: string }[] = [
        { id: 'orders', Icon: Package, label: 'Orders', color: '#3b82f6' },
        { id: 'services', Icon: ClipboardList, label: 'Services', color: '#f59e0b' },
        { id: 'fraud', Icon: ShieldAlert, label: 'Fraud', color: '#ef4444' },
        { id: 'users', Icon: Users, label: 'Users', color: '#8b5cf6' },
        { id: 'products', Icon: Box, label: 'Products', color: '#10b981' },
        { id: 'settings', Icon: Settings, label: 'Settings', color: '#64748b' },
    ];

    return (
        <div className="min-h-screen bg-[#070711] flex font-sans pb-16 md:pb-0">
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Desktop Sidebar */}
            <aside className={cn(
                'w-60 flex flex-col h-screen sticky top-0 z-50 transition-transform shrink-0',
                'hidden md:flex',
                isMobile && 'fixed left-0 top-0 h-full -translate-x-full md:translate-x-0',
                isMobile && sidebarOpen && 'flex translate-x-0'
            )}
                style={{background:'rgba(13,13,26,0.95)',borderRight:'1px solid rgba(255,255,255,0.07)',backdropFilter:'blur(20px)'}}>
                <div className="p-5 flex items-center justify-between" style={{borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-black text-sm tracking-tight">CNVerifyHub Admin</span>
                    </div>
                    {isMobile && (
                        <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ id, Icon, label, color }) => (
                        <button key={id}
                            onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold"
                            style={activeTab === id
                                ? { background: `${color}18`, color, boxShadow: `inset 0 0 0 1px ${color}30` }
                                : { color: '#64748b' }
                            }
                        >
                            <Icon className="w-4 h-4 shrink-0" style={activeTab === id ? { color } : {}}/>
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="p-3" style={{borderTop:'1px solid rgba(255,255,255,0.07)'}}>
                    <button onClick={logoutAdmin}
                        className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-colors text-sm">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
                    style={{background:'rgba(7,7,17,0.95)',borderTop:'1px solid rgba(255,255,255,0.08)',backdropFilter:'blur(20px)'}}>
                    {navItems.map(({ id, Icon, label, color }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-all"
                            style={activeTab === id ? { color } : { color: '#475569' }}>
                            <Icon className="w-5 h-5" />
                            <span className="text-[9px] font-bold">{label}</span>
                        </button>
                    ))}
                </nav>
            )}

            <main className="flex-1 min-w-0" style={{background:'#070711'}}>
                {/* Mobile Top Bar */}
                {isMobile && (
                    <div className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{background:'rgba(7,7,17,0.9)',borderBottom:'1px solid rgba(255,255,255,0.07)',backdropFilter:'blur(20px)'}}>
                        <span className="font-black text-white text-sm">CNVerifyHub Admin</span>
                        <span className="text-xs font-mono" style={{color:'#475569'}}>v2.0</span>
                    </div>
                )}

                {/* Global Toast Notification */}
                {saveStatus && (
                    <div className="fixed top-4 right-4 z-[999] px-4 py-3 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2 transition-all"
                        style={{background: saveStatus.ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: saveStatus.ok ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(239,68,68,0.4)', color: saveStatus.ok ? '#6ee7b7' : '#fca5a5', backdropFilter:'blur(20px)'}}>
                        {saveStatus.msg}
                    </div>
                )}

                {activeTab === 'services' ? (
                    <div className="p-4 md:p-6">
                        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                            <div>
                                <h2 className="text-xl font-black text-white">Professional Services</h2>
                                <p className="text-slate-500 text-xs mt-0.5">Track KYC, Verification, and Manual Workflows.</p>
                            </div>
                            <button onClick={fetchServiceOrders}
                                className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-slate-300 hover:text-white transition-all shrink-0"
                                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
                                <RefreshCw className={cn('w-3.5 h-3.5', isLoadingServices && 'animate-spin')} /> Refresh
                            </button>
                        </header>

                        {/* Kanban Board */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
                            {[
                                { id: 'pending', label: 'Pending', color: 'slate' },
                                { id: 'in_progress', label: 'In Progress', color: 'blue' },
                                { id: 'awaiting_customer', label: 'Awaiting Info', color: 'orange' },
                                { id: 'completed', label: 'Completed', color: 'emerald' }
                            ].map(col => (
                                <div key={col.id} className="min-w-[280px]">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <span className={cn('w-2 h-2 rounded-full', 
                                                col.id === 'pending' ? 'bg-slate-500' :
                                                col.id === 'in_progress' ? 'bg-blue-500' :
                                                col.id === 'awaiting_customer' ? 'bg-orange-500' : 'bg-emerald-500'
                                            )} />
                                            {col.label}
                                        </h3>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/5 rounded text-slate-500">
                                            {serviceOrders.filter(s => s.status === col.id).length}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {serviceOrders.filter(s => s.status === col.id).map(service => (
                                            <div key={service.id} className="rounded-2xl p-4 space-y-3 transition-all hover:scale-[1.02] cursor-pointer" 
                                                style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                                                <div className="flex justify-between items-start">
                                                    <div className="text-[10px] font-mono text-blue-400">#{service.order?.public_id || 'ORD'}</div>
                                                    <div className="text-[9px] text-slate-500">{new Date(service.created_at).toLocaleDateString()}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-white mb-0.5">{service.product?.name_en}</div>
                                                    <div className="text-[10px] text-slate-500">{service.order?.telegram || service.order?.email}</div>
                                                </div>
                                                <div className="flex gap-1.5 pt-1">
                                                    {col.id !== 'pending' && <button onClick={() => handleUpdateServiceStatus(service.id, 'pending')} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"><RefreshCw className="w-3 h-3" /></button>}
                                                    {col.id !== 'in_progress' && <button onClick={() => handleUpdateServiceStatus(service.id, 'in_progress')} className="flex-1 py-1 px-2 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-bold">Start</button>}
                                                    {col.id !== 'completed' && <button onClick={() => handleUpdateServiceStatus(service.id, 'completed')} className="flex-1 py-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Finish</button>}
                                                </div>
                                            </div>
                                        ))}
                                        {serviceOrders.filter(s => s.status === col.id).length === 0 && (
                                            <div className="py-8 text-center text-[10px] text-slate-600 border border-dashed border-white/5 rounded-2xl">
                                                No tasks
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'users' ? (
                    <>
                        <div className="p-4 md:p-6">
                        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                            <div>
                                <h2 className="text-xl font-black text-white">User & VIP Management</h2>
                                <p className="text-slate-500 text-xs mt-0.5">Manage registered users, lifetime spend, and VIP tiers.</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => setIsCreateUserOpen(true)}
                                    className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-white transition-all"
                                    style={{background:'linear-gradient(135deg,#8b5cf6,#6d28d9)'}}>
                                    <Plus className="w-3.5 h-3.5" /> New User
                                </button>
                                <button onClick={fetchUsers}
                                    className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-slate-300 hover:text-white transition-all"
                                    style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
                                    <RefreshCw className={cn('w-3.5 h-3.5', isLoadingUsers && 'animate-spin')} /> Refresh
                                </button>
                            </div>
                        </header>

                        {userFetchError && (
                            <div className="mb-4 p-3 rounded-xl text-sm font-medium flex items-start gap-2" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5'}}>
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div><span className="font-bold">Failed to load users: </span>{userFetchError}<br/><span className="text-xs opacity-70">Check that SUPABASE_SERVICE_ROLE_KEY is set in Vercel env vars.</span></div>
                            </div>
                        )}

                        <div className="rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr style={{background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Identity (Telegram/Email)</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-center" style={{color:'#64748b'}}>VIP Tier</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Total Spent</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingUsers && users.length === 0 ? (
                                            <tr><td colSpan={4} className="px-4 py-12 text-center" style={{color:'#64748b'}}><Loader2 className="w-8 h-8 animate-spin mx-auto" /></td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan={4} className="px-4 py-12 text-center text-sm" style={{color:'#64748b'}}>No users found. Click Refresh to load.</td></tr>
                                        ) : (
                                            users.map(u => (
                                                <tr key={u.id} style={{borderTop:'1px solid rgba(255,255,255,0.05)'}} className="transition-colors hover:bg-white/[0.02]">
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-col">
                                                            {u.telegram ? (
                                                                <div className="font-black text-sm flex items-center gap-1" style={{color:'#60a5fa'}}>
                                                                    <Send className="w-3 h-3" /> @{u.telegram.replace('@', '')}
                                                                </div>
                                                            ) : (
                                                                <div className="font-black text-sm text-white">{u.email}</div>
                                                            )}
                                                            <div className="text-[10px] font-mono" style={{color:'#475569'}}>{u.email || 'No email linked'}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={cn('px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                                                            u.vip_tier === 'diamond' ? 'bg-cyan-900/40 text-cyan-300' :
                                                            u.vip_tier === 'gold' ? 'bg-yellow-900/40 text-yellow-300' :
                                                            u.vip_tier === 'silver' ? 'bg-slate-700 text-slate-300' :
                                                            'bg-orange-900/40 text-orange-300'
                                                        )}>
                                                            {u.vip_tier}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-white">
                                                        {formatYuan(u.total_spent || 0)}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs" style={{color:'#64748b'}}>
                                                        {new Date(u.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>
                    </>
                ) : activeTab === 'products' ? (
                    <div className="p-4 md:p-6">
                        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                            <div>
                                <h2 className="text-xl font-black text-white">Inventory Control</h2>
                                <p className="text-xs mt-0.5" style={{color:'#64748b'}}>Manage account stock and active status across all tiers.</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button 
                                    onClick={handleSyncProducts} 
                                    disabled={isSyncingProducts}
                                    className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center transition-all disabled:opacity-50"
                                    style={{background:'rgba(249,115,22,0.12)',color:'#fb923c',border:'1px solid rgba(249,115,22,0.3)'}}
                                >
                                    {isSyncingProducts ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                                    Sync from Code
                                </button>
                                <button onClick={fetchProducts}
                                    className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-slate-300 hover:text-white transition-all"
                                    style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
                                    <RefreshCw className={cn('w-3.5 h-3.5', isLoadingProducts && 'animate-spin')} /> Refresh
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {isLoadingProducts && dbProducts.length === 0 ? (
                                <div className="col-span-full py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" style={{color:'#64748b'}} /></div>
                            ) : dbProducts.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-sm rounded-2xl border border-dashed" style={{color:'#64748b',borderColor:'rgba(255,255,255,0.1)'}}>
                                    No products found in database. Click &quot;Sync from Code&quot; to import.
                                </div>
                            ) : (
                                dbProducts.map(p => (
                                    <div key={p.id} className="rounded-2xl p-5 flex flex-col sm:flex-row gap-5" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{background:'rgba(255,255,255,0.08)',color:'#94a3b8'}}>{p.category}</span>
                                                {!p.is_active && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{background:'rgba(239,68,68,0.15)',color:'#f87171'}}>Inactive</span>}
                                            </div>
                                            <h4 className="text-base font-bold text-white leading-tight">{p.name_en}</h4>
                                            <p className="text-sm mb-4" style={{color:'#64748b'}}>{p.name_zh}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-black text-white">${Number(p.price_usdt).toFixed(2)}</span>
                                                <span className="text-xs" style={{color:'#475569'}}> / unit</span>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-44 rounded-xl p-4 flex flex-col justify-center items-center" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                                            <div className="text-[10px] font-bold uppercase mb-2" style={{color:'#475569'}}>Current Stock</div>
                                            {editingStock?.id === p.id ? (
                                                <div className="flex flex-col gap-2 w-full">
                                                    <input 
                                                        type="number" 
                                                        value={editingStock?.count || 0} 
                                                        onChange={e => { if (editingStock) setEditingStock({...editingStock, count: parseInt(e.target.value) || 0}); }}
                                                        className="w-full px-3 py-2 rounded-lg text-center font-bold text-white outline-none"
                                                        style={{background:'rgba(255,255,255,0.08)',border:'1px solid #3b82f6'}}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingStock(null)} className="flex-1 py-1 text-xs rounded-md" style={{background:'rgba(255,255,255,0.08)',color:'#94a3b8'}}>Cancel</button>
                                                        <button onClick={() => editingStock && handleUpdateStock(p.id, editingStock.count)} className="flex-1 py-1 text-xs rounded-md font-bold text-white" style={{background:'#3b82f6'}}>Save</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={cn('text-3xl font-black mb-3', p.stock_count > 10 ? 'text-emerald-400' : p.stock_count > 0 ? 'text-orange-400' : 'text-red-400')}>
                                                        {p.stock_count}
                                                    </div>
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <button onClick={() => setEditingStock({id: p.id, count: p.stock_count})} className="text-xs font-bold" style={{color:'#60a5fa'}}>Quick Adjust Stock</button>
                                                        <button onClick={() => setEditingProduct(p)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors" style={{background:'rgba(255,255,255,0.08)',color:'#cbd5e1'}}>Full Edit</button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : activeTab === 'fraud' ? (
                    <div className="p-4 md:p-6">
                        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                            <div>
                                <h2 className="text-xl font-black text-white">Security &amp; Fraud</h2>
                                <p className="text-xs mt-0.5" style={{color:'#64748b'}}>Real-time alerts for suspicious transactions and IP behaviors.</p>
                            </div>
                            <button onClick={fetchFraudEvents}
                                className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-slate-300 hover:text-white transition-all shrink-0"
                                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}>
                                <RefreshCw className={cn('w-3.5 h-3.5', isLoadingFraud && 'animate-spin')} /> Refresh
                            </button>
                        </header>

                        <div className="rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr style={{background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Severity</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Event Type</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Identifier</th>
                                            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingFraud && fraudEvents.length === 0 ? (
                                            <tr><td colSpan={4} className="px-4 py-12 text-center" style={{color:'#64748b'}}><Loader2 className="w-8 h-8 animate-spin mx-auto" /></td></tr>
                                        ) : fraudEvents.length === 0 ? (
                                            <tr><td colSpan={4} className="px-4 py-12 text-center text-sm" style={{color:'#64748b'}}>No fraud events detected. Everything looks safe! ✅</td></tr>
                                        ) : (
                                            fraudEvents.map(ev => (
                                                <tr key={ev.id} style={{borderTop:'1px solid rgba(255,255,255,0.04)'}} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-4 py-3">
                                                        <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                                                            ev.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                                            ev.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                                            ev.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-slate-100 text-slate-600'
                                                        )}>
                                                            {ev.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-bold text-slate-900 dark:text-white text-xs">{ev.event_type}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-xs font-mono text-slate-500">{ev.email || ev.ip_address || ev.txid || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-[10px] text-slate-400">
                                                        {new Date(ev.created_at).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'settings' ? (
                    <div className="p-4 md:p-6">
                        <header className="mb-6">
                            <h2 className="text-xl font-black text-white">Platform Settings</h2>
                            <p className="text-xs mt-0.5" style={{color:'#64748b'}}>Global configuration and active wallets.</p>
                        </header>
                        <div className="rounded-2xl p-6 max-w-2xl" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                            <div className="space-y-5">
                                <div>
                                    <h4 className="font-bold text-sm text-white mb-2">Primary TRC20 Wallet</h4>
                                    <input type="text" readOnly value={process.env.NEXT_PUBLIC_TRC20_WALLET || 'Not set'} className="w-full px-4 py-2.5 rounded-xl font-mono text-sm outline-none cursor-default" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8'}} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white mb-2">Backup TRC20 Wallet</h4>
                                    <input type="text" readOnly value={process.env.NEXT_PUBLIC_TRC20_WALLET_2 || 'Not set'} className="w-full px-4 py-2.5 rounded-xl font-mono text-sm outline-none cursor-default" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',color:'#94a3b8'}} />
                                </div>
                                <div className="pt-4" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                                    <button disabled className="px-4 py-2 rounded-lg text-sm font-bold cursor-not-allowed" style={{background:'rgba(255,255,255,0.04)',color:'#475569'}}>Dynamic Wallet Edit (Requires API Migration)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'orders' ? (
                    <div className="p-4 md:p-6">
                        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                            <div>
                                <h2 className="text-xl font-black text-white">Order Management</h2>
                                <p className="text-xs mt-0.5" style={{color:'#64748b'}}>Manage all orders and process deliveries</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => setIsCreateOrderOpen(true)}
                                    className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-white transition-all"
                                    style={{background:'linear-gradient(135deg,#3b82f6,#2563eb)'}}>
                                    <Plus className="w-3.5 h-3.5" /> New Order
                                </button>
                                <button onClick={fetchOrders}
                                    className="px-3 py-2 text-xs font-bold rounded-xl flex gap-1.5 items-center text-slate-300 hover:text-white transition-all"
                                    style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                >
                                    {isLoadingOrders ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                    Refresh
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                            {[
                                { label: 'Total Orders', value: stats.total, icon: ShoppingCart, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                                { label: 'Pending', value: stats.pending, icon: Clock, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
                                { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                                { label: 'Revenue (USDT)', value: `$${stats.revenue.toFixed(1)}`, icon: DollarSign, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
                                { label: 'Revenue (RMB)', value: `¥${stats.revenueRMB.toFixed(0)}`, icon: DollarSign, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
                                { label: 'Verified Payments', value: `${stats.verified}/${stats.total}`, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                            ].map(s => (
                                <div key={s.label} className="rounded-2xl p-4" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:s.bg, color:s.color}}>
                                            <s.icon className="w-4 h-4" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-black text-white">{s.value}</div>
                                    <div className="text-[10px] mt-0.5" style={{color:'#64748b'}}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Revenue Trend Chart */}
                        <div className="mb-6 p-5 rounded-2xl" style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)'}}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">7-Day Revenue Trend (USDT)</h3>
                                <div className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-full">Live Data</div>
                            </div>
                            <div className="flex items-end justify-between gap-2 h-32 pt-2">
                                {stats.last7Days.map((day, i) => {
                                    const maxRev = Math.max(...stats.last7Days.map(d => d.revenue), 10);
                                    const height = (day.revenue / maxRev) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center group">
                                            <div className="relative w-full flex flex-col items-center">
                                                {/* Tooltip */}
                                                <div className="absolute -top-8 bg-slate-900 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-white/10">
                                                    ${day.revenue.toFixed(1)}
                                                </div>
                                                {/* Bar */}
                                                <div 
                                                    className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 bg-gradient-to-t from-blue-600/20 to-blue-500 group-hover:to-blue-400"
                                                    style={{ height: `${Math.max(height, 5)}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-500 mt-2">{day.day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                            <div className="p-4" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                                <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'#475569'}} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                        placeholder="Search order / email / TXID..."
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',color:'white'}}
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {(['all', 'pending', 'paid', 'completed', 'cancelled'] as StatusFilter[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                                            className="px-3 py-2 rounded-xl text-xs font-bold transition-colors capitalize"
                                            style={statusFilter === s
                                                ? {background:'#3b82f6',color:'white'}
                                                : {background:'rgba(255,255,255,0.06)',color:'#94a3b8'}
                                            }
                                        >
                                            {s === 'all' ? 'All' : s}
                                        </button>
                                    ))}
                                </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr style={{background:'rgba(255,255,255,0.03)',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                                            {['Order & Identity','Category','Variant','Payment','Wallet','Status','Actions'].map(h => (
                                                <th key={h} className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider" style={{color:'#64748b'}}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingOrders && orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-12 text-center" style={{color:'#64748b'}}>
                                                    <Clock className="w-8 h-8 animate-spin mx-auto mb-3" style={{color:'#3b82f6'}} />
                                                    <p>Loading orders from Supabase...</p>
                                                </td>
                                            </tr>
                                        ) : paginatedOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-12 text-center" style={{color:'#64748b'}}>
                                                    <Package className="w-10 h-10 mx-auto mb-3" style={{color:'#334155'}} />
                                                    <p>No orders found</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedOrders.map(order => (
                                                <tr key={order.id} style={{borderTop:'1px solid rgba(255,255,255,0.04)'}} className="hover:bg-white/[0.02] transition-colors">
                                                    {/* Order ID + Date + Email + Telegram */}
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        <div className="font-mono text-[11px] font-bold text-white">{order.id}</div>
                                                        <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</div>
                                                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{order.email}</div>
                                                        {order.telegram && (
                                                            <a href={`https://t.me/${order.telegram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline">
                                                                @{order.telegram.replace('@','')}
                                                            </a>
                                                        )}
                                                    </td>
                                                    
                                                    {/* Product Items */}
                                                    <td className="px-3 py-3">
                                                        {order.items && order.items.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {order.items.map((item: any, idx: number) => {
                                                                    const p = dbProducts.find(prod => prod.id === item.productId);
                                                                    return (
                                                                        <div key={idx} className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                                                            {p?.category || 'General'}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Product Variant */}
                                                    <td className="px-3 py-3">
                                                        {order.items && order.items.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {order.items.map((item: any, idx: number) => {
                                                                    const p = dbProducts.find(prod => prod.id === item.productId);
                                                                    // Extract variant from name or ID
                                                                    const variant = p?.name_en?.split('Account')[0]?.trim() || p?.name_en || item.productId;
                                                                    return (
                                                                        <div key={idx} className="text-[10px] text-slate-500">
                                                                            {variant} <span className="opacity-60">×{item.quantity}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Payment Amount + TXID link */}
                                                    <td className="px-3 py-3">
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)}</div>
                                                        <div className="text-[10px] text-slate-400">≈¥{(order.totalAmount * 7.2).toFixed(0)}</div>
                                                        {order.txid ? (
                                                            <a href={getExplorerUrl(order.txid, order.paymentNetwork || 'trc20')} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 font-mono hover:underline truncate block max-w-[100px]" title={order.txid}>
                                                                {order.txid.slice(0, 10)}...
                                                            </a>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">No TXID</span>
                                                        )}
                                                    </td>

                                                    {/* Wallet Type + Address */}
                                                    <td className="px-3 py-3">
                                                        {order.paymentWallet ? (
                                                            <>
                                                                <span className={cn('inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mb-1',
                                                                    order.paymentNetwork === 'trc20' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                    : order.paymentNetwork?.startsWith('bep20') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                )}>
                                                                    {getWalletLabel(order.paymentWallet, order.paymentNetwork || '')}
                                                                </span>
                                                                <div className="text-[9px] font-mono text-slate-400 truncate max-w-[100px] cursor-pointer hover:text-slate-600" title={order.paymentWallet} onClick={() => { navigator.clipboard.writeText(order.paymentWallet || ''); }}>
                                                                    {order.paymentWallet.slice(0, 8)}...{order.paymentWallet.slice(-4)}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Verification Status */}
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        {order.txVerified ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                                            </span>
                                                        ) : order.txid ? (
                                                            <button onClick={() => handleManualVerify(order.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 transition-colors cursor-pointer">
                                                                <AlertCircle className="w-3 h-3" /> Verify Now
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Status Dropdown */}
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                            className={cn('text-[10px] font-bold rounded-lg px-2 py-1.5 border-0 outline-none cursor-pointer appearance-none',
                                                                order.status === 'pending' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
                                                                order.status === 'paid' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                                                                order.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                                                                order.status === 'cancelled' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                                                order.status === 'processing' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
                                                            )}
                                                        >
                                                            <option value="pending">⏳ Pending</option>
                                                            <option value="paid">💰 Paid</option>
                                                            <option value="processing">🔄 Processing</option>
                                                            <option value="completed">✅ Completed</option>
                                                            <option value="cancelled">❌ Cancelled</option>
                                                        </select>
                                                    </td>

                                                    {/* Action Buttons */}
                                                    <td className="px-3 py-3 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors"
                                                        >
                                                            {order.status === 'pending' || order.status === 'paid' ? 'Deliver' : 'View'} <ChevronRight className="w-3 h-3" />
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
                                     <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                                         <button
                                             type="button"
                                             onClick={() => setDeliveryType('manual')}
                                             className={cn('flex-1 py-1.5 text-xs font-bold rounded-lg transition-all', deliveryType === 'manual' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500')}
                                         >
                                             Manual Structured
                                         </button>
                                         <button
                                             type="button"
                                             onClick={() => setDeliveryType('vault')}
                                             className={cn('flex-1 py-1.5 text-xs font-bold rounded-lg transition-all', deliveryType === 'vault' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500')}
                                         >
                                             Bulk List (Vault)
                                         </button>
                                     </div>

                                     {deliveryType === 'manual' ? (
                                         <div className="space-y-3 mb-4">
                                             <div className="grid grid-cols-2 gap-3">
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Mobile</label>
                                                     <input type="text" value={manualFields.mobile} onChange={e => setManualFields({...manualFields, mobile: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="+880..." />
                                                 </div>
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Real Name</label>
                                                     <input type="text" value={manualFields.realName} onChange={e => setManualFields({...manualFields, realName: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="RANA RAHAT..." />
                                                 </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-3">
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Email</label>
                                                     <input type="text" value={manualFields.email} onChange={e => setManualFields({...manualFields, email: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="user@mail.com" />
                                                 </div>
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Email Pass</label>
                                                     <input type="text" value={manualFields.emailPass} onChange={e => setManualFields({...manualFields, emailPass: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono" placeholder="Password" />
                                                 </div>
                                             </div>
                                             <div className="grid grid-cols-2 gap-3">
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Account Pass</label>
                                                     <input type="text" value={manualFields.accountPass} onChange={e => setManualFields({...manualFields, accountPass: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono" placeholder="Alipay Pass" />
                                                 </div>
                                                 <div>
                                                     <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">PIN</label>
                                                     <input type="text" value={manualFields.pin} onChange={e => setManualFields({...manualFields, pin: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-mono" placeholder="888999" />
                                                 </div>
                                             </div>
                                             <div>
                                                 <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Passport No</label>
                                                 <input type="text" value={manualFields.passportNo} onChange={e => setManualFields({...manualFields, passportNo: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="A21623946" />
                                             </div>
                                             <div>
                                                 <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Other / Raw Info</label>
                                                 <textarea rows={2} value={manualFields.other} onChange={e => setManualFields({...manualFields, other: e.target.value})} className="w-full px-3 py-2 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono" placeholder="Additional details..." />
                                             </div>
                                         </div>
                                     ) : (
                                         <div className="mb-4">
                                             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                 Bulk List ({selectedOrder.items.reduce((a, c) => a + c.quantity, 0)} units)
                                             </label>
                                             <textarea
                                                 required
                                                 rows={8}
                                                 value={accountsInput}
                                                 onChange={e => setAccountsInput(e.target.value)}
                                                 placeholder="account1----pass1&#10;account2----pass2"
                                                 className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white font-mono text-sm"
                                             />
                                         </div>
                                     )}

                                    <button
                                        type="submit"
                                        disabled={delivering}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {delivering ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
                                        {delivering ? 'Delivering...' : 'Complete Fulfillment'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* ── CREATE ORDER MODAL ── */}
            {isCreateOrderOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-dark-950">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Create Manual Order</h3>
                            <button onClick={() => setIsCreateOrderOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buyer Email</label>
                                    <input type="email" value={newOrder.email} onChange={e => setNewOrder({...newOrder, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none" placeholder="user@example.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telegram (Optional)</label>
                                    <input type="text" value={newOrder.telegram} onChange={e => setNewOrder({...newOrder, telegram: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none" placeholder="@username" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Product</label>
                                <select value={newOrder.productId} onChange={e => setNewOrder({...newOrder, productId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none">
                                    <option value="">Choose a product...</option>
                                    {dbProducts.map(p => (
                                        <option key={p.id} value={p.id}>{p.name_en} (${p.price_usdt})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                                    <input type="number" min="1" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 1})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initial Status</label>
                                    <select value={newOrder.status} onChange={e => setNewOrder({...newOrder, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none">
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleCreateOrder} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all">
                                Generate Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CREATE USER MODAL ── */}
            {isCreateUserOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-dark-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-dark-950">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Create Manual Profile</h3>
                            <button onClick={() => setIsCreateUserOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                                <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none" placeholder="user@example.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telegram</label>
                                <input type="text" value={newUser.telegram} onChange={e => setNewUser({...newUser, telegram: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none" placeholder="@username" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">VIP Tier</label>
                                <select value={newUser.vipTier} onChange={e => setNewUser({...newUser, vipTier: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none">
                                    <option value="bronze">Bronze</option>
                                    <option value="silver">Silver</option>
                                    <option value="gold">Gold</option>
                                    <option value="diamond">Diamond</option>
                                </select>
                            </div>
                            <button onClick={handleCreateUser} className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl shadow-xl transition-all">
                                Create Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.8)',backdropFilter:'blur(8px)'}}>
                    <div className="rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" style={{background:'#0f0f1a',border:'1px solid rgba(255,255,255,0.1)'}}>
                        <div className="p-5 flex justify-between items-center" style={{borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                            <h3 className="text-lg font-black text-white">Edit Product</h3>
                            <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleFullUpdateProduct} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Product Name (EN)</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct.name_en || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, name_en: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Product Name (ZH)</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct.name_zh || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, name_zh: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Price (USDT)</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        value={editingProduct.price_usdt || 0} 
                                        onChange={e => setEditingProduct({...editingProduct, price_usdt: parseFloat(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Stock Count</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.stock_count || 0} 
                                        onChange={e => setEditingProduct({...editingProduct, stock_count: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Description (EN)</label>
                                    <textarea 
                                        rows={3}
                                        value={editingProduct.description_en || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, description_en: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Description (ZH)</label>
                                    <textarea 
                                        rows={3}
                                        value={editingProduct.description_zh || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, description_zh: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Sold Count</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.sold_count || 0} 
                                        onChange={e => setEditingProduct({...editingProduct, sold_count: parseInt(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{color:'#64748b'}}>Rating (0-5)</label>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={editingProduct.rating || 0} 
                                        onChange={e => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value)})}
                                        className="w-full px-4 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500"
                                        style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                                    />
                                </div>
                                <div className="col-span-2 flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={editingProduct.is_active} 
                                            onChange={e => setEditingProduct({...editingProduct, is_active: e.target.checked})}
                                            className="w-4 h-4 rounded accent-violet-600"
                                        />
                                        <span className="text-sm font-bold text-white">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={editingProduct.is_published} 
                                            onChange={e => setEditingProduct({...editingProduct, is_published: e.target.checked})}
                                            className="w-4 h-4 rounded accent-emerald-600"
                                        />
                                        <span className="text-sm font-bold text-white">Published</span>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3" style={{borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                                <button type="button" onClick={() => setEditingProduct(null)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all"
                                    style={{background:'rgba(255,255,255,0.06)',color:'#94a3b8'}}>Cancel</button>
                                <button type="submit"
                                    className="flex-1 py-3 px-8 text-white font-bold rounded-xl transition-all shadow-lg"
                                    style={{background:'linear-gradient(135deg,#7c3aed,#4f46e5)'}}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

