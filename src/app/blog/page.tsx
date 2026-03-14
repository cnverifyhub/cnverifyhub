'use client';

import { useState } from 'react';
import Link from 'next/link';
import { posts } from '@/data/posts';
import { t, getLocalizedPath } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Tag, ChevronRight, Search } from 'lucide-react';

export default function BlogListingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const lang = 'zh'; // Default to zh, logic can be added for auto-detect

    const filteredPosts = posts.filter(post => 
        post.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt[lang].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            <Header />

            <main className="pt-24 pb-20">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                            {lang === 'zh' ? '账号安全与运营学院' : 'Account Security & Academy'}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            {lang === 'zh' ? '专业的指南，助您安全运营中国社交媒体账号' : 'Professional guides for operating Chinese social accounts safely.'}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-16 px-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <Link 
                                key={post.slug} 
                                href={getLocalizedPath(`/blog/${post.slug}`, lang)}
                                className="group bg-white dark:bg-dark-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                     {/* Image placeholder for now */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-orange-500/20 flex items-center justify-center">
                                        <Tag className="w-12 h-12 text-primary-500/20" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-dark-900/90 text-[10px] font-bold text-primary-600 uppercase tracking-widest backdrop-blur-sm border border-slate-100 dark:border-slate-800">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {post.date}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors line-clamp-2">
                                        {post.title[lang]}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                                        {post.excerpt[lang]}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-primary-500 gap-1">
                                        {lang === 'zh' ? '阅读更多' : 'Read More'}
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
