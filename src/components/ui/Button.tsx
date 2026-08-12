'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:pointer-events-none disabled:opacity-50 select-none rounded-lg',
    {
        variants: {
            variant: {
                primary:
                    'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 border border-red-500/30',
                secondary:
                    'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700/80 hover:border-slate-600',
                outline:
                    'border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
                ghost:
                    'text-slate-300 hover:bg-slate-800/60 hover:text-white',
                crypto:
                    'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 border border-amber-400/40',
            },
            size: {
                sm: 'h-8 px-3 text-xs gap-1.5',
                md: 'h-10 px-4 text-sm gap-2',
                lg: 'h-12 px-6 text-base gap-2.5',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

export interface ButtonProps
    extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading = false, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={disabled || isLoading}
                className={buttonVariants({ variant, size, className })}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span>{children}</span>
                    </>
                ) : (
                    children
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
