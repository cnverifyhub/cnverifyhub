'use client';

import { Suspense } from 'react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { t } from '@/lib/i18n';

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-dark-950">
            <Suspense fallback={<div className="py-32 text-center">Loading checkout...</div>}>
                <div className="section-container py-12 md:py-24 animate-fade-in">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                            {t('checkout.title', 'zh')}
                        </h1>
                    </div>
                    <CheckoutForm lang="zh" />
                </div>
            </Suspense>
        </div>
    );
}
