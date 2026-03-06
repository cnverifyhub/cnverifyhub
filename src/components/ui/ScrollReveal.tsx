'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number; // ms
    direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
    duration?: number; // ms
    once?: boolean;
}

export function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 600,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [once]);

    const directionStyles: Record<string, string> = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
        fade: '',
    };

    return (
        <div
            ref={ref}
            className={`transition-all ease-out ${className} ${isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : `opacity-0 ${directionStyles[direction]}`
                }`}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
