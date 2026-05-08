import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogIndexClient from './BlogIndexClient';

export const revalidate = 3600; // ISR: Revalidate every hour

export const metadata: Metadata = {
    title: 'Buy Chinese Accounts — Guides, Tutorials & Tips | CNVerifyHub Blog',
    description: 'Expert guides on buying WeChat accounts, Alipay accounts, Douyin accounts and more. Learn how international buyers can safely purchase and use Chinese social media accounts.',
    keywords: [
        'buy WeChat account guide',
        'buy Alipay account tutorial',
        'Chinese social media accounts',
        'WeChat for foreigners',
        'Alipay international users',
        'buy Chinese accounts',
        '购买微信号指南',
        '购买支付宝账号',
    ],
    alternates: {
        canonical: 'https://CNVerifyHub.com/blog/',
        languages: {
            'en': 'https://CNVerifyHub.com/en/blog/',
            'zh-CN': 'https://CNVerifyHub.com/blog/',
        },
    },
    openGraph: {
        title: 'Buy Chinese Accounts — Guides & Tutorials | CNVerifyHub Blog',
        description: 'Expert guides on buying WeChat, Alipay, Douyin accounts for international buyers. USDT payment accepted.',
        url: 'https://CNVerifyHub.com/blog/',
        type: 'website',
    },
};

export default async function BlogPage() {
    const posts = getAllPosts('zh');
    return <BlogIndexClient posts={posts} lang="zh" />;
}
