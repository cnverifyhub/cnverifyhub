'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ShieldCheck, Loader2, AlertCircle, QrCode, Wallet } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface AlipayPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    orderId: string;
    onSuccess: () => void;
}

type PaymentMethod = 'alipay' | 'wechat' | 'usdt';

export function AlipayPaymentModal({ isOpen, onClose, amount, orderId, onSuccess }: AlipayPaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>('usdt');
    const [txId, setTxId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    const usdtAddress = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';

    useEffect(() => {
        if (!isOpen) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeLeft(15 * 60); // Reset timer on open
        } else {
            document.body.style.overflow = 'unset';
            setShowSuccess(false);
            setTxId('');
        }
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(usdtAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (txId.length < 6) return;
        setIsSubmitting(true);
        
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Let success animation play before calling onSuccess
        setTimeout(() => {
            onSuccess();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-white dark:bg-slate-900 w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 relative"
                >
                    {/* Institutional Header */}
                    <div className="bg-[#f5f5f5] dark:bg-slate-800 px-8 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-[#1677ff] rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-white" />
                             </div>
                             <span className="font-black text-slate-800 dark:text-white tracking-tight">收银台 | Checkout</span>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Status/Order Info */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">确认付款</h3>
                                <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-wider">Order ID: {orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">支付剩余时间</p>
                                <div className="text-2xl font-black text-red-500 font-mono tracking-tighter animate-pulse">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-slate-800">
                             <div className="flex justify-between items-center mb-4">
                                 <span className="text-sm font-bold text-slate-500">实付金额</span>
                                 <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-slate-900 dark:text-white">¥</span>
                                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        {(amount * 7.2).toFixed(2)}
                                    </span>
                                 </div>
                             </div>
                             <div className="h-px bg-slate-200 dark:bg-slate-700 w-full mb-4" />
                             <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-400">结算价格 (USDT)</span>
                                 <span className="text-lg font-black text-[#07C160]">{amount.toFixed(2)} USDT</span>
                             </div>
                        </div>

                        {/* QR Code & Scanning Prompt */}
                        <div className="flex flex-col items-center gap-6 mb-8">
                            <div className="relative p-4 bg-white rounded-[24px] shadow-2xl border-4 border-slate-50">
                                <QRCodeSVG 
                                    value={usdtAddress} 
                                    size={180}
                                    level="H"
                                    includeMargin={false}
                                />
                                {/* Scanning Frame corners */}
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#1677ff] rounded-tl-lg" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#1677ff] rounded-tr-lg" />
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#1677ff] rounded-bl-lg" />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#1677ff] rounded-br-lg" />
                            </div>

                            <div className="flex items-center gap-3 px-6 py-2.5 bg-[#f0f7ff] dark:bg-blue-900/10 rounded-full border border-blue-100 dark:border-blue-900/30">
                                <QrCode className="w-5 h-5 text-[#1677ff]" />
                                <span className="text-sm font-black text-[#1677ff] tracking-tight">打开加密钱包APP 扫一扫付款</span>
                            </div>
                        </div>

                        {/* Address & TXID Field */}
                        <div className="space-y-4">
                             <div className="relative">
                                 <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">收币地址 (TRC20 网络)</p>
                                 <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 group">
                                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate flex-1 font-bold">
                                        {usdtAddress}
                                    </span>
                                    <button 
                                        onClick={handleCopy}
                                        className="p-1.5 text-slate-400 hover:text-[#1677ff] transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-[#07C160]" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                 </div>
                             </div>

                             <div className="relative">
                                 <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">转账确认 (后6位单号/TXID)</p>
                                 <input 
                                    type="text"
                                    maxLength={32}
                                    value={txId}
                                    onChange={(e) => setTxId(e.target.value)}
                                    placeholder="请输入转账后6位单号"
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-[#1677ff]/10 focus:border-[#1677ff] transition-all font-black tracking-[0.2em] text-lg text-center"
                                 />
                             </div>
                        </div>

                        {/* Final Action */}
                        <button
                            onClick={handleSubmit}
                            disabled={txId.length < 6 || isSubmitting}
                            className={`w-full mt-8 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 ${
                                txId.length >= 6
                                    ? 'bg-[#1677ff] text-white shadow-[#1677ff]/30 hover:brightness-110'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-7 h-7 animate-spin" />
                            ) : (
                                '我已完成支付'
                            )}
                        </button>

                        {/* Institutional Trust Badges */}
                        <div className="mt-8 flex items-center justify-between px-2 gap-4">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                <ShieldCheck className="w-4 h-4 text-[#07C160]" />
                                担保交易
                             </div>
                             <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                <ShieldCheck className="w-4 h-4 text-[#07C160]" />
                                资金安全
                             </div>
                             <div className="w-px h-3 bg-slate-200 dark:bg-slate-800" />
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                <ShieldCheck className="w-4 h-4 text-[#07C160]" />
                                自动发货
                             </div>
                        </div>
                    </div>

                    {/* Success Animation Overlay (Existing logic kept but styled) */}
                    <AnimatePresence>
                        {showSuccess && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[120] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-24 h-24 rounded-full bg-[#07C160] flex items-center justify-center shadow-2xl shadow-[#07C160]/40 mb-8">
                                    <Check className="w-12 h-12 text-white stroke-[4px]" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">支付已提交</h3>
                                <p className="text-slate-500 font-bold">请等待区块链确认 (1-5分钟)</p>
                                <div className="mt-8 w-48 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2.5 }}
                                        className="h-full bg-[#07C160]"
                                     />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(156, 163, 175, 0.1);
                            border-radius: 10px;
                        }
                    `}</style>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
