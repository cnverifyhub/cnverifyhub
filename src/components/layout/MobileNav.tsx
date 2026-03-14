'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Search, MessageCircle } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';

export default function MobileNav() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);

    const tabs = [
        { href: '/', icon: Home, label: t('nav.home', lang) },
        { href: '/pricing', icon: ShoppingBag, label: t('nav.pricing', lang) },
        { href: '/track', icon: Search, label: t('nav.track', lang) },
        { href: '/contact', icon: MessageCircle, label: t('nav.contact', lang) },
    ];

    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50">
            {/* Frosted glass backdrop */}
            <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-2xl border-t border-slate-200/60 dark:border-slate-700/60 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)] pb-safe">
                <div className="flex items-center justify-around h-[60px] relative">
                    {tabs.map((tab) => {
                        const isActive = pathname === getLocalizedPath(tab.href, lang);
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.href}
                                href={getLocalizedPath(tab.href, lang)}
                                className="relative flex flex-col items-center justify-center w-full h-full group"
                                style={{ minHeight: '48px', minWidth: '48px' }}
                            >
                                {/* Active pill background */}
                                {isActive && (
                                    <span className="absolute inset-x-2 top-1  bottom-1 bg-red-50 dark:bg-red-950/30 rounded-xl transition-all" />
                                )}

                                <div className="relative z-10 flex flex-col items-center">
                                    <Icon
                                        className={`w-5 h-5 mb-0.5 transition-all duration-200 ${isActive
                                            ? 'text-red-600 dark:text-red-400 scale-110'
                                            : 'text-slate-400 dark:text-slate-500 group-active:scale-90'
                                            }`}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                    />
                                    <span className={`text-[10px] font-semibold transition-colors ${isActive
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-slate-400 dark:text-slate-500'
                                        }`}>
                                        {tab.label}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
