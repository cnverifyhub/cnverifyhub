import type { Metadata } from 'next';
import { posts } from '@/data/posts';
import BlogIndexClient from '@/app/blog/BlogIndexClient';

export const metadata: Metadata = {
    title: 'Buy Chinese Accounts — Guides & Tutorials | CNWePro Blog',
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
        canonical: 'https://cnwepro.com/en/blog/',
        languages: {
            'en': 'https://cnwepro.com/en/blog/',
            'zh-CN': 'https://cnwepro.com/blog/',
        },
    },
    openGraph: {
        title: 'Buy Chinese Accounts — Guides & Tutorials | CNWePro',
        description: 'Expert guides on buying WeChat, Alipay, Douyin, QQ accounts for international buyers. Anonymous USDT payment accepted.',
        url: 'https://cnwepro.com/en/blog/',
        type: 'website',
    },
};

export default function EnBlogPage() {
    return <BlogIndexClient posts={posts} lang="en" />;
}
