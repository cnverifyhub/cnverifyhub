'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog';
import { Calendar, ChevronRight, Search, ChevronLeft, Tag } from 'lucide-react';

interface BlogIndexClientProps {
    posts: BlogPost[];
    lang: 'zh' | 'en';
}

const POSTS_PER_PAGE = 9;

export default function BlogIndexClient({ posts, lang }: BlogIndexClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const blogBase = lang === 'en' ? '/en/blog' : '/blog';

    // Get unique categories
    const categories = useMemo(() => {
        const cats = new Set(posts.map(p => p.category));
        return ['all', ...Array.from(cats)];
    }, [posts]);

    // Format category names
    const getCategoryName = (cat: string) => {
        if (cat === 'all') return lang === 'zh' ? '全部' : 'All';
        const map: Record<string, string> = {
            'security': lang === 'zh' ? '安全指南' : 'Security',
            'tutorial': lang === 'zh' ? '教程指南' : 'Tutorials',
            'marketing': lang === 'zh' ? '营销技巧' : 'Marketing',
            'news': lang === 'zh' ? '最新动态' : 'News'
        };
        return map[cat] || cat;
    };

    // Filter posts
    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory !== 'all' ? post.category === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [posts, searchQuery, selectedCategory, lang]);

    // Reset page when filters change
    useMemo(() => { setCurrentPage(1); }, [searchQuery, selectedCategory]);

    const featuredPost = searchQuery === '' && selectedCategory === 'all' && currentPage === 1 ? filteredPosts[0] : null;
    const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

    const displayPosts = regularPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);

    return (
        <main className="pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {lang === 'zh' ? '账号安全与运营学院' : 'Account Security & Operations'}
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        {lang === 'zh'
                            ? '专业的指南，助您安全运营中国社交媒体账号'
                            : 'Expert guides for buying, using, and protecting Chinese social media accounts.'}
                    </p>
                </div>

                {/* Search Bar & Categories */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="relative group mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === cat 
                                        ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                                        : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500/50'
                                }`}
                            >
                                {getCategoryName(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Post Hero */}
                {featuredPost && (
                    <Link
                        href={`${blogBase}/${featuredPost.slug}`}
                        className="group relative block w-full mb-16 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c1c1e] shadow-2xl hover:shadow-[#FF0036]/20 transition-all duration-500"
                    >
                        {/* Background Texture Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url(/images/patterns/natural-paper.png)' }} />
                        
                        <div className="flex flex-col lg:flex-row min-h-[450px] relative z-10">
                            <div className="w-full lg:w-[60%] relative min-h-[300px] overflow-hidden">
                                {featuredPost.featuredImage ? (
                                    <Image 
                                        src={featuredPost.featuredImage} 
                                        alt={featuredPost.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                                        <Tag className="w-24 h-24 text-white/20" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest shadow-xl">
                                        {lang === 'zh' ? '精选文章' : 'Featured Post'}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">
                                    <span className="text-red-500">{getCategoryName(featuredPost.category)}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {featuredPost.publishDate}
                                    </div>
                                </div>
                                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-[#FF0036] transition-colors leading-[1.1] tracking-tighter">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-base font-black text-[#FF0036] gap-2 group-hover:translate-x-2 transition-transform bg-[#FF0036]/5 px-4 py-2 rounded-xl">
                                        {lang === 'zh' ? '立即抢购' : 'READ NOW'}
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-bold bg-white/50 dark:bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                        {featuredPost.readingTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Blog Grid Header */}
                {featuredPost && (
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{lang === 'zh' ? '更多阅读' : 'More Posts'}</h3>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>
                )}

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`${blogBase}/${post.slug}`}
                            className="group flex flex-col bg-white dark:bg-[#1c1c1e] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5 hover:shadow-2xl hover:shadow-[#FF0036]/10 hover:-translate-y-2 transition-all duration-500 relative"
                        >
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url(/images/patterns/gplay.png)' }} />
                            <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                                {post.featuredImage ? (
                                    <Image 
                                        src={post.featuredImage} 
                                        alt={post.title} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/20 flex items-center justify-center">
                                        <Tag className="w-12 h-12 text-red-500/20" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-dark-900/90 text-[10px] font-bold text-red-600 uppercase tracking-widest backdrop-blur-sm border border-slate-100 dark:border-slate-800 shadow-sm">
                                        {getCategoryName(post.category)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {post.publishDate}
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-[#FF0036] transition-colors line-clamp-2 leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center text-sm font-bold text-red-500 gap-1 group-hover:translate-x-1 transition-transform">
                                        {lang === 'zh' ? '阅读更多' : 'Read More'}
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium bg-slate-50 dark:bg-dark-800 px-2 py-1 rounded-md">
                                        {post.readingTime}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        {lang === 'zh' ? '未找到相关文章' : 'No articles found'}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                    currentPage === i + 1
                                        ? 'bg-red-500 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Subscription Section */}
                <div className="mt-24 relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-black p-8 md:p-16 text-center border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 blur-[100px] -z-10" />
                    
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                            {lang === 'zh' ? '获取最新的安全指南' : 'Get Latest Security Guides'}
                        </h3>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            {lang === 'zh' 
                                ? '加入 5,000+ 订阅者，每周获取中国主流社交平台运营技巧与安全更新。' 
                                : 'Join 5,000+ subscribers and get weekly tips on Chinese social media operations.'}
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder={lang === 'zh' ? '您的邮箱地址' : 'Your email address'} 
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                                required
                            />
                            <button className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
                                {lang === 'zh' ? '立即订阅' : 'Subscribe'}
                            </button>
                        </form>
                        <p className="mt-4 text-[10px] text-slate-500 font-medium">
                            {lang === 'zh' ? '您的数据受到保护。您可以随时取消订阅。' : 'Your data is protected. Unsubscribe at any time.'}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
