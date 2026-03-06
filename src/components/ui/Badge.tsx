'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
                primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
                success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
                warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
                danger: 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400',
                accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400',
                gold: 'bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400',
                outline: 'border border-slate-200 text-slate-800 dark:border-slate-800 dark:text-slate-200',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
    return (
        <div className={badgeVariants({ variant, className })} {...props}>
            {dot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-success-500' :
                            variant === 'danger' ? 'bg-danger-500' :
                                variant === 'warning' ? 'bg-warning-500' :
                                    'bg-current'
                        }`}
                />
            )}
            {children}
        </div>
    );
}
