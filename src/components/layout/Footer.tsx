'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, MessageCircle, Send, Wallet, Shield, Clock, Headphones, Award } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import Image from 'next/image';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon } from '@/components/ui/BrandIcons';

const categoryIcons: Record<string, React.ReactNode> = {
    wechat: <WeChatIcon className="w-5 h-5 text-emerald-500" />,
    alipay: <AlipayIcon className="w-5 h-5 text-blue-500" />,
    douyin: <DouyinIcon className="w-5 h-5 text-slate-800 dark:text-white" />,
    qq: <QQIcon className="w-5 h-5 text-sky-500" />,
};

export default function Footer() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const currentYear = new Date().getFullYear();

    const trustBadges = [
        { icon: ShieldCheck, label: lang === 'zh' ? 'SSL安全加密' : 'SSL Encrypted', color: 'text-emerald-500' },
        { icon: Headphones, label: lang === 'zh' ? '7×24在线客服' : '24/7 Support', color: 'text-blue-500' },
        { icon: Clock, label: lang === 'zh' ? '72小时售后质保' : '72h Warranty', color: 'text-amber-500' },
        { icon: Award, label: lang === 'zh' ? '50,000+订单完成' : '50K+ Orders Done', color: 'text-red-500' },
    ];

    return (
        <footer className="relative bg-slate-50 dark:bg-[#0a0a14] pb-20 md:pb-0 overflow-hidden">
            {/* Gradient top border */}
            <div className="h-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-amber-400" />

            {/* Trust Badges Row */}
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {trustBadges.map((badge) => {
                            const Icon = badge.icon;
                            return (
                                <div key={badge.label} className="flex items-center gap-2.5 justify-center md:justify-start">
                                    <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 ${badge.color}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                                        {badge.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-8">

                    {/* Brand & Intro */}
                    <div className="space-y-5 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2 group">
                            <Image src="/logo.png" alt="CNWePro Logo" width={36} height={36} className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                                    CNWePro
                                </span>
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">
                                    {lang === 'zh' ? '专业账号平台' : 'ACCOUNT MARKETPLACE'}
                                </span>
                            </div>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                            {t('site.description', lang)}
                        </p>

                        {/* Payment Method Badge */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <Wallet className="w-3.5 h-3.5" />
                                USDT TRC20
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                                <Shield className="w-3.5 h-3.5" />
                                {lang === 'zh' ? '担保交易' : 'Escrow'}
                            </div>
                        </div>
                    </div>

                    {/* Accounts */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
                            {t('footer.accounts', lang)}
                        </h3>
                        <ul className="space-y-3 flex flex-col items-center sm:items-start">
                            {categories.map((c) => (
                                <li key={c.id}>
                                    <Link
                                        href={getLocalizedPath(c.href, lang)}
                                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center gap-2.5 group"
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 group-hover:scale-110 transition-transform">
                                            {categoryIcons[c.id]}
                                        </div>
                                        <span className="group-hover:translate-x-1 transition-transform font-medium">{c.name[lang]}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
                            {t('footer.quickLinks', lang)}
                        </h3>
                        <ul className="space-y-3 flex flex-col items-center sm:items-start">
                            {[
                                { href: '/pricing', label: t('nav.pricing', lang) },
                                { href: '/client', label: t('nav.track', lang) },
                                { href: '/faq', label: t('nav.faq', lang) },
                                { href: '/terms', label: lang === 'zh' ? '服务条款' : 'Terms & Policy' },
                                { href: '/account', label: lang === 'zh' ? '个人中心' : 'My Account' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={getLocalizedPath(link.href, lang)}
                                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm group flex items-center gap-1"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 rounded-full transition-all duration-200" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">
                            {t('footer.support', lang)}
                        </h3>
                        <ul className="space-y-3.5 flex flex-col items-center sm:items-start">
                            <li>
                                <a
                                    href={process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL || 'https://t.me/cnwepro'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors group"
                                >
                                    <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/20 text-sky-500 group-hover:scale-110 transition-transform">
                                        <Send className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="break-words">Channel</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}` : 'https://t.me/Minsheng0'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors group"
                                >
                                    <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/20 text-sky-500 group-hover:scale-110 transition-transform">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="break-words">@{process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'Minsheng0'}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@cnwepro.com'}`}
                                    className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors group"
                                >
                                    <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 group-hover:scale-110 transition-transform">
                                        <Send className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="break-all text-xs">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@cnwepro.com'}</span>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                    </div>
                                    <span>{t('contact.hours', lang)}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Mobile Extra Support (Phone/Email) — Enhanced UX */}
                <div className="md:hidden mt-8 p-6 rounded-3xl bg-white/50 dark:bg-white/[0.03] border border-white/20 dark:border-white/5 backdrop-blur-sm">
                    <p className="text-center text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">
                        {lang === 'zh' ? '快速联系' : 'QUICK CONTACT'}
                    </p>
                    <div className="flex flex-col gap-3">
                        <a
                            href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}` : 'https://t.me/Minsheng0'}
                            className="flex items-center justify-center gap-3 bg-[#24A1DE] text-white py-4 rounded-2xl font-black shadow-lg shadow-sky-500/20 active:scale-95 transition-transform"
                        >
                            <Send className="w-5 h-5" />
                            {lang === 'zh' ? 'Telegram 咨询' : 'Telegram Support'}
                        </a>
                        <a
                            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@cnwepro.com'}`}
                            className="flex items-center justify-center gap-3 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-4 rounded-2xl font-black active:scale-95 transition-transform"
                        >
                            {lang === 'zh' ? '邮件联系' : 'Email Us'}
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 md:mt-14 pt-6 border-t border-slate-200/60 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 dark:text-slate-500 text-xs">
                        {t('footer.copyright', lang).replace('2025', currentYear.toString())}
                    </p>
                    <p className="text-slate-400 dark:text-slate-600 text-[10px] max-w-md text-center sm:text-right leading-relaxed">
                        {t('footer.disclaimer', lang)}
                    </p>
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-100/50 dark:from-black/20 to-transparent pointer-events-none" />
        </footer>
    );
}
