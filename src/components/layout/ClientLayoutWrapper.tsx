'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { GsapAnimations } from '@/components/ui/GsapAnimations';

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
        <div className="flex flex-col min-h-screen pt-[66px] md:pt-[70px]">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <CartDrawer lang="zh" />
            <Footer />
            <MobileNav />
            <GsapAnimations />
        </div>
    );
}
