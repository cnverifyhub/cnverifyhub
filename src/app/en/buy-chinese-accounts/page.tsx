import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How to Buy Chinese Social & Trading Accounts | CNVerifyHub',
    description: 'Learn how to securely purchase verified WeChat, Alipay, and Douyin accounts outside of China.',
};

export default function BuyChineseAccounts() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to buy Chinese accounts internationally',
        description: 'A step-by-step guide to bypassing restrictions and buying verified Chinese accounts.',
        step: [
            {
                '@type': 'HowToStep',
                name: 'Choose the Account',
                text: 'Select from our verified WeChat or Alipay accounts.',
            },
            {
                '@type': 'HowToStep',
                name: 'Pay Securely',
                text: 'Use USDT cryptocurrency for private and secure checkout.',
            }
        ],
    };

    return (
        <article className="max-w-3xl mx-auto py-24 px-4 text-white">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <h1 className="text-4xl font-bold mb-6">How to Buy Chinese Accounts</h1>
            <p className="text-gray-300 mb-4">
                Accessing Chinese platforms like WeChat and Alipay can be difficult from abroad. Here is how CNVerifyHub makes it easy.
            </p>
        </article>
    );
}
