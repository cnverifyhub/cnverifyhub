import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogIndexClient from './BlogIndexClient';
import { getSeoAlternates } from '@/lib/seo-utils';

export const revalidate = 3600; // ISR: Revalidate every hour

const alternates = getSeoAlternates(null, '/blog/');

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
    alternates: alternates,
    openGraph: {
        title: 'Buy Chinese Accounts — Guides & Tutorials | CNVerifyHub Blog',
        description: 'Expert guides on buying WeChat, Alipay, Douyin accounts for international buyers. USDT payment accepted.',
        url: alternates.canonical,
        type: 'website',
        images: [
            {
                url: `https://cnverifyhub.com/api/og?title=${encodeURIComponent('CNVerifyHub Blog')}&subtitle=${encodeURIComponent('Guides & Tutorials for Buying Chinese Accounts')}&category=Blog`,
                width: 1200,
                height: 630,
                alt: 'CNVerifyHub Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Buy Chinese Accounts — Guides & Tutorials | CNVerifyHub Blog',
        description: 'Expert guides on buying WeChat, Alipay, Douyin accounts for international buyers. USDT payment accepted.',
        images: [`https://cnverifyhub.com/api/og?title=${encodeURIComponent('CNVerifyHub Blog')}&subtitle=${encodeURIComponent('Guides & Tutorials for Buying Chinese Accounts')}&category=Blog`],
    },
};

export default async function BlogPage() {
    const posts = await getAllPosts('zh');
    return <BlogIndexClient posts={posts} lang="zh" />;
}
