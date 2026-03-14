'use client';

import { posts } from '@/data/posts';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Tag, ChevronLeft, Share2, ShieldCheck, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/i18n';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = posts.find(p => p.slug === params.slug);
    const lang = 'zh';

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            <Header />

            <main className="pt-24 pb-20">
                <article className="section-container max-w-4xl">
                    {/* Breadcrumbs */}
                    <Link 
                        href={getLocalizedPath('/blog', lang)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-500 mb-8 transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        返回学院列表
                    </Link>

                    {/* Post Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-[11px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest border border-primary-200 dark:border-primary-800">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.date}
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.15] tracking-tight">
                            {post.title[lang]}
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {post.excerpt[lang]}
                        </p>
                    </div>

                    {/* Featured Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-dark-800 dark:to-dark-900 rounded-[2.5rem] mb-12 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
                        <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
                        <ShieldCheck className="w-32 h-32 text-primary-500/10" />
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white font-bold text-sm drop-shadow-md">CNWePro Academy Certified</span>
                             </div>
                             <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <Bookmark className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                             </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-500 dark:prose-a:text-primary-400 prose-img:rounded-3xl">
                        <div dangerouslySetInnerHTML={{ __html: post.content[lang].replace(/\n/g, '<br/>') }} />
                    </div>

                    {/* Footer / CTA */}
                    <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
                        <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden group shadow-2xl shadow-primary-500/30">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-4">准备好开启您的运营之旅了吗？</h2>
                                <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                                    选择 CNWePro 专业级账号，从高权重、老字号开始。
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/" className="px-8 py-4 bg-white text-primary-600 font-extrabold rounded-2xl hover:scale-105 transition-transform shadow-xl">
                                        立即选购账号
                                    </Link>
                                    <Link href="/contact" className="px-8 py-4 bg-primary-700/50 backdrop-blur-md text-white border border-primary-400/30 font-extrabold rounded-2xl hover:bg-primary-700/70 transition-all">
                                        咨询专业客服
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
