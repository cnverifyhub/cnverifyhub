import fs from 'fs';
import path from 'path';

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
        .filter(fileName => fileName.endsWith('.json') && fileName !== 'manifest.json')
        .map(fileName => {
            const fullPath = path.join(dir, fileName);
            try {
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const post = JSON.parse(fileContents) as BlogPost;
                
                // Parse markdown content to HTML
                const markdownContent = post.content;
                post.content = marked.parse(markdownContent) as string;
                
                // Calculate word count and reading time dynamically if missing or thin
                const plainText = markdownContent.replace(/<[^>]*>/g, '');
                post.wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);
                post.readingTime = `${Math.ceil(post.wordCount / 250)} min`;
                
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
    const fullPath = path.join(dir, `${slug}.json`);
    
    if (!fs.existsSync(fullPath)) return null;
    
    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const post = JSON.parse(fileContents) as BlogPost;
        
        // Parse markdown content to HTML
        const markdownContent = post.content;
        post.content = marked.parse(markdownContent) as string;
        
        // Dynamic stats
        const plainText = markdownContent.replace(/<[^>]*>/g, '');
        post.wordCount = plainText.trim().split(/\s+/).length + (plainText.match(/[\u4e00-\u9fa5]/g)?.length || 0);
        post.readingTime = `${Math.ceil(post.wordCount / 250)} min`;
        
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
        .filter(fileName => fileName.endsWith('.json') && fileName !== 'manifest.json')
        .map(fileName => fileName.replace(/\.json$/, ''));
}
