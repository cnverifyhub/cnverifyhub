'use client';

import { useEffect, useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Send, List } from 'lucide-react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';

export function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 origin-left z-[110]"
            style={{ scaleX: scrollYProgress }}
        />
    );
}

export function ScrollProgressBar() {
    const { scrollYProgress } = useScroll();
    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100 dark:bg-dark-800">
            <motion.div 
                className="h-full bg-red-500"
                style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
            />
        </div>
    );
}

export function ShareButtons({ title, url, lang }: { title: string, url: string, lang: 'zh' | 'en' }) {
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-500 mr-2">{lang === 'zh' ? '分享至：' : 'Share:'}</span>
            <button onClick={copyLink} className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors relative group">
                <LinkIcon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <AnimatePresence>
                    {copied && (
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap"
                        >
                            {lang === 'zh' ? '已复制' : 'Copied'}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-[#1DA1F2]/10 dark:bg-white/5 dark:hover:bg-[#1DA1F2]/20 rounded-full transition-colors text-slate-600 dark:text-slate-300 hover:text-[#1DA1F2]">
                <Twitter className="w-4 h-4" />
            </a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" className="p-2.5 bg-slate-100 hover:bg-[#0088cc]/10 dark:bg-white/5 dark:hover:bg-[#0088cc]/20 rounded-full transition-colors text-slate-600 dark:text-slate-300 hover:text-[#0088cc]">
                <Send className="w-4 h-4" />
            </a>
        </div>
    );
}

export function TableOfContents({ lang }: { lang: 'zh' | 'en' }) {
    const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
        
        elements.forEach((el, index) => {
            if (!el.id) {
                const id = el.textContent?.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\u4e00-\u9fa5-]/g, '') || `h-${index}`;
                el.id = id;
            }
        });

        const headingData = elements.map((el) => ({
            id: el.id,
            text: el.textContent || '',
            level: el.tagName.toLowerCase() === 'h2' ? 2 : 3
        }));

        setHeadings(headingData);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0% -70% 0%', threshold: [0, 0.5, 1] }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            window.history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <div className="sticky top-28 bg-white dark:bg-dark-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                <List className="w-4 h-4 text-red-500" />
                {lang === 'zh' ? '目录导航' : 'Contents'}
            </h3>
            <nav className="relative">
                {/* Active Indicator Line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                
                <ul className="space-y-4 relative">
                    {headings.map((h, i) => (
                        <li key={i} className={`${h.level === 3 ? 'pl-4' : 'pl-0'}`}>
                            <a
                                href={`#${h.id}`}
                                onClick={(e) => scrollTo(e, h.id)}
                                className={`text-xs md:text-sm transition-all block border-l-2 -ml-px pl-4 ${
                                    activeId === h.id 
                                        ? 'text-red-500 border-red-500 font-bold bg-red-500/5 py-1 rounded-r-md' 
                                        : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                                }`}
                            >
                                {h.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export function CopyHeadingLink({ id }: { id: string }) {
    const [copied, setCopied] = useState(false);

    const copy = (e: React.MouseEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.hash = id;
        navigator.clipboard.writeText(url.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={copy}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-md inline-flex items-center align-middle"
            title="Copy link to this section"
        >
            {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <LinkIcon className="w-3 h-3 text-slate-400" />}
        </button>
    );
}

import { CheckCircle2 } from 'lucide-react';

