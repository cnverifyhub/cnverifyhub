'use client';

import React, { useState, useEffect } from 'react';
import { useCountDown } from 'ahooks';

interface FlashCountdownProps {
    targetDate?: Date;
}

export function FlashCountdown({ targetDate }: FlashCountdownProps) {
    const [target, setTarget] = useState<Date>(() => {
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);
        return targetDate || tomorrow;
    });

    const [countdown, formattedRes] = useCountDown({
        targetDate: target,
    });

    const { days, hours, minutes, seconds } = formattedRes;

    const TimeUnit = ({ val, label }: { val: number; label: string }) => (
        <div className="flex items-center gap-1">
            <div className="w-8 h-9 flex items-center justify-center bg-[#1A1A1E] border border-white/10 rounded-md shadow-inner">
                <span className="text-lg font-black font-mono-price text-[#FF0036]">
                    {val.toString().padStart(2, '0')}
                </span>
            </div>
            {label && <span className="text-[10px] font-bold text-white/30 uppercase">{label}</span>}
        </div>
    );

    return (
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-[#FF0036] uppercase tracking-[0.2em] animate-pulse">
                    Flash Sale
                </span>
                <span className="text-[11px] font-bold text-white/80">
                    距结束还剩
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <TimeUnit val={hours} label="" />
                <span className="text-[#FF0036] font-black animate-pulse">:</span>
                <TimeUnit val={minutes} label="" />
                <span className="text-[#FF0036] font-black animate-pulse">:</span>
                <TimeUnit val={seconds} label="" />
            </div>
        </div>
    );
}
