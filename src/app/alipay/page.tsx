import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';

export const metadata: Metadata = {
    title: '支付宝账号购买 - 实名号·企业号·商家号现货 | Buy Alipay Account',
    description: '支付宝账号批发：个人实名号、企业号、商家号现货秒发。已过风控认证，USDT支付，72小时售后质保。Buy verified Alipay accounts — personal, business, enterprise. Instant USDT delivery.',
    keywords: '支付宝账号购买, 买支付宝号, 支付宝实名号, 支付宝企业号, 支付宝商家号, buy alipay account, verified alipay, alipay for sale',
    alternates: {
        canonical: 'https://cnwepro.netlify.app/alipay/',
        languages: { 'zh-CN': 'https://cnwepro.netlify.app/alipay/', 'en': 'https://cnwepro.netlify.app/en/alipay/' },
    },
    openGraph: {
        title: '支付宝账号购买 - 实名·企业·商家号 | CNWePro',
        description: '支付宝个人号¥38起 | 企业号¥88起 | USDT支付秒发货',
    },
};

export default function AlipayPage() {
    return <CategoryPageTemplate categoryId="alipay" lang="zh" />;
}
