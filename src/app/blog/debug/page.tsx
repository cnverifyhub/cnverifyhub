import { getAllPosts, BlogPost } from '@/lib/blog';
import { ShieldCheck, AlertTriangle, FileCheck, Search, Database, Globe } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function BlogDebugPage() {
    const zhPosts = getAllPosts('zh');
    const enPosts = getAllPosts('en');

    const checkPost = (post: BlogPost) => {
        const issues: string[] = [];
        if (post.wordCount < 1000) issues.push('Thin Content (<1000 words)');
        if (!post.metaDescription) issues.push('Missing Meta Description');
        if (post.keywords.length === 0) issues.push('Missing Keywords');
        if (!post.featuredImage) issues.push('Missing Featured Image');
        
        // Simple encoding check: find non-ASCII but valid UTF-8
        const hasChinese = /[\u4e00-\u9fa5]/.test(post.content);
        if (!hasChinese && post.slug.includes('zh')) issues.push('No Chinese characters in ZH post? Potential encoding issue.');

        return issues;
    };

    return (
        <main className="pt-24 pb-20 bg-slate-50 dark:bg-dark-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3">
                            <Database className="w-8 h-8 text-red-500" />
                            Blog System Debugger
                        </h1>
                        <p className="text-slate-500 mt-2">Monitoring word counts, encoding, and data integrity.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-dark-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-widest">Total Posts</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{zhPosts.length + enPosts.length}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chinese Posts Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-red-500" />
                            Chinese Catalog (ZH)
                        </h2>
                        <div className="space-y-4">
                            {zhPosts.map(post => {
                                const issues = checkPost(post);
                                return (
                                    <div key={post.slug} className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</h3>
                                                <div className="text-xs text-slate-400 font-mono mt-1">/blog/{post.slug}/</div>
                                            </div>
                                            {issues.length === 0 ? (
                                                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-slate-50 dark:bg-dark-800/50 p-2 rounded-xl text-center">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Words</div>
                                                <div className={`text-sm font-black ${post.wordCount < 1000 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                                    {post.wordCount}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-dark-800/50 p-2 rounded-xl text-center">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Read Time</div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white">{post.readingTime}</div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-dark-800/50 p-2 rounded-xl text-center">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Category</div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white">{post.category}</div>
                                            </div>
                                        </div>

                                        {issues.length > 0 && (
                                            <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-xl p-3">
                                                <div className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase mb-1">Detected Issues:</div>
                                                <ul className="text-xs text-red-500 space-y-1">
                                                    {issues.map((issue, i) => (
                                                        <li key={i} className="flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-red-500" />
                                                            {issue}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4 flex gap-2">
                                            <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-red-500 hover:underline">View Page</Link>
                                            <span className="text-slate-300">|</span>
                                            <Link href="/" className="text-xs font-bold text-slate-400 hover:underline">Edit Code</Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* English Posts Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" />
                            English Catalog (EN)
                        </h2>
                        <div className="space-y-4">
                            {enPosts.map(post => {
                                const issues = checkPost(post);
                                return (
                                    <div key={post.slug} className="bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</h3>
                                                <div className="text-xs text-slate-400 font-mono mt-1">/en/blog/{post.slug}/</div>
                                            </div>
                                            {issues.length === 0 ? (
                                                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                            ) : (
                                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="bg-slate-50 dark:bg-dark-800/50 p-2 rounded-xl text-center">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Words</div>
                                                <div className={`text-sm font-black ${post.wordCount < 1000 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                                    {post.wordCount}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-dark-800/50 p-2 rounded-xl text-center">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Read Time</div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white">{post.readingTime}</div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-dark-800/50 p-2 rounded-xl text-center">
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Category</div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white">{post.category}</div>
                                            </div>
                                        </div>

                                        {issues.length > 0 && (
                                            <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-xl p-3">
                                                <div className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase mb-1">Detected Issues:</div>
                                                <ul className="text-xs text-red-500 space-y-1">
                                                    {issues.map((issue, i) => (
                                                        <li key={i} className="flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-red-500" />
                                                            {issue}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="mt-4 flex gap-2">
                                            <Link href={`/en/blog/${post.slug}`} className="text-xs font-bold text-red-500 hover:underline">View Page</Link>
                                            <span className="text-slate-300">|</span>
                                            <Link href="/" className="text-xs font-bold text-slate-400 hover:underline">Edit Code</Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
