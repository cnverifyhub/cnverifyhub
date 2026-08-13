'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { GsapAnimations } from '@/components/ui/GsapAnimations';
import { SalesTicker } from '@/components/ui/SalesTicker';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { LiveOrderFeed } from '@/components/home/LiveOrderFeed';
import { CustomCursor } from '@/components/ui/CustomCursor';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { MobileActionBar } from '@/components/ui/MobileActionBar';
import { LuckyDrawWidget } from '@/components/ui/LuckyDrawWidget';
import { ErrorBoundary } from '@/components/error-boundary';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // Check if we're on the admin dashboard route
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <SmoothScrollProvider>
            <LoadingScreen />
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pb-[64px] md:pb-0">
                    <ErrorBoundary fallback={<div className="p-4">{children}</div>}>
                        {children}
                    </ErrorBoundary>
                </main>
                <CartDrawer lang="zh" />
                <Footer />
                <MobileNav />
                <MobileActionBar />
                
                {/* Client-only Auxiliary Enhancements wrapped in ErrorBoundary */}
                {isClient && (
                    <ErrorBoundary fallback={null}>
                        <LuckyDrawWidget />
                        <LiveOrderFeed />
                        <SalesTicker />
                        <CustomCursor />
                        <GsapAnimations />
                    </ErrorBoundary>
                )}
            </div>
        </SmoothScrollProvider>
    );
}
