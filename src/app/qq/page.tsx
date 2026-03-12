import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';

export const metadata: Metadata = {
    title: 'QQ号购买 - 靓号·太阳号·高等级号现货 | Buy QQ Account',
    description: 'QQ账号批发：普通号、太阳号、月亮号、高等级靓号现货秒发。老号防封，USDT支付，72小时售后质保。Buy QQ accounts — VIP, Sun level, high-grade numbers. Instant USDT delivery.',
    keywords: 'QQ号购买, 买QQ号, QQ靓号, QQ太阳号, QQ高等级号, QQ账号出售, buy qq account, qq number for sale, qq vip account',
    alternates: {
        canonical: 'https://cnwepro.netlify.app/qq/',
        languages: { 'zh-CN': 'https://cnwepro.netlify.app/qq/', 'en': 'https://cnwepro.netlify.app/en/qq/' },
    },
    openGraph: {
        title: 'QQ号购买 - 靓号·太阳号·高等级号 | CNWePro',
        description: 'QQ普通号¥18起 | 太阳号¥38起 | USDT支付秒发货',
    },
};

export default function QQPage() {
    return <CategoryPageTemplate categoryId="qq" lang="zh" />;
}
