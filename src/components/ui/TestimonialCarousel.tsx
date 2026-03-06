'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import type { Testimonial } from '@/types';
import { type Lang } from '@/lib/i18n';

interface TestimonialCarouselProps {
    testimonials: Testimonial[];
    lang: Lang;
}

export function TestimonialCarousel({ testimonials, lang }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto scroll
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handlePrevious = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 500);
    };

    if (!testimonials.length) return null;

    const current = testimonials[currentIndex];

    return (
        <div className="relative max-w-4xl mx-auto px-4 sm:px-12">
            {/* Controls */}
            <button
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors z-10"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors z-10"
                aria-label="Next testimonial"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Card */}
            <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                <Quote className="absolute top-6 right-8 w-24 h-24 text-slate-100 dark:text-slate-800/50 -rotate-12 z-0" />

                <div key={current.id} className="relative z-10 animate-fade-in">
                    <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < current.rating ? 'text-gold-500 fill-gold-500' : 'text-slate-300 dark:text-slate-700'}`}
                            />
                        ))}
                    </div>

                    <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-8">
                        "{current.text[lang]}"
                    </p>

                    <div className="flex items-center gap-4">
                        {current.avatar ? (
                            <img src={current.avatar} alt={current.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                                {current.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-slate-900 dark:text-white text-lg">{current.name}</p>
                                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold border border-emerald-200 dark:border-emerald-800/30">
                                    <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    {lang === 'zh' ? '已实名认证' : 'Verified Buyer'}
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {current.date} · <span className="text-primary-600 dark:text-primary-400">{lang === 'zh' ? '已购' : 'Purchased'} {current.platform.toUpperCase()}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (isAnimating || i === currentIndex) return;
                            setIsAnimating(true);
                            setCurrentIndex(i);
                            setTimeout(() => setIsAnimating(false), 500);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary-500 w-8' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
