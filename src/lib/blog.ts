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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAllPosts(lang: 'zh' | 'en'): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });

    if (error || !data) return [];

    return data.map(post => {
        const contentStr = lang === 'zh' ? post.content_zh : post.content_en;
        const plainText = contentStr.replace(/<[^>]*>/g, '');
        const wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);

        return {
            slug: post.id,
            title: lang === 'zh' ? post.title_zh : post.title_en,
            metaDescription: lang === 'zh' ? post.excerpt_zh : post.excerpt_en,
            keywords: [],
            category: post.category,
            publishDate: post.date,
            modifiedDate: post.date,
            author: 'CNVerifyHub',
            readingTime: post.read_time,
            wordCount,
            featuredImage: post.image,
            excerpt: lang === 'zh' ? post.excerpt_zh : post.excerpt_en,
            content: marked.parse(contentStr) as string,
        };
    });
}

export async function getPostBySlug(slug: string, lang: 'zh' | 'en'): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', slug)
        .single();

    if (error || !data) return null;

    const post = data;
    const contentStr = lang === 'zh' ? post.content_zh : post.content_en;
    const plainText = contentStr.replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);

    return {
        slug: post.id,
        title: lang === 'zh' ? post.title_zh : post.title_en,
        metaDescription: lang === 'zh' ? post.excerpt_zh : post.excerpt_en,
        keywords: [],
        category: post.category,
        publishDate: post.date,
        modifiedDate: post.date,
        author: 'CNVerifyHub',
        readingTime: post.read_time,
        wordCount,
        featuredImage: post.image,
        excerpt: lang === 'zh' ? post.excerpt_zh : post.excerpt_en,
        content: marked.parse(contentStr) as string,
    };
}

export async function getAllSlugs(): Promise<string[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('id');
    
    if (error || !data) return [];
    
    return data.map(p => p.id);
}
