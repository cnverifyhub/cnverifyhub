'use client';

import React from 'react';

interface PriceTagProps {
    price: number;
    originalPrice?: number;
    className?: string;
}

export function PriceTag({ price, originalPrice, className = '' }: PriceTagProps) {
    const savings = originalPrice ? originalPrice - price : 0;

    return (
        <div className={`flex flex-col gap-0.5 ${className}`}>
            {originalPrice && (
                <div className="flex items-center gap-2">
                    <span className="text-[13px] text-white/30 line-through decoration-white/20">
                        ¥{originalPrice.toFixed(2)}
                    </span>
                    {savings > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#FF0036]/15 text-[#FF0036] text-[10px] font-bold">
                            省¥{savings.toFixed(0)}
                        </span>
                    )}
                </div>
            )}
            <div className="flex items-start gap-0.5 text-[#FF0036]">
                <span className="text-sm font-bold mt-1.5">¥</span>
                <span className="text-3xl font-black font-mono-price tracking-tighter">
                    {Math.floor(price)}
                </span>
                <span className="text-sm font-bold mt-1.5">
                    .{(price % 1).toFixed(2).split('.')[1]}
                </span>
            </div>
        </div>
    );
}
