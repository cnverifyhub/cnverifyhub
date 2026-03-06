'use client';

import { useState } from 'react';
import { QRCodeDisplay } from '@/components/ui/QRCodeDisplay';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
import { Check, Copy } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { t, type Lang } from '@/lib/i18n';

interface PaymentDisplayProps {
    amount: number;
    orderId: string;
    lang: Lang;
    onConfirm: (txHash: string) => void;
}

export function PaymentDisplay({ amount, orderId, lang, onConfirm }: PaymentDisplayProps) {
    const [txHash, setTxHash] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const walletAddress = process.env.NEXT_PUBLIC_TRC20_WALLET || 'TRC20_WALLET_ADDRESS_NOT_CONFIGURED';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!txHash.trim()) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onConfirm(txHash);
            setIsSubmitting(false);
        }, 1500);
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="txHash" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {t('checkout.txHash', lang)}
                    </label>
                    <input
                        id="txHash"
                        type="text"
                        required
                        placeholder={t('checkout.txHashPlaceholder', lang)}
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!txHash.trim() || isSubmitting}
                    className="btn-primary w-full justify-center py-4"
                >
                    {isSubmitting ? t('common.loading', lang) : t('checkout.confirm', lang)}
                </button>
            </form>
        </div>
    );
}
