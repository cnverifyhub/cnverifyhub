'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '', className = '' }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let startTimestamp: number | null = null;
                    const step = (timestamp: number) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

                        // easeOutExpo function for smooth deceleration
                        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                        setCount(Math.floor(easeOutExpo * end));

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return (
        <span ref={countRef} className={className}>
            {prefix}{count.toString()}{suffix}
        </span>
    );
}
