import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '联系我们 - Telegram客服 | Contact Us',
    description: '通过Telegram联系CNWePro客服团队，获取售前咨询、售后支持、批量订单报价。7×24小时在线。Contact CNWePro support via Telegram for pre-sales, after-sales, and bulk order inquiries.',
    alternates: {
        canonical: `${SITE_URL}/contact/`,
        languages: { 'zh-CN': `${SITE_URL}/contact/`, 'en': `${SITE_URL}/en/contact/` },
    },
    openGraph: {
        title: '联系CNWePro客服 | Contact Support',
        description: 'Telegram 7×24小时客服在线 | 批量采购特价 | 售后无忧',
    },
};

export default function ContactPage() {
    return <ContactForm lang="zh" />;
}
