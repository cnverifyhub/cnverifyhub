import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';





export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        template: '%s | CNVerifyHub - 专业中国数字账号交易平台',
        default: 'CNVerifyHub - 专业中国数字账号交易平台 | Buy WeChat, Alipay, Douyin Accounts',
    },
    description: '专业中国数字账号批发平台。微信号、支付宝账号、抖音号、QQ号现货供应。实名认证号、绑卡号、老号、白号应有尽有。USDT匿名支付，5分钟极速发货，72小时售后质保。Professional Chinese digital account marketplace — WeChat, Alipay, Douyin, QQ accounts with instant USDT delivery.',
    keywords: [
        // Chinese keywords (Baidu)
        '微信号购买', '买微信号', '微信账号出售', '微信号批发', '微信老号购买',
        '支付宝账号购买', '支付宝实名号', '支付宝企业号',
        '抖音号购买', '抖音账号出售', '抖音万粉号', '抖音蓝V号',
        'QQ号购买', 'QQ靓号', 'QQ太阳号',
        '海外充值', '中国账号购买', 'USDT购买微信号', '加密货币购买中国账号',
        '数字账号交易平台', '账号批发', '实名微信号出售',
        // English keywords (Google)
        'buy wechat account', 'wechat account for sale', 'buy chinese wechat',
        'buy alipay account', 'verified alipay account',
        'buy douyin account', 'tiktok china account', 'buy douyin followers',
        'buy qq account', 'qq number for sale',
        'chinese social media accounts', 'buy chinese accounts with crypto',
        'USDT payment chinese accounts', 'instant delivery wechat',
    ].join(', '),
    authors: [{ name: 'CNVerifyHub', url: SITE_URL }],
    creator: 'CNVerifyHub',
    publisher: 'CNVerifyHub',
    formatDetection: {
        telephone: false,
        email: false,
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/icon.png', type: 'image/png' },
        ],
        apple: [
            { url: '/logo.png' },
        ],
    },
    openGraph: {
        type: 'website',
        siteName: 'CNVerifyHub',
        locale: 'zh_CN',
        alternateLocale: 'en_US',
        title: 'CNVerifyHub - 专业中国数字账号交易平台 | Chinese Digital Accounts',
        description: '微信、支付宝、抖音、QQ账号现货供应。USDT支付，5分钟发货，72小时质保。Buy verified Chinese social media accounts with instant crypto delivery.',
        url: SITE_URL,
        images: [
            {
                url: `${SITE_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: 'CNVerifyHub - 中国数字账号交易平台',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CNVerifyHub - Buy WeChat, Alipay, Douyin & QQ Accounts',
        description: 'Professional Chinese digital account marketplace. Instant USDT delivery, 72hr warranty. 微信号、支付宝、抖音、QQ账号批发平台。',
        images: [`${SITE_URL}/og-image.png`],
    },
    alternates: {
        canonical: SITE_URL,
        languages: {
            'zh-CN': SITE_URL,
            'en': `${SITE_URL}/en`,
        }
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
        // Baidu verification is handled via meta tag below
    },
    other: {
        // Baidu SEO specific meta
        'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
        'applicable-device': 'pc,mobile',
        'mobile-agent': `format=html5; url=${SITE_URL}`,
        // Sogou & 360 search
        'sogou_site_verification': process.env.NEXT_PUBLIC_SOGOU_VERIFICATION || '',
        // Content language for search engines
        'content-language': 'zh-CN, en',
        // Force webkit rendering in 360/QQ/Sogou browsers (critical for Chinese market)
        'renderer': 'webkit',
        'force-rendering': 'webkit',
    },
};

// JSON-LD Structured Data
const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CNVerifyHub',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description: '专业中国数字账号交易平台 - Professional Chinese digital account marketplace',
    contactPoint: [
        {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            url: 'https://t.me/cnwechatpro',
            email: 'cnverifyhub@gmail.com',
            availableLanguage: ['Chinese', 'English'],
        }
    ],
    sameAs: [
        'https://t.me/CNVerifyHub',
        'https://t.me/cnwechatpro',
    ],
};

const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CNVerifyHub',
    url: SITE_URL,
    description: '专业中国数字账号交易平台',
    inLanguage: ['zh-CN', 'en'],
    potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/track/?id={search_term_string}`,
        'query-input': 'required name=search_term_string',
    },
};

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: '微信账号', item: `${SITE_URL}/wechat/` },
        { '@type': 'ListItem', position: 3, name: '支付宝账号', item: `${SITE_URL}/alipay/` },
        { '@type': 'ListItem', position: 4, name: '抖音账号', item: `${SITE_URL}/douyin/` },
        { '@type': 'ListItem', position: 5, name: 'QQ账号', item: `${SITE_URL}/qq/` },
    ],
};

export const viewport: Viewport = {
    themeColor: '#FF0036',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh" className="scroll-smooth" suppressHydrationWarning>
            <head>
                {/* Preconnect to external domains for China speed */}
                <link rel="preconnect" href="https://otgewrynnrqmtsyvlzrj.supabase.co" />
                <link rel="dns-prefetch" href="https://hm.baidu.com" />
                <link rel="dns-prefetch" href="https://zz.bdstatic.com" />
                <link rel="dns-prefetch" href="https://api.trongrid.io" />

                {/* Fonts loaded via CDN to prevent Next.js build-time fetch crashing on ECONNRESET */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;900&family=Noto+Serif+SC:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

                {/* Canonical & hreflang for Baidu */}
                <link rel="alternate" hrefLang="zh-CN" href={SITE_URL} />
                <link rel="alternate" hrefLang="en" href={`${SITE_URL}/en`} />
                <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />

                {/* Theme script to prevent hydration mismatch */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
                    }}
                />

                {/* Baidu Analytics */}
                {process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                var _hmt = _hmt || [];
                (function() {
                  var hm = document.createElement("script");
                  hm.src = "https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID}";
                  var s = document.getElementsByTagName("script")[0]; 
                  s.parentNode.insertBefore(hm, s);
                })();
              `,
                        }}
                    />
                )}

                {/* Baidu auto-push for faster indexing */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(){
                var bp = document.createElement('script');
                var curProtocol = window.location.protocol.split(':')[0];
                if (curProtocol === 'https') {
                  bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
                } else {
                  bp.src = 'http://push.zhanzhang.baidu.com/push.js';
                }
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(bp, s);
              })();
            `,
                    }}
                />
            </head>
            <body className={`min-h-screen flex flex-col overflow-x-hidden font-sans`}>
                <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P3BSVQS6'} />
                
                <ClientLayoutWrapper>
                    {children}
                </ClientLayoutWrapper>

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
