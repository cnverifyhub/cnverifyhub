'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Moon, Sun, ChevronDown, ShoppingCart, User, Zap } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import { LiveTicker } from './LiveTicker';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, BundleIcon, VerificationIcon, FintechIcon } from '@/components/ui/BrandIcons';

const categoryIcons: Record<string, React.ReactNode> = {
    wechat: <WeChatIcon className="w-full h-full" />,
    alipay: <AlipayIcon className="w-full h-full" />,
    douyin: <DouyinIcon className="w-full h-full" />,
    qq: <QQIcon className="w-full h-full" />,
    xianyu: <XianyuIcon className="w-full h-full" />,
    taobao: <TaobaoIcon className="w-full h-full" />,
    xiaohongshu: <XiaohongshuIcon className="w-full h-full" />,
    bundle: <BundleIcon className="w-full h-full" />,
    verification: <VerificationIcon className="w-full h-full" />,
    fintech: <FintechIcon className="w-full h-full" />,
};

export default function Header() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const { items, setIsOpen } = useCartStore();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const headerRef = useRef<HTMLElement>(null);
    const [headerHeight, setHeaderHeight] = useState(96);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Measure header height dynamically
    useEffect(() => {
        const measure = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
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
        { href: '/blog', label: t('nav.blog', lang) },
        { href: '/client', label: t('nav.track', lang) },
        { href: '/faq', label: t('nav.faq', lang) },
    ];

    const switchLangPath = lang === 'zh' ? `/en${pathname}` : pathname.replace(/^\/en/, '') || '/';

    return (
        <header ref={headerRef} className="fixed top-0 inset-x-0 z-50">
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
                    <div className="flex justify-between items-center h-16 lg:h-[68px]">

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
                        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                            {navLinks.map((link) => {
                                const localizedHref = getLocalizedPath(link.href, lang);
                                const isActive = link.href === '/' 
                                    ? pathname === localizedHref 
                                    : pathname.startsWith(localizedHref);
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

                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-72 z-50">
                                    <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('footer.accounts', lang)}</span>
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">7x24 即收即用</span>
                                            </div>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            {categories.map((c) => (
                                                <Link
                                                    key={c.id}
                                                    href={getLocalizedPath(c.href, lang)}
                                                    className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all group/item hover:translate-x-1"
                                                >
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden bg-white border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 group-hover/item:scale-110 group-hover/item:shadow-md transition-all">
                                                        {categoryIcons[c.id]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`font-bold text-sm block ${c.color} group-hover/item:translate-x-0.5 transition-transform`}>{c.name[lang]}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 opacity-70">
                                                            {c.description[lang]}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 -rotate-90 opacity-0 group-hover/item:opacity-100 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-1.5">
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
                        <div className="flex lg:hidden items-center gap-0.5 shrink-0">
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
                                className="p-2 text-slate-900 dark:text-white relative w-10 h-10 flex items-center justify-center"
                                aria-label="Toggle Menu"
                            >
                                <motion.div
                                    animate={mobileMenuOpen ? "open" : "closed"}
                                    className="flex flex-col gap-1.5 w-6"
                                >
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: 45, y: 8 }
                                        }}
                                        className="w-full h-0.5 bg-current rounded-full origin-center"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { opacity: 1, x: 0 },
                                            open: { opacity: 0, x: 20 }
                                        }}
                                        className="w-full h-0.5 bg-current rounded-full"
                                    />
                                    <motion.span
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: -45, y: -8 }
                                        }}
                                        className="w-full h-0.5 bg-current rounded-full origin-center"
                                    />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu — Fullscreen overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-[90]"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ top: `${headerHeight}px` }}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ y: -30, opacity: 0, scale: 0.97 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -20, opacity: 0, scale: 0.97 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                            className="lg:hidden fixed left-3 right-3 z-[100] bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden"
                            style={{ top: `${headerHeight + 4}px`, maxHeight: `calc(100vh - ${headerHeight + 16}px)`, overflowY: 'auto' }}
                        >
                            <div className="p-5 space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ x: -30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 250, delay: i * 0.04 }}
                                    >
                                        {(() => {
                                            const localizedHref = getLocalizedPath(link.href, lang);
                                            const isActive = link.href === '/' 
                                                ? pathname === localizedHref 
                                                : pathname.startsWith(localizedHref);
                                            return (
                                                <Link
                                                    href={localizedHref}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`block px-5 py-4 rounded-2xl text-lg font-bold transition-all active:scale-[0.97] ${isActive
                                                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                                                        }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        })()}
                                    </motion.div>
                                ))}

                                {/* Category Grid — Chinese e-commerce style */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15, duration: 0.3 }}
                                    className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/5"
                                >
                                    <p className="px-3 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                                        {t('footer.accounts', lang)}
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {categories.map((c, i) => (
                                            <motion.div
                                                key={c.id}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{
                                                    type: 'spring',
                                                    damping: 20,
                                                    stiffness: 300,
                                                    delay: 0.2 + (i * 0.04)
                                                }}
                                            >
                                                <Link
                                                    href={getLocalizedPath(c.href, lang)}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-90 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                                                >
                                                    <div className="w-11 h-11 flex items-center justify-center rounded-xl overflow-hidden bg-white border border-slate-200 dark:border-slate-800 shadow-md shrink-0">
                                                        {categoryIcons[c.id]}
                                                    </div>
                                                    <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300 text-center leading-tight line-clamp-1">{c.name[lang].replace('账号', '')}</span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Bottom CTA */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="grid grid-cols-1 gap-3 mt-6 pt-5 border-t border-slate-200/50 dark:border-white/5"
                                >
                                    <Link
                                        href={getLocalizedPath('/auth/login', lang)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-dark-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xl hover:border-red-300 active:scale-95 transition-all"
                                    >
                                        <User className="w-4 h-4" />
                                        {lang === 'zh' ? '登录 / 注册' : 'Login / Sign Up'}
                                    </Link>
                                    <Link
                                        href={getLocalizedPath('/contact', lang)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center h-14 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 active:scale-95 transition-transform"
                                    >
                                        {t('nav.contact', lang)}
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
