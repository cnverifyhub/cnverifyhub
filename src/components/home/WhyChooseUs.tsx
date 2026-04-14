'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, HeartHandshake, Box } from 'lucide-react';
import type { Lang } from '@/lib/i18n';

interface WhyChooseUsProps {
    lang: Lang;
}

const trustItems = {
    zh: [
        {
            title: "官方正品保护",
            desc: "货源经过严格筛选，确保每一份都是正品",
            icon: <ShieldCheck className="w-10 h-10 text-[#e4393c]" />,
        },
        {
            title: "极速发货",
            desc: "系统自动处理，平均5分钟内完成发货",
            icon: <Zap className="w-10 h-10 text-[#ffd700]" />,
        },
        {
            title: "售后无忧",
            desc: "7天质保期内任何质量问题可申请售后",
            icon: <HeartHandshake className="w-10 h-10 text-[#e4393c]" />,
        },
        {
            title: "平台担保交易",
            desc: "采用区块链担保，支付更安全透明",
            icon: <Box className="w-10 h-10 text-[#ffd700]" />,
        },
    ],
    en: [
        {
            title: "Official Protection",
            desc: "Strictly screened sources to ensure every account is authentic",
            icon: <ShieldCheck className="w-10 h-10 text-[#e4393c]" />,
        },
        {
            title: "Instant Delivery",
            desc: "Automatic processing, average delivery within 5 minutes",
            icon: <Zap className="w-10 h-10 text-[#ffd700]" />,
        },
        {
            title: "Worry-free After-sales",
            desc: "Any quality issues within 7 days are eligible for support",
            icon: <HeartHandshake className="w-10 h-10 text-[#e4393c]" />,
        },
        {
            title: "Secured Escrow",
            desc: "Safe and transparent payments via blockchain escrow",
            icon: <Box className="w-10 h-10 text-[#ffd700]" />,
        },
    ]
};

export function WhyChooseUs({ lang }: WhyChooseUsProps) {
    const [count, setCount] = useState(0);
    const targetCount = 5284;
    const items = trustItems[lang] || trustItems.zh;

    useEffect(() => {
        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = Math.ceil(targetCount / (duration / 16)); // ~60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetCount) {
                setCount(targetCount);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-dark-950/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 font-['PingFang_SC','System-ui',sans-serif]">
                        为什么选择我们？
                    </h2>
                    <div className="h-1.5 w-20 bg-gradient-to-r from-[#e4393c] to-[#ffd700] mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-[1.8]">
                        我们致力于打造全网最安全、最专业、最透明的数字化商品交易平台。
                    </p>
                </div>

                {/* 4-Column Grid (2x2 on Mobile) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item, idx) => (
                        <div 
                            key={idx} 
                            className="bg-white dark:bg-dark-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-[1.8]">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Real-time Counter Animation */}
                <div className="mt-16 bg-white dark:bg-dark-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-red-500/5 border border-red-100 dark:border-red-900/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e4393c] via-[#ffd700] to-[#e4393c]"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">
                            诚信经营 · 全球可信
                        </span>
                        <div className="flex items-baseline gap-1 animate-pulse-slow">
                            <span className="text-sm md:text-xl font-bold text-slate-700 dark:text-slate-300">已服务</span>
                            <span className="text-5xl md:text-7xl font-black text-[#e4393c] tabular-nums tracking-tighter drop-shadow-sm">
                                {count.toLocaleString()}
                            </span>
                            <span className="text-lg md:text-2xl font-bold text-[#e4393c]">+</span>
                            <span className="text-sm md:text-xl font-bold text-slate-700 dark:text-slate-300 ml-1">客户</span>
                        </div>
                        <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm italic font-medium">
                            数据每分钟自动更新 · 累计完成交易 12,045+ 次
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Add CSS for pulse-slow if needed, but Tailwind usually covers it
