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
    const items = trustItems[lang] || trustItems.zh;

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

                {/* Removed customer counter as requested (until real data is higher) */}
            </div>
        </section>
    );
}

// Add CSS for pulse-slow if needed, but Tailwind usually covers it
