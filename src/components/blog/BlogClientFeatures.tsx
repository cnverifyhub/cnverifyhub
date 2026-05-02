'use client';

import { useEffect, useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Send, List } from 'lucide-react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';

export function ReadingProgress() {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 origin-left z-[100]"
            style={{ scaleX: scrollYProgress }}
        />
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
        
        // Add IDs to headings if they don't have them
        elements.forEach((el, index) => {
            if (!el.id) {
                el.id = `heading-${index}`;
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
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0% -60% 0%' }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-28 bg-slate-50 dark:bg-dark-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/50">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                <List className="w-4 h-4 text-red-500" />
                {lang === 'zh' ? '目录导航' : 'On this page'}
            </h3>
            <ul className="space-y-3">
                {headings.map((h, i) => (
                    <li key={i} className={`${h.level === 3 ? 'ml-4' : ''}`}>
                        <a
                            href={`#${h.id}`}
                            className={`text-sm transition-colors block line-clamp-2 ${
                                activeId === h.id 
                                    ? 'text-red-500 font-bold' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
