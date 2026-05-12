'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

interface ContactFloatProps {
    lang: Lang;
}

export function ContactFloat({ lang }: ContactFloatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [teaseMessage, setTeaseMessage] = useState<string | null>(null);

    const zhTeases = [
        '金牌客服正在输入...',
        '需要帮忙推荐账号吗？',
        '最新折扣码已发放！',
        '遇到了支付问题？'
    ];
    const enTeases = [
        'Support Manager is typing...',
        'Need help choosing?',
        'New discount codes available!',
        'Any questions on payment?'
    ];

    // Show after scrolling down a bit
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);

        // Teaser logic
        const initialTimer = setTimeout(() => {
            if (!isOpen) {
                setTeaseMessage(lang === 'zh' ? zhTeases[0] : enTeases[0]);
                setTimeout(() => setTeaseMessage(null), 5000); // Hide after 5s
            }
        }, 5000); // First tease after 5s

        const teaseInterval = setInterval(() => {
            if (!isOpen && Math.random() > 0.4) {
                const arr = lang === 'zh' ? zhTeases : enTeases;
                setTeaseMessage(arr[Math.floor(Math.random() * arr.length)]);
                setTimeout(() => setTeaseMessage(null), 5000);
            }
        }, 15000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(initialTimer);
            clearInterval(teaseInterval);
        };
    }, [isOpen, lang]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 flex flex-col items-end animate-fade-in-up">

            {/* Typing Teaser Bubble */}
            {!isOpen && teaseMessage && (
                <div className="absolute bottom-16 right-2 bg-white dark:bg-dark-800 text-slate-800 dark:text-slate-200 text-xs font-medium px-4 py-2.5 rounded-2xl rounded-br-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 w-max mb-2 animate-bounce-slow flex items-center gap-2 pointer-events-none transform origin-bottom-right">
                    <div className="flex gap-0.5 pointer-events-none">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    {teaseMessage}
                </div>
            )}

            {/* Popover Menu */}
            <div
                className={`mb-4 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="glass-card p-4 rounded-2xl shadow-glass flex flex-col gap-3 w-56">
                    <a
                        href={process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL || 'https://t.me/CNVerifyHub'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-500/10 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
                    >
                        <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
                            <Send className="w-4 h-4 ml-0.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm">Telegram Channel</span>
                            <span className="text-xs text-slate-500">Updates & News</span>
                        </div>
                    </a>
                    <a
                        href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}` : 'https://t.me/cnverifyhub'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-500/10 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
                    >
                        <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center text-sky-500 shrink-0">
                            <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm">Telegram Support</span>
                            <span className="text-xs text-slate-500">24/7 Live Help</span>
                        </div>
                    </a>
                    <a
                        href="mailto:cnverifyhub@gmail.com"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                            <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm">{lang === 'zh' ? '在线留言' : 'Email Us'}</span>
                            <span className="text-xs text-slate-500">cnverifyhub@gmail.com</span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none z-50 group relative"
                aria-label="Contact Support"
            >
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s' }}></div>
                {isOpen ? (
                    <X className="w-6 h-6 animate-scale-in" />
                ) : (
                    <MessageCircle className="w-6 h-6 animate-scale-in group-hover:scale-110 transition-transform" />
                )}
            </button>
        </div>
    );
}
