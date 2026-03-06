'use client';

import { useState } from 'react';
import { Gift, X, Loader2 } from 'lucide-react';
import type { Lang } from '@/lib/i18n';

interface LuckyWheelProps {
    lang: Lang;
}

export function LuckyWheel({ lang }: LuckyWheelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [hasSpun, setHasSpun] = useState(false);

    const rewards = [
        lang === 'zh' ? '10U 代金券' : '10U Voucher',
        lang === 'zh' ? '谢谢参与' : 'Try Again',
        lang === 'zh' ? '免单大奖' : 'Free Order',
        lang === 'zh' ? '5U 代金券' : '5U Voucher',
        lang === 'zh' ? '9折 优惠券' : '10% OFF',
        lang === 'zh' ? '谢谢参与' : 'Try Again',
    ];

    const spinWheel = () => {
        if (hasSpun) return;
        setIsSpinning(true);

        // Always win the 5U Voucher (index 3) or 10% OFF (index 4)
        // This is a common e-commerce tactic - high win rate for small coupons to drive conversion
        const winIndex = Math.random() > 0.5 ? 3 : 4;
        const spins = 5; // Base rotations
        const targetDegree = spins * 360 + (winIndex * 60) + 30; // Land in the middle of the slice

        setTimeout(() => {
            setIsSpinning(false);
            setResult(rewards[winIndex]);
            setHasSpun(true);
        }, 3000); // 3 seconds spin

        return targetDegree; // Passed to inline style below
    };

    return (
        <>
            {/* Floating Trigger Widget */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-4 bottom-28 md:left-8 md:bottom-32 z-40 w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-white flex flex-col items-center justify-center text-red-700 animate-[bounce-slow_3s_ease-in-out_infinite] hover:scale-110 transition-transform group"
            >
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-yellow-400"></div>
                <Gift className="w-6 h-6 animate-pulse" />
                <span className="text-[9px] font-black leading-tight -mt-0.5 tracking-tighter">
                    {lang === 'zh' ? '抽奖' : 'SPIN'}
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isSpinning && setIsOpen(false)}></div>

                    <div className="relative max-w-sm w-full animate-zoom-in">
                        {/* Red Packet Background wrapper */}
                        <div className="bg-gradient-to-b from-red-500 to-red-800 rounded-[2rem] p-6 shadow-2xl border-4 border-yellow-500/30 overflow-hidden relative pb-12">
                            <button
                                onClick={() => !isSpinning && setIsOpen(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-6 relative z-10">
                                <h3 className="text-3xl font-black text-yellow-300 drop-shadow-md tracking-widest mb-1 italic">
                                    {lang === 'zh' ? '天天抽大奖' : 'LUCKY SPIN'}
                                </h3>
                                <p className="text-red-100 text-sm">
                                    {lang === 'zh' ? '新人必中无门槛红包！' : 'Guaranteed win for new users!'}
                                </p>
                            </div>

                            {/* Wheel */}
                            <div className="relative w-64 h-64 mx-auto mb-8 z-10">
                                {/* Outer glowing ring */}
                                <div className="absolute inset-[-10px] rounded-full border-[8px] border-yellow-400/30 shadow-[0_0_30px_rgba(234,179,8,0.5)]"></div>
                                {/* Inner ring with dots (simulated by border pattern) */}
                                <div className="absolute inset-0 rounded-full border-4 border-yellow-200 bg-red-900 overflow-hidden">
                                    <div
                                        className="w-full h-full relative"
                                        style={{
                                            transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                                            transform: isSpinning ? `rotate(2310deg)` : 'rotate(0deg)' // Fixed rotation for demo
                                        }}
                                    >
                                        {/* Slices */}
                                        {rewards.map((reward, i) => (
                                            <div
                                                key={i}
                                                className={`absolute inset-0 origin-center`}
                                                style={{ transform: `rotate(${i * 60}deg)` }}
                                            >
                                                {/* Slice background */}
                                                <div
                                                    className="w-[124px] h-[124px] absolute top-[-2px] left-1/2 -translate-x-1/2 origin-bottom clip-triangle"
                                                    style={{
                                                        backgroundColor: i % 2 === 0 ? '#ffedd5' : '#ffffff', // alternating cream/white
                                                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                                                    }}
                                                >
                                                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[11px] font-bold text-red-600 tracking-tighter w-14 text-center">
                                                        {reward}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Center pointer */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-2 border-white flex justify-center z-20">
                                    {/* Pointer Triangle */}
                                    <div className="absolute -top-4 border-[10px] border-transparent border-b-yellow-400"></div>
                                    <div className="mt-2.5 text-red-800 font-extrabold text-xs leading-none">
                                        {lang === 'zh' ? '抽奖' : 'GO'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="text-center relative z-10">
                                {result ? (
                                    <div className="animate-fade-in-up bg-white rounded-xl p-4 shadow-inner">
                                        <p className="text-slate-500 text-xs mb-1 font-medium">
                                            {lang === 'zh' ? '恭喜您抽中' : 'Congratulations! You won:'}
                                        </p>
                                        <div className="text-xl font-black text-red-600 mb-3">{result}</div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 rounded-lg active:scale-95 transition-transform shadow-md"
                                        >
                                            {lang === 'zh' ? '立即领取绑定账号' : 'Login to Claim Reward'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={spinWheel}
                                        disabled={isSpinning || hasSpun}
                                        className="w-full relative group overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-900 font-extrabold py-4 rounded-xl shadow-[0_6px_0_#b45309] active:shadow-[0_2px_0_#b45309] active:translate-y-[4px] transition-all flex justify-center items-center gap-2"
                                    >
                                        {isSpinning && <Loader2 className="w-5 h-5 animate-spin" />}
                                        {lang === 'zh' ? (isSpinning ? '正在抽奖...' : '立即抽奖 (剩1次)') : (isSpinning ? 'Spinning...' : 'Spin Now (1 Left)')}
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine-sweep_1.5s_ease-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
