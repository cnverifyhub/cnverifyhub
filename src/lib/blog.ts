import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';

export interface BlogPost {
    slug: string;
    title: string;
    metaDescription: string;
    keywords: string[];
    category: string;
    publishDate: string;
    modifiedDate: string;
    author: string;
    readingTime: string;
    wordCount: number;
    featuredImage: string;
    excerpt: string;
    content: string;
    faqSchema?: Array<{ question: string; answer: string }>;
    aiOptimization?: {
        featuredSnippetTarget?: string;
        peopleAlsoAsk?: string[];
        entitySalience?: string[];
    };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mybzjmhyxamldklezngu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllPosts(lang: 'zh' | 'en'): Promise<BlogPost[]> {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
            .order('date', { ascending: false });

        if (error || !data) return [];

        return data.map((post: any) => {
            const contentStr = (lang === 'zh' ? post.content_zh : post.content_en) || post.content_zh || '';
            const plainText = contentStr.replace(/<[^>]*>/g, '');
            const wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);

            return {
                slug: post.id,
                title: (lang === 'zh' ? post.title_zh : post.title_en) || post.title_zh || post.id,
                metaDescription: (lang === 'zh' ? post.excerpt_zh : post.excerpt_en) || post.excerpt_zh || '',
                keywords: Array.isArray(post.keywords) ? post.keywords : [],
                category: post.category || 'general',
                publishDate: post.date || new Date().toISOString().split('T')[0],
                modifiedDate: post.modified_date || post.date || new Date().toISOString().split('T')[0],
                author: post.author || 'CNVerifyHub Editorial',
                readingTime: post.read_time || '8 min',
                wordCount,
                featuredImage: post.image || '/images/blog/wechat-overseas-verification-guide-featured.webp',
                excerpt: (lang === 'zh' ? post.excerpt_zh : post.excerpt_en) || post.excerpt_zh || '',
                content: marked.parse(contentStr) as string,
                faqSchema: post.faq_schema || undefined,
            };
        });
    } catch (err) {
        console.warn('[Blog] Error fetching all posts:', err);
        return [];
    }
}

export async function getPostBySlug(slug: string, lang: 'zh' | 'en'): Promise<BlogPost | null> {
    if (!supabaseUrl || !supabaseKey) return null;

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', slug)
            .or('tenant_id.eq.cnverifyhub,tenant_id.is.null')
            .maybeSingle();

        if (error || !data) return null;

        const post = data;
        const contentStr = (lang === 'zh' ? post.content_zh : post.content_en) || post.content_zh || '';
        const plainText = contentStr.replace(/<[^>]*>/g, '');
        const wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);

        return {
            slug: post.id,
            title: (lang === 'zh' ? post.title_zh : post.title_en) || post.title_zh || post.id,
            metaDescription: (lang === 'zh' ? post.excerpt_zh : post.excerpt_en) || post.excerpt_zh || '',
            keywords: Array.isArray(post.keywords) ? post.keywords : [],
            category: post.category || 'general',
            publishDate: post.date || new Date().toISOString().split('T')[0],
            modifiedDate: post.modified_date || post.date || new Date().toISOString().split('T')[0],
            author: post.author || 'CNVerifyHub Editorial',
            readingTime: post.read_time || '8 min',
            wordCount,
            featuredImage: post.image || '/images/blog/wechat-overseas-verification-guide-featured.webp',
            excerpt: (lang === 'zh' ? post.excerpt_zh : post.excerpt_en) || post.excerpt_zh || '',
            content: marked.parse(contentStr) as string,
            faqSchema: post.faq_schema || undefined,
        };
    } catch (err) {
        console.warn('[Blog] Error fetching post by slug:', err);
        return null;
    }
}

export async function getAllSlugs(): Promise<string[]> {
    if (!supabaseUrl || !supabaseKey) return [];

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('id')
            .or('tenant_id.eq.cnverifyhub,tenant_id.is.null');
        
        if (error || !data) return [];
        
        return data.map((p: any) => p.id);
    } catch (err) {
        console.warn('[Blog] Error fetching slugs:', err);
        return [];
    }
}
