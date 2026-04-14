'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Check } from 'lucide-react';

interface AlipaySuccessAnimationProps {
    isVisible: boolean;
    /** Title shown on success (e.g. '支付成功') */
    title?: string;
    subtitle?: string;
    /** millis before calling onDone, default 3000 */
    duration?: number;
    onDone?: () => void;
}

export function AlipaySuccessAnimation({
    isVisible,
    title = '支付成功',
    subtitle = '请稍候，正在自动发货...',
    duration = 3000,
    onDone,
}: AlipaySuccessAnimationProps) {
    const ripple1Ref = useRef<HTMLDivElement>(null);
    const ripple2Ref = useRef<HTMLDivElement>(null);
    const ripple3Ref = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isVisible) return;

        // GSAP ripple burst — staggered rings expanding outward
        const rings = [ripple1Ref.current, ripple2Ref.current, ripple3Ref.current].filter(Boolean);
        gsap.set(rings, { scale: 0.3, opacity: 0 });
        gsap.to(rings, {
            scale: 3.2,
            opacity: 0,
            duration: 1.8,
            stagger: 0.35,
            ease: 'power2.out',
            repeat: -1,
        });

        // GSAP progress bar fill
        if (barRef.current) {
            gsap.fromTo(
                barRef.current,
                { width: '0%' },
                { width: '100%', duration: duration / 1000, ease: 'linear' }
            );
        }

        // Trigger onDone callback
        const timer = setTimeout(() => onDone?.(), duration);

        return () => {
            clearTimeout(timer);
            gsap.killTweensOf(rings);
            if (barRef.current) gsap.killTweensOf(barRef.current);
        };
    }, [isVisible, duration, onDone]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="alipay-success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-[200] bg-white dark:bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Ripple rings behind the checkmark */}
                    <div className="relative flex items-center justify-center mb-8">
                        {/* Ring 1 */}
                        <div
                            ref={ripple1Ref}
                            className="absolute w-24 h-24 rounded-full border-4 border-[#07C160]/40"
                        />
                        {/* Ring 2 */}
                        <div
                            ref={ripple2Ref}
                            className="absolute w-24 h-24 rounded-full border-4 border-[#07C160]/30"
                        />
                        {/* Ring 3 */}
                        <div
                            ref={ripple3Ref}
                            className="absolute w-24 h-24 rounded-full border-4 border-[#07C160]/20"
                        />

                        {/* Checkmark circle */}
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                            className="relative w-24 h-24 rounded-full bg-[#07C160] flex items-center justify-center shadow-2xl shadow-[#07C160]/40 z-10"
                        >
                            <motion.div
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                            >
                                <Check className="w-12 h-12 text-white stroke-[3]" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.42 }}
                        className="text-center px-6"
                    >
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                            {subtitle}
                        </p>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="mt-10 w-52 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            ref={barRef}
                            className="h-full bg-[#07C160] rounded-full"
                            style={{ width: '0%' }}
                        />
                    </div>

                    {/* Confetti-like floating dots */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: ['#07C160', '#1677ff', '#FF5000', '#FFB300', '#ff2442'][i % 5],
                                left: `${10 + (i * 7) % 80}%`,
                                top: `${20 + (i * 11) % 60}%`,
                            }}
                            initial={{ scale: 0, opacity: 0, y: 0 }}
                            animate={{
                                scale: [0, 1.2, 0],
                                opacity: [0, 1, 0],
                                y: [0, -(40 + (i % 5) * 12)],
                                x: [(i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 6)],
                            }}
                            transition={{
                                delay: 0.2 + i * 0.06,
                                duration: 1.1,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
