'use client';

import { QRCodeSVG } from 'qrcode.react';
import { CopyButton } from './CopyButton';
import { type Lang } from '@/lib/i18n';

interface QRCodeDisplayProps {
    address: string;
    amount?: string;
    lang: Lang;
}

export function QRCodeDisplay({ address, amount, lang }: QRCodeDisplayProps) {
    return (
        <div className="flex flex-col items-center bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm max-w-sm mx-auto">
            <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-100 mb-6">
                <QRCodeSVG
                    value={address}
                    size={200}
                    level="H"
                    includeMargin={false}
                    className="rounded-lg"
                />
            </div>

            {amount && (
                <div className="w-full text-center mb-6">
                    <p className="text-sm text-slate-500 mb-1">{lang === 'zh' ? '请精准转账该金额 (包含小数)' : 'Please transfer exact amount'}</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-extrabold text-red-600 dark:text-red-500">{amount}</span>
                        <span className="text-red-600/70 font-bold">USDT</span>
                        <CopyButton textToCopy={amount} lang={lang} iconOnly className="ml-2 scale-110" />
                    </div>
                </div>
            )}

            <div className="w-full space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                    USDT (TRC20) Address
                </p>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 pl-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate w-full">
                        {address}
                    </span>
                    <CopyButton textToCopy={address} lang={lang} iconOnly />
                </div>
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                    <p className="text-xs text-center text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-1">
                        ⚠️ {lang === 'zh' ? '仅支持 TRC20 网络的 USDT 转账，充错无法找回!' : 'Only send USDT via TRC-20. Other assets will be lost!'}
                    </p>
                </div>
            </div>
        </div>
    );
}
