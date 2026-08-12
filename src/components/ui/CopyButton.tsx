'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                try { navigator.vibrate(50); } catch {}
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleCopy}
            type="button"
            className={cn(
                'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 dark:focus:ring-offset-dark-900',
                iconOnly
                    ? 'p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800'
                    : 'px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
                copied && (iconOnly ? 'text-emerald-600 dark:text-emerald-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'),
                className
            )}
            aria-label={label || t('checkout.copyAddress', lang)}
        >
            <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                    <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="flex items-center gap-1.5"
                    >
                        <Check className={cn('w-4 h-4', copied && !iconOnly && 'text-emerald-600 dark:text-emerald-400')} />
                        {!iconOnly && <span>{t('checkout.copied', lang)}</span>}
                    </motion.span>
                ) : (
                    <motion.span
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5"
                    >
                        <Copy className="w-4 h-4" />
                        {!iconOnly && <span>{label || t('checkout.copyAddress', lang)}</span>}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

