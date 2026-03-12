'use client';

import { useState } from 'react';
import { QRCodeDisplay } from '@/components/ui/QRCodeDisplay';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { CopyButton } from '@/components/ui/CopyButton';
import { Check, AlertTriangle, Loader2, ShieldCheck, ExternalLink } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

interface PaymentDisplayProps {
    amount: number;
    orderId: string;
    lang: Lang;
    onConfirm: (txHash: string, verificationData?: any) => void;
}

type VerifyPhase = 'idle' | 'checking' | 'verified' | 'failed';

export function PaymentDisplay({ amount, orderId, lang, onConfirm }: PaymentDisplayProps) {
    const [txHash, setTxHash] = useState('');
    const [phase, setPhase] = useState<VerifyPhase>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [verificationData, setVerificationData] = useState<any>(null);
    const walletAddress = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!txHash.trim()) return;

        setPhase('checking');
        setErrorMsg('');
        setVerificationData(null);

        try {
            const res = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    txHash: txHash.trim(),
                    expectedAmount: amount
                })
            });

            const data = await res.json();

            if (data.verified) {
                setPhase('verified');
                setVerificationData(data);
                // Auto-proceed to success after showing verification
                setTimeout(() => {
                    onConfirm(txHash.trim(), data);
                }, 2000);
            } else {
                setPhase('failed');
                setErrorMsg(data.error || (lang === 'zh' ? '验证失败，请检查TXID后重试' : 'Verification failed. Please check TXID and try again.'));
            }
        } catch (err) {
            setPhase('failed');
            setErrorMsg(lang === 'zh'
                ? '网络错误，验证服务暂时不可用。您的付款是安全的，请联系客服。'
                : 'Network error. Verification service temporarily unavailable. Your payment is safe — please contact support.'
            );
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t('checkout.orderId', lang)}:</h3>
                    <p className="font-mono text-sm text-slate-500">{orderId}</p>
                </div>
                <CountdownTimer initialMinutes={15} lang={lang} />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <QRCodeDisplay address={walletAddress} amount={amount.toFixed(2)} lang={lang} />
            </div>

            {/* Payment Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="txHash" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t('checkout.txHash', lang)}
                    </label>
                    <input
                        id="txHash"
                        type="text"
                        required
                        disabled={phase === 'checking' || phase === 'verified'}
                        placeholder={t('checkout.txHashPlaceholder', lang)}
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm disabled:opacity-50"
                    />
                </div>

                {/* Verification Status Display */}
                {phase === 'checking' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 animate-pulse">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                        <div>
                            <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                                {lang === 'zh' ? '正在区块链上验证交易...' : 'Verifying transaction on blockchain...'}
                            </p>
                            <p className="text-blue-600/70 dark:text-blue-400/70 text-xs mt-0.5">
                                {lang === 'zh' ? '查询TronScan · 验证钱包地址 · 确认金额' : 'Querying TronScan · Verifying wallet · Confirming amount'}
                            </p>
                        </div>
                    </div>
                )}

                {phase === 'verified' && verificationData && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-bold text-emerald-700 dark:text-emerald-400">
                                {lang === 'zh' ? '✅ 付款验证成功！' : '✅ Payment Verified!'}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg">
                                <span className="text-slate-500">{lang === 'zh' ? '金额' : 'Amount'}</span>
                                <p className="font-bold text-slate-900 dark:text-white">${verificationData.amount} USDT</p>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg">
                                <span className="text-slate-500">{lang === 'zh' ? '代币' : 'Token'}</span>
                                <p className="font-bold text-slate-900 dark:text-white">{verificationData.token} (TRC20)</p>
                            </div>
                            <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg col-span-2">
                                <span className="text-slate-500">{lang === 'zh' ? '发送方' : 'From'}</span>
                                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate">{verificationData.from}</p>
                            </div>
                        </div>
                        <a
                            href={`https://tronscan.org/#/transaction/${txHash.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                            <ExternalLink className="w-3 h-3" />
                            {lang === 'zh' ? '在TronScan上查看' : 'View on TronScan'}
                        </a>
                    </div>
                )}

                {phase === 'failed' && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                                    {lang === 'zh' ? '验证失败' : 'Verification Failed'}
                                </p>
                                <p className="text-red-600/80 dark:text-red-400/80 text-xs mt-1">{errorMsg}</p>
                                <button
                                    type="button"
                                    onClick={() => { setPhase('idle'); setErrorMsg(''); }}
                                    className="text-xs text-red-600 dark:text-red-400 font-medium mt-2 hover:underline"
                                >
                                    {lang === 'zh' ? '重新输入TXID →' : 'Re-enter TXID →'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!txHash.trim() || phase === 'checking' || phase === 'verified'}
                    className="btn-primary w-full justify-center py-4"
                >
                    {phase === 'checking' ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {lang === 'zh' ? '验证中...' : 'Verifying...'}
                        </span>
                    ) : phase === 'verified' ? (
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {lang === 'zh' ? '已验证 ✓' : 'Verified ✓'}
                        </span>
                    ) : phase === 'failed' ? (
                        lang === 'zh' ? '重新验证' : 'Retry Verification'
                    ) : (
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            {t('checkout.confirm', lang)}
                        </span>
                    )}
                </button>

                {/* Trust message */}
                <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                    <ShieldCheck className="w-3 h-3 inline mr-1" />
                    {lang === 'zh'
                        ? '付款通过TronScan区块链验证，安全可靠'
                        : 'Payment verified via TronScan blockchain — secure & reliable'}
                </p>
            </form>
        </div>
    );
}
