'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, ShoppingCart, ChevronDown, Zap, Shield } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon,
    XianyuIcon, TaobaoIcon, XiaohongshuIcon,
    BundleIcon, VerificationIcon, FintechIcon
} from '@/components/ui/BrandIcons';

const categoryMeta: Record<string, { icon: React.ReactNode; color: string; desc: { zh: string; en: string } }> = {
    wechat:       { icon: <WeChatIcon className="w-full h-full" />,       color: '#07C160', desc: { zh: '实名认证老号', en: 'Real-name verified' } },
    alipay:       { icon: <AlipayIcon className="w-full h-full" />,       color: '#1677ff', desc: { zh: '花呗绑卡账户', en: 'Huabei linked' } },
    douyin:       { icon: <DouyinIcon className="w-full h-full" />,       color: '#ffffff', desc: { zh: '千粉高权重号', en: 'High-authority' } },
    qq:           { icon: <QQIcon className="w-full h-full" />,           color: '#12B7F5', desc: { zh: '太阳星钻账号', en: 'Sun/Star level' } },
    xianyu:       { icon: <XianyuIcon className="w-full h-full" />,       color: '#FFB300', desc: { zh: '高芝麻信用号', en: 'Zhima credit' } },
    taobao:       { icon: <TaobaoIcon className="w-full h-full" />,       color: '#FF5000', desc: { zh: '高级实名老店', en: 'Aged seller acc' } },
    xiaohongshu:  { icon: <XiaohongshuIcon className="w-full h-full" />, color: '#ff2442', desc: { zh: '真实粉丝账号', en: 'Real-follower acc' } },
    bundle:       { icon: <BundleIcon className="w-full h-full" />,       color: '#8b5cf6', desc: { zh: '多平台组合包', en: 'Multi-platform' } },
    verification: { icon: <VerificationIcon className="w-full h-full" />, color: '#00E5FF', desc: { zh: '专业实名代认证', en: 'KYC service' } },
    trading:      { icon: <FintechIcon className="w-full h-full" />,      color: '#FFB800', desc: { zh: '量化外汇账户', en: 'Quant/Forex' } },
};

/* ── Top micro-bar ticker ─────────────────── */
function MicroBar({ lang }: { lang: 'zh' | 'en' }) {
    const items = lang === 'zh'
        ? [
            '🔥 满700¥减100¥限时活动', 
            '⚡ USDT TRC20 自动发卡', 
            '🛡️ 全程担保交易', 
            '🏆 已服务 50,000+ 用户', 
            '⏱️ 平均发货 < 5分钟',
            '💎 VIP 尊享折上折'
          ]
        : [
            '🔥 Save 100¥ on orders 700¥+', 
            '⚡ USDT TRC20 Auto-Delivery', 
            '🛡️ Full Escrow Protection', 
            '🏆 50,000+ Customers Served', 
            '⏱️ Avg Delivery < 5 Min',
            '💎 VIP Membership Discounts'
          ];
          
    return (
        <div className="h-8 bg-gradient-to-r from-[#FF0036] to-[#C0001A] overflow-hidden flex items-center relative group">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer-fast pointer-events-none" />
            
            <div className="flex items-center gap-0 animate-marquee whitespace-nowrap hover:[animation-play-state:paused] transition-[animation-play-state] duration-300">
                {[...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center">
                        <span className="text-[11px] font-bold text-white px-6 tracking-wide drop-shadow-sm">
                            {item.includes('🔥') ? (
                                <span className="text-yellow-300 font-extrabold">{item}</span>
                            ) : item}
                        </span>
                        <span className="text-[#FFD700] text-[8px] opacity-80 animate-pulse">●</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Header() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const { items, setIsOpen } = useCartStore();
    const cartCount = items.reduce((s, i) => s + i.quantity, 0);

    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const megaRef = useRef<HTMLDivElement>(null);
    const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const openMega  = () => { if (megaTimerRef.current) clearTimeout(megaTimerRef.current); setMegaOpen(true); };
    const closeMega = () => { megaTimerRef.current = setTimeout(() => setMegaOpen(false), 120); };

    const langToggle = lang === 'zh'
        ? getLocalizedPath(pathname.replace(/^\/zh/, '') || '/', 'en')
        : getLocalizedPath(pathname.replace(/^\/en/, '') || '/', 'zh');

    const navLinks = [
        { label: lang === 'zh' ? '全部商品' : 'All Products', href: getLocalizedPath('/', lang), hasMega: true },
        { label: lang === 'zh' ? '套餐优惠' : 'Bundles', href: getLocalizedPath('/bundle', lang) },
        { label: lang === 'zh' ? '实名代认证' : 'KYC Service', href: getLocalizedPath('/verification', lang) },
        { label: lang === 'zh' ? '量化交易' : 'Trading', href: getLocalizedPath('/trading', lang) },
        { label: lang === 'zh' ? '安全指南' : 'Blog', href: getLocalizedPath('/blog', lang) },
    ];

    return (
        <>
            <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.5)]' : ''}`}>
                {/* Micro bar */}
                <MicroBar lang={lang} />

                {/* Main nav */}
                <nav
                    className={`transition-all duration-300 border-b border-[#1E2D45] ${
                        isScrolled
                            ? 'bg-[#060B18]/95 backdrop-blur-xl'
                            : 'bg-[#060B18]'
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-8">
                        {/* Logo */}
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2 shrink-0 group">
                            <div className="w-7 h-7 rounded flex items-center justify-center bg-[#FF2D55] text-white font-syne font-black text-xs leading-none shadow-neon-red-sm">
                                CV
                            </div>
                            <span className="font-syne font-bold text-lg tracking-tight text-white leading-none">
                                CN<span className="text-[#00E5FF]">Verify</span>Hub
                            </span>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-1 flex-1">
                            {navLinks.map((link) =>
                                link.hasMega ? (
                                    <div
                                        key={link.label}
                                        ref={megaRef}
                                        onMouseEnter={openMega}
                                        onMouseLeave={closeMega}
                                        className="relative"
                                    >
                                        <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${megaOpen ? 'text-[#00E5FF] bg-[#00E5FF]/5' : 'text-[#7B91B0] hover:text-white hover:bg-white/5'}`}>
                                            {link.label}
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180 text-[#00E5FF]' : ''}`} />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="relative px-3 py-2 text-sm font-medium text-[#7B91B0] hover:text-white transition-colors group/nav"
                                    >
                                        <span>{link.label}</span>
                                        <div className={`absolute bottom-1 left-3 right-3 h-0.5 bg-[#FF0036] rounded-full transition-transform duration-300 origin-center ${pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'}`} />
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Right actions */}
                        <div className="hidden md:flex items-center gap-2 ml-auto">
                            {/* Lang toggle */}
                            <Link href={langToggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7B91B0] hover:text-white hover:bg-white/5 transition-colors border border-[#1E2D45]">
                                <Globe className="w-3.5 h-3.5" />
                                {lang === 'zh' ? 'EN' : '中文'}
                            </Link>
                            {/* Cart */}
                            {mounted && (
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7B91B0] hover:text-white hover:bg-white/5 transition-colors border border-[#1E2D45]"
                                >
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF2D55] text-white text-[9px] font-black flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}
                            {/* Primary CTA */}
                            <Link
                                href={getLocalizedPath('/wechat', lang)}
                                className="cyber-btn-primary px-4 py-2 rounded-lg text-xs"
                            >
                                <Zap className="w-3.5 h-3.5 inline mr-1" />
                                {lang === 'zh' ? '立即选购' : 'Shop Now'}
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden ml-auto flex items-center gap-2">
                            {mounted && cartCount > 0 && (
                                <button onClick={() => setIsOpen(true)} className="relative p-2">
                                    <ShoppingCart className="w-5 h-5 text-[#7B91B0]" />
                                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#FF2D55] text-white text-[9px] font-black flex items-center justify-center">{cartCount}</span>
                                </button>
                            )}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 text-[#7B91B0] hover:text-white transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* ── Mega dropdown ───────────────────────── */}
                    <AnimatePresence>
                        {megaOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                                onMouseEnter={openMega}
                                onMouseLeave={closeMega}
                                className="absolute left-0 right-0 border-b border-[#1E2D45] bg-[#0D1526]/98 backdrop-blur-xl z-40"
                            >
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                    <div className="grid grid-cols-5 gap-4">
                                        {categories.map((cat) => {
                                            const meta = categoryMeta[cat.id];
                                            if (!meta) return null;
                                            return (
                                                <Link
                                                    key={cat.id}
                                                    href={getLocalizedPath(cat.href, lang)}
                                                    onClick={() => setMegaOpen(false)}
                                                    className="group flex items-center gap-3 p-3 rounded-lg border border-[#1E2D45] hover:border-[#00E5FF]/30 bg-[#060B18] hover:bg-[#142035] transition-all duration-200"
                                                >
                                                    <div
                                                        className="w-8 h-8 rounded shrink-0 flex items-center justify-center"
                                                        style={{ background: `${meta.color}18` }}
                                                    >
                                                        <div className="w-5 h-5">{meta.icon}</div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-white truncate">{cat.name[lang]}</p>
                                                        <p className="text-[10px] text-[#7B91B0] truncate">{meta.desc[lang]}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    {/* Bottom strip */}
                                    <div className="mt-4 pt-4 border-t border-[#1E2D45] flex items-center gap-4 text-[11px] text-[#7B91B0]">
                                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-[#FF2D55]" />{lang === 'zh' ? '全品类现货秒发' : 'All categories in-stock, instant delivery'}</span>
                                        <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-[#00E5FF]" />{lang === 'zh' ? 'USDT TRC20支付' : 'USDT TRC20 payment'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </header>

            {/* ── Mobile bottom-sheet drawer ───────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/70 z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0D1526] border-t border-[#1E2D45] rounded-t-2xl pb-safe-area-inset-bottom"
                        >
                            {/* Handle bar */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-10 h-1 rounded-full bg-[#1E2D45]" />
                            </div>
                            {/* Logo row */}
                            <div className="px-5 pb-4 border-b border-[#1E2D45] flex items-center justify-between">
                                <span className="font-syne font-bold text-base text-white">
                                    CN<span className="text-[#00E5FF]">Verify</span>Hub
                                </span>
                                <Link href={langToggle} className="text-xs font-medium text-[#7B91B0] border border-[#1E2D45] px-2.5 py-1 rounded-lg">
                                    {lang === 'zh' ? 'EN' : '中文'}
                                </Link>
                            </div>
                            {/* Nav links */}
                            <nav className="px-5 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-[#7B91B0] hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {link.label}
                                        <ChevronDown className="-rotate-90 w-4 h-4 opacity-40" />
                                    </Link>
                                ))}
                                <div className="pt-2 border-t border-[#1E2D45]">
                                    <p className="text-[10px] text-[#7B91B0] font-mono uppercase tracking-widest mb-2 px-3">
                                        {lang === 'zh' ? '全部分类' : 'Categories'}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map((cat) => {
                                            const meta = categoryMeta[cat.id];
                                            if (!meta) return null;
                                            return (
                                                <Link
                                                    key={cat.id}
                                                    href={getLocalizedPath(cat.href, lang)}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg border border-[#1E2D45] bg-[#060B18] hover:border-[#00E5FF]/30"
                                                >
                                                    <div className="w-6 h-6">{meta.icon}</div>
                                                    <span className="text-[9px] font-medium text-[#7B91B0] text-center truncate w-full">{cat.name[lang]}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </nav>
                            {/* Bottom CTA */}
                            <div className="px-5 pb-6 pt-4 border-t border-[#1E2D45]">
                                <Link
                                    href={getLocalizedPath('/wechat', lang)}
                                    onClick={() => setMobileOpen(false)}
                                    className="cyber-btn-primary block w-full py-3.5 rounded-xl text-sm text-center"
                                >
                                    <Zap className="w-4 h-4 inline mr-1.5" />
                                    {lang === 'zh' ? '立即选购' : 'Shop Now'}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Spacer for fixed header + micro-bar */}
            <div style={{ height: '96px' }} />
        </>
    );
}
