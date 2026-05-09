'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={pathname} className="relative">
                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {children}
                </motion.div>

                {/* Transition Overlay */}
                <motion.div
                    className="fixed inset-0 z-[100] bg-[#FF0036] pointer-events-none"
                    initial={{ y: "100%" }}
                    animate={{ y: "-100%" }}
                    exit={{ y: "0%" }}
                    transition={{ 
                        duration: 0.6, 
                        ease: [0.76, 0, 0.24, 1],
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
}
