'use client';

import { t, type Lang } from '@/lib/i18n';
import { Send, MessageCircle, Mail } from 'lucide-react';
import { useState } from 'react';

export function ContactForm({ lang }: { lang: Lang }) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="text-center py-16 animate-fade-in">
                <div className="w-20 h-20 bg-success-50 text-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {t('contact.success', lang)}
                </h3>
                <button onClick={() => setStatus('idle')} className="btn-outline">
                    {lang === 'zh' ? '发送新消息' : 'Send New Message'}
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto py-12 md:py-24 px-4 sm:px-6">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        {t('contact.title', lang)}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        {t('contact.subtitle', lang)}
                    </p>
                </div>

                <div className="space-y-4">
                    <a href="#" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group">
                        <div className="w-12 h-12 bg-sky-50 dark:bg-sky-500/10 text-sky-500 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Telegram</h3>
                            <p className="text-sm text-slate-500">@CNVerifyHub_Support (24/7)</p>
                        </div>
                    </a>

                    <a href="mailto:cnverifyhub@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Email</h3>
                            <p className="text-sm text-slate-500">cnverifyhub@gmail.com</p>
                        </div>
                    </a>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.name', lang)}</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.method', lang)}</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500 outline-none">
                                <option value="telegram">Telegram</option>
                                <option value="email">Email</option>
                                <option value="wechat">WeChat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.id', lang)}</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.type', lang)}</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500 outline-none">
                            <option value="purchase">{t('contact.type.purchase', lang)}</option>
                            <option value="support">{t('contact.type.support', lang)}</option>
                            <option value="wholesale">{t('contact.type.wholesale', lang)}</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('contact.message', lang)}</label>
                        <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
                    </div>

                    <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center py-4">
                        <Send className="w-5 h-5 mr-2" />
                        {status === 'submitting' ? t('common.loading', lang) : t('contact.submit', lang)}
                    </button>
                </form>
            </div>
        </div>
    );
}
