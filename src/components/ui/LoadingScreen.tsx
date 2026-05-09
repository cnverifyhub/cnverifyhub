'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextScramble } from '@/utils/textScramble';

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [scrambled, setScrambled] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sessionStorage.getItem('hasVisited')) {
            setIsVisible(false);
            return;
        }

        const runSequence = async () => {
            if (textRef.current) {
                const fx = new TextScramble(textRef.current);
                await fx.setText('CNVerifyHub');
                setScrambled(true);
            }
            
            setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('hasVisited', 'true');
            }, 1200);
        };

        runSequence();
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="fixed inset-0 z-[100] bg-[#060608] flex flex-col items-center justify-center"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-[#FF0036] font-noto-serif mb-4"
                        >
                            CV
                        </motion.div>
                        
                        <div ref={textRef} className="text-xl md:text-2xl font-bold text-white tracking-[0.3em] uppercase mb-4 h-8" />
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: scrambled ? 1 : 0 }}
                            className="text-xs md:text-sm text-white/40 tracking-[0.1em]"
                        >
                            中国数字资产正规交易平台
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 1.4, ease: "easeInOut" }}
                            className="absolute -bottom-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF0036] to-transparent origin-left"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
