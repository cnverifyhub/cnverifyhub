'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'zoom-in' | 'slide-up' | 'stagger';

interface ScrollRevealProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
    distance?: number;
    className?: string;
    staggerChildren?: number;
    threshold?: number;
    once?: boolean;
}

export function ScrollReveal({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 0.8,
    distance = 50,
    className = '',
    staggerChildren = 0.1,
    threshold = 0.15,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const initialState: gsap.TweenVars = { opacity: 0 };
        const animateState: gsap.TweenVars = {
            opacity: 1,
            duration,
            delay,
            ease: 'power3.out',
        };

        switch (animation) {
            case 'fade-up':
                initialState.y = distance;
                animateState.y = 0;
                break;
            case 'fade-down':
                initialState.y = -distance;
                animateState.y = 0;
                break;
            case 'fade-left':
                initialState.x = -distance;
                animateState.x = 0;
                break;
            case 'fade-right':
                initialState.x = distance;
                animateState.x = 0;
                break;
            case 'scale-up':
                initialState.scale = 0.85;
                animateState.scale = 1;
                break;
            case 'zoom-in':
                initialState.scale = 0.6;
                initialState.y = 30;
                animateState.scale = 1;
                animateState.y = 0;
                break;
            case 'slide-up':
                initialState.y = distance * 1.5;
                initialState.clipPath = 'inset(100% 0% 0% 0%)';
                animateState.y = 0;
                animateState.clipPath = 'inset(0% 0% 0% 0%)';
                break;
            case 'stagger':
                break;
        }

        if (animation === 'stagger') {
            const children = el.children;
            gsap.set(children, { opacity: 0, y: distance });
            gsap.to(children, {
                opacity: 1,
                y: 0,
                duration,
                stagger: staggerChildren,
                ease: 'power3.out',
                delay,
                scrollTrigger: {
                    trigger: el,
                    start: `top ${100 - threshold * 100}%`,
                    toggleActions: once ? 'play none none none' : 'play none none reverse',
                },
            });
        } else {
            gsap.set(el, initialState);
            gsap.to(el, {
                ...animateState,
                scrollTrigger: {
                    trigger: el,
                    start: `top ${100 - threshold * 100}%`,
                    toggleActions: once ? 'play none none none' : 'play none none reverse',
                },
            });
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [animation, delay, duration, distance, staggerChildren, threshold, once]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

/* ============================================
   Parallax component for depth effect
   ============================================ */
interface ParallaxProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        gsap.to(el, {
            yPercent: -20 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [speed]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

/* ============================================
   CountUp animation for statistics
   ============================================ */
interface CountUpProps {
    end: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    className?: string;
}

export function CountUp({ end, suffix = '', prefix = '', duration = 2, className = '' }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                if (hasAnimated.current) return;
                hasAnimated.current = true;
                gsap.to(obj, {
                    val: end,
                    duration,
                    ease: 'power2.out',
                    onUpdate: () => {
                        if (el) {
                            const value = end >= 1000
                                ? Math.floor(obj.val / 1000) + 'K'
                                : Math.floor(obj.val).toString();
                            el.textContent = `${prefix}${value}${suffix}`;
                        }
                    },
                });
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [end, suffix, prefix, duration]);

    return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
