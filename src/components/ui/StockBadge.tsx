'use client';

import { getStockStatus } from '@/data/products';
import { t, type Lang } from '@/lib/i18n';

interface StockBadgeProps {
    count: number;
    lang: Lang;
    className?: string;
}

export function StockBadge({ count, lang, className = '' }: StockBadgeProps) {
    const status = getStockStatus(count);

    let colorClass = '';
    let dotClass = '';
    let label = '';

    switch (status) {
        case 'high':
            colorClass = 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400 border border-success-200 dark:border-success-500/20';
            dotClass = 'bg-success-500';
            label = t('category.inStock', lang);
            break;
        case 'medium':
            colorClass = 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400 border border-warning-200 dark:border-warning-500/20';
            dotClass = 'bg-warning-500';
            label = t('pricing.limited', lang) || t('category.inStock', lang);
            break;
        case 'low':
            colorClass = 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400 border border-danger-200 dark:border-danger-500/20';
            dotClass = 'bg-danger-500';
            label = lang === 'zh' ? '库存紧张' : 'Low Stock';
            break;
        case 'out':
            colorClass = 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700';
            dotClass = 'bg-slate-400';
            label = lang === 'zh' ? '已售罄' : 'Sold Out';
            break;
    }

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass} ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass} ${status !== 'out' ? 'animate-pulse' : ''}`} />
            <span>{label}: {count}</span>
        </div>
    );
}
