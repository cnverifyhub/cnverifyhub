import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';

export const metadata: Metadata = {
    title: '抖音号购买 - 万粉号·蓝V号·老号现货 | Buy Douyin Account',
    description: '抖音账号批发：白号、万粉号、蓝V认证号、老号现货秒发。粉丝真实，权重高，USDT支付，72小时售后质保。Buy Douyin (TikTok China) accounts — aged, with followers, blue verified. Instant delivery.',
    keywords: '抖音号购买, 买抖音号, 抖音账号出售, 抖音万粉号, 抖音蓝V号, 抖音老号, buy douyin account, tiktok china account, douyin followers',
    alternates: {
        canonical: 'https://cnwepro.netlify.app/douyin/',
        languages: { 'zh-CN': 'https://cnwepro.netlify.app/douyin/', 'en': 'https://cnwepro.netlify.app/en/douyin/' },
    },
    openGraph: {
        title: '抖音号购买 - 万粉·蓝V·老号现货 | CNWePro',
        description: '抖音白号¥28起 | 万粉号¥68起 | USDT支付秒发货',
    },
};

export default function DouyinPage() {
    return <CategoryPageTemplate categoryId="douyin" lang="zh" />;
}
