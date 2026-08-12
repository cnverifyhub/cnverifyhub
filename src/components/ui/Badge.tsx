'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors font-mono tracking-tight',
    {
        variants: {
            variant: {
                default: 'bg-slate-800 text-slate-200 border border-slate-700',
                primary: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
                success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
                warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
                danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
                accent: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
                gold: 'bg-amber-400/10 text-amber-300 border border-amber-400/30',
                outline: 'border border-slate-700 text-slate-300',
            },
            verifyState: {
                pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
                processing: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse',
                verified: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
                failed: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
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

export function Badge({ className, variant, verifyState, dot = false, children, ...props }: BadgeProps) {
    const activeState = verifyState || variant;

    return (
        <div className={badgeVariants({ variant: verifyState ? undefined : variant, verifyState, className })} {...props}>
            {dot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeState === 'verified' || activeState === 'success'
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                            : activeState === 'failed' || activeState === 'danger'
                            ? 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                            : activeState === 'pending' || activeState === 'warning'
                            ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : activeState === 'processing' || activeState === 'primary'
                            ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-ping'
                            : 'bg-current'
                    }`}
                />
            )}
            <span className="font-mono tabular-nums">{children}</span>
        </div>
    );
}
