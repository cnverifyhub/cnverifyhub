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
        <div className="space-y-4">
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
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                            "group border transition-all duration-500 rounded-2xl overflow-hidden mb-4",
                            isOpen 
                                ? "bg-[#0D1526] border-[#FF0036]/30 shadow-[0_0_30px_rgba(255,0,54,0.05)]" 
                                : "bg-[#0D1526]/30 border-[#1E2D45] hover:border-[#FF0036]/20"
                        )}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="flex w-full items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                            aria-expanded={isOpen}
                        >
                            <span className={cn(
                                "font-bold pr-8 transition-colors text-lg md:text-xl",
                                isOpen ? "text-white" : "text-[#7B91B0] group-hover:text-white"
                            )}>
                                {item.question[lang]}
                            </span>
                            <span className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                isOpen 
                                    ? "bg-[#FF0036] border-[#FF0036] text-white rotate-180 shadow-[0_0_15px_rgba(255,0,54,0.4)]" 
                                    : "bg-[#1E2D45]/50 border-[#1E2D45] text-[#7B91B0]"
                            )}>
                                <ChevronDown className="w-5 h-5" />
                            </span>
                        </button>

                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-500 ease-in-out",
                                isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="px-6 md:px-8 pb-8 text-[#7B91B0] leading-relaxed text-base md:text-lg border-t border-[#1E2D45]/30 pt-6">
                                <p className="relative z-10">
                                    {item.answer[lang]}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
