'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { X, Copy, Check, ShieldCheck, Loader2, QrCode, Wallet, ChevronRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatYuan } from '@/lib/utils';
import { WeChatIcon, AlipayIcon } from '@/components/ui/BrandIcons';
import { AlipaySuccessAnimation } from './AlipaySuccessAnimation';

interface AlipayPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    orderId: string;
    onSuccess: () => void;
}

type PaymentMethod = 'alipay' | 'wechat' | 'usdt';

const METHODS: { id: PaymentMethod; icon: React.ReactNode; label: string; color: string; bg: string }[] = [
    {
        id: 'alipay',
        icon: <AlipayIcon className="w-5 h-5" />,
        label: '支付宝',
        color: '#1677ff',
        bg: '#e8f4ff',
    },
    {
        id: 'wechat',
        icon: <WeChatIcon className="w-5 h-5" />,
        label: '微信支付',
        color: '#07C160',
        bg: '#e8f8f0',
    },
    {
        id: 'usdt',
        icon: <Wallet className="w-5 h-5 text-emerald-500" />,
        label: 'USDT',
        color: '#10b981',
        bg: '#ecfdf5',
    },
];

export function AlipayPaymentModal({ isOpen, onClose, amount, orderId, onSuccess }: AlipayPaymentModalProps) {
    const [method, setMethod] = useState<PaymentMethod>('alipay');
    const [txId, setTxId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    const scanLineRef = useRef<HTMLDivElement>(null);
    const qrWrapperRef = useRef<HTMLDivElement>(null);
    const scanTweenRef = useRef<gsap.core.Tween | null>(null);

    const usdtAddress = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';
    const activeMethod = METHODS.find(m => m.id === method)!;

    /* ── Countdown timer ── */
    useEffect(() => {
        if (!isOpen) return;
        const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    /* ── Body scroll lock ── */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeLeft(15 * 60);
        } else {
            document.body.style.overflow = 'unset';
            setShowSuccess(false);
            setTxId('');
        }
    }, [isOpen]);

    /* ── GSAP QR scan line ── */
    useEffect(() => {
        if (!isOpen || !scanLineRef.current || !qrWrapperRef.current) return;

        const wrapper = qrWrapperRef.current;
        const scanEl = scanLineRef.current;
        const h = wrapper.offsetHeight || 200;

        gsap.set(scanEl, { top: '6%', opacity: 1 });

        scanTweenRef.current = gsap.to(scanEl, {
            top: `${h - 10}px`,
            duration: 2.2,
            ease: 'none',
            repeat: -1,
            yoyo: false,
            onRepeat: () => {
                gsap.set(scanEl, { top: '6%', opacity: 1 });
            },
        });

        return () => {
            scanTweenRef.current?.kill();
        };
    }, [isOpen, method]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(usdtAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (txId.length < 6) return;
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsSubmitting(false);
        setShowSuccess(true);
    };

    if (!isOpen) return null;

    const qrValue = method === 'usdt'
        ? usdtAddress
        : `https://cnwepro.com/pay/${method}/${orderId}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/75 backdrop-blur-sm p-0 sm:p-4">
                <motion.div
                    key="modal"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className="relative bg-white dark:bg-[#111827] w-full sm:max-w-[440px] sm:rounded-[28px] rounded-t-[28px] overflow-hidden shadow-2xl"
                    style={{ maxHeight: '96dvh', overflowY: 'auto' }}
                >
                    {/* ── Alipay-style header ── */}
                    <div
                        className="sticky top-0 z-20 px-5 pt-5 pb-4 flex items-center justify-between"
                        style={{ background: `linear-gradient(135deg, ${activeMethod.color} 0%, ${activeMethod.color}cc 100%)` }}
                    >
                        <div className="flex items-center gap-3">
                            {/* Brand icon badge */}
                            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                {activeMethod.id === 'alipay' && <AlipayIcon className="w-7 h-7" />}
                                {activeMethod.id === 'wechat' && <WeChatIcon className="w-7 h-7" />}
                                {activeMethod.id === 'usdt' && <Wallet className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                                <p className="text-white font-black text-base leading-none tracking-tight">安全收银台</p>
                                <p className="text-white/70 text-[10px] font-medium mt-0.5 font-mono uppercase">Order #{orderId.slice(-8)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Countdown */}
                            <div className="text-right">
                                <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest">剩余时间</p>
                                <p className={`text-white font-black font-mono text-lg leading-none ${timeLeft < 60 ? 'animate-pulse' : ''}`}>
                                    {formatTime(timeLeft)}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="px-5 pt-5 pb-8">
                        {/* ── Method Switcher with animated indicator ── */}
                        <div className="relative flex gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
                            {METHODS.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black z-10 transition-colors"
                                    style={{
                                        color: method === m.id ? m.color : undefined,
                                    }}
                                >
                                    {method === m.id && (
                                        <motion.div
                                            layoutId="method-pill"
                                            className="absolute inset-0 rounded-xl shadow-sm"
                                            style={{ backgroundColor: m.bg }}
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        {m.icon}
                                        {m.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* ── Amount section ── */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">实付金额</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black tracking-tighter" style={{ color: activeMethod.color }}>
                                            {formatYuan(amount)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] font-bold text-slate-400 mb-1">等值 USDT</p>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{amount.toFixed(2)} USDT</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── QR Code with GSAP scan line ── */}
                        <div className="flex flex-col items-center gap-4 mb-6">
                            <div
                                ref={qrWrapperRef}
                                className="relative p-5 rounded-3xl shadow-xl border-2"
                                style={{ borderColor: `${activeMethod.color}30`, background: 'white' }}
                            >
                                {/* Laser scan line */}
                                <div
                                    ref={scanLineRef}
                                    className="absolute left-4 right-4 h-[2px] z-20 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${activeMethod.color}, transparent)`,
                                        boxShadow: `0 0 8px 2px ${activeMethod.color}50`,
                                    }}
                                />

                                {/* Corner brackets */}
                                <div className="absolute inset-3 pointer-events-none">
                                    {[
                                        'top-0 left-0 border-t-4 border-l-4 rounded-tl-lg',
                                        'top-0 right-0 border-t-4 border-r-4 rounded-tr-lg',
                                        'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
                                        'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
                                    ].map((cls, i) => (
                                        <div
                                            key={i}
                                            className={`absolute w-6 h-6 ${cls}`}
                                            style={{ borderColor: activeMethod.color }}
                                        />
                                    ))}
                                </div>

                                <QRCodeSVG
                                    value={qrValue}
                                    size={188}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: method === 'alipay'
                                            ? '/images/categories/alipay.webp'
                                            : method === 'wechat'
                                            ? '/images/categories/wechat.webp'
                                            : '/images/categories/telegram.png',
                                        x: undefined,
                                        y: undefined,
                                        height: 38,
                                        width: 38,
                                        excavate: true,
                                    }}
                                />
                            </div>

                            {/* Scan prompt */}
                            <div
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black border"
                                style={{
                                    color: activeMethod.color,
                                    backgroundColor: activeMethod.bg,
                                    borderColor: `${activeMethod.color}30`
                                }}
                            >
                                {method === 'usdt' ? <Wallet className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                                {method === 'usdt'
                                    ? '钱包扫码 或 复制地址转账'
                                    : `请使用${method === 'alipay' ? '支付宝' : '微信'}扫描二维码`}
                            </div>
                        </div>

                        {/* ── USDT address copy ── */}
                        {method === 'usdt' && (
                            <div className="mb-5">
                                <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                                    收币地址 (TRC20 网络)
                                </p>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate flex-1">
                                        {usdtAddress}
                                    </span>
                                    <button onClick={handleCopy} className="shrink-0 p-1.5 text-slate-400 hover:text-emerald-500 transition-colors">
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── TXID input ── */}
                        <div className="mb-5">
                            <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest pl-1">
                                {method === 'usdt' ? '转账 TXID（区块链哈希）' : '转账后6位单号确认'}
                            </p>
                            <input
                                type="text"
                                maxLength={80}
                                value={txId}
                                onChange={e => setTxId(e.target.value)}
                                placeholder={method === 'usdt' ? '请粘贴TXID / Transaction Hash' : '请输入转账后6位单号'}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-[color:var(--focus-color)] focus:ring-4 focus:ring-[color:var(--focus-color)]/10 font-bold tracking-wider text-sm text-center transition-all"
                                style={{ '--focus-color': activeMethod.color } as React.CSSProperties}
                            />
                        </div>

                        {/* ── Submit button ── */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSubmit}
                            disabled={txId.length < 6 || isSubmitting}
                            className="relative w-full py-4 rounded-2xl font-black text-lg text-white overflow-hidden flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: txId.length >= 6
                                    ? `linear-gradient(135deg, ${activeMethod.color} 0%, ${activeMethod.color}cc 100%)`
                                    : undefined,
                                backgroundColor: txId.length < 6 ? '#e2e8f0' : undefined,
                                color: txId.length < 6 ? '#94a3b8' : 'white',
                            }}
                        >
                            {/* Shimmer on active */}
                            {txId.length >= 6 && (
                                <span
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer-sweep 2.4s ease-in-out infinite',
                                    }}
                                />
                            )}
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span className="relative z-10">我已完成支付</span>
                                    <ChevronRight className="relative z-10 w-5 h-5" />
                                </>
                            )}
                        </motion.button>

                        {/* ── Trust badges ── */}
                        <div className="mt-6 flex items-center justify-around">
                            {[
                                { icon: <ShieldCheck className="w-4 h-4 text-[#07C160]" />, label: '担保交易' },
                                { icon: <ShieldCheck className="w-4 h-4 text-[#07C160]" />, label: '资金安全' },
                                { icon: <ShieldCheck className="w-4 h-4 text-[#07C160]" />, label: '自动发货' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                    {b.icon}
                                    {b.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Success Overlay ── */}
                    <AlipaySuccessAnimation
                        isVisible={showSuccess}
                        title="支付已提交"
                        subtitle="请等待区块链确认 (1-5分钟)"
                        duration={3000}
                        onDone={onSuccess}
                    />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
