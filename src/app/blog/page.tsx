import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogIndexClient from './BlogIndexClient';

export const metadata: Metadata = {
    title: 'Buy Chinese Accounts — Guides, Tutorials & Tips | CNWePro Blog',
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
        canonical: 'https://cnwepro.com/blog/',
        languages: {
            'en': 'https://cnwepro.com/en/blog/',
            'zh-CN': 'https://cnwepro.com/blog/',
        },
    },
    openGraph: {
        title: 'Buy Chinese Accounts — Guides & Tutorials | CNWePro Blog',
        description: 'Expert guides on buying WeChat, Alipay, Douyin accounts for international buyers. USDT payment accepted.',
        url: 'https://cnwepro.com/blog/',
        type: 'website',
    },
};

export default function BlogPage() {
    const posts = getAllPosts('zh');
    return <BlogIndexClient posts={posts} lang="zh" />;
}
