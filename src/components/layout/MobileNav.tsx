'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, MessageCircle, User } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';

export default function MobileNav() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);

    const tabs = [
        {
            href: '/',
            icon: Home,
            label: t('nav.home', lang),
        },
        {
            href: '/pricing',
            icon: ShoppingBag,
            label: t('nav.pricing', lang),
        },
        {
            href: '/track',
            icon: Search,
            label: t('nav.track', lang),
        },
        {
            href: '/contact',
            icon: MessageCircle,
            label: t('nav.contact', lang),
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-dark-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around h-16">
                {tabs.map((tab) => {
                    const isActive = pathname === getLocalizedPath(tab.href, lang);
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={getLocalizedPath(tab.href, lang)}
                            className="relative flex flex-col items-center justify-center w-full h-full touch-target group"
                        >
                            {isActive && (
                                <span className="absolute top-0 inset-x-0 h-0.5 bg-primary-500 rounded-b-full"></span>
                            )}
                            <Icon
                                className={`w-5 h-5 mb-1 transition-colors ${isActive
                                    ? 'text-primary-600 dark:text-primary-400 stroke-[2.5px]'
                                    : 'text-slate-500 dark:text-slate-400 group-hover:text-primary-500'
                                    }`}
                            />
                            <span className={`text-[10px] sm:text-xs font-medium transition-colors ${isActive
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-slate-500 dark:text-slate-400 group-hover:text-primary-500'
                                }`}>
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
