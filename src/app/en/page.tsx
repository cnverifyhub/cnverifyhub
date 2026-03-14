import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { CategoryCards } from '@/components/home/CategoryCards';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { PopularProducts } from '@/components/home/PopularProducts';
import { FAQSection } from '@/components/home/FAQSection';
import { ContactFloat } from '@/components/ui/ContactFloat';
import { LuckyWheel } from '@/components/home/LuckyWheel';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'CNWePro - Buy Chinese Digital Accounts | WeChat, Alipay, Douyin, QQ',
    description: 'Professional Chinese digital account marketplace. Buy verified WeChat, Alipay, Douyin & QQ accounts with instant USDT crypto delivery. 5-minute auto-delivery, 72-hour warranty. Bulk pricing available.',
    keywords: 'buy wechat account, buy alipay account, buy douyin account, buy qq account, chinese social media accounts, buy chinese accounts with crypto, USDT payment, instant delivery, verified accounts, wechat for sale, tiktok china account',
    alternates: {
        canonical: `${SITE_URL}/en/`,
        languages: { 'en': `${SITE_URL}/en/`, 'zh-CN': SITE_URL },
    },
    openGraph: {
        title: 'CNWePro - Buy WeChat, Alipay, Douyin & QQ Accounts',
        description: 'Professional Chinese digital account marketplace. Instant USDT delivery, 72hr warranty. Bulk pricing from $18.',
        url: `${SITE_URL}/en/`,
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CNWePro - Buy Chinese Digital Accounts with USDT',
        description: 'Verified WeChat, Alipay, Douyin & QQ accounts. Instant crypto delivery.',
    },
};

// English FAQ structured data
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How to buy a WeChat account?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Select your account type → Pay with USDT (TRC20) → Receive credentials automatically within 5 minutes → Verify and start using. Simple and secure.',
            },
        },
        {
            '@type': 'Question',
            name: 'What payment methods are accepted?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'We accept USDT (TRC20) cryptocurrency — secure, anonymous, and available worldwide. Payment is verified on the Tron blockchain automatically.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is there a warranty on accounts?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, all accounts come with a 72-hour quality guarantee. Free replacement for any issues not caused by the buyer during the warranty period.',
            },
        },
        {
            '@type': 'Question',
            name: 'How fast is delivery?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'After USDT payment is confirmed on the blockchain, your account credentials are delivered automatically within 5 minutes.',
            },
        },
    ],
};

export default function HomeEn() {
    const lang = 'en';

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Hero lang={lang} />
            <CategoryCards lang={lang} />
            <PopularProducts lang={lang} />
            <WhyChooseUs lang={lang} />
            <CustomerReviews lang={lang} />
            <FAQSection lang={lang} />
            <ContactFloat lang={lang} />
            <LuckyWheel lang={lang} />
        </div>
    );
}
