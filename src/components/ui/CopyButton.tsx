'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
    textToCopy: string;
    lang: Lang;
    label?: string;
    className?: string;
    iconOnly?: boolean;
}

export function CopyButton({ textToCopy, lang, label, className, iconOnly = false }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            type="button"
            className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-dark-900',
                iconOnly
                    ? 'p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800'
                    : 'px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
                copied && (iconOnly ? 'text-success-600 dark:text-success-400' : 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-500/10'),
                className
            )}
            aria-label={label || t('checkout.copyAddress', lang)}
        >
            {copied ? (
                <Check className={cn('w-4 h-4', copied && !iconOnly && 'text-success-600 dark:text-success-400')} />
            ) : (
                <Copy className="w-4 h-4" />
            )}

            {!iconOnly && (
                <span>{copied ? t('checkout.copied', lang) : label || t('checkout.copyAddress', lang)}</span>
            )}
        </button>
    );
}
