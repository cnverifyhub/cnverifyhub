'use client';

import { useState, useEffect } from 'react';
import { Volume2, ShieldCheck, Zap, Users } from 'lucide-react';
import { type Lang } from '@/lib/i18n';

const notifications = [
    { zh: '用户 135**** 刚刚购买了 微信高级实名号', en: 'User 135**** just purchased WeChat Advanced Real-Name Account' },
    { zh: '用户 188**** 刚刚购买了 支付宝商业版', en: 'User 188**** just purchased Alipay Business Account' },
    { zh: '用户 159**** 刚刚购买了 抖音企业蓝V号', en: 'User 159**** just purchased Douyin Blue V Enterprise' },
    { zh: '用户 130**** 刚刚购买了 QQ老号', en: 'User 130**** just purchased QQ Aged Account' },
    { zh: '用户 176**** 刚刚购买了 微信企微尊享版', en: 'User 176**** just purchased WeChat Enterprise Pro' },
];

export function LiveTicker({ lang }: { lang: Lang }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false); // trigger fade out

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % notifications.length);
                setIsVisible(true); // trigger fade in
            }, 500); // Wait for fade out animation

        }, 4000); // Change message every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30 overflow-hidden text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">

                {/* Left: Ticker */}
                <div className="flex items-center gap-2 flex-1 relative overflow-hidden h-4">
                    <Volume2 className="w-3.5 h-3.5 text-red-500 flex-shrink-0 animate-pulse" />
                    <span
                        className={`text-red-700 dark:text-red-400 font-medium transition-all duration-500 ease-in-out absolute left-6 truncate w-[90%] md:w-auto ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                            }`}
                    >
                        {notifications[currentIndex][lang]}
                    </span>
                </div>

                {/* Right: Guarantees (Chinese e-commerce style) */}
                <div className="hidden md:flex items-center gap-4 text-[11px] text-red-600/80 dark:text-red-400/80 font-medium shrink-0">
                    <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{lang === 'zh' ? '平台担保交易' : 'Escrow Secured'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{lang === 'zh' ? '24小时自动发货' : '24/7 Auto-Delivery'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{lang === 'zh' ? '1.2w+ 用户信赖' : '12K+ Trusted Users'}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
