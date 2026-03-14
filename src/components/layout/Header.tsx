'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Moon, Sun, ChevronDown, ShoppingCart, User, Zap } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import { LiveTicker } from './LiveTicker';
import { useCartStore } from '@/store/cartStore';

const categoryIcons: Record<string, string> = {
    wechat: '💬',
    alipay: '💰',
    douyin: '🎵',
    qq: '🐧',
};

export default function Header() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const { items, setIsOpen } = useCartStore();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        }
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

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
        <header className="fixed top-0 inset-x-0 z-50">
            {/* Gradient accent line */}
            <div className="h-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />

            <div
                className={`transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 dark:bg-dark-950/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
                    : 'bg-white/60 dark:bg-dark-950/60 backdrop-blur-md'
                    }`}
            >
                <LiveTicker lang={lang} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-[68px]">

                        {/* Logo */}
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2 group shrink-0">
                            <div className="relative">
                                <Image src="/logo.png" alt="CNWePro Logo" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                                    CNWePro
                                </span>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase leading-none mt-0.5 hidden sm:block">
                                    {lang === 'zh' ? '专业账号平台' : 'ACCOUNT MARKETPLACE'}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === getLocalizedPath(link.href, lang);
                                return (
                                    <Link
                                        key={link.href}
                                        href={getLocalizedPath(link.href, lang)}
                                        className={`relative px-3.5 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Categories Dropdown */}
                            <div className="relative group px-1">
                                <button className="flex items-center gap-1 px-3.5 lg:px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5">
                                    {t('footer.accounts', lang)}
                                    <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
                                </button>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72">
                                    <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 p-2">
                                        {categories.map((c) => (
                                            <Link
                                                key={c.id}
                                                href={getLocalizedPath(c.href, lang)}
                                                className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group/item"
                                            >
                                                <span className="text-lg">{categoryIcons[c.id]}</span>
                                                <div className="flex-1 min-w-0">
                                                    <span className={`font-semibold text-sm block ${c.color}`}>{c.name[lang]}</span>
                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                                        {c.description[lang]}
                                                    </span>
                                                </div>
                                                <Zap className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover/item:text-orange-400 transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-1.5">
                            <Link
                                href={switchLangPath}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5"
                                title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-xs font-semibold">{lang === 'zh' ? 'EN' : 'CN'}</span>
                            </Link>

                            <Link
                                href={getLocalizedPath('/account', lang)}
                                className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5"
                                aria-label="Account"
                            >
                                <User className="w-[18px] h-[18px]" />
                            </Link>

                            <button
                                onClick={() => setIsOpen(true)}
                                className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5 relative"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="w-[18px] h-[18px]" />
                                {mounted && items.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-dark-950">
                                        {items.length}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/5"
                                aria-label={t('common.darkMode', lang)}
                            >
                                {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                            </button>

                            <Link
                                href={getLocalizedPath('/contact', lang)}
                                className="ml-1 relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <span className="relative z-10">{t('nav.contact', lang)}</span>
                                <div className="absolute inset-0 hero-shine" />
                            </Link>
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex md:hidden items-center gap-0.5 shrink-0">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="p-2 text-slate-600 dark:text-slate-300 relative"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {mounted && items.length > 0 && (
                                    <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-dark-950">
                                        {items.length}
                                    </span>
                                )}
                            </button>
                            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-slate-900 dark:text-white"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu — Fullscreen overlay */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ top: 'calc(2px + 64px)' }}
                    />

                    {/* Menu Panel */}
                    <div
                        className="md:hidden fixed left-0 right-0 z-50 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto"
                        style={{ top: 'calc(2px + 64px)', maxHeight: 'calc(100vh - 66px - 64px)' }}
                    >
                        <div className="p-5 space-y-1">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={getLocalizedPath(link.href, lang)}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${pathname === getLocalizedPath(link.href, lang)
                                        ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 text-red-600 dark:text-red-400'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Category Grid */}
                            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    {t('footer.accounts', lang)}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((c) => (
                                        <Link
                                            key={c.id}
                                            href={getLocalizedPath(c.href, lang)}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                        >
                                            <span className="text-base">{categoryIcons[c.id]}</span>
                                            <span className={`font-semibold text-sm ${c.color}`}>{c.name[lang]}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={getLocalizedPath('/contact', lang)}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-red-500/20"
                                >
                                    {t('nav.contact', lang)}
                                </Link>
                                <Link
                                    href={switchLangPath}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3.5 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                                >
                                    <Globe className="w-4 h-4 shrink-0" />
                                    {lang === 'zh' ? 'English' : '中文'}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
