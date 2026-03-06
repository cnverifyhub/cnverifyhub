'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
    initialMinutes: number;
    lang: Lang;
    className?: string;
    onExpire?: () => void;
}

export function CountdownTimer({ initialMinutes, lang, className, onExpire }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

    useEffect(() => {
        if (timeLeft <= 0) {
            if (onExpire) onExpire();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isWarning = timeLeft < 300; // Less than 5 mins

    return (
        <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors',
            isWarning
                ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400 animate-pulse'
                : 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
            className
        )}>
            <Clock className="w-4 h-4" />
            <span className="font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span>{t('checkout.timer', lang).replace('{minutes}', '')}</span>
        </div>
    );
}
