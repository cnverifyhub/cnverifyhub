'use client';

import { useState, useEffect } from 'react';
import { useUserStore, type VIPTier } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import { t, type Lang } from '@/lib/i18n';
import { formatUsdt } from '@/lib/utils';
import { User, Shield, Star, Crown, ChevronRight, LogOut, Package, Wallet, Gift, Diamond } from 'lucide-react';
import Link from 'next/link';

interface AccountDashboardProps {
    lang: Lang;
}

const tierConfig: Record<VIPTier, { color: string, icon: any, zh: string, en: string }> = {
    bronze: { color: 'from-amber-700 to-amber-900', icon: Star, zh: '青铜会员', en: 'Bronze' },
    silver: { color: 'from-slate-300 to-slate-500', icon: Shield, zh: '白银会员', en: 'Silver' },
    gold: { color: 'from-yellow-400 to-yellow-600', icon: Crown, zh: '黄金保时捷', en: 'Gold VIP' },
    diamond: { color: 'from-cyan-300 to-blue-500', icon: Diamond, zh: '黑钻至尊', en: 'Diamond' },
};

export function AccountDashboard({ lang }: AccountDashboardProps) {
    const { user, login, logout, getTierProgress } = useUserStore();
    const { orders } = useOrderStore();
    const [emailInput, setEmailInput] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    if (!user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-zoom-in">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-black mb-2">{lang === 'zh' ? '欢迎回来' : 'Welcome Back'}</h1>
                    <p className="text-slate-500 mb-8">{lang === 'zh' ? '输入邮箱快速登录，查看历史订单与VIP特权' : 'Enter your email to access your VIP benefits and history'}</p>

                    <form onSubmit={(e) => { e.preventDefault(); if (emailInput) login(emailInput); }} className="space-y-4">
                        <input
                            type="email"
                            required
                            placeholder={lang === 'zh' ? '您的邮箱地址' : 'Your email address'}
                            className="w-full bg-slate-100 dark:bg-dark-800 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary-500 outline-none"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <button type="submit" className="w-full btn-primary py-4 text-lg">
                            {lang === 'zh' ? '一键登录 / 注册' : 'Login / Register'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const tier = tierConfig[user.vipTier];
    const TierIcon = tier.icon;
    const progress = getTierProgress();
    const userOrders = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 text-slate-500">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    {lang === 'zh' ? '个人中心' : 'My Account'}
                </h1>
                <button onClick={logout} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                    {lang === 'zh' ? '退出登录' : 'Logout'}
                </button>
            </div>

            {/* VIP Gamification Card */}
            <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 mb-8 text-white shadow-2xl bg-gradient-to-br ${tier.color}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                            <TierIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-medium opacity-80 mb-1">{user.email}</div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                                {lang === 'zh' ? tier.zh : tier.en}
                                {user.vipTier === 'diamond' && <span className="text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">Max Level</span>}
                            </h2>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span>{lang === 'zh' ? '当前成长值' : 'Current EXP'}</span>
                            <span className="text-yellow-300">{formatUsdt(user.totalSpent)}</span>
                        </div>
                        <div className="h-3 bg-black/40 rounded-full overflow-hidden mb-2 relative">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress.percentage}%` }}
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                            </div>
                        </div>
                        <div className="text-xs opacity-80 text-right">
                            {user.vipTier === 'diamond'
                                ? (lang === 'zh' ? '已达到最高等级！' : 'Maximum Tier Reached!')
                                : (lang === 'zh' ? `距离升级还差 ${formatUsdt(progress.nextTarget - progress.current)}` : `Spend ${formatUsdt(progress.nextTarget - progress.current)} more to upgrade`)
                            }
                        </div>
                    </div>
                </div>

                {/* Privileges */}
                <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-2">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold">{lang === 'zh' ? '专属折扣' : 'VIP Discount'}</div>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-2">
                            <Gift className="w-5 h-5 text-yellow-300" />
                        </div>
                        <div className="text-xs font-bold">{lang === 'zh' ? '节日礼包' : 'Bonus Gifts'}</div>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-2">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold">{lang === 'zh' ? '极速售后' : 'Priority Support'}</div>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-500" />
                {lang === 'zh' ? '我的订单' : 'Order History'}
            </h3>

            {userOrders.length === 0 ? (
                <div className="glass-card p-8 rounded-2xl text-center text-slate-500">
                    {lang === 'zh' ? '暂无订单记录' : 'No recent orders found.'}
                    <div className="mt-4">
                        <Link href={`/${lang === 'en' ? 'en' : ''}`} className="text-primary-500 font-bold hover:underline">
                            {lang === 'zh' ? '去挑选商品' : 'Start Shopping'}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {userOrders.map(order => (
                        <div key={order.id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary-500/30 transition-colors">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">{new Date(order.createdAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
                                <div className="font-bold flex items-center gap-2">
                                    {order.id}
                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                                        {lang === 'zh' ? '已完成' : 'Completed'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                                <span className="font-black text-red-600 dark:text-red-500">{formatUsdt(order.totalAmount)}</span>
                                <Link href={lang === 'en' ? '/en/client' : '/client'} className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center mt-1">
                                    {lang === 'zh' ? '查看详情' : 'View Details'} <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
