'use client';

import { Suspense } from 'react';
import TrackPageZH from '../track/page'; // Reuse component structure
import { useSearchParams } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n';
import { Search, Package, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Simplified re-definition for English version to avoid complex exports from page.tsx
function TrackContent({ lang }: { lang: Lang }) {
    const searchParams = useSearchParams();
    const initialId = searchParams.get('id') || '';
    const [orderId, setOrderId] = useState(initialId);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!orderId.trim()) return;

        setIsSearching(true);
        setTimeout(() => {
            setResult({
                id: orderId,
                status: 'processing',
                date: new Date().toLocaleDateString(),
                productName: 'Aged WeChat (1yr+)',
                telegram: 'user123'
            });
            setIsSearching(false);
        }, 1000);
    };

    useState(() => {
        if (initialId) handleSearch();
    });

    return (
        <div className="max-w-3xl mx-auto section-container py-12 md:py-24 min-h-[70vh]">
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    {t('track.title', lang)}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    {t('track.subtitle', lang)}
                </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4 mb-12 relative max-w-xl mx-auto">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder={t('track.placeholder', lang)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm text-lg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!orderId.trim() || isSearching}
                    className="btn-primary py-4 px-8 rounded-2xl whitespace-nowrap"
                >
                    {isSearching ? t('common.loading', lang) : t('track.search', lang)}
                </button>
            </form>

            {result && (
                <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 animate-fade-in-up">
                    <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{t('checkout.orderId', lang)}</p>
                            <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-white">{result.id}</h2>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-gold-50 dark:bg-gold-500/10 text-gold-600 font-bold text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Processing
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700">
                        <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                            Preparing your account
                        </h3>
                        <p className="text-slate-500 text-sm">
                            Payment received. System is extracting account credentials. Will be sent via Telegram shortly...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function TrackPageEn() {
    return (
        <Suspense fallback={<div className="py-32 text-center">Loading...</div>}>
            <TrackContent lang="en" />
        </Suspense>
    );
}
