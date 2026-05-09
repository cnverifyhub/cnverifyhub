'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_ORDERS = [
    { user: '138****9021', item: '微信实名号 ×3', time: '刚刚' },
    { user: '159****3347', item: '支付宝花呗号', time: '1分钟前' },
    { user: '186****7712', item: '抖音千粉号 ×2', time: '2分钟前' },
    { user: '177****4405', item: 'QQ太阳号', time: '3分钟前' },
    { user: '135****8890', item: 'WeChat Aged Account', time: '4分钟前' },
    { user: '139****1122', item: '支付宝企业号 ×1', time: '5分钟前' },
    { user: '188****6677', item: '抖音万粉号', time: '刚刚' },
    { user: '131****9900', item: '微信实名号 ×5', time: '1分钟前' },
];

export function LiveOrderFeed() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MOCK_ORDERS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const order = MOCK_ORDERS[index];

    return (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/85 backdrop-blur-md border border-[#FF0036]/40 shadow-[0_0_20px_rgba(255,0,54,0.15)]"
                >
                    <div className="relative flex">
                        <div className="w-2 h-2 rounded-full bg-[#FF0036]" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#FF0036] animate-ping" />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-medium tracking-tight">
                        <span className="text-white/70">{order.user}</span>
                        <span className="text-white/40">购买了</span>
                        <span className="text-[#FF0036] font-bold">{order.item}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-white/40">{order.time}</span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
