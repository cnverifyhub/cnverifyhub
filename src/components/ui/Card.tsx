'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
    hoverEffect?: boolean;
    cyberBorder?: boolean;
    children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', hoverEffect = true, cyberBorder = false, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={
                    hoverEffect
                        ? {
                              y: -4,
                              transition: { duration: 0.2, ease: 'easeOut' },
                          }
                        : undefined
                }
                className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-xl p-6 shadow-lg transition-all duration-200 ${
                    hoverEffect
                        ? 'hover:border-cyan-500/50 hover:shadow-cyan-500/10 hover:-translate-y-1'
                        : ''
                } ${cyberBorder ? 'border-cyber-border-focus' : ''} ${className}`}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight text-slate-100 ${className}`} {...props}>
        {children}
    </h3>
);

export const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={`text-sm text-slate-400 ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`pt-0 ${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`flex items-center pt-4 mt-4 border-t border-slate-800/60 ${className}`} {...props}>
        {children}
    </div>
);
