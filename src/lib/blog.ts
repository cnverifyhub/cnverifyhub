import fs from 'fs';
import path from 'path';

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
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            return JSON.parse(fileContents) as BlogPost;
        })
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        
    return posts;
}

export function getPostBySlug(slug: string, lang: 'zh' | 'en'): BlogPost | null {
    const dir = getBlogDirectory(lang);
    const fullPath = path.join(dir, `${slug}.json`);
    
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as BlogPost;
}

export function getAllSlugs(): string[] {
    const dir = getBlogDirectory('zh');
    if (!fs.existsSync(dir)) return [];
    
    const fileNames = fs.readdirSync(dir);
    return fileNames
        .filter(fileName => fileName.endsWith('.json') && fileName !== 'manifest.json')
        .map(fileName => fileName.replace(/\.json$/, ''));
}
