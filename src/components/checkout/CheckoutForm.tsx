'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlipayPaymentModal } from './AlipayPaymentModal';
import { getProductById } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { ChevronRight, ShieldCheck, Check, ShoppingBag, Shield, Timer, PartyPopper, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { 
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, 
    BundleIcon, VerificationIcon, FintechIcon,
    AlipayXianyuIcon, AlipayTaobaoIcon, Alipay1688Icon, WechatJdIcon, FullSuiteIcon,
    PassportVerifyIcon, FaceVerifyIcon, KycPackageIcon, WechatRealnameIcon, AlipayRealnameIcon,
    XmIcon, HfmIcon, NetellerIcon, SkrillIcon, PayoneerIcon, WiseIcon
} from '@/components/ui/BrandIcons';

const ICON_COMPONENTS: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
    bundle: BundleIcon,
    verification: VerificationIcon,
    trading: FintechIcon,
    
    // New Bundles
    'bundle-alipay-xianyu': AlipayXianyuIcon,
    'bundle-alipay-taobao': AlipayTaobaoIcon,
    'bundle-alipay-1688':   AlipayTaobaoIcon, // Fallback for 1688
    'bundle-wechat-jd':     WechatJdIcon,
    'bundle-full-suite':    FullSuiteIcon,
    
    // New Verification
    'verify-passport':      PassportVerifyIcon,
    'verify-face':          FaceVerifyIcon,
    'verify-kyc':           KycPackageIcon,
    'verify-wechat':        WechatRealnameIcon,
    'verify-alipay':        AlipayRealnameIcon,
    
    // New Trading
    'xm-account':           XmIcon,
    'hfm-account':          HfmIcon,
    'neteller-account':     NetellerIcon,
    'skrill-account':       SkrillIcon,
    'payoneer-account':     PayoneerIcon,
    'wise-account':         WiseIcon,
};

interface CheckoutFormProps {
    lang: Lang;
}

const CartItemImage = ({ category, productId, badge }: { category: string, productId: string, badge?: any }) => {
    // Try to resolve specific icon (by productId or category)
    const Icon = ICON_COMPONENTS[productId] || ICON_COMPONENTS[category] || WeChatIcon;
    return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white dark:bg-dark-800 rounded-xl shadow-sm flex items-center justify-center relative overflow-hidden border border-slate-200 dark:border-slate-800`}>
            <div className="w-full h-full p-2">
                <Icon className="w-full h-full" />
            </div>
            {badge && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-bl-lg uppercase">
                    HOT
                </div>
            )}
        </div>
    );
};

export function CheckoutForm({ lang }: CheckoutFormProps) {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const { addOrder } = useOrderStore();
    const [step, setStep] = useState<1 | 1.5 | 2 | 3>(1);
    const [requirementsData, setRequirementsData] = useState<Record<string, string>>({});
    const [agreedToAntiBan, setAgreedToAntiBan] = useState(false);

    const [contactInfo, setContactInfo] = useState({ telegram: '', email: '' });
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
    const [showConfetti, setShowConfetti] = useState(false);

    // Idle Red Envelope Rain State
    const [isIdle, setIsIdle] = useState(false);
    const [claimedEnvelope, setClaimedEnvelope] = useState(false);

    // Quick mock order ID generator
    const [orderId, setOrderId] = useState('');
    const [processingPhase, setProcessingPhase] = useState(0);

    useEffect(() => {
        setMounted(true);
        setOrderId(`CNW-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
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

    const totalPrice = getTotal();

    const handleNextStep = () => {
        if (step === 1 && contactInfo.telegram && contactInfo.email) {
            // Check if any item is a service
            const hasService = items.some(item => {
                const p = getProductById(item.productId);
                return p?.type === 'service';
            });

            if (hasService) {
                setStep(1.5);
            } else {
                setStep(2);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (step === 1.5) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };


    const handlePaymentConfirm = async (txHash: string, verificationData?: any) => {
        setIsProcessingPayment(true);
        setProcessingPhase(0);

        // Get auth user ID if logged in
        let authUserId: string | null = null;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) authUserId = session.user.id;
        } catch {}

        // 3-phase progression animation
        setTimeout(() => setProcessingPhase(1), 800);
        setTimeout(() => setProcessingPhase(2), 1800);
        setTimeout(() => setProcessingPhase(3), 2800);
        
        const isVerified = verificationData?.verified || false;
        
        const orderData = {
            id: orderId,
            userId: authUserId,
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
            totalAmount: totalPrice,
            paymentWallet: verificationData?.paymentWallet || '',
            paymentNetwork: verificationData?.paymentNetwork || ''
        };

        try {
            // Persist to Supabase
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: orderData,
                    items: orderData.items,
                    paymentWallet: orderData.paymentWallet,
                    paymentNetwork: orderData.paymentNetwork
                })
            });

            if (!response.ok) {
                console.warn('Failed to save to Supabase, falling back to local storage only');
            }
        } catch (error) {
            console.error('Order Persistence Error:', error);
        }

        // Wait for the full 3-phase animation to complete
        setTimeout(() => {
            setIsProcessingPayment(false);
            setProcessingPhase(0);
            setStep(3);
            addOrder(orderData);
            clearCart();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }, 3800);
    };

    return (
        <div className="max-w-4xl mx-auto relative min-h-[400px]">
            {!mounted ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            ) : items.length === 0 && step === 1 ? (
                <div className="text-center py-20 flex flex-col items-center animate-fade-in">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-8 font-medium text-lg">
                        {lang === 'zh' ? '您的购物车是空的' : 'Your cart is currently empty'}
                    </p>
                    <button 
                        onClick={() => router.push(getLocalizedPath('/', lang))} 
                        className="btn-primary px-8 py-3"
                    >
                        {t('common.backToHome', lang)}
                    </button>
                </div>
            ) : (
                <>
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
                            {lang === 'zh' ? '点击天降红包，最高减40¥！' : 'Click a packet to win up to 40¥ off!'}
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
                            <p className="text-red-100 mb-6">{lang === 'zh' ? '立减 15.00 ¥' : 'Saved 15.00 ¥'}</p>
                            <div className="text-6xl font-black text-yellow-400 mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">-15 ¥</div>
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

            {/* Countdown Banner */}
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
                    { num: 1.5, label: lang === 'zh' ? '提交资料' : 'Requirements' },
                    { num: 2, label: t('checkout.step2', lang) },
                    { num: 3, label: t('checkout.step4', lang) },
                ].filter(s => s.num !== 1.5 || items.some(i => getProductById(i.productId)?.type === 'service')).map((s, i, arr) => (
                    <div key={s.num} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 z-10 transition-colors ${step >= s.num ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                            }`}>
                            {step > s.num ? <Check className="w-5 h-5" /> : s.num === 1.5 ? '!' : s.num}
                        </div>
                        <span className={`text-xs font-bold md:text-sm text-center ${step >= s.num ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'
                            }`}>
                            {s.label}
                        </span>
                        {i < arr.length - 1 && (
                            <div className={`absolute top-5 left-[50%] w-[100%] h-[2px] -z-0 transition-colors ${step > s.num ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                                }`}></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Step 2 & 3: Payment Confirmation Modal */}
            <AlipayPaymentModal 
                isOpen={step === 2}
                onClose={() => setStep(1)}
                amount={totalPrice}
                orderId={orderId}
                onSuccess={() => handlePaymentConfirm("MANUAL_CONFIRM_VIA_ALIPAY_MODAL")}
            />

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
                                                <CartItemImage category={product.category} productId={item.productId} badge={product.badge} />
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-tight">
                                                            {product.name?.[lang] || product.tierName[lang]}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description[lang]}</p>
                                                    </div>
                                                    <div className="flex items-end justify-between mt-3">
                                                        <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded">
                                                            {lang === 'zh' ? '数量:' : 'Qty:'} {item.quantity}
                                                        </div>
                                                        <div className="font-black text-red-600 dark:text-red-500 text-lg sm:text-xl">
                                                            {formatYuan(unitPrice * item.quantity)}
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
                                        <span>{formatYuan(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl sm:text-2xl font-black text-red-600 dark:text-red-500">
                                        <span>{lang === 'zh' ? '应付总额' : 'Total'}</span>
                                        <span>{formatYuan(totalPrice)}</span>
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

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center animate-fade-in py-8 max-w-lg mx-auto">
                                {/* ========== SUCCESS SCREEN — WECHAT/ALIPAY STYLE ========== */}
                                <div className="relative">
                                    {/* Green checkmark with animated rings */}
                                    <div className="relative w-28 h-28 mx-auto mb-8">
                                        {/* Outer pulse ring */}
                                        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                                        {/* Middle ring */}
                                        <div className="absolute inset-2 rounded-full border-4 border-emerald-400/30 animate-pulse" />
                                        {/* Inner circle with check */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/40 flex items-center justify-center">
                                                <Check className="w-10 h-10 text-white drop-shadow-md" strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                        {lang === 'zh' ? '支付成功！' : 'Payment Successful!'}
                                    </h2>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-8">
                                        {t('checkout.orderPlaced', lang)}
                                    </p>
                                </div>

                                {/* Order Summary Card */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 text-left">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3">
                                        <p className="text-white text-xs font-black tracking-wider uppercase">
                                            {lang === 'zh' ? '订单确认' : 'ORDER CONFIRMED'}
                                        </p>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">{lang === 'zh' ? '订单号' : 'Order ID'}</span>
                                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{orderId}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">{lang === 'zh' ? '接收方式' : 'Delivery to'}</span>
                                            <span className="font-bold text-sm text-slate-900 dark:text-white">@{contactInfo.telegram}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">{lang === 'zh' ? '状态' : 'Status'}</span>
                                            <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                                </span>
                                                {lang === 'zh' ? '处理中 · 即将发货' : 'Processing · Delivering soon'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Golden 72 Hours Anti-Ban Protocol Portal */}
                                <div className="mt-8 mb-8 text-left border-2 border-red-500 rounded-2xl overflow-hidden bg-white dark:bg-dark-900 shadow-xl shadow-red-500/10">
                                    <div className="bg-gradient-to-r from-red-600 to-[#FF5000] px-5 py-4 flex items-center gap-3">
                                        <AlertCircle className="w-6 h-6 text-white animate-pulse" />
                                        <h3 className="text-white font-black text-lg tracking-wide shadow-sm">
                                            {lang === 'zh' ? '【防封必读】黄金72小时安全守则' : 'MUST READ: Golden 72 Hours Anti-Ban Protocol'}
                                        </h3>
                                    </div>
                                    <div className="p-5 sm:p-6 space-y-4">
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                                            {lang === 'zh'
                                                ? '为了保障您的账号安全并享有72小时质保，登录后前三天内【绝对禁止】以下操作：'
                                                : 'To ensure account safety and keep your 72h warranty active, you MUST NOT do the following in the first 3 days:'}
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                            <li className="flex items-start gap-2">
                                                <div className="bg-red-100 text-red-600 font-black rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">X</div>
                                                <span><strong className="text-red-600 dark:text-red-400">{lang === 'zh' ? '禁止修改资料：' : 'DO NOT change info:'}</strong> {lang === 'zh' ? '不改密、不换绑手机/邮箱/微信号。' : 'Do not change password, linked phone, email, or ID.'}</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="bg-red-100 text-red-600 font-black rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">X</div>
                                                <span><strong className="text-red-600 dark:text-red-400">{lang === 'zh' ? '禁止大额交易：' : 'DO NOT make instant payments:'}</strong> {lang === 'zh' ? '首次登录切勿立刻绑定新卡或转大额资金（先微小消费养号）。' : 'Do not bind new banks or make massive transfers immediately.'}</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="bg-red-100 text-red-600 font-black rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">X</div>
                                                <span><strong className="text-red-600 dark:text-red-400">{lang === 'zh' ? '禁止营销加人：' : 'DO NOT spam:'}</strong> {lang === 'zh' ? '严禁主动群发、批量加好友、发营销朋友圈。' : 'Do not mass friend request or post spam ads.'}</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="bg-yellow-100 text-yellow-600 font-black rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">!</div>
                                                <span><strong className="text-yellow-600 dark:text-yellow-400">{lang === 'zh' ? '注意网络环境：' : 'Watch IP address:'}</strong> {lang === 'zh' ? '使用干净静态独立IP登录，禁止频繁上下线。' : 'Use a static clean IP, avoid frequent logins/logouts.'}</span>
                                            </li>
                                        </ul>
                                        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 text-[#FF5000] focus:ring-[#FF5000] focus:ring-offset-0 transition-colors cursor-pointer"
                                                        checked={agreedToAntiBan}
                                                        onChange={(e) => setAgreedToAntiBan(e.target.checked)}
                                                    />
                                                </div>
                                                <span className={`text-sm sm:text-base font-bold select-none transition-colors ${agreedToAntiBan ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                                    {lang === 'zh' ? '我已阅读并理解《72小时防封守则》，违规操作将导致质保失效。' : 'I understand the Anti-Ban Protocol. Violating these rules voids my warranty.'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        disabled={!agreedToAntiBan}
                                        onClick={() => router.push(getLocalizedPath(`/track?id=${orderId}`, lang))}
                                        className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl shadow-lg transition-all text-lg ${
                                            agreedToAntiBan
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 animate-pulse'
                                                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        {lang === 'zh' ? (agreedToAntiBan ? '去查看我的账号 (提取)' : '请先勾选上方同意守则') : (agreedToAntiBan ? 'View Account Details ->' : 'Agree to rules first')}
                                    </button>
                                </div>
                    </div>
                )}

                {/* Step 1.5: Requirements */}
                {step === 1.5 && (
                    <div className="animate-fade-in max-w-2xl mx-auto py-4">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                {lang === 'zh' ? '填写服务需求' : 'Service Requirements'}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {lang === 'zh' ? '请提供以下信息以便我们处理您的实名/验证需求。' : 'Please provide the following info so we can process your request.'}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {items.filter(i => getProductById(i.productId)?.type === 'service').map(item => {
                                const p = getProductById(item.productId);
                                return (
                                    <div key={item.productId} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-blue-500 rounded-full" />
                                            {p?.tierName[lang]}
                                        </h4>
                                        <div className="space-y-4">
                                            {p?.requirements?.[lang] && (
                                                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                    {p.requirements[lang]}
                                                </div>
                                            )}
                                            <textarea 
                                                rows={4}
                                                placeholder={lang === 'zh' ? '在此输入所需资料（如护照号、姓名、预留手机号等）...' : 'Enter required info here (Passport, Full Name, Phone, etc.)...'}
                                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                                                value={requirementsData[item.productId] || ''}
                                                onChange={(e) => setRequirementsData({...requirementsData, [item.productId]: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    {lang === 'zh' ? '返回修改' : 'Go Back'}
                                </button>
                                <button 
                                    onClick={handleNextStep}
                                    disabled={items.filter(i => getProductById(i.productId)?.type === 'service').some(i => !requirementsData[i.productId])}
                                    className="flex-[2] py-4 px-6 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {lang === 'zh' ? '确认并付款' : 'Confirm & Pay'}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
                </>
            )}

            {/* ========== WECHAT/ALIPAY-STYLE 3-PHASE PROCESSING OVERLAY ========== */}
            {/* Rendered OUTSIDE the step conditional to prevent hook count changes */}
            {isProcessingPayment && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{
                    background: processingPhase >= 3
                        ? 'linear-gradient(160deg, #07C160 0%, #06AD56 50%, #059B4C 100%)'
                        : 'linear-gradient(160deg, #1677ff 0%, #0958d9 50%, #003eb3 100%)',
                    transition: 'background 0.8s ease-in-out'
                }}>
                    {/* Subtle radial glow */}
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 50% 40%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
                    }} />

                    <div className="relative flex flex-col items-center text-white px-6 w-full max-w-sm">
                        {/* Animated Circle + Icon */}
                        <div className="relative w-32 h-32 mb-10">
                            <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
                                processingPhase >= 3 ? 'bg-white/10 scale-150 animate-ping' : 'bg-white/5 scale-100'
                            }`} style={{ animationDuration: '2s' }} />
                            
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.15)" />
                                <circle
                                    cx="60" cy="60" r="54"
                                    fill="none"
                                    strokeWidth="4"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeDasharray="339.292"
                                    strokeDashoffset={339.292 - (339.292 * Math.min(processingPhase, 3) / 3)}
                                    style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                                />
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">
                                {processingPhase < 3 ? (
                                    <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                        <svg className="animate-spin w-8 h-8 text-white" style={{ animationDuration: '2s' }} viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center animate-[scale-bounce_0.5s_ease-out]">
                                        <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline
                                                points="6 12 10 16 18 8"
                                                strokeDasharray="24"
                                                strokeDashoffset="0"
                                                className="animate-[draw-check_0.4s_ease-out_forwards]"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <p className="text-white/60 text-sm mb-1">
                                {lang === 'zh' ? '支付金额' : 'Payment Amount'}
                            </p>
                            <p className="text-4xl font-black tracking-tight drop-shadow-md">
                                {formatYuan(totalPrice)}
                            </p>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black mb-6 tracking-tight drop-shadow-md text-center transition-all duration-500">
                            {processingPhase >= 3
                                ? (lang === 'zh' ? '支付成功！' : 'Payment Successful!')
                                : (lang === 'zh' ? '正在安全处理付款...' : 'Processing Payment...')
                            }
                        </h2>

                        <div className="space-y-3 w-full max-w-xs">
                            {[
                                { zh: '已连接区块链网络', en: 'Connected to blockchain network', phase: 1 },
                                { zh: '正在验证交易记录', en: 'Verifying transaction record', phase: 2 },
                                { zh: '订单确认完成', en: 'Order confirmed', phase: 3 },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                                        processingPhase >= item.phase
                                            ? 'bg-white/15 backdrop-blur-sm'
                                            : processingPhase === item.phase - 1
                                                ? 'bg-white/5'
                                                : 'opacity-40'
                                    }`}
                                >
                                    {processingPhase >= item.phase ? (
                                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 animate-[scale-bounce_0.3s_ease-out]">
                                            <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                                        </div>
                                    ) : processingPhase === item.phase - 1 ? (
                                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-white/30 shrink-0" />
                                    )}
                                    <span className="text-sm font-medium">
                                        {lang === 'zh' ? item.zh : item.en}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex items-center gap-2 text-white/40 text-xs text-center border-t border-white/5 pt-4">
                            <Lock className="w-3 h-3" />
                            <span>{lang === 'zh' ? 'CNWePro 企业级风控引擎保障' : 'Secured by CNWePro risk engine'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
