import type { Metadata } from 'next';
import { posts } from '@/data/posts';
import { notFound } from 'next/navigation';
import { Calendar, ChevronLeft, ShieldCheck, Bookmark, Share2 } from 'lucide-react';
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

export default function EnBlogPostPage({ params }: { params: { slug: string } }) {
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) notFound();

    const siteUrl = 'https://cnwepro.com';
    const postUrl = `${siteUrl}/en/blog/${post.slug}/`;

    // JSON-LD: Article Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title.en,
        description: post.excerpt.en,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Organization', name: 'CNWePro', url: siteUrl },
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
            {/* JSON-LD Schemas */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <main className="pt-8 pb-20">
                <article className="section-container max-w-4xl">
                    {/* Breadcrumbs */}
                    <Link
                        href="/en/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-500 mb-8 transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
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
                            {post.title.en}
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            {post.excerpt.en}
                        </p>
                    </div>

                    {/* Featured Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-dark-800 dark:to-dark-900 rounded-[2.5rem] mb-12 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors" />
                        <ShieldCheck className="w-32 h-32 text-primary-500/10" />
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white font-bold text-sm drop-shadow-md">CNWePro Academy Certified</span>
                            </div>
                            <div className="flex gap-2">
                                <button aria-label="bookmark" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <Bookmark className="w-4 h-4" />
                                </button>
                                <button aria-label="share" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Post Content - rendered as proper HTML */}
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-500 dark:prose-a:text-primary-400 prose-img:rounded-3xl prose-table:text-sm"
                        dangerouslySetInnerHTML={{ __html: post.content.en }}
                    />

                    {/* Footer CTA */}
                    <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
                        <div className="bg-gradient-to-br from-primary-500 to-orange-600 rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-500/30">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-4">Ready to Get Started?</h2>
                                <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                                    Browse CNWePro's verified Chinese account inventory — instant delivery, USDT payment, 72-hour guarantee.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/en/" className="px-8 py-4 bg-white text-primary-600 font-extrabold rounded-2xl hover:scale-105 transition-transform shadow-xl">
                                        Browse Accounts
                                    </Link>
                                    <Link href="/en/contact" className="px-8 py-4 bg-primary-700/50 backdrop-blur-md text-white border border-primary-400/30 font-extrabold rounded-2xl hover:bg-primary-700/70 transition-all">
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </>
    );
}
