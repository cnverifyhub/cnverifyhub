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
        return <span className={className}>{prefix}0{suffix}</span>;
    }

    return (
        <span className={className}>
            <CountUp 
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
