'use client';

import { useState, useEffect } from 'react';
import CountUp from 'react-countup';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({ end, duration = 2000, prefix = '', suffix = '', className = '' }: AnimatedCounterProps) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return <span className={className} suppressHydrationWarning>{prefix}{end}{suffix}</span>;
    }

    return (
        <span className={className} suppressHydrationWarning>
            <CountUp 
                start={Math.max(1, Math.floor(end * 0.8))}
                end={end} 
                duration={duration / 1000} 
                prefix={prefix} 
                suffix={suffix} 
                enableScrollSpy={true}
                scrollSpyOnce={true}
            />
        </span>
    );
}
