'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * This component applies GSAP scroll-triggered entrance animations
 * to all major homepage sections. It finds sections by their CSS classes
 * and applies staggered, professional reveal animations.
 * 
 * Drop this component inside any page layout and it will automatically
 * animate <section> elements, .glass-card elements, and other key selectors.
 */
export function GsapAnimations() {
    useEffect(() => {
        // Wait for DOM to be fully painted
        const timer = setTimeout(() => {
            initAnimations();
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return null; // This is a side-effect-only component
}

function initAnimations() {
    // ============================================
    // 1. Section entrance animations (fade-up)
    // ============================================
    const sections = document.querySelectorAll('section, [class*="section-padding"]');
    sections.forEach((section) => {
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

    // ============================================
    // 2. Glass cards — staggered reveal
    // ============================================
    const cardGroups = document.querySelectorAll('[class*="grid"]');
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

    // ============================================
    // 3. Headings — slide-up reveal
    // ============================================
    const headings = document.querySelectorAll('h1, h2, h3.text-xl, h3.text-2xl, h3.text-3xl');
    headings.forEach((heading) => {
        // Skip headings in the hero (they have their own animations)
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

    // ============================================
    // 4. Trust badges & stat counters — scale-up
    // ============================================
    const badges = document.querySelectorAll('.badge, .badge-success, .badge-primary, [class*="rounded-full"][class*="font-semibold"]');
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

    // ============================================
    // 5. Pricing cards — dramatic entrance
    // ============================================
    const pricingCards = document.querySelectorAll('[id*="pricing"] > *, [class*="pricing"]');
    if (pricingCards.length > 0) {
        gsap.fromTo(pricingCards,
            { opacity: 0, y: 80, rotateX: 8 },
            {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: pricingCards[0]?.parentElement,
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }

    // ============================================
    // 6. FAQ items — accordion reveal
    // ============================================
    const faqItems = document.querySelectorAll('[class*="faq"] > *, details, [class*="accordion"]');
    faqItems.forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0,
                duration: 0.6,
                delay: i * 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item.parentElement,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // ============================================
    // 7. Footer — slide up
    // ============================================
    const footer = document.querySelector('footer');
    if (footer) {
        gsap.fromTo(footer,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 92%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }

    // ============================================
    // 8. Smooth hover effects for interactive elements
    // ============================================
    const interactiveCards = document.querySelectorAll('.glass-card-hover, [class*="hover:-translate"]');
    interactiveCards.forEach((card) => {
        const cardEl = card as HTMLElement;
        cardEl.addEventListener('mouseenter', () => {
            gsap.to(cardEl, {
                y: -6,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                duration: 0.3,
                ease: 'power2.out',
            });
        });
        cardEl.addEventListener('mouseleave', () => {
            gsap.to(cardEl, {
                y: 0,
                scale: 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                duration: 0.3,
                ease: 'power2.out',
            });
        });
    });

    // ============================================
    // 9. Live Ticker smooth scroll
    // ============================================
    const ticker = document.querySelector('[class*="animate-marquee"]')?.parentElement;
    if (ticker) {
        gsap.fromTo(ticker,
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
        );
    }
}
