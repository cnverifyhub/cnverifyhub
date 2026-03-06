import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
    title: {
        template: '%s | CNWePro',
        default: 'CNWePro - 专业中国数字账号交易平台',
    },
    description: '安全可靠的微信、支付宝、抖音、QQ账号交易平台。实名认证号、绑卡号、白号、老号应有尽有。USDT支付，即时发货。',
    keywords: '海外充值,微信号购买,支付宝账号出售,抖音号批发,QQ号购买,实名微信号,USDT购买微信号,微信企业号出售',
    openGraph: {
        type: 'website',
        siteName: 'CNWePro',
        title: 'CNWePro - 专业中国数字账号交易平台',
        description: '安全可靠的微信、支付宝、抖音、QQ账号交易平台。USDT支付，即时发货。',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CNWePro - 专业中国数字账号交易平台',
        description: '安全可靠的微信、支付宝、抖音、QQ账号交易平台。USDT支付，即时发货。',
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL,
        languages: {
            'zh-CN': process.env.NEXT_PUBLIC_SITE_URL,
            'en': `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
        }
    },
    robots: 'index, follow',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh" className="scroll-smooth" suppressHydrationWarning>
            <head>
                {/* Preload critical fonts */}
                <link rel="preload" href="/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/fonts/noto-sans-sc-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

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
            <body className="min-h-screen flex flex-col pt-16 md:pt-20">
                <Header />

                <main className="flex-grow">
                    {children}
                </main>

                <CartDrawer lang="zh" />
                <Footer />
                <MobileNav />
            </body>
        </html>
    );
}
