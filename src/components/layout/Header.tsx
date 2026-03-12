'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Moon, Sun, ChevronDown, ShoppingCart, User } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import { LiveTicker } from './LiveTicker';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const { items, setIsOpen } = useCartStore();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize theme and hydration
    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        }
    }, []);

    const toggleTheme = () => {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', !isDark);
        setTheme(isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    };

    const navLinks = [
        { href: '/', label: t('nav.home', lang) },
        { href: '/pricing', label: t('nav.pricing', lang) },
        { href: '/client', label: t('nav.track', lang) },
        { href: '/faq', label: t('nav.faq', lang) },
    ];

    const switchLangPath = lang === 'zh' ? `/en${pathname}` : pathname.replace(/^\/en/, '') || '/';

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <LiveTicker lang={lang} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-18">

                    {/* Logo */}
                    <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
                        <Image src="/logo.png" alt="CNWePro Logo" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
                        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                            CNWePro
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={getLocalizedPath(link.href, lang)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${pathname === getLocalizedPath(link.href, lang)
                                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10'
                                    : 'text-slate-600 dark:text-slate-300'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Categories Dropdown (Hover) */}
                        <div className="relative group px-2">
                            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                {t('footer.accounts', lang)}
                                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                            </button>

                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64">
                                <div className="glass-card p-2 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
                                    {categories.map((c) => (
                                        <Link
                                            key={c.id}
                                            href={getLocalizedPath(c.href, lang)}
                                            className="flex flex-col px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                                        >
                                            <span className={`font-semibold text-sm ${c.color}`}>{c.name[lang]}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                {c.description[lang]}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            href={switchLangPath}
                            className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-sm font-medium"
                            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
                        >
                            <Globe className="w-5 h-5" />
                            <span>{lang === 'zh' ? 'EN' : 'CN'}</span>
                        </Link>

                        <Link
                            href={getLocalizedPath('/account', lang)}
                            className="p-2 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label="Account Dashboard"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative"
                            aria-label="Toggle cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {mounted && items.length > 0 && (
                                <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                    {items.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            aria-label={t('common.darkMode', lang)}
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link
                            href={getLocalizedPath('/contact', lang)}
                            className="ml-2 btn-primary text-sm px-5 py-2.5"
                        >
                            {t('nav.contact', lang)}
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle & Cart */}
                    <div className="flex md:hidden items-center gap-1 sm:gap-2 shrink-0">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {mounted && items.length > 0 && (
                                <span className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 sm:p-2 text-slate-900 dark:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-card absolute top-full left-0 w-full border-t border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-slide-down origin-top">
                    <div className="p-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={getLocalizedPath(link.href, lang)}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-medium ${pathname === getLocalizedPath(link.href, lang)
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="my-4 border-t border-slate-100 dark:border-slate-800/50 pt-4">
                            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                {t('footer.accounts', lang)}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((c) => (
                                    <Link
                                        key={c.id}
                                        href={getLocalizedPath(c.href, lang)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <span className={`font-semibold text-sm ${c.color}`}>{c.name[lang]}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                            <Link
                                href={getLocalizedPath('/contact', lang)}
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn-primary w-full justify-center"
                            >
                                {t('nav.contact', lang)}
                            </Link>

                            <Link
                                href={switchLangPath}
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn-outline w-full justify-center flex items-center gap-2"
                            >
                                <Globe className="w-4 h-4 shrink-0" />
                                <span>{lang === 'zh' ? 'English' : '中文'}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
