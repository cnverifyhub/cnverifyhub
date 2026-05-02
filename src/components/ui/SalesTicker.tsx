'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';

const SALES_DATA = [
    { name: '王**', product: '微信实名高级号', time: '刚刚' },
    { name: 'A***', product: 'Douyin 1K Followers', time: '1分钟前' },
    { name: '李**', product: '支付宝企业号', time: '3分钟前' },
    { name: 'J***', product: 'WeChat Aged Account', time: '5分钟前' },
    { name: '陈**', product: '小红书种草号', time: '8分钟前' },
    { name: 'S***', product: 'Alipay Verified', time: '12分钟前' },
];

export function SalesTicker() {
    const [currentSale, setCurrentSale] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Don't show on admin or checkout pages
        if (pathname?.includes('/admin') || pathname?.includes('/checkout')) {
            setIsVisible(false);
            return;
        }

        const triggerSale = () => {
            setCurrentSale(prev => (prev + 1) % SALES_DATA.length);
            setIsVisible(true);

            // Hide after 4 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 4000);
        };

        // Initial delay before first popup
        const initialTimer = setTimeout(() => {
            triggerSale();
        }, 3000);

        // Subsequent popups every 15-25 seconds
        const interval = setInterval(() => {
            triggerSale();
        }, Math.floor(Math.random() * 10000) + 15000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="fixed bottom-24 sm:bottom-6 left-4 sm:left-6 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 flex items-center gap-3 max-w-[280px] sm:max-w-xs cursor-pointer hover:scale-105 transition-transform"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30">
                        <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {SALES_DATA[currentSale].name} 已购买
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {SALES_DATA[currentSale].product}
                        </p>
                        <p className="text-[10px] font-bold text-primary-500 mt-0.5">
                            {SALES_DATA[currentSale].time}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
