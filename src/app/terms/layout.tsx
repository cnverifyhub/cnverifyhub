import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '服务条款与政策 | Terms of Service',
    description: 'CNWePro平台服务协议、支付条款、退款政策、隐私保护和免责声明。了解USDT支付流程、72小时质保政策和争议解决方式。Terms of Service for CNWePro — payment, refund, privacy, and warranty policies.',
    alternates: {
        canonical: `${SITE_URL}/terms/`,
        languages: { 'zh-CN': `${SITE_URL}/terms/`, 'en': `${SITE_URL}/en/terms/` },
    },
    openGraph: {
        title: '服务条款与政策 | CNWePro Terms',
        description: '平台服务协议 · 支付条款 · 72小时质保政策 · 隐私保护',
    },
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
