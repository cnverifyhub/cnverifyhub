'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ChineseLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative w-24 h-24">
                {/* Traditional Chinese Cloud Pattern Circles */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-emerald-500/20 rounded-full border-t-emerald-500"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border border-emerald-400/10 rounded-full border-b-emerald-400"
                />

                {/* Central Taiji (Yin-Yang) Spinner */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 flex items-center justify-center"
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        {/* Yin side (Dark/Darker Emerald) */}
                        <path
                            d="M 50 0 A 50 50 0 0 0 50 100 A 25 25 0 0 0 50 50 A 25 25 0 0 1 50 0"
                            fill="#064e3b"
                        />
                        {/* Yang side (Light/Emerald 500) */}
                        <path
                            d="M 50 0 A 50 50 0 0 1 50 100 A 25 25 0 0 1 50 50 A 25 25 0 0 0 50 0"
                            fill="#10b981"
                        />
                        {/* Dots */}
                        <circle cx="50" cy="25" r="8" fill="#10b981" />
                        <circle cx="50" cy="75" r="8" fill="#064e3b" />
                    </svg>
                </motion.div>
            </div>

            {/* Premium "Loading" Text in Chinese */}
            <div className="flex flex-col items-center gap-1">
                <motion.div
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl font-bold tracking-[0.3em] text-emerald-500 font-serif"
                >
                    加载中
                </motion.div>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-1 h-1 bg-emerald-400 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Traditional Element: Subtle Glow Background */}
            <div className="absolute -z-10 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full" />
        </div>
    );
}
