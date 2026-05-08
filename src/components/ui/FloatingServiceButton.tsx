'use client';

import React from 'react';
import { MessageCircle, X, Headphones, Send } from 'lucide-react';

export function FloatingServiceButton() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
            {/* Expanded Menu */}
            {isOpen && (
                <div className="flex flex-col gap-3 mb-2 animate-fade-in-up">
                    <a
                        href="https://t.me/CNVerifyHub"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800 p-2 pr-4 rounded-full shadow-lg hover:-translate-x-2 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-md group-hover:bg-sky-400">
                            <Send className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">加入 TG 频道</span>
                    </a>
                    
                    <a
                        href="mailto:cnverifyhub@gmail.com"
                        className="flex items-center gap-3 bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800 p-2 pr-4 rounded-full shadow-lg hover:-translate-x-2 transition-all duration-300 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#e4393c] flex items-center justify-center text-white shadow-md group-hover:bg-red-500">
                            <Headphones className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">联系在线客服</span>
                    </a>
                </div>
            )}

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-500 transform ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-tr from-[#e4393c] to-[#ff0036] hover:scale-110 active:scale-95'}`}
            >
                {isOpen ? (
                    <X className="w-7 h-7" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-7 h-7 fill-current" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffd700] rounded-full border-2 border-[#e4393c] animate-ping"></span>
                    </div>
                )}
            </button>
            
            {/* Tooltip text (when closed) */}
            {!isOpen && (
                <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest hidden md:block">
                    客服咨询
                </div>
            )}
        </div>
    );
}
