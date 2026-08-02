import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { getTenantConfigFromHeaders } from '@/lib/tenant-server';
import { TenantProvider } from '@/components/providers/TenantProvider';

export async function generateMetadata(): Promise<Metadata> {
    const config = getTenantConfigFromHeaders();
    const SITE_URL = `https://${config.domain}`;

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            template: `%s | ${config.name} - ${config.psychology.headlines[0]}`,
            default: `${config.name} - ${config.psychology.headlines[0]} | Buy Verified Accounts`,
        },
        description: `${config.name}: ${config.psychology.subheadlines.join(' ')}. ${config.delivery.promiseText} (${config.delivery.promiseSubtext}).`,
        keywords: [
            '微信号购买', '买微信号', '微信账号出售', '微信号批发', '微信老号购买',
            '支付宝账号购买', '支付宝实名号', '支付宝企业号',
            '抖音号购买', '抖音账号出售', '抖音万粉号', '抖音蓝V号',
            'QQ号购买', 'QQ靓号', 'QQ太阳号',
            '海外充值', '中国账号购买', 'USDT购买微信号', '加密货币购买中国账号',
            '数字账号交易平台', '账号批发', '实名微信号出售',
            'buy wechat account', 'wechat account for sale', 'buy chinese wechat',
            'buy alipay account', 'verified alipay account',
            'buy douyin account', 'tiktok china account', 'buy douyin followers',
            'buy qq account', 'qq number for sale',
            'chinese social media accounts', 'buy chinese accounts with crypto',
            'USDT payment chinese accounts', 'instant delivery wechat',
        ].join(', '),
        authors: [{ name: config.name, url: SITE_URL }],
        creator: config.name,
        publisher: config.name,
        formatDetection: {
            telephone: false,
            email: false,
        },
        icons: {
            icon: [
                { url: config.branding.favicon || '/favicon.svg', type: 'image/svg+xml' },
            ],
            apple: [
                { url: config.branding.logo || '/logo.png' },
            ],
        },
        openGraph: {
            type: 'website',
            siteName: config.name,
            locale: 'zh_CN',
            alternateLocale: 'en_US',
            title: `${config.name} - ${config.psychology.headlines[0]}`,
            description: config.psychology.subheadlines[0],
            url: SITE_URL,
            images: [
                {
                    url: `${SITE_URL}/api/og`,
                    width: 1200,
                    height: 630,
                    alt: `${config.name} - ${config.psychology.headlines[0]}`,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${config.name} - ${config.psychology.headlines[0]}`,
            description: config.psychology.subheadlines[0],
            images: [`${SITE_URL}/api/og`],
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
        },
        other: {
            'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
            'applicable-device': 'pc,mobile',
            'mobile-agent': `format=html5; url=${SITE_URL}`,
            'sogou_site_verification': process.env.NEXT_PUBLIC_SOGOU_VERIFICATION || '',
            'content-language': 'zh-CN, en',
            'renderer': 'webkit',
            'force-rendering': 'webkit',
        },
    };
}

export const viewport: Viewport = {
    themeColor: '#FF0036',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const tenantConfig = getTenantConfigFromHeaders();
    const SITE_URL = `https://${tenantConfig.domain}`;
    const telegramUrl = tenantConfig.id === 'cnwepro' ? 'https://t.me/cnwepro_support' : 'https://t.me/cnverifyhub';

    // JSON-LD Structured Data
    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: tenantConfig.name,
        url: SITE_URL,
        logo: `${SITE_URL}${tenantConfig.branding.logo}`,
        description: `${tenantConfig.name} - ${tenantConfig.psychology.subheadlines[0]}`,
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: telegramUrl,
                availableLanguage: ['Chinese', 'English'],
            }
        ],
        sameAs: [
            telegramUrl,
        ],
    };

    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: tenantConfig.name,
        url: SITE_URL,
        description: tenantConfig.psychology.headlines[0],
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

    const headersList = headers();
    const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || headersList.get('referer') || '';
    const isEnglish = pathname.includes('/en/') || pathname.endsWith('/en');
    const lang = isEnglish ? 'en' : 'zh';

    return (
        <html lang={lang} className="scroll-smooth" suppressHydrationWarning>
            <head>
                {/* Preconnect to external domains for China speed */}
                <link rel="preconnect" href="https://mybzjmhyxamldklezngu.supabase.co" />
                <link rel="dns-prefetch" href="https://hm.baidu.com" />
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
            </head>
            <body 
                className={`min-h-screen flex flex-col overflow-x-hidden font-sans`}
                style={{
                    '--color-primary': tenantConfig.branding.primary,
                    '--color-secondary': tenantConfig.branding.secondary,
                    '--color-accent': tenantConfig.branding.accent,
                    '--color-background': tenantConfig.branding.background,
                    '--color-surface': tenantConfig.branding.surface,
                } as React.CSSProperties}
            >
                <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-P3BSVQS6'} />
                <GoogleAnalytics gaId="G-YKJ9S5L36F" />
                
                <TenantProvider initialConfig={tenantConfig}>
                    <ClientLayoutWrapper>
                        {children}
                    </ClientLayoutWrapper>
                </TenantProvider>

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}

