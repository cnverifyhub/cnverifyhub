'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/blog';
import { Calendar, ChevronRight, Search, ChevronLeft, Tag, Clock, ArrowRight } from 'lucide-react';

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

    const categories = useMemo(() => {
        const cats = new Set(posts.map(p => p.category));
        return ['all', ...Array.from(cats)];
    }, [posts]);

    const getCategoryName = (cat: string) => {
        if (cat === 'all') return lang === 'zh' ? '全部' : 'All';
        const map: Record<string, string> = {
            'security':  lang === 'zh' ? '安全指南' : 'Security',
            'tutorial':  lang === 'zh' ? '教程指南' : 'Tutorials',
            'marketing': lang === 'zh' ? '营销技巧' : 'Marketing',
            'news':      lang === 'zh' ? '最新动态' : 'News',
        };
        return map[cat] || cat;
    };

    const filteredPosts = useMemo(() => posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory !== 'all' ? post.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    }), [posts, searchQuery, selectedCategory]);

    useMemo(() => { setCurrentPage(1); }, [searchQuery, selectedCategory]);

    const featuredPost = searchQuery === '' && selectedCategory === 'all' && currentPage === 1 ? filteredPosts[0] : null;
    const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;
    const displayPosts = regularPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
    const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);

    return (
        <main className="min-h-screen bg-[#060B18] pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Page header ─────────────────────── */}
                <div className="mb-12 max-w-3xl">
                    <span className="terminal-label mb-3 block"># {lang === 'zh' ? '知识库' : 'KNOWLEDGE BASE'}</span>
                    <h1 className="heading-syne text-4xl md:text-5xl text-white mb-4">
                        {lang === 'zh' ? (
                            <>账号安全与<br /><span className="text-gradient-cyan">运营学院</span></>
                        ) : (
                            <>Security &<br /><span className="text-gradient-cyan">Operations Hub</span></>
                        )}
                    </h1>
                    <p className="text-sm text-[#7B91B0] max-w-xl leading-relaxed">
                        {lang === 'zh'
                            ? '专业的安全操作指南，助您安全运营中国社交媒体账号'
                            : 'Expert guides for buying, using, and protecting Chinese social media accounts.'}
                    </p>
                </div>

                {/* ── Search + filters ────────────────── */}
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7B91B0]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
                            className="w-full pl-9 pr-4 py-2.5 rounded text-sm bg-[#0D1526] border border-[#1E2D45] text-[#F0F4FF] placeholder-[#7B91B0] focus:outline-none focus:border-[#00E5FF]/40 transition-colors font-dm"
                        />
                    </div>
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40'
                                        : 'text-[#7B91B0] border border-[#1E2D45] hover:border-[#00E5FF]/25 hover:text-[#F0F4FF]'
                                }`}
                            >
                                {getCategoryName(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Featured post — editorial hero ──── */}
                {featuredPost && (
                    <Link
                        href={`${blogBase}/${featuredPost.slug}`}
                        className="group relative block mb-16 border border-[#1E2D45] hover:border-[#00E5FF]/35 bg-[#0D1526] overflow-hidden transition-all duration-400"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[420px]">
                            {/* Image */}
                            <div className="w-full lg:w-[55%] relative min-h-[280px] overflow-hidden">
                                {featuredPost.featuredImage ? (
                                    <Image
                                        src={featuredPost.featuredImage}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover group-hover:scale-103 transition-transform duration-700"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF2D55]/20 to-[#142035]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D1526] lg:block hidden" />
                                {/* Featured badge */}
                                <div className="absolute top-5 left-5">
                                    <span className="terminal-label px-3 py-1.5 rounded border border-[#FF2D55]/40 bg-[#FF2D55]/10 text-[#FF2D55]">
                                        {lang === 'zh' ? '精选文章' : 'FEATURED'}
                                    </span>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="w-full lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center relative z-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest">
                                        {getCategoryName(featuredPost.category)}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-[#1E2D45]" />
                                    <span className="flex items-center gap-1.5 text-[10px] text-[#7B91B0]">
                                        <Calendar className="w-3 h-3" />{featuredPost.publishDate}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-[#7B91B0]">
                                        <Clock className="w-3 h-3" />{featuredPost.readingTime}
                                    </span>
                                </div>
                                <h2 className="heading-syne text-2xl lg:text-3xl text-white mb-4 group-hover:text-[#00E5FF] transition-colors leading-tight">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-sm text-[#7B91B0] leading-relaxed mb-8 line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-[#00E5FF] group-hover:gap-3 transition-all">
                                    {lang === 'zh' ? '阅读全文' : 'Read Article'}
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* ── Grid header ─────────────────────── */}
                {featuredPost && (
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="terminal-label">{lang === 'zh' ? '更多文章' : 'MORE POSTS'}</h3>
                        <div className="h-px flex-1 bg-[#1E2D45]" />
                    </div>
                )}

                {/* ── Blog card grid ───────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {displayPosts.map((post, i) => (
                        <Link
                            key={post.slug}
                            href={`${blogBase}/${post.slug}`}
                            className="group flex flex-col border border-[#1E2D45] hover:border-[#00E5FF]/35 bg-[#0D1526] overflow-hidden transition-all duration-250 hover:-translate-y-1"
                        >
                            {/* Left accent stripe */}
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00E5FF]/40 group-hover:bg-[#00E5FF] transition-all z-10"
                                    style={{ boxShadow: '0 0 8px rgba(0,229,255,0.3)' }}
                                />
                                {/* Thumbnail */}
                                <div className="aspect-[16/9] bg-[#142035] relative overflow-hidden">
                                    {post.featuredImage ? (
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-103 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Tag className="w-8 h-8 text-[#1E2D45]" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-5">
                                        <span className="text-[9px] font-bold text-[#00E5FF] bg-[#060B18]/80 border border-[#00E5FF]/25 px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-wider">
                                            {getCategoryName(post.category)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Card content */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-3 text-[9px] text-[#7B91B0] mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishDate}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime}</span>
                                </div>
                                <h2 className="text-sm font-semibold text-[#F0F4FF] mb-2.5 group-hover:text-[#00E5FF] transition-colors line-clamp-2 leading-snug">
                                    {post.title}
                                </h2>
                                <p className="text-xs text-[#7B91B0] line-clamp-2 mb-4 leading-relaxed flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center text-xs font-bold text-[#7B91B0] group-hover:text-[#00E5FF] transition-colors gap-1 mt-auto">
                                    {lang === 'zh' ? '阅读更多' : 'Read More'}
                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-20 border border-[#1E2D45] rounded">
                        <Tag className="w-8 h-8 text-[#1E2D45] mx-auto mb-3" />
                        <p className="text-sm text-[#7B91B0]">{lang === 'zh' ? '未找到相关文章' : 'No articles found'}</p>
                    </div>
                )}

                {/* ── Pagination ───────────────────────── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mb-16">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-[#1E2D45] text-[#7B91B0] disabled:opacity-30 hover:border-[#00E5FF]/30 hover:text-white transition-colors rounded"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-9 h-9 text-xs font-mono font-bold rounded transition-all ${
                                    currentPage === i + 1
                                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40'
                                        : 'text-[#7B91B0] border border-[#1E2D45] hover:border-[#00E5FF]/25'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-[#1E2D45] text-[#7B91B0] disabled:opacity-30 hover:border-[#00E5FF]/30 hover:text-white transition-colors rounded"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* ── Newsletter CTA ──────────────────── */}
                <div className="relative border border-[#1E2D45] bg-[#0D1526] p-8 md:p-12 overflow-hidden">
                    {/* Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF2D55]/5 blur-[80px] pointer-events-none" />
                    {/* Left accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00E5FF]" style={{ boxShadow: '0 0 12px rgba(0,229,255,0.5)' }} />
                    <div className="relative z-10 max-w-xl">
                        <span className="terminal-label mb-3 block"># {lang === 'zh' ? '订阅更新' : 'SUBSCRIBE'}</span>
                        <h3 className="heading-syne text-2xl md:text-3xl text-white mb-3">
                            {lang === 'zh' ? '获取最新安全指南' : 'Get Latest Security Guides'}
                        </h3>
                        <p className="text-sm text-[#7B91B0] mb-6 leading-relaxed">
                            {lang === 'zh'
                                ? '加入 5,000+ 订阅者，每周获取中国主流社交平台运营技巧与安全更新。'
                                : 'Join 5,000+ subscribers for weekly tips on Chinese social media operations.'}
                        </p>
                        <form className="flex gap-3 max-w-md" onSubmit={e => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder={lang === 'zh' ? '您的邮箱地址' : 'Your email address'}
                                className="flex-1 px-4 py-2.5 rounded text-sm bg-[#060B18] border border-[#1E2D45] text-[#F0F4FF] placeholder-[#7B91B0] focus:outline-none focus:border-[#00E5FF]/40 transition-colors"
                                required
                            />
                            <button className="cyber-btn-ghost px-6 py-2.5 rounded text-xs whitespace-nowrap" type="submit">
                                {lang === 'zh' ? '订阅' : 'Subscribe'}
                            </button>
                        </form>
                        <p className="mt-3 text-[10px] text-[#7B91B0]/60 font-mono">
                            {lang === 'zh' ? '数据受到保护 · 随时可取消' : 'Data protected · Unsubscribe anytime'}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
