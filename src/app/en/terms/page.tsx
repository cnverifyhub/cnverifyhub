'use client';

import Link from 'next/link';
import { ShieldCheck, FileText, CreditCard, RefreshCw, Lock, AlertTriangle, Scale, MessageCircle } from 'lucide-react';
import { getLocalizedPath } from '@/lib/i18n';

export default function TermsPageEn() {
    const lang = 'en';

    const sections = [
        {
            icon: FileText,
            title: 'Service Agreement',
            content: [
                'CNWePro is a digital account marketplace providing account services for Chinese social media and payment platforms including WeChat, Alipay, Douyin, and QQ.',
                'By using our services, you acknowledge that you have read, understood, and agree to all terms of this agreement.',
                'All accounts sold are intended for legitimate business purposes only (e.g., marketing, business testing). Users assume all risks associated with account usage.',
                'We reserve the right to modify this agreement at any time. Changes take effect immediately upon publication on the website.',
            ]
        },
        {
            icon: CreditCard,
            title: 'Payment Terms',
            content: [
                'All transactions are settled in USDT (TRC20 network).',
                'After payment, the system verifies transaction authenticity via TronScan blockchain verification.',
                'Please ensure you send the exact USDT amount to the designated receiving wallet address.',
                'Delays caused by blockchain network congestion are beyond our control.',
                'Please retain your Transaction Hash (TXID) after payment for order status inquiries.',
            ]
        },
        {
            icon: RefreshCw,
            title: 'Refund & Warranty Policy',
            content: [
                'All accounts come with a 72-hour quality guarantee period after delivery.',
                'During the warranty period, if an account experiences login issues or bans not caused by user actions, a free replacement will be provided.',
                'The following situations are NOT eligible for refund/replacement: account bans due to user-modified passwords/bindings, violations of platform rules, or issues reported after the warranty period.',
                'Refund requests must include order ID, TXID, and problem screenshots, sent via Telegram support.',
                'After review and confirmation, refunds will be processed within 24 hours in USDT to the original address.',
            ]
        },
        {
            icon: Lock,
            title: 'Privacy Protection',
            content: [
                'We only collect the minimum information necessary to complete transactions (Telegram username, email address).',
                'USDT cryptocurrency payments eliminate the need for bank card or personal identity information.',
                'Your contact information is used solely for order delivery and after-sales service, and will never be sold to third parties.',
                'This site uses SSL encryption for all data transmission.',
            ]
        },
        {
            icon: AlertTriangle,
            title: 'Disclaimer',
            content: [
                'We do not guarantee permanent account availability. Social media platforms may affect account status due to their own policy changes.',
                'Users must comply with the laws and regulations of their country/region and the terms of service of each social platform.',
                'All consequences arising from improper account use (including but not limited to spam, illegal activities) are the sole responsibility of the user.',
                'We are not liable for any indirect losses, lost profits, or data loss.',
            ]
        },
        {
            icon: Scale,
            title: 'Dispute Resolution',
            content: [
                'In case of transaction disputes, both parties should first attempt to resolve through friendly negotiation.',
                'All complaints and disputes should be submitted via Telegram support (@cnwechatpro) or email (support@cnwepro.com).',
                'We commit to providing an initial response within 24 hours of receiving a complaint.',
            ]
        },
    ];

    return (
        <div className="max-w-4xl mx-auto section-container py-12 md:py-24 min-h-[70vh]">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400 text-sm font-semibold mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    Platform Protection
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    Terms of Service & Policy
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Please read the following terms carefully. By using CNWePro services, you agree to this agreement.
                </p>
            </div>

            <div className="space-y-8">
                {sections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <div key={idx} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-500">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {idx + 1}. {section.title}
                                </h2>
                            </div>
                            <ul className="space-y-3 pl-2">
                                {section.content.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
                <MessageCircle className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Have Questions?</h3>
                <p className="text-sm text-slate-500 mb-4">
                    If you have any questions about our terms, please dont hesitate to contact our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="https://t.me/cnwechatpro" target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Telegram Support
                    </a>
                    <a href="mailto:support@cnwepro.com" className="btn-outline">
                        Email Us
                    </a>
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-8">
                Last Updated: March 12, 2026 · © CNWePro All Rights Reserved
            </p>
        </div>
    );
}
