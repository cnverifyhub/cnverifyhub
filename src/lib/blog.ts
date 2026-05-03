import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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

export function getBlogDirectory(lang: 'zh' | 'en') {
    return lang === 'en' 
        ? path.join(process.cwd(), 'content', 'blog', 'en')
        : path.join(process.cwd(), 'content', 'blog');
}

export function getAllPosts(lang: 'zh' | 'en'): BlogPost[] {
    const dir = getBlogDirectory(lang);
    if (!fs.existsSync(dir)) return [];
    
    const fileNames = fs.readdirSync(dir);
    const posts: BlogPost[] = fileNames
        .filter(fileName => fileName.endsWith('.mdx'))
        .map(fileName => {
            const fullPath = path.join(dir, fileName);
            try {
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const { data, content } = matter(fileContents);
                
                const post = {
                    ...data,
                    content: marked.parse(content) as string,
                    slug: data.slug || fileName.replace(/\.mdx$/, '')
                } as BlogPost;
                
                // Calculate word count and reading time dynamically
                const plainText = content.replace(/<[^>]*>/g, '');
                const wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);
                post.wordCount = wordCount;
                post.readingTime = `${Math.ceil(wordCount / 200)} min`;
                
                return post;
            } catch (err) {
                console.error(`Error loading blog post ${fileName}:`, err);
                return null;
            }
        })
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        
    return posts;
}

export function getPostBySlug(slug: string, lang: 'zh' | 'en'): BlogPost | null {
    const dir = getBlogDirectory(lang);
    const fullPath = path.join(dir, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) return null;
    
    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        const post = {
            ...data,
            content: marked.parse(content) as string,
            slug: data.slug || slug
        } as BlogPost;
        
        // Dynamic stats
        const plainText = content.replace(/<[^>]*>/g, '');
        const wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);
        post.wordCount = wordCount;
        post.readingTime = `${Math.ceil(wordCount / 200)} min`;
        
        return post;
    } catch (err) {
        console.error(`Error loading blog post ${slug}:`, err);
        return null;
    }
}

export function getAllSlugs(): string[] {
    const dir = getBlogDirectory('zh');
    if (!fs.existsSync(dir)) return [];
    
    const fileNames = fs.readdirSync(dir);
    return fileNames
        .filter(fileName => fileName.endsWith('.mdx'))
        .map(fileName => fileName.replace(/\.mdx$/, ''));
}

