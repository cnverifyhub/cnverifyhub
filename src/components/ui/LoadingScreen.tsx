'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Hide loading screen after 1s (simulated load)
        const timer = setTimeout(() => setShow(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-dark-950 flex flex-col items-center justify-center transition-opacity duration-500">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Animated rings */}
                <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-accent-500 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '6s' }}></div>
                <div className="absolute inset-4 border-4 border-transparent border-t-gold-500 rounded-full animate-spin-slow" style={{ animationDuration: '4s' }}></div>

                {/* Logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse-slow">
                    CN
                </div>
            </div>
            <p className="mt-8 text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase text-sm animate-pulse">
                Loading...
            </p>
        </div>
    );
}
