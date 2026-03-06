'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Eye, PlayCircle, MessageCircle, ShoppingCart } from 'lucide-react';
import type { Lang } from '@/lib/i18n';

interface LivestreamWidgetProps {
    lang: Lang;
}

const mockCommentsZh = [
    "李**：号真的稳这把稳了",
    "用户773：怎么购买？",
    "主播：左下角直接下单，自动发货的兄弟们",
    "风**：刚买了个万粉号，秒到账",
    "张**：企业V好贵，不过真好用",
    "主播：企业号现在有折扣，赶紧入手"
];

const mockCommentsEn = [
    "Alex**: Is this account safe?",
    "Host: Yes 100% safe, instant auth",
    "User99: Just bought a 1-year aged account",
    "Sarah**: How do I pay with USDT?",
    "Host: Click buy and scan the TRC20 code",
    "John**: Fast delivery, thanks!"
];

export function LivestreamWidget({ lang }: LivestreamWidgetProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [viewers, setViewers] = useState(1243);
    const [chatIndex, setChatIndex] = useState(0);
    const [hearts, setHearts] = useState<number[]>([]);

    const comments = lang === 'zh' ? mockCommentsZh : mockCommentsEn;

    // Simulate viewers fluctuating
    useEffect(() => {
        const viewerInterval = setInterval(() => {
            setViewers(prev => {
                const change = Math.floor(Math.random() * 20) - 10;
                return Math.max(800, prev + change);
            });
        }, 3000);

        // Simulate chat scrolling
        const chatInterval = setInterval(() => {
            setChatIndex(prev => (prev + 1) % comments.length);
        }, 4000);

        // Simulate random hearts
        const heartInterval = setInterval(() => {
            if (Math.random() > 0.4) {
                setHearts(prev => [...prev.slice(-4), Date.now()]);
            }
        }, 1500);

        return () => {
            clearInterval(viewerInterval);
            clearInterval(chatInterval);
            clearInterval(heartInterval);
        };
    }, [comments.length]);

    if (!isVisible) return null;

    return (
        <div className="fixed right-4 bottom-28 md:right-8 md:bottom-8 z-40 w-36 h-48 md:w-44 md:h-60 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 bg-black cursor-pointer group hover:scale-105 transition-transform animate-fade-in-up">

            {/* Background Simulate Live Host (Animated gradient & pulse to simulate movement) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center animate-[spin-very-slow_60s_linear_infinite]"></div>
                {/* Host Silhouette */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-t from-slate-900 to-slate-700 rounded-t-full opacity-80 animate-[bounce-slow_4s_ease-in-out_infinite]"></div>
            </div>

            {/* Top Bar: LIVE badge & Viewers */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
                <div className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    LIVE
                </div>
                <div className="bg-black/40 backdrop-blur-sm text-white text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    {viewers}
                </div>
            </div>

            {/* Close Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsVisible(false);
                }}
                className="absolute top-2 right-2 w-5 h-5 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white/80 hover:text-white z-20 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
            >
                <X className="w-3 h-3" />
            </button>

            {/* Play Button Overlay (Center) */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-10 h-10 text-white/50" />
            </div>

            {/* Bottom Gradient overlay for text readability */}
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none"></div>

            {/* Chat Overlay */}
            <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none">
                <div className="space-y-1">
                    <div className="text-[10px] text-white/90 leading-tight drop-shadow-md pb-1 border-b border-white/10 w-max pr-2 font-medium">
                        <span className={chatIndex % 2 === 0 ? "text-blue-300" : "text-yellow-300"}>
                            {comments[chatIndex].split('：')[0] || comments[chatIndex].split(':')[0]}
                        </span>
                        <span>: {comments[chatIndex].split('：')[1] || comments[chatIndex].split(':')[1]}</span>
                    </div>
                </div>

                {/* Simulated product link */}
                <div className="mt-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded pl-1 pr-2 py-0.5 flex items-center gap-1 w-max">
                    <div className="w-3 h-3 bg-red-500 rounded flex items-center justify-center">
                        <ShoppingCart className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-[9px] text-white font-bold">{lang === 'zh' ? '1号链接 爆款微信' : 'Link 1: Hot WeChat'}</span>
                </div>
            </div>

            {/* Floating Hearts */}
            {hearts.map(id => (
                <div
                    key={id}
                    className="absolute right-2 bottom-6 z-10 animate-[float-up_2s_ease-out_forwards]"
                >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </div>
            ))}
        </div>
    );
}
