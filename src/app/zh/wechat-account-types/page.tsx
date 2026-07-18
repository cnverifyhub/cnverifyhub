import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '微信实名号种类区别 - 白号、老号、满月号解析',
    description: '深入分析微信白号、老号、满月号及实名号的区别，帮助您选择最适合业务的微信账号。',
};

export default function WechatAccountTypes() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: '微信账号种类全面解析',
        description: '白号与老号的区别及应用场景分析',
        author: {
            '@type': 'Organization',
            name: 'CNVerifyHub'
        }
    };

    return (
        <article className="max-w-3xl mx-auto py-24 px-4 text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <h1 className="text-4xl font-bold mb-6">微信实名号种类区别</h1>
            <p className="text-gray-300 mb-4">
                白号、满月号、半年号和企业号究竟有何区别？本页面为您提供详细解答。
            </p>
        </article>
    );
}
