'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, MessageCircle, Send, Wallet } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import Image from 'next/image';

export default function Footer() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-50 dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800 pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8">

                    {/* Brand & Intro */}
                    <div className="space-y-6">
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2">
                            <Image src="/logo.png" alt="CNWePro Logo" width={32} height={32} className="w-8 h-8 object-contain drop-shadow-sm" />
                            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                                CNWePro
                            </span>
                        </Link>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {t('site.description', lang)}
                        </p>
                        <div className="flex items-center gap-4 text-slate-400">
                            {/* Payment Methods */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <Wallet className="w-4 h-4" />
                                USDT TRC20
                            </div>
                        </div>
                    </div>

                    {/* Accounts */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">
                            {t('footer.accounts', lang)}
                        </h3>
                        <ul className="space-y-4">
                            {categories.map((c) => (
                                <li key={c.id}>
                                    <Link
                                        href={getLocalizedPath(c.href, lang)}
                                        className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm flex items-center gap-2"
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full bg-current ${c.color}`}></span>
                                        {c.name[lang]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">
                            {t('footer.quickLinks', lang)}
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href={getLocalizedPath('/pricing', lang)} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                                    {t('nav.pricing', lang)}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedPath('/client', lang)} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                                    {t('nav.track', lang)}
                                </Link>
                            </li>
                            <li>
                                <Link href={getLocalizedPath('/faq', lang)} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                                    {t('nav.faq', lang)}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-6">
                            {t('footer.support', lang)}
                        </h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@cnwepro.com'}`}
                                    className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <Send className="w-5 h-5 text-primary-500" />
                                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@cnwepro.com'}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL || 'https://t.me/cnwepro'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors"
                                >
                                    <Send className="w-5 h-5 text-sky-500" />
                                    Channel (t.me/cnwepro)
                                </a>
                            </li>
                            <li>
                                <a
                                    href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}` : 'https://t.me/Minsheng0'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5 text-sky-500" />
                                    Telegram (@{process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'Minsheng0'})
                                </a>
                            </li>
                            <li>
                                <Link
                                    href={getLocalizedPath('/contact', lang)}
                                    className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                                    {t('nav.contact', lang)}
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                    <ShieldCheck className="w-5 h-5 text-primary-500" />
                                    <span>{t('contact.hours', lang)}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {t('footer.copyright', lang).replace('2025', currentYear.toString())}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xl text-center md:text-right">
                        {t('footer.disclaimer', lang)}
                    </p>
                </div>
            </div>
        </footer>
    );
}
