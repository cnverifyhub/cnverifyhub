'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { GsapAnimations } from '@/components/ui/GsapAnimations';
import { SalesTicker } from '@/components/ui/SalesTicker';
import BaiduPush from '@/components/layout/BaiduPush';

import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

import { LiveOrderFeed } from '@/components/home/LiveOrderFeed';

import { CustomCursor } from '@/components/ui/CustomCursor';

import LoadingScreen from '@/components/ui/LoadingScreen';

import { MobileActionBar } from '@/components/ui/MobileActionBar';
import { LuckyDrawWidget } from '@/components/ui/LuckyDrawWidget';
import { PageTransition } from '@/components/ui/PageTransition';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';
    
    // Check if we're on the admin dashboard route
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        // Render just the children (the admin dashboard handles its own layout, sidebar, background, etc)
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                    {children}
                </main>
            </div>
        );
    }

    // Render the standard website layout
    return (
        <SmoothScrollProvider>
            <LoadingScreen />
            <div className="flex flex-col min-h-screen pt-[66px] md:pt-[70px]">
                <BaiduPush />
                <Header />
                <main className="flex-grow pb-[64px] md:pb-0">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
                <CartDrawer lang="zh" />
                <Footer />
                <MobileNav />
                <MobileActionBar />
                <LuckyDrawWidget />
                <LiveOrderFeed />
                <SalesTicker />
                <CustomCursor />
                <GsapAnimations />
            </div>
        </SmoothScrollProvider>
    );
}
