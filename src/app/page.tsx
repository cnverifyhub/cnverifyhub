import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { TrustBadges } from '@/components/home/TrustBadges';
import { CategoryCards } from '@/components/home/CategoryCards';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { HotProducts } from '@/components/sections/HotProducts';
import { LiveMarketTable } from '@/components/sections/LiveMarketTable';
import { FAQSection } from '@/components/home/FAQSection';
import { LuckyWheel } from '@/components/home/LuckyWheel';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: 'CNVerifyHub - 专业中国数字账号交易平台 | Buy Chinese Accounts',
    description: '专业中国大陆数字账号批发平台，现货供应高权重微信实名老号、支付宝企业户、抖音万粉号及QQ高级靓号。USDT匿名担保交易，5分钟极速发货，72小时售后无忧。Buy verified WeChat, Alipay, Douyin & QQ accounts with instant crypto delivery.',
    alternates: {
        canonical: SITE_URL,
        languages: { 'zh-CN': SITE_URL, 'en': `${SITE_URL}/en` },
    },
    openGraph: {
        title: 'CNVerifyHub - 微信号·支付宝·抖音·QQ账号批发平台',
        description: '实名老号·企业号·万粉号现货秒发 | USDT支付 | 72小时质保',
        url: SITE_URL,
    },
};

// FAQ structured data for rich snippets
const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: '如何购买微信号？How to buy a WeChat account?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '选择账号类型 → USDT支付 → 系统自动发货 → 验证使用。全程5分钟内完成。Select account type → Pay with USDT → Instant auto-delivery → Verify and use. Completed within 5 minutes.',
            },
        },
        {
            '@type': 'Question',
            name: '支持哪些支付方式？What payment methods are accepted?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '目前支持USDT (TRC20)加密货币支付，安全匿名，全球通用。We accept USDT (TRC20) cryptocurrency — secure, anonymous, and available worldwide.',
            },
        },
        {
            '@type': 'Question',
            name: '账号有售后保障吗？Is there a warranty?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: '所有账号提供72小时质保。质保期内如有非用户操作导致的问题，免费换号。All accounts come with a 72-hour quality guarantee. Free replacement for non-user-caused issues.',
            },
        },
        {
            '@type': 'Question',
            name: '发货速度如何？How fast is delivery?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'USDT付款确认后5分钟内自动发货。After USDT payment confirmation, auto-delivery within 5 minutes.',
            },
        },
    ],
};

export default function Home() {
    const lang = 'zh';

    return (
        <div className="flex flex-col min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Hero lang={lang} />
            <TrustBadges />
            <CategoryCards lang={lang} />
            <HotProducts lang={lang} />
            <LiveMarketTable lang={lang} />
            <WhyChooseUs lang={lang} />
            <CustomerReviews lang={lang} />
            <FAQSection lang={lang} />
            <LuckyWheel lang={lang} />
        </div>
    );
}
