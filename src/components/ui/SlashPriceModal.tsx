'use client';

import { useState, useEffect } from 'react';
import { X, Scissors, Gift, Copy, CheckCircle2 } from 'lucide-react';
import type { Lang } from '@/lib/i18n';

interface SlashPriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Lang;
    productName: string;
}

export function SlashPriceModal({ isOpen, onClose, lang, productName }: SlashPriceModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [slashedAmount, setSlashedAmount] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSlashedAmount(null);
            setCopied(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSlash = () => {
        // Random amount between 3.50 and 8.90
        const amount = (Math.random() * (8.90 - 3.50) + 3.50).toFixed(2);
        setSlashedAmount(parseFloat(amount));
        setStep(2);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-gradient-to-b from-red-600 to-red-800 rounded-3xl shadow-2xl overflow-hidden animate-zoom-in border-4 border-red-500/50">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Decorative Header */}
                <div className="absolute top-0 inset-x-0 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

                <div className="p-6 md:p-8 text-center relative z-10">
                    {step === 1 ? (
                        <div className="animate-fade-in-up">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/30 border-4 border-white/20">
                                <Gift className="w-10 h-10 text-red-700 animate-bounce" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-md">
                                {lang === 'zh' ? '恭喜发现隐藏福利！' : 'Secret Discount Found!'}
                            </h3>
                            <p className="text-red-100/90 text-sm mb-8 leading-relaxed">
                                {lang === 'zh'
                                    ? `您可以为【${productName}】砍下一刀，赢取专属折扣！`
                                    : `Slash the price for [${productName}] and win an exclusive discount!`}
                            </p>

                            <button
                                onClick={handleSlash}
                                className="w-full relative group overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-900 font-extrabold py-4 rounded-2xl shadow-[0_8px_0_#b45309] active:shadow-[0_2px_0_#b45309] active:translate-y-[6px] transition-all flex items-center justify-center gap-2 text-xl"
                            >
                                <Scissors className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
                                {lang === 'zh' ? '立即帮忙砍一刀' : 'Slash the Price Now!'}
                                {/* Shine effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine-sweep_1.5s_ease-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <div className="mb-2">
                                <span className="text-red-200 font-medium">
                                    {lang === 'zh' ? '成功砍掉' : 'Successfully Slashed'}
                                </span>
                            </div>
                            <div className="text-5xl font-black text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-6 flex justify-center items-baseline gap-1">
                                <span className="text-2xl">-</span>
                                <span>{slashedAmount}</span>
                                <span className="text-xl font-bold">USDT</span>
                            </div>

                            {/* Fake Progress Bar */}
                            <div className="bg-black/20 rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/10">
                                <div className="flex justify-between text-xs text-red-100 mb-2 font-medium">
                                    <span>{lang === 'zh' ? '当前进度 98%' : 'Progress 98%'}</span>
                                    <span>{lang === 'zh' ? '还差 1.50 USDT' : '1.50 USDT left!'}</span>
                                </div>
                                <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 w-[98%] rounded-full relative">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20 animate-slide-right"></div>
                                    </div>
                                </div>
                                <p className="text-[11px] text-red-200">
                                    {lang === 'zh' ? '邀请1位新朋友即可直接拿走！' : 'Invite 1 friend to claim immediately!'}
                                </p>
                            </div>

                            <button
                                onClick={handleShare}
                                className="w-full relative group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-900 font-extrabold py-4 rounded-2xl shadow-[0_8px_0_#b45309] active:shadow-[0_2px_0_#b45309] active:translate-y-[6px] transition-all flex flex-col items-center justify-center gap-1 leading-tight"
                            >
                                <div className="flex items-center gap-2 text-lg">
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    {lang === 'zh'
                                        ? (copied ? '链接已复制！' : '邀请好友帮忙砍一刀')
                                        : (copied ? 'Link Copied!' : 'Invite Friend to Slash')}
                                </div>
                            </button>
                            <button className="mt-4 text-xs text-red-200/60 hover:text-red-200 underline underline-offset-2" onClick={onClose}>
                                {lang === 'zh' ? '忍痛放弃' : 'Give up'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
