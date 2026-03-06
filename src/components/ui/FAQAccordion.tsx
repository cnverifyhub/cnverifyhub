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
                    <div
                        key={item.id}
                        className={cn(
                            "border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300",
                            isOpen ? "bg-white dark:bg-dark-900 shadow-md shadow-slate-200/50 dark:shadow-none border-primary-200 dark:border-primary-900/50" : "bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="flex w-full items-center justify-between p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset"
                            aria-expanded={isOpen}
                        >
                            <span className={cn(
                                "font-semibold pr-8 transition-colors text-base md:text-lg",
                                isOpen ? "text-primary-600 dark:text-primary-400" : "text-slate-900 dark:text-slate-100"
                            )}>
                                {item.question[lang]}
                            </span>
                            <span className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                isOpen ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 transform rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            )}>
                                <ChevronDown className="w-5 h-5" />
                            </span>
                        </button>

                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="p-5 md:p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base border-t border-slate-100 dark:border-slate-800/50 mt-2">
                                {item.answer[lang]}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
