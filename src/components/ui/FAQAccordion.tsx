'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '@/types';
import { type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface FAQAccordionProps {
    items: FAQItem[];
    lang: Lang;
    limit?: number;
}

export function FAQAccordion({ items, lang, limit }: FAQAccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
    const displayItems = limit ? items.slice(0, limit) : items;

    return (
        <div className="grid gap-4">
            {/* Schema.org JSON-LD for FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": displayItems.map(item => ({
                            "@type": "Question",
                            "name": item.question[lang],
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": item.answer[lang]
                            }
                        }))
                    })
                }}
            />

            {displayItems.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                    <div
                        key={item.id}
                        className={cn(
                            "group relative border transition-all duration-500 overflow-hidden rounded-2xl",
                            isOpen 
                                ? "bg-[#0D1526]/80 border-[#FF0036]/50 shadow-[0_0_30px_rgba(255,0,54,0.1)]" 
                                : "bg-[#0D1526]/40 border-[#1E2D45] hover:border-[#FF0036]/30"
                        )}
                    >
                        {/* Interactive state indicator */}
                        <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 transition-all duration-500",
                            isOpen ? "bg-[#FF0036] shadow-[0_0_15px_#FF0036]" : "bg-transparent"
                        )} />

                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="flex w-full items-center justify-between p-6 md:p-8 text-left focus:outline-none relative z-10"
                            aria-expanded={isOpen}
                        >
                            <span className={cn(
                                "font-black transition-all duration-300 text-lg md:text-xl tracking-tight leading-snug",
                                isOpen ? "text-white" : "text-[#7B91B0] group-hover:text-white"
                            )}>
                                {item.question[lang]}
                            </span>
                            <div className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                isOpen 
                                    ? "bg-[#FF0036] border-[#FF0036] text-white shadow-neon-red-sm rotate-180" 
                                    : "bg-[#060B18] border-[#1E2D45] text-[#7B91B0]"
                            )}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </button>

                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-500 ease-in-out relative z-10",
                                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="px-6 md:px-8 pb-8 pt-0 text-[#999AAA] leading-relaxed text-sm md:text-base border-t border-[#1E2D45]/50 mt-2">
                                <div className="pt-6">
                                    {item.answer[lang]}
                                </div>
                            </div>
                        </div>
                        
                        {/* Animated background flare */}
                        <div className={cn(
                            "absolute top-0 right-0 w-64 h-64 bg-[#FF0036]/5 blur-[80px] rounded-full transition-opacity duration-700 pointer-events-none",
                            isOpen ? "opacity-100" : "opacity-0"
                        )} />
                    </div>
                );
            })}
        </div>

    );
}
