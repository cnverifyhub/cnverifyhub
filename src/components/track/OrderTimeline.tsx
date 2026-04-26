'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Box, Truck, CheckCircle, Copy, Check, Eye, EyeOff, AlertTriangle, Headphones } from 'lucide-react';
import { Order } from '@/store/orderStore';

interface OrderTimelineProps {
    order: Order;
    lang: 'zh' | 'en';
}

export function OrderTimeline({ order, lang }: OrderTimelineProps) {
    const [showAccounts, setShowAccounts] = useState(false);
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

    // Timeline Steps Mapping
    // 0: 待付款, 1: 待发货, 2: 已发货, 3: 交易成功
    let currentStep = 0;
    if (order.status === 'paid') currentStep = 1;
    if (order.deliveredAccounts?.length > 0 || order.deliveryDetails) currentStep = 2;
    if (order.status === 'completed') currentStep = 3;

    const wechatGreen = "#07C160";
    const taobaoRed = "#FF0036";

    const steps = [
        { labelZh: '待付款', labelEn: 'Pending Payment', icon: Clock },
        { labelZh: '待发货', labelEn: 'Processing', icon: Box },
        { labelZh: '已发货', labelEn: 'Shipped', icon: Truck },
        { labelZh: '交易成功', labelEn: 'Success', icon: CheckCircle },
    ];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedAccount(id);
        setTimeout(() => setCopiedAccount(null), 2000);
    };

    return (
        <div className="space-y-8 py-4">
            {/* Timeline Stepper */}
            <div className="relative">
                {/* Desktop Horizontal View */}
                <div className="hidden md:flex justify-between items-start mb-12 relative px-4 text-center">
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
                    {/* Progress Bar Active */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        className="absolute top-5 left-10 h-0.5 -z-10"
                        style={{ backgroundColor: wechatGreen }}
                    />

                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;
                        
                        return (
                            <div key={idx} className="flex flex-col items-center flex-1">
                                <div 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm transition-all duration-500 ${
                                        isCompleted ? 'text-white' : 
                                        isActive ? 'text-white animate-pulse' : 
                                        'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                    }`}
                                    style={{ 
                                        backgroundColor: isCompleted ? wechatGreen : isActive ? taobaoRed : undefined 
                                    }}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" strokeWidth={3} /> : <Icon className="w-5 h-5" />}
                                </div>
                                <div className={`mt-3 font-black text-sm tracking-tight ${isActive ? 'text-[#FF0036]' : isCompleted ? 'text-[#07C160]' : 'text-slate-400'}`}>
                                    {lang === 'zh' ? step.labelZh : step.labelEn}
                                </div>
                                <div className="mt-1 text-[10px] text-slate-400 font-bold font-mono uppercase tracking-tighter opacity-60">
                                    {idx <= currentStep ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : '等待中'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Vertical View */}
                <div className="md:hidden space-y-8 pl-10 relative before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;

                        return (
                            <div key={idx} className="relative">
                                <div 
                                    className={`absolute -left-[31px] w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center z-10 transition-all duration-500 ${
                                        isCompleted ? 'text-white' : 
                                        isActive ? 'text-white animate-pulse' : 
                                        'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                    }`}
                                    style={{ 
                                        backgroundColor: isCompleted ? wechatGreen : isActive ? taobaoRed : undefined 
                                    }}
                                >
                                    {isCompleted ? <Check className="w-3 h-3" strokeWidth={3} /> : <Icon className="w-3 h-3" />}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div className={`font-black text-base tracking-tight ${isActive ? 'text-[#FF0036]' : isCompleted ? 'text-[#07C160]' : 'text-slate-400'}`}>
                                        {lang === 'zh' ? step.labelZh : step.labelEn}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold font-mono bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                                        {idx <= currentStep ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : 'WAITING'}
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-500 mt-1.5 leading-relaxed">
                                    {idx === 0 ? (lang === 'zh' ? '订单已创建，等待系统配对' : 'Order created, matching in system') : 
                                     idx === 1 ? (lang === 'zh' ? '支付已确认，系统正在提取账号' : 'Payment confirmed, extracting credentials') : 
                                     idx === 2 ? (lang === 'zh' ? '账号已下发，请及时查收' : 'Credentials shipped, please check') : 
                                     (lang === 'zh' ? '交易已圆满完成，感谢信任' : 'Transaction completed, thank you')}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Account Credentials Section (Visible only when shipped) */}
            {currentStep >= 2 && ((order.deliveredAccounts && order.deliveredAccounts.length > 0) || order.deliveryDetails) && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 overflow-hidden rounded-3xl border-2 border-emerald-500/20 bg-white dark:bg-slate-900 shadow-xl"
                >
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Truck className="w-5 h-5" />
                            {lang === 'zh' ? '您的账号信息' : 'Account Credentials'}
                        </div>
                        <button 
                            onClick={() => setShowAccounts(!showAccounts)}
                            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
                        >
                            {showAccounts ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {showAccounts ? (lang === 'zh' ? '隐藏' : 'Hide') : (lang === 'zh' ? '显示' : 'Show')}
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {order.deliveredAccounts.map((account, idx) => {
                            const [username, password] = account.split(':');
                            return (
                                <div key={idx} className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">账号/用户名</p>
                                            <div className="font-mono text-sm dark:text-white break-all">
                                                {showAccounts ? username : '****************'}
                                            </div>
                                        </div>
                                        <button 
                                            disabled={!showAccounts}
                                            onClick={() => handleCopy(username || '', `user-${idx}`)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                                        >
                                            {copiedAccount === `user-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            复制账号
                                        </button>
                                    </div>
                                    <div className="h-px bg-slate-200/50 dark:bg-slate-700/50" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">密码/密钥</p>
                                            <div className="font-mono text-sm text-red-500 dark:text-red-400 break-all font-bold">
                                                {showAccounts ? password : '****************'}
                                            </div>
                                        </div>
                                        <button 
                                            disabled={!showAccounts}
                                            onClick={() => handleCopy(password || '', `pass-${idx}`)}
                                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                                        >
                                            {copiedAccount === `pass-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            复制密码
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Manual Delivery Details */}
                        {order.deliveryDetails && (
                            <div className="space-y-4">
                                {Object.entries(order.deliveryDetails).map(([key, value]) => {
                                    if (!value) return null;
                                    const labels: Record<string, {zh: string, en: string}> = {
                                        mobile: { zh: '手机号', en: 'Mobile' },
                                        email: { zh: '电子邮箱', en: 'Email' },
                                        emailPass: { zh: '邮箱密码', en: 'Email Password' },
                                        accountPass: { zh: '账号密码', en: 'Account Password' },
                                        pin: { zh: '支付/PIN码', en: 'PIN/Pay Code' },
                                        passportNo: { zh: '证件号', en: 'ID/Passport No' },
                                        realName: { zh: '实名姓名', en: 'Real Name' },
                                        other: { zh: '其他信息', en: 'Other Info' }
                                    };
                                    const label = labels[key] || { zh: key, en: key };
                                    
                                    return (
                                        <div key={key} className="space-y-3 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="text-[10px] uppercase tracking-widest text-blue-500 dark:text-blue-400 font-bold mb-1">
                                                        {lang === 'zh' ? label.zh : label.en}
                                                    </p>
                                                    <div className="font-mono text-sm dark:text-white break-all">
                                                        {showAccounts ? (value as string) : '****************'}
                                                    </div>
                                                </div>
                                                <button 
                                                    disabled={!showAccounts}
                                                    onClick={() => handleCopy(value as string, `manual-${key}`)}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                                                >
                                                    {copiedAccount === `manual-${key}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    {lang === 'zh' ? '复制' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Red Warning Banner */}
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 animate-pulse">
                            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-black tracking-tight leading-tight">
                                    请在3小时内修改密码确保账号安全
                                </p>
                                <p className="text-[10px] opacity-80 mt-1">
                                    为了您的资产安全，登录后请务必立刻解绑前主手的指纹/人脸并修改登录密码。
                                </p>
                            </div>
                        </div>

                        {/* Customer Support Button */}
                        <a 
                            href="https://t.me/cnwechatpro" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group"
                        >
                            <Headphones className="w-5 h-5 text-slate-500 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">联系客服协助登录</span>
                        </a>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
