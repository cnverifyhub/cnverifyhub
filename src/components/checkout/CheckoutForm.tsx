'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentDisplay } from './PaymentDisplay';
import { getProductById } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatUsdt } from '@/lib/utils';
import { ChevronRight, ShieldCheck, Check, ShoppingBag, Shield, Timer, PartyPopper } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';

interface CheckoutFormProps {
    lang: Lang;
}

export function CheckoutForm({ lang }: CheckoutFormProps) {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { addOrder } = useOrderStore();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [contactInfo, setContactInfo] = useState({ telegram: '', email: '' });
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
    const [showConfetti, setShowConfetti] = useState(false);

    // Idle Red Envelope Rain State
    const [isIdle, setIsIdle] = useState(false);
    const [claimedEnvelope, setClaimedEnvelope] = useState(false);

    // Quick mock order ID generator
    const [orderId] = useState(() => `CNW-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Countdown timer for checkout urgency
    useEffect(() => {
        if (step !== 1 || countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [step, countdown]);

    // Track idle time for gamified Red Envelope
    useEffect(() => {
        if (step !== 1 || claimedEnvelope) return;

        let idleTimer: NodeJS.Timeout;

        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            setIsIdle(false);
            idleTimer = setTimeout(() => {
                setIsIdle(true);
            }, 60000); // 60 seconds idle
        };

        resetIdleTimer();
        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('keydown', resetIdleTimer);
        window.addEventListener('touchstart', resetIdleTimer);

        return () => {
            clearTimeout(idleTimer);
            window.removeEventListener('mousemove', resetIdleTimer);
            window.removeEventListener('keydown', resetIdleTimer);
            window.removeEventListener('touchstart', resetIdleTimer);
        };
    }, [step, claimedEnvelope]);

    const formatCountdown = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!mounted) return null;

    if (items.length === 0 && step === 1) {
        return (
            <div className="text-center py-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mb-6 font-medium">{lang === 'zh' ? '购物车为空' : 'Your cart is empty'}</p>
                <button onClick={() => router.push(getLocalizedPath('/', lang))} className="btn-primary">
                    {t('common.backToHome', lang)}
                </button>
            </div>
        );
    }

    const totalPrice = getTotal();

    const handleNextStep = () => {
        if (step === 1 && contactInfo.telegram && contactInfo.email) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePaymentConfirm = async (txHash: string, verificationData?: any) => {
        setIsProcessingPayment(true);
        
        const isVerified = verificationData?.verified || false;
        
        const orderData = {
            id: orderId,
            email: contactInfo.email || contactInfo.telegram || 'Anonymous',
            telegram: contactInfo.telegram,
            cryptoType: "USDT",
            txid: txHash,
            txVerified: isVerified,
            verificationDetails: isVerified ? {
                amount: verificationData.amount,
                from: verificationData.from,
                to: verificationData.to,
                token: verificationData.token,
                timestamp: verificationData.timestamp,
                confirmed: verificationData.confirmed,
            } : undefined,
            createdAt: new Date().toISOString(),
            items: items.map(i => {
                const product = getProductById(i.productId);
                return {
                    productId: i.productId,
                    quantity: i.quantity,
                    priceAtTime: product ? product.price.single : 0
                };
            }),
            totalAmount: totalPrice
        };

        try {
            // Persist to Supabase
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: orderData,
                    items: orderData.items
                })
            });

            if (!response.ok) {
                console.warn('Failed to save to Supabase, falling back to local storage only');
            }
        } catch (error) {
            console.error('Order Persistence Error:', error);
        }

        // Brief delay for the Alipay-style processing animation
        setTimeout(() => {
            setIsProcessingPayment(false);
            setStep(3);
            addOrder(orderData);
            clearCart();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto relative">
            {/* Idle Gamification: Red Envelope Rain */}
            {isIdle && !claimedEnvelope && (
                <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden bg-black/40 backdrop-blur-sm transition-all duration-700">
                    {/* Falling envelopes */}
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setClaimedEnvelope(true);
                                setIsIdle(false);
                            }}
                            className="absolute w-12 h-16 bg-red-600 rounded-md border-2 border-yellow-400 cursor-pointer pointer-events-auto shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center hover:scale-125 transition-transform"
                            style={{
                                left: `${Math.random() * 90}%`,
                                top: '-100px',
                                animation: `falling-envelope ${3 + Math.random() * 4}s linear infinite`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        >
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-red-700 font-bold text-[10px]">
                                {lang === 'zh' ? '抢' : 'Grab'}
                            </div>
                        </div>
                    ))}
                    {/* Banner */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full pointer-events-none">
                        <h2 className="text-4xl md:text-6xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-widest animate-pulse">
                            {lang === 'zh' ? '红包场降临！' : 'RED PACKET RAIN!'}
                        </h2>
                        <p className="text-white text-lg mt-4 font-bold drop-shadow-md">
                            {lang === 'zh' ? '点击天降红包，最高减5U！' : 'Click a packet to win up to 5U off!'}
                        </p>
                    </div>
                </div>
            )}

            {/* Claimed Modal Overlay */}
            {claimedEnvelope && step === 1 && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-gradient-to-b from-red-600 to-red-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400 animate-zoom-in relative">
                        <div className="absolute top-0 inset-x-0 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 text-white">
                            <h3 className="text-3xl font-black text-yellow-300 mb-2 drop-shadow-md">{lang === 'zh' ? '恭喜抢到红包！' : 'You got a Red Packet!'}</h3>
                            <p className="text-red-100 mb-6">{lang === 'zh' ? '立减 2.00 USDT' : 'Saved 2.00 USDT'}</p>
                            <div className="text-6xl font-black text-yellow-400 mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">-2.00 U</div>
                            <button onClick={() => setClaimedEnvelope(false)} className="w-full bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-red-900 font-extrabold py-4 rounded-xl shadow-[0_6px_0_#b45309] active:translate-y-[4px] active:shadow-[0_2px_0_#b45309] transition-all text-lg">
                                {lang === 'zh' ? '立即使用 (仅限本次)' : 'Use Now (This Order Only)'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confetti burst on success */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
                    {[...Array(60)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full confetti-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                backgroundColor: ['#ff4d4f', '#ffb300', '#52c41a', '#1890ff', '#ff6b6b', '#ffd700'][i % 6],
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>
            )}
            {/* Stepper */}
            {step === 1 && countdown > 0 && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-200 dark:border-red-800/30 rounded-xl px-4 py-3 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2">
                        <Timer className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                            {lang === 'zh' ? '订单保留时间' : 'Cart reserved for'}
                        </span>
                    </div>
                    <span className={`text-xl font-black tabular-nums ${countdown < 120 ? 'text-red-600 animate-pulse' : 'text-red-500'}`}>
                        {formatCountdown(countdown)}
                    </span>
                </div>
            )}
            <div className="flex items-center justify-between mb-8 md:mb-12 max-w-2xl mx-auto px-4">
                {[
                    { num: 1, label: t('checkout.step1', lang) },
                    { num: 2, label: t('checkout.step2', lang) },
                    { num: 3, label: t('checkout.step4', lang) },
                ].map((s, i) => (
                    <div key={s.num} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 z-10 transition-colors ${step >= s.num ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                            }`}>
                            {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                        </div>
                        <span className={`text-xs font-bold md:text-sm text-center ${step >= s.num ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'
                            }`}>
                            {s.label}
                        </span>
                        {i < 2 && (
                            <div className={`absolute top-5 left-[50%] w-[100%] h-[2px] -z-0 transition-colors ${step > s.num ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                                }`}></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="glass-card p-6 md:p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                {/* Background decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-3xl rounded-full pointer-events-none -z-10"></div>

                {/* Step 1: Confirm Details & Contact */}
                {step === 1 && (
                    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Left: Cart Summary */}
                        <div className="lg:col-span-7 space-y-6">
                            <h3 className="font-extrabold text-xl md:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-primary-500" />
                                {lang === 'zh' ? '订单结算' : 'Order Summary'}
                            </h3>

                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {items.map(item => {
                                        const product = getProductById(item.productId);
                                        if (!product) return null;

                                        const getUnitPrice = (qty: number) => {
                                            if (qty >= 200) return product.price.bulk200;
                                            if (qty >= 50) return product.price.bulk50;
                                            if (qty >= 10) return product.price.bulk10;
                                            return product.price.single;
                                        };
                                        const unitPrice = getUnitPrice(item.quantity);

                                        return (
                                            <div key={item.productId} className="p-4 sm:p-5 flex gap-4 hover:bg-white dark:hover:bg-slate-800/50 transition-colors">
                                                <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gradient-to-br ${product.badge ? 'from-primary-400 to-primary-600' : 'from-slate-300 to-slate-400'} rounded-xl shadow-sm flex items-center justify-center`}>
                                                    <span className="text-white font-black text-2xl">{product.category.toUpperCase().slice(0, 1)}</span>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-tight">
                                                            {product.tierName[lang]}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description[lang]}</p>
                                                    </div>
                                                    <div className="flex items-end justify-between mt-3">
                                                        <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded">
                                                            {lang === 'zh' ? '数量:' : 'Qty:'} {item.quantity}
                                                        </div>
                                                        <div className="font-black text-red-600 dark:text-red-500 text-lg sm:text-xl">
                                                            {formatUsdt(unitPrice * item.quantity)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-5 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_10px_rgb(0,0,0,0.02)]">
                                    <div className="flex justify-between items-center mb-2 text-slate-600 dark:text-slate-400 font-medium">
                                        <span>{lang === 'zh' ? '共计金额' : 'Subtotal'}</span>
                                        <span>{formatUsdt(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl sm:text-2xl font-black text-red-600 dark:text-red-500">
                                        <span>{lang === 'zh' ? '应付总额' : 'Total'}</span>
                                        <span>{formatUsdt(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Escrow Badge */}
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 flex gap-3 text-emerald-800 dark:text-emerald-300 shadow-sm">
                                <Shield className="w-6 h-6 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold mb-1 tracking-wide">{lang === 'zh' ? '平台担保交易' : 'Escrow Protected'}</p>
                                    <p className="text-xs opacity-90 leading-relaxed">
                                        {lang === 'zh'
                                            ? '您的资金将被安全冻结。在我们发货并且您确认账号无误之前，资金绝不会打给卖家。确保100%安全。'
                                            : 'Your funds are held safely in escrow. They will not be released to the seller until delivery is confirmed.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form & CTA */}
                        <div className="lg:col-span-5 space-y-6">
                            <h3 className="font-extrabold text-xl md:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                                {lang === 'zh' ? '联系方式' : 'Contact Info'}
                            </h3>

                            <div className="bg-white dark:bg-slate-800/30 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                                <p className="text-xs text-slate-500 mb-5">{lang === 'zh' ? '发货账号及密码将通过此方式发送，请务必准确填写您的有效联系方式。' : 'Used for receiving account credentials and support. Please enter accurately.'}</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                                            Telegram / Wechat Username <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                                            <input
                                                type="text"
                                                required
                                                value={contactInfo.telegram}
                                                onChange={(e) => setContactInfo({ ...contactInfo, telegram: e.target.value })}
                                                placeholder="username"
                                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={contactInfo.email}
                                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                            placeholder="contact@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNextStep}
                                disabled={!contactInfo.telegram || !contactInfo.email}
                                className="btn-primary w-full justify-center py-4 text-lg font-black tracking-wider shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all"
                            >
                                {lang === 'zh' ? '下一步：去支付' : 'Proceed to Payment'} <ChevronRight className="w-5 h-5 ml-1" />
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-primary-500" />
                                <span>{lang === 'zh' ? '信息加密传输，安全保证' : 'Secure encrypted connection'}</span>
                            </div>
                        </div>

                    </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <PaymentDisplay
                        amount={totalPrice}
                        orderId={orderId}
                        lang={lang}
                        orderDetails={{
                            id: orderId,
                            email: contactInfo.email || contactInfo.telegram || 'Anonymous',
                            telegram: contactInfo.telegram,
                            cryptoType: "USDT",
                            totalAmount: totalPrice,
                            items: items.map(i => ({
                                productId: i.productId,
                                quantity: i.quantity,
                                priceAtTime: 0 // Could compute real price here or backend
                            }))
                        }}
                        onConfirm={handlePaymentConfirm}
                    />
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center animate-fade-in py-12 max-w-lg mx-auto">
                        {isProcessingPayment ? (
                            <div className="flex flex-col items-center justify-center space-y-6">
                                {/* Alipay style blue loading spinner */}
                                <div className="relative w-24 h-24 mb-4">
                                    <svg className="animate-spin w-full h-full text-[#1677ff]" viewBox="0 0 50 50">
                                       <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="90,150"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[#1677ff]">
                                       <ShieldCheck className="w-10 h-10 animate-pulse" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{lang === 'zh' ? '正在安全处理付款...' : 'Processing secure payment...'}</h2>
                                <p className="text-slate-500 text-sm">{lang === 'zh' ? 'CNWePro资金安全由企业级风控引擎保障' : 'Secured by CNWePro enterprise risk control engine'}</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-24 h-24 rounded-full bg-[#1677ff]/10 text-[#1677ff] flex items-center justify-center mx-auto mb-8 relative">
                                    <div className="absolute inset-0 border-4 border-[#1677ff]/20 rounded-full animate-ping"></div>
                                    <Check className="w-12 h-12" />
                                </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                            {t('checkout.orderPlaced', lang)}
                        </h2>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
                            <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                {lang === 'zh'
                                    ? `您的付款已收到！订单 ${orderId} 正在处理中。我们会尽快将账号信息发送至您的通讯软件 (@${contactInfo.telegram})。期间资金由平台全额担保，请放心等待。`
                                    : `Payment received! Your order ${orderId} is processing. We will send credentials to your contact (@${contactInfo.telegram}) shortly. Funds are held in escrow for your safety.`}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push(getLocalizedPath(`/track?id=${orderId}`, lang))}
                                className="w-full sm:w-auto px-8 py-3 bg-[#1677ff] hover:bg-[#1677ff]/90 text-white font-bold rounded-xl shadow-lg shadow-[#1677ff]/30 transition-all"
                            >
                                {t('nav.track', lang)}
                            </button>
                            <button
                                onClick={() => router.push(getLocalizedPath('/', lang))}
                                className="w-full sm:w-auto px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
                            >
                                {t('common.backToHome', lang)}
                            </button>
                        </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
