'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { categories, getLowestPrice } from '@/data/products';
import { type Lang } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';

interface MarketData {
    id: string;
    name: string;
    price: number;
    change: number;
    status: 'stock' | 'preorder' | 'soldout';
}

export function LiveMarketTable({ lang }: { lang: Lang }) {
    const [data, setData] = useState<MarketData[]>([]);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    useEffect(() => {
        // Initialize with real data from categories
        const initialData = categories.map(c => ({
            id: c.id,
            name: c.name[lang],
            price: getLowestPrice(c.id as any),
            change: 0,
            status: 'stock' as const
        }));
        setData(initialData);

        const interval = setInterval(() => {
            setData(prev => prev.map(item => {
                const changePercent = (Math.random() - 0.5) * 0.04; // ±2% change
                return {
                    ...item,
                    price: Number((item.price * (1 + changePercent)).toFixed(2)),
                    change: changePercent
                };
            }));
            setLastUpdate(new Date());
        }, 15000);

        return () => clearInterval(interval);
    }, [lang]);

    return (
        <section className="py-20 bg-[#060B18]">
            <div className="section-container">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="section-eyebrow"># {lang === 'zh' ? '实时行情' : 'LIVE MARKET'}</span>
                        <h2 className="section-title text-white">
                            {lang === 'zh' ? '数字资产交易指数' : 'Digital Asset Indices'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-full px-4 py-2 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF0036] animate-pulse" />
                            <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">LIVE</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                            <RefreshCw className="w-3 h-3 animate-spin-slow" />
                            {lang === 'zh' ? '更新于' : 'Updated'}: {lastUpdate.toLocaleTimeString()}
                        </div>
                    </div>
                </div>

                <div className="bg-[#0A0A0D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{lang === 'zh' ? '资产类别' : 'ASSET'}</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{lang === 'zh' ? '实时价格' : 'PRICE'}</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{lang === 'zh' ? '24H 涨跌' : '24H CHANGE'}</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{lang === 'zh' ? '趋势' : 'TREND'}</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{lang === 'zh' ? '状态' : 'STATUS'}</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-sm">
                                {data.map((item) => (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#FF0036]/30 transition-colors">
                                                    <span className="text-white text-xs font-black">{item.id.slice(0, 2).toUpperCase()}</span>
                                                </div>
                                                <span className="text-white font-bold tracking-tight">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <AnimatePresence mode="wait">
                                                <motion.span
                                                    key={item.price}
                                                    initial={{ color: item.change > 0 ? '#00D68F' : item.change < 0 ? '#FF0036' : '#fff' }}
                                                    animate={{ color: '#fff' }}
                                                    transition={{ duration: 1 }}
                                                    className="text-lg font-black"
                                                >
                                                    ¥{item.price.toLocaleString()}
                                                </motion.span>
                                            </AnimatePresence>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-1 font-bold ${item.change >= 0 ? 'text-[#00D68F]' : 'text-[#FF0036]'}`}>
                                                {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {(item.change * 100).toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-8">
                                                <svg viewBox="0 0 100 30" className="w-full h-full">
                                                    <path 
                                                        d={`M 0 15 Q 25 ${15 - item.change * 100} 50 15 T 100 ${15 + item.change * 50}`}
                                                        fill="none" 
                                                        stroke={item.change >= 0 ? '#00D68F' : '#FF0036'} 
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#00D68F]/10 text-[#00D68F] border border-[#00D68F]/20">
                                                <span className="w-1 h-1 rounded-full bg-[#00D68F] animate-pulse" />
                                                {lang === 'zh' ? '现货' : 'INSTOCK'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
