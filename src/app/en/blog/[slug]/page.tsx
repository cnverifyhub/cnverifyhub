import type { Metadata } from 'next';
import { posts } from '@/data/posts';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft, ShieldCheck, Bookmark, Share2, Tag } from 'lucide-react';
import Link from 'next/link';

// --- SSG: Pre-render every English blog post at build time ---
export async function generateStaticParams() {
    return posts.map((post) => ({ slug: post.slug }));
}

// --- Dynamic metadata per post (English) ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return { title: 'Post Not Found | CNWePro' };

    const siteUrl = 'https://cnwepro.com';
    const postUrl = `${siteUrl}/en/blog/${post.slug}/`;

    return {
        title: `${post.title.en} | CNWePro`,
        description: post.excerpt.en.slice(0, 160),
        alternates: {
            canonical: postUrl,
            languages: {
                'en': postUrl,
                'zh-CN': `${siteUrl}/blog/${post.slug}/`,
            },
        },
        openGraph: {
            title: post.title.en,
            description: post.excerpt.en.slice(0, 160),
            url: postUrl,
            type: 'article',
            publishedTime: post.date,
            authors: ['CNWePro'],
        },
    };
}

import Image from 'next/image';
import { ReadingProgress, ShareButtons, TableOfContents } from '@/components/blog/BlogClientFeatures';

export default function EnBlogPostPage({ params }: { params: { slug: string } }) {
    const post = posts.find((p) => p.slug === params.slug);
    const lang = 'en';

    if (!post) notFound();

    const siteUrl = 'https://cnwepro.com';
    const postUrl = `${siteUrl}/en/blog/${post.slug}/`;

    // Related Posts
    const relatedPosts = posts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);

    // JSON-LD: Article Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title.en,
        description: post.excerpt.en,
        image: post.image ? `${siteUrl}${post.image}` : `${siteUrl}/logo.png`,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: 'CNWePro Team', url: siteUrl },
        publisher: {
            '@type': 'Organization',
            name: 'CNWePro',
            url: siteUrl,
            logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
        inLanguage: 'en',
    };

    // JSON-LD: Breadcrumb
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/en/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/en/blog/` },
            { '@type': 'ListItem', position: 3, name: post.title.en, item: postUrl },
        ],
    };

    return (
        <>
            <ReadingProgress />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <main className="pt-24 pb-20">
                <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="max-w-4xl mx-auto mb-10">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500 mb-8">
                            <Link href="/en" className="hover:text-red-500 transition-colors">Home</Link>
                            <ChevronLeft className="w-3 h-3 rotate-180" />
                            <Link href="/en/blog" className="hover:text-red-500 transition-colors">Blog</Link>
                            <ChevronLeft className="w-3 h-3 rotate-180" />
                            <span className="text-slate-400">{post.category}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-500/10 text-[11px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest border border-red-100 dark:border-red-500/20">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                {post.date}
                            </div>
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.2] tracking-tight">
                            {post.title.en}
                        </h1>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-md shadow-red-500/20">
                                    CW
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-900 dark:text-white">CNWePro Team</div>
                                    <div className="text-xs text-slate-500">{Math.ceil(post.content.en.length / 500)} min read</div>
                                </div>
                            </div>
                            <ShareButtons title={post.title.en} url={postUrl} lang={lang} />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="max-w-5xl mx-auto aspect-[21/9] bg-slate-100 dark:bg-dark-800 rounded-3xl mb-12 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                        {post.image ? (
                            <Image src={post.image} alt={post.title.en} fill className="object-cover" priority />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-red-500/5" />
                                <ShieldCheck className="w-24 h-24 text-red-500/20" />
                            </>
                        )}
                    </div>

                    {/* Content & Sidebar Grid */}
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                        
                        <div className="prose prose-slate dark:prose-invert prose-red max-w-none prose-headings:font-black prose-headings:tracking-tight prose-img:rounded-2xl lg:prose-xl">
                            <p className="lead text-xl text-slate-500 dark:text-slate-400 font-medium mb-10 border-l-4 border-red-500 pl-6 py-2">
                                {post.excerpt.en}
                            </p>
                            <div dangerouslySetInnerHTML={{ __html: post.content.en }} />
                        </div>
                        
                        <aside className="hidden lg:block">
                            <TableOfContents lang={lang} />
                            
                            <div className="mt-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white text-center shadow-lg shadow-red-500/20">
                                <h4 className="font-black text-lg mb-2">Need Premium Accounts?</h4>
                                <p className="text-white/80 text-sm mb-6">Lowest prices, instant automated delivery</p>
                                <Link href="/en" className="block w-full bg-white text-red-600 font-bold py-3 rounded-xl hover:scale-105 transition-transform">
                                    Browse Shop
                                </Link>
                            </div>
                        </aside>

                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="max-w-6xl mx-auto mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                                <Tag className="w-6 h-6 text-red-500" />
                                Related Posts
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map(rp => (
                                    <Link key={rp.slug} href={`/en/blog/${rp.slug}`} className="group block bg-slate-50 dark:bg-dark-800 rounded-2xl p-5 hover:bg-white dark:hover:bg-dark-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-xl">
                                        <div className="text-xs text-red-500 font-bold mb-2">{rp.category}</div>
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors line-clamp-2">{rp.title.en}</h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>
        </>
    );
}
