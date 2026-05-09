'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const PRIZES = ["9折券", "免运费", "再来一次", "5元优惠", "8折券", "谢谢参与"];

export function LuckyDrawWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<string | null>(null);

    const handleSpin = () => {
        if (isSpinning) return;
        
        setIsSpinning(true);
        setResult(null);
        
        const newRotation = rotation + 1800 + Math.random() * 360;
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const actualRotation = newRotation % 360;
            const prizeIndex = Math.floor((360 - actualRotation) / (360 / PRIZES.length)) % PRIZES.length;
            const prize = PRIZES[prizeIndex];
            setResult(prize);

            if (prize !== "谢谢参与" && prize !== "再来一次") {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FF0036', '#FFD700', '#ffffff']
                });
            }
        }, 4000);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-[#FF0036] text-white flex flex-col items-center justify-center shadow-[0_0_30px_rgba(255,0,54,0.5)] group hidden md:flex"
            >
                <div className="absolute inset-0 rounded-full border-2 border-[#FF0036] animate-ping opacity-20" />
                <Gift className="w-6 h-6 mb-0.5 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-tighter">抽奖</span>
                <div className="absolute -top-1 -right-1 bg-white text-[#FF0036] text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#FF0036]">1</div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSpinning && setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0D1526] border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl"
                        >
                            {/* Decorative background */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FF0036]/20 to-transparent pointer-events-none" />
                            
                            <button 
                                onClick={() => !isSpinning && setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-white mb-2">
                                    幸运大转盘
                                </h3>
                                <p className="text-white/40 text-sm">
                                    今日剩余 <span className="text-[#FF0036] font-bold">1</span> 次免费机会
                                </p>
                            </div>

                            {/* Spin Wheel */}
                            <div className="relative aspect-square w-64 mx-auto mb-8">
                                {/* Pointer */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-[#FF0036]" />
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ rotate: rotation }}
                                    transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
                                    className="w-full h-full rounded-full border-8 border-white/5 relative overflow-hidden bg-[#060B18] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                >
                                    {PRIZES.map((prize, i) => (
                                        <div 
                                            key={i}
                                            className="absolute top-0 left-0 w-full h-full origin-center"
                                            style={{ 
                                                transform: `rotate(${i * (360 / PRIZES.length)}deg)`,
                                                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 20%)' // Simplistic clip
                                            }}
                                        >
                                            <div 
                                                className={`w-full h-full flex items-center justify-center pt-12 ${i % 2 === 0 ? 'bg-white/[0.03]' : 'bg-transparent'}`}
                                            >
                                                <span className="text-[10px] font-black text-white/60 -rotate-90 origin-center whitespace-nowrap">
                                                    {prize}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Center Hub */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#0D1526] rounded-full border-4 border-white/10 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#FF0036] shadow-[0_0_10px_#FF0036]" />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="relative z-10">
                                <button
                                    onClick={handleSpin}
                                    disabled={isSpinning}
                                    className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${
                                        isSpinning 
                                            ? 'bg-white/5 text-white/20 cursor-not-allowed' 
                                            : 'bg-[#FF0036] text-white hover:bg-[#FF2D55] shadow-[0_10px_20px_rgba(255,0,54,0.3)]'
                                    }`}
                                >
                                    {isSpinning ? '正在抽奖...' : '立即开奖'}
                                </button>
                                
                                <AnimatePresence>
                                    {result && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="mt-6 p-4 rounded-xl bg-[#FF0036]/10 border border-[#FF0036]/20 text-center"
                                        >
                                            <p className="text-white/60 text-xs mb-1">恭喜获得</p>
                                            <p className="text-xl font-black text-[#FF0036] uppercase tracking-tighter flex items-center justify-center gap-2">
                                                <Sparkles className="w-5 h-5" />
                                                {result}
                                                <Sparkles className="w-5 h-5" />
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
