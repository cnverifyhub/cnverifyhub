import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';

export const metadata: Metadata = {
    title: '微信号购买 - 实名老号·绑卡号·企业号现货 | Buy WeChat Account',
    description: '微信账号批发平台：白号、实名号、绑卡号、老号、企业微信号现货秒发。高权重防封号，USDT支付，72小时售后质保。Buy verified WeChat accounts — aged, bank-linked, enterprise. Instant USDT delivery with 72hr warranty.',
    keywords: '微信号购买, 买微信号, 微信账号出售, 微信老号, 微信实名号, 微信绑卡号, 微信企业号, buy wechat account, wechat for sale, verified wechat',
    alternates: {
        canonical: 'https://cnwepro.netlify.app/wechat/',
        languages: { 'zh-CN': 'https://cnwepro.netlify.app/wechat/', 'en': 'https://cnwepro.netlify.app/en/wechat/' },
    },
    openGraph: {
        title: '微信号购买 - 实名·绑卡·企业号现货 | CNWePro',
        description: '微信白号¥28起 | 实名号¥38起 | 绑卡号¥58起 | USDT支付秒发货',
    },
};

export default function WeChatPage() {
    return <CategoryPageTemplate categoryId="wechat" lang="zh" />;
}
