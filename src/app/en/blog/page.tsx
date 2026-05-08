import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogIndexClient from '@/app/blog/BlogIndexClient';

export const revalidate = 3600; // ISR: Revalidate every hour

export const metadata: Metadata = {
    title: 'Buy Chinese Accounts — Guides & Tutorials | CNVerifyHub Blog',
    description: 'Expert guides on how to buy WeChat accounts, Alipay accounts, Douyin and QQ accounts. International buyers — purchase Chinese social media accounts safely with USDT payment.',
    keywords: [
        'buy WeChat account',
        'buy Alipay account',
        'buy Chinese social media accounts',
        'WeChat account for foreigners',
        'Alipay for international users',
        'buy verified WeChat account',
        'Chinese accounts with USDT',
        'buy aged WeChat account',
        'Xianyu account for foreigners',
    ],
    alternates: {
        canonical: 'https://cnverifyhub.com/en/blog/',
        languages: {
            'en': 'https://cnverifyhub.com/en/blog/',
            'zh-CN': 'https://cnverifyhub.com/blog/',
        },
    },
    openGraph: {
        title: 'Buy Chinese Accounts — Guides & Tutorials | CNVerifyHub',
        description: 'Expert guides on buying WeChat, Alipay, Douyin, QQ accounts for international buyers. Anonymous USDT payment accepted.',
        url: 'https://cnverifyhub.com/en/blog/',
        type: 'website',
    },
};

export default async function EnBlogPage() {
    const posts = getAllPosts('en');
    return <BlogIndexClient posts={posts} lang="en" />;
}
