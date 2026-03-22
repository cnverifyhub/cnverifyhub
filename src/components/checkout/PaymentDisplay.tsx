'use client';

import { useState } from 'react';
import { QRCodeDisplay } from '@/components/ui/QRCodeDisplay';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { CopyButton } from '@/components/ui/CopyButton';
import { Check, AlertTriangle, Loader2, ShieldCheck, ExternalLink, Wallet, Bitcoin, ChevronDown } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

interface PaymentDisplayProps {
    amount: number;
    orderId: string;
    lang: Lang;
    orderDetails: any;
    onConfirm: (txHash: string, verificationData?: any) => void;
}

type VerifyPhase = 'idle' | 'checking' | 'verified' | 'failed';

type PaymentNetwork = 'trc20' | 'bep20_usdt' | 'bep20_btc' | 'erc20_btc' | 'wechat';

const NETWORKS: { id: PaymentNetwork; label: string; labelZh: string; token: string; icon: string; enabled: boolean; autoVerify: boolean }[] = [
    { id: 'trc20', label: 'USDT TRC20', labelZh: 'USDT TRC20', token: 'USDT', icon: '🟢', enabled: true, autoVerify: true },
    { id: 'bep20_usdt', label: 'USDT BEP20', labelZh: 'USDT BEP20', token: 'USDT', icon: '🟡', enabled: true, autoVerify: true },
    { id: 'bep20_btc', label: 'BTC BEP20', labelZh: 'BTC BEP20', token: 'BTC', icon: '🟠', enabled: true, autoVerify: true },
    { id: 'erc20_btc', label: 'BTC ERC20', labelZh: 'BTC ERC20', token: 'BTC', icon: '🔵', enabled: true, autoVerify: true },
    { id: 'wechat', label: 'WeChat Pay', labelZh: '微信支付', token: 'CNY', icon: '💚', enabled: false, autoVerify: false },
];

// TRC20 wallets — main + alternates
const TRC20_WALLETS = [
    { address: process.env.NEXT_PUBLIC_TRC20_WALLET || 'TQofpQffADyHpv25EBZPcQD7scx8AZV5or', label: 'Main', labelZh: '主钱包', recommended: true },
    { address: process.env.NEXT_PUBLIC_TRC20_WALLET_2 || 'TH2mdXf9wkddGSpynCTLJcS4CcHSLHSv4E', label: '2nd', labelZh: '备用1' },
    { address: process.env.NEXT_PUBLIC_TRC20_WALLET_3 || 'TXrNZRoVsnTEhNkEJsdgTKSGoXMsmyj6xr', label: '3rd', labelZh: '备用2' },
];

function getWalletAddress(network: PaymentNetwork, trc20Index: number = 0): string {
    switch (network) {
        case 'trc20':
            return TRC20_WALLETS[trc20Index]?.address || TRC20_WALLETS[0].address;
        case 'bep20_usdt':
        case 'bep20_btc':
            return process.env.NEXT_PUBLIC_BEP20_WALLET || '0xb47669d0d17b57be5af515bf57e0294c130359b1';
        case 'erc20_btc':
            return process.env.NEXT_PUBLIC_ERC20_WALLET || '0xb47669d0d17b57be5af515bf57e0294c130359b1';
        default:
            return '';
    }
}

function getExplorerUrl(network: PaymentNetwork, txHash: string): string {
    switch (network) {
        case 'trc20':
            return `https://tronscan.org/#/transaction/${txHash}`;
        case 'bep20_usdt':
        case 'bep20_btc':
            return `https://bscscan.com/tx/${txHash}`;
        case 'erc20_btc':
            return `https://etherscan.io/tx/${txHash}`;
        default:
            return '#';
    }
}

export function PaymentDisplay({ amount, orderId, lang, orderDetails, onConfirm }: PaymentDisplayProps) {
    const [txHash, setTxHash] = useState('');
    const [phase, setPhase] = useState<VerifyPhase>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [verificationData, setVerificationData] = useState<any>(null);
    const [selectedNetwork, setSelectedNetwork] = useState<PaymentNetwork>('trc20');
    const [selectedTrc20Wallet, setSelectedTrc20Wallet] = useState(0);

    const walletAddress = getWalletAddress(selectedNetwork, selectedTrc20Wallet);
    const currentNetworkInfo = NETWORKS.find(n => n.id === selectedNetwork)!;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!txHash.trim()) return;

        setPhase('checking');
        setErrorMsg('');
        setVerificationData(null);

        // All networks now use automated blockchain verification
        if (currentNetworkInfo.autoVerify) {
            try {
                const res = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        txHash: txHash.trim(),
                        expectedAmount: amount,
                        orderId,
                        network: selectedNetwork,
                        walletAddress,
                        orderDetails
                    })
                });

                const data = await res.json();

                if (data.verified) {
                    setPhase('verified');
                    setVerificationData(data);
                    setTimeout(() => {
                        onConfirm(txHash.trim(), data);
                    }, 2000);
                } else {
                    setPhase('failed');
                    setErrorMsg(data.error || (lang === 'zh' ? '验证失败，请检查TXID后重试' : 'Verification failed. Please check TXID and try again.'));
                }
            } catch (err) {
                // Graceful fallback — if API fails, still accept the order with manual verification flag
                setPhase('verified');
                const fallbackData = {
                    verified: true,
                    amount: amount,
                    token: currentNetworkInfo.token,
                    network: selectedNetwork,
                    manualVerification: true,
                    from: 'pending-manual-check',
                    to: walletAddress,
                    confirmed: false,
                };
                setVerificationData(fallbackData);
                setTimeout(() => {
                    onConfirm(txHash.trim(), fallbackData);
                }, 2500);
            }
        } else {
            // For disabled networks (wechat), simulate
            setTimeout(() => {
                setPhase('verified');
                const manualData = {
                    verified: true,
                    amount: amount,
                    token: currentNetworkInfo.token,
                    network: selectedNetwork,
                    manualVerification: true,
                    from: 'pending-manual-check',
                    to: walletAddress,
                    confirmed: false,
                };
                setVerificationData(manualData);
                setTimeout(() => {
                    onConfirm(txHash.trim(), manualData);
                }, 2500);
            }, 2000);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t('checkout.orderId', lang)}:</h3>
                    <p className="font-mono text-sm text-slate-500">{orderId}</p>
                </div>
                <CountdownTimer initialMinutes={15} lang={lang} />
            </div>

            {/* Network Selector Tabs */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {lang === 'zh' ? '选择支付网络' : 'Select Payment Network'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {NETWORKS.map((net) => (
                        <button
                            key={net.id}
                            disabled={!net.enabled}
                            onClick={() => { setSelectedNetwork(net.id); setPhase('idle'); setTxHash(''); setErrorMsg(''); setSelectedTrc20Wallet(0); }}
                            className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all text-sm font-bold
                                ${selectedNetwork === net.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
                                    : net.enabled
                                        ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
                                }`}
                        >
                            <span className="text-base">{net.icon}</span>
                            <span className="truncate">{lang === 'zh' ? net.labelZh : net.label}</span>
                            {net.id === 'trc20' && (
                                <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                                    {lang === 'zh' ? '推荐' : 'REC'}
                                </span>
                            )}
                            {!net.enabled && (
                                <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-slate-400 text-white px-1.5 py-0.5 rounded-full">
                                    {lang === 'zh' ? '即将' : 'SOON'}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* TRC20 Multi-Wallet Selector */}
            {selectedNetwork === 'trc20' && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {lang === 'zh' ? '选择收款钱包' : 'Select Receiving Wallet'}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        {TRC20_WALLETS.map((w, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedTrc20Wallet(i)}
                                className={`relative flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border-2 text-center transition-all text-xs font-bold
                                    ${selectedTrc20Wallet === i
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-md shadow-emerald-500/10'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <span className="font-black text-sm">{lang === 'zh' ? w.labelZh : w.label}</span>
                                <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 truncate w-full">
                                    {w.address.slice(0, 6)}...{w.address.slice(-4)}
                                </span>
                                {w.recommended && (
                                    <span className="absolute -top-1.5 -right-1.5 text-[7px] font-black bg-emerald-500 text-white px-1 py-0.5 rounded-full">
                                        {lang === 'zh' ? '推荐' : 'REC'}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Blockchain auto-verify notice */}
            {currentNetworkInfo.autoVerify && currentNetworkInfo.enabled && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        {lang === 'zh'
                            ? '此网络支持自动区块链验证。提交TXID后，系统将自动验证付款。'
                            : 'This network supports automatic blockchain verification. Submit your TXID and the system will verify instantly.'}
                    </p>
                </div>
            )}

            {/* QR Code & Wallet Address */}
            {currentNetworkInfo.enabled && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                    <QRCodeDisplay address={walletAddress} amount={amount.toFixed(2)} lang={lang} />
                </div>
            )}

            {/* Payment Verification Form */}
            {currentNetworkInfo.enabled && (
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
                        <div className="relative overflow-hidden p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            {/* Animated progress bar */}
                            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 shrink-0">
                                    <svg className="animate-spin w-full h-full text-blue-500" viewBox="0 0 50 50">
                                        <circle className="opacity-20" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" />
                                        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeDasharray="80,150" strokeLinecap="round" />
                                    </svg>
                                    <ShieldCheck className="absolute inset-0 m-auto w-4 h-4 text-blue-600 animate-pulse" />
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                                        {lang === 'zh' ? '正在区块链上验证交易...' : 'Verifying transaction on blockchain...'}
                                    </p>
                                    <p className="text-blue-600/70 dark:text-blue-400/70 text-xs mt-0.5">
                                        {selectedNetwork === 'trc20'
                                            ? (lang === 'zh' ? '查询TronScan · 验证钱包地址 · 确认金额' : 'Querying TronScan · Verifying wallet · Confirming amount')
                                            : selectedNetwork.startsWith('bep20')
                                                ? (lang === 'zh' ? '查询BSCScan · 验证BNB Chain · 确认金额' : 'Querying BSCScan · Verifying BNB Chain · Confirming amount')
                                                : (lang === 'zh' ? '查询Etherscan · 验证以太坊 · 确认金额' : 'Querying Etherscan · Verifying Ethereum · Confirming amount')
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {phase === 'verified' && verificationData && (
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center animate-[scale-bounce_0.5s_ease-out]">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                                    {verificationData.manualVerification
                                        ? (lang === 'zh' ? '📋 已提交，客服确认中...' : '📋 Submitted, awaiting manual confirmation...')
                                        : (lang === 'zh' ? '✅ 付款验证成功！' : '✅ Payment Verified!')}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg">
                                    <span className="text-slate-500">{lang === 'zh' ? '金额' : 'Amount'}</span>
                                    <p className="font-bold text-slate-900 dark:text-white">${verificationData.amount} {verificationData.token}</p>
                                </div>
                                <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg">
                                    <span className="text-slate-500">{lang === 'zh' ? '网络' : 'Network'}</span>
                                    <p className="font-bold text-slate-900 dark:text-white">{currentNetworkInfo.label}</p>
                                </div>
                                {verificationData.from && verificationData.from !== 'pending-manual-check' && (
                                    <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg col-span-2">
                                        <span className="text-slate-500">{lang === 'zh' ? '发送方' : 'From'}</span>
                                        <p className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate">{verificationData.from}</p>
                                    </div>
                                )}
                            </div>
                            <a
                                href={getExplorerUrl(selectedNetwork, txHash.trim())}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                                <ExternalLink className="w-3 h-3" />
                                {lang === 'zh' ? '在区块链浏览器上查看' : 'View on Blockchain Explorer'}
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

                    <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                        <ShieldCheck className="w-3 h-3 inline mr-1" />
                        {lang === 'zh'
                            ? '付款通过区块链验证，安全可靠'
                            : 'Payment verified via blockchain — secure & reliable'}
                    </p>
                </form>
            )}
        </div>
    );
}
