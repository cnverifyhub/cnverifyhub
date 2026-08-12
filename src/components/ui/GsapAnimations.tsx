'use client';

import { useEffect, useRef, MutableRefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook to safely run GSAP animations scoped to a React component container ref.
 * Cleans up GSAP Context automatically on unmount to prevent memory leaks and race conditions.
 */
export function useGsapContext(
    scopeRef: MutableRefObject<HTMLElement | null>,
    animationFn: (ctx: gsap.Context) => void,
    deps: any[] = []
) {
    useEffect(() => {
        if (!scopeRef.current) return;

        const ctx = gsap.context(() => {
            animationFn(ctx);
        }, scopeRef);

        return () => {
            ctx.revert();
        };
    }, [scopeRef, ...deps]);
}

/**
 * Global/Section level scroll-triggered animation initializer.
 * Scoped safely inside a container element.
 */
export function GsapAnimations() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGsapContext(containerRef, () => {
        // 1. Section entrance animations (fade-up)
        const sections = gsap.utils.toArray<HTMLElement>('section, [class*="section-padding"]');
        sections.forEach((section) => {
            if (section.id === 'hot-products-section') return;

            gsap.fromTo(section,
                { opacity: 0, y: 60 },
                {
                    opacity: 1, y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // 2. Glass cards — staggered reveal
        const cardGroups = gsap.utils.toArray<HTMLElement>('[class*="grid"]');
        cardGroups.forEach((group) => {
            const cards = group.querySelectorAll('.glass-card, .glass-card-hover, [class*="rounded-2xl"][class*="border"], [class*="rounded-3xl"][class*="border"]');
            if (cards.length === 0) return;

            gsap.fromTo(cards,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: group,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // 3. Headings — slide-up reveal
        const headings = gsap.utils.toArray<HTMLElement>('h1, h2, h3.text-xl, h3.text-2xl, h3.text-3xl');
        headings.forEach((heading) => {
            if (heading.closest('[class*="hero"]') || heading.closest('header')) return;

            gsap.fromTo(heading,
                { opacity: 0, y: 30, clipPath: 'inset(100% 0% 0% 0%)' },
                {
                    opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // 4. Trust badges & stat counters
        const badges = gsap.utils.toArray<HTMLElement>('.badge, .badge-success, .badge-primary, [class*="rounded-full"][class*="font-semibold"]');
        badges.forEach((badge) => {
            gsap.fromTo(badge,
                { opacity: 0, scale: 0.7 },
                {
                    opacity: 1, scale: 1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: badge,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });

        // 5. Pricing cards
        const pricingCards = gsap.utils.toArray<HTMLElement>('[id*="pricing"] > *, [class*="pricing"]');
        if (pricingCards.length > 0) {
            gsap.fromTo(pricingCards,
                { opacity: 0, y: 80, rotateX: 8 },
                {
                    opacity: 1, y: 0, rotateX: 0,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: pricingCards[0]?.parentElement || pricingCards[0],
                        start: 'top 75%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }

        // 6. FAQ items
        const faqItems = gsap.utils.toArray<HTMLElement>('[class*="faq"] > *, details, [class*="accordion"]');
        faqItems.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, x: -30 },
                {
                    opacity: 1, x: 0,
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item.parentElement || item,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        });
    });

    return <div ref={containerRef} className="hidden" aria-hidden="true" />;
}

