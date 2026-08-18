'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { allProducts } from '@/data/products';
import { PricingCard } from '@/components/ui/PricingCard';
import { type Lang } from '@/lib/i18n';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function HotProducts({ lang }: { lang: Lang }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const products = allProducts;

    useGSAP(() => {
        if (!sectionRef.current || !trackRef.current) return;

        const trackWidth = trackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        const scrollAmount = Math.max(trackWidth - windowWidth, 0);

        const trackAnimation = gsap.to(trackRef.current, {
            id: "track-scroll",
            x: -scrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => `+=${scrollAmount}`,
                invalidateOnRefresh: true,
            }
        });

        // Animate cards on scroll with GPU hardware acceleration
        const cards = gsap.utils.toArray('.product-card-wrap');
        cards.forEach((card: any) => {
            gsap.fromTo(card,
                { scale: 0.95, opacity: 0.8 },
                {
                    scale: 1,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: trackAnimation,
                        start: "left center",
                        end: "right center",
                        scrub: 0.5,
                    }
                }
            );
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} id="hot-products-section" className="relative bg-[#030712] py-20 min-h-screen flex items-center" style={{ overflow: 'clip' }}>
            <div className="absolute top-20 left-0 right-0 px-8 z-10">
                <span className="section-eyebrow"># {lang === 'zh' ? '热销爆款' : 'HOT PRODUCTS'}</span>
                <h2 className="section-title text-white">
                    {lang === 'zh' ? '本周最受欢迎产品' : 'Most Popular This Week'}
                </h2>
            </div>

            <div 
                ref={trackRef} 
                className="flex gap-8 px-8 items-center mt-20"
                style={{ width: 'max-content', willChange: 'transform' }}
            >
                {products.map((product, i) => (
                    <div key={product.id} className="product-card-wrap w-[320px] md:w-[400px] shrink-0">
                        <PricingCard product={product} lang={lang} />
                    </div>
                ))}
                <div className="w-[400px] flex flex-col items-center justify-center text-center p-12 border border-white/5 bg-white/2 rounded-3xl">
                   <p className="text-[#FF0036] font-bold text-lg mb-2">END OF COLLECTION</p>
                   <p className="text-white/40 text-sm">Scroll back or visit the shop for more.</p>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#FF0036]/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
}
