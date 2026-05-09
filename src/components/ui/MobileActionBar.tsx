'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Home, MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getLocalizedPath, getLangFromPath } from '@/lib/i18n';
import { useCartStore } from '@/store/cartStore';

export function MobileActionBar() {
    const pathname = usePathname();
    const lang = getLangFromPath(pathname);
    const cartCount = useCartStore(state => state.items.reduce((acc, item) => acc + item.quantity, 0));

    const navItems = [
        { icon: Home, label: lang === 'zh' ? '首页' : 'Home', href: '/' },
        { icon: MessageSquare, label: lang === 'zh' ? '客服' : 'Support', href: 'https://t.me/cnwechatpro', external: true },
        { icon: ShoppingCart, label: lang === 'zh' ? '购物车' : 'Cart', href: '/checkout', badge: cartCount },
        { icon: User, label: lang === 'zh' ? '我的' : 'Me', href: '/account' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-[#060B18]/80 backdrop-blur-xl border-t border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]" />
            
            <div className="relative flex items-center justify-around h-[64px] pb-safe">
                {navItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = pathname === getLocalizedPath(item.href, lang);
                    
                    return (
                        <Link 
                            key={i}
                            href={item.external ? item.href : getLocalizedPath(item.href, lang)}
                            target={item.external ? '_blank' : undefined}
                            className="flex flex-col items-center justify-center gap-1 w-full relative"
                        >
                            <div className={`relative p-1 transition-all duration-300 ${isActive ? 'text-[#FF0036]' : 'text-white/40'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] px-1 bg-[#FF0036] text-white text-[8px] font-black rounded-full border border-[#060B18]">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-white/30'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 w-8 h-0.5 bg-[#FF0036] rounded-full blur-[2px]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
