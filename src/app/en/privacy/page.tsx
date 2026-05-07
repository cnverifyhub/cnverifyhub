'use client';

import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';
import { t, getLangFromPath } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

export default function PrivacyPage() {
    const pathname = usePathname();
    const lang = getLangFromPath(pathname);

    const sections = [
        {
            icon: <Shield className="w-6 h-6 text-emerald-500" />,
            title: lang === 'zh' ? '信息安全' : 'Data Security',
            content: lang === 'zh' 
                ? '我们采用行业标准的加密技术保护您的交易数据。所有支付均通过去中心化的USDT网络进行，不记录您的银行或信用卡隐私信息。' 
                : 'We use industry-standard encryption to protect your transaction data. All payments are processed via the decentralized USDT network, ensuring no bank or credit card details are stored.',
        },
        {
            icon: <Eye className="w-6 h-6 text-blue-500" />,
            title: lang === 'zh' ? '隐私保护' : 'Privacy Protection',
            content: lang === 'zh'
                ? '本平台承诺不会向任何第三方泄露您的个人联系信息。我们仅收集必要的交付信息（如Telegram ID）用于完成订单。'
                : 'We promise not to disclose your personal contact information to any third party. We only collect necessary delivery info (like Telegram ID) to fulfill your orders.',
        },
        {
            icon: <Lock className="w-6 h-6 text-amber-500" />,
            title: lang === 'zh' ? '账号保密' : 'Account Confidentiality',
            content: lang === 'zh'
                ? '一旦账号成功交付并由客户确认，我们将从服务器中彻底删除该账号的敏感凭据（如初始密码），确保您的账号独占权。'
                : 'Once an account is delivered and confirmed, sensitive credentials (like original passwords) are permanently deleted from our servers to ensure exclusive ownership.',
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-dark-950 transition-colors">
            <div className="section-container max-w-4xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        {lang === 'zh' ? '您的数据安全与隐私是我们的首要任务' : 'Your data security and privacy are our top priorities'}
                    </p>
                </div>

                <div className="space-y-6">
                    {sections.map((section, i) => (
                        <div 
                            key={i} 
                            className="bg-white dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all animate-fade-in-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        {section.title}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black mb-2">{lang === 'zh' ? '有任何隐私疑问？' : 'Privacy Questions?'}</h3>
                            <p className="opacity-90">{lang === 'zh' ? '联系我们的合规团队获取详细解答' : 'Contact our compliance team for detailed answers'}</p>
                        </div>
                        <a 
                            href="https://t.me/cnwechatpro" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-white text-indigo-600 font-black rounded-2xl hover:bg-indigo-50 transition-colors flex items-center gap-2 shrink-0 shadow-lg"
                        >
                            {lang === 'zh' ? '立即咨询' : 'Contact Now'}
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div className="mt-12 text-center text-slate-400 dark:text-slate-600 text-sm animate-fade-in">
                    <p>{lang === 'zh' ? '最后更新日期：2026年5月8日' : 'Last Updated: May 8, 2026'}</p>
                </div>
            </div>
        </div>
    );
}
