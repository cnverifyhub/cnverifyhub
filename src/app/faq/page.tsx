import type { Metadata } from 'next';
import { FAQSection } from '@/components/home/FAQSection';

export const metadata: Metadata = {
    title: '常见问题 - FAQ',
    description: '关于微信号购买、支付宝账号交易、抖音号批发、QQ号出售的常见问题解答。了解如何购买、付款、发货和售后保障。FAQ about buying WeChat, Alipay, Douyin & QQ accounts — payment, delivery, warranty.',
    alternates: {
        canonical: 'https://cnwepro.netlify.app/faq/',
        languages: { 'zh-CN': 'https://cnwepro.netlify.app/faq/', 'en': 'https://cnwepro.netlify.app/en/faq/' },
    },
};

export default function FAQPage() {
    return (
        <div className="pt-12">
            <FAQSection lang="zh" />
        </div>
    );
}
