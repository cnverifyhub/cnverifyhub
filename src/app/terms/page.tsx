'use client';

import Link from 'next/link';
import { ShieldCheck, FileText, CreditCard, RefreshCw, Lock, AlertTriangle, Scale, MessageCircle } from 'lucide-react';
import { getLocalizedPath } from '@/lib/i18n';

export default function TermsPage() {
    const lang = 'zh';

    const sections = [
        {
            icon: FileText,
            title: '服务协议',
            content: [
                'CNWePro 是一个数字账号交易平台，提供微信、支付宝、抖音、QQ 等中国社交媒体和支付平台的账号服务。',
                '使用本平台服务即表示您已阅读、理解并同意本协议的所有条款。',
                '本平台所售账号仅供合法商业用途（如营销推广、业务测试等），用户须自行承担使用风险。',
                '我们保留随时修改本协议的权利，修改后的协议将在网站上公布后立即生效。',
            ]
        },
        {
            icon: CreditCard,
            title: '支付条款',
            content: [
                '所有交易以 USDT（TRC20 网络）进行结算。',
                '付款后，系统将通过TronScan区块链验证交易真实性。',
                '请务必发送正确金额的 USDT 至指定的收款钱包地址。',
                '因区块链网络拥堵导致的延迟，不在本平台控制范围内。',
                '付款完成后请保留交易哈希（TXID），以便查询订单状态。',
            ]
        },
        {
            icon: RefreshCw,
            title: '退款与质保政策',
            content: [
                '所有账号在交付后提供 72 小时质量保证期。',
                '质保期内如账号出现登录异常、被封禁等非用户操作导致的问题，可申请免费换号。',
                '以下情况不适用退款/换号：用户自行修改密码/绑定信息导致封号、用户违反平台规则被封、超过质保期限的问题。',
                '退款请求需提供订单号、TXID 和问题截图，发送至 Telegram 客服。',
                '经审核确认后，退款将在 24 小时内以 USDT 原路退回。',
            ]
        },
        {
            icon: Lock,
            title: '隐私保护',
            content: [
                '我们仅收集完成交易所必需的最少信息（Telegram 用户名、邮箱地址）。',
                '使用 USDT 加密货币支付，无需提供银行卡或个人身份信息。',
                '您的联系信息仅用于订单交付和售后服务，不会出售给第三方。',
                '本站使用 SSL 加密传输所有数据。',
            ]
        },
        {
            icon: AlertTriangle,
            title: '免责声明',
            content: [
                '本平台不保证账号永久可用，社交媒体平台可能因其自身政策变更而影响账号状态。',
                '用户应遵守所在国家/地区的法律法规及各社交平台的服务条款。',
                '因用户不当使用账号（包括但不限于发送垃圾信息、从事违法活动）导致的一切后果由用户自行承担。',
                '本平台不对任何间接损失、利润损失或数据丢失承担责任。',
            ]
        },
        {
            icon: Scale,
            title: '争议解决',
            content: [
                '如发生交易争议，双方应首先通过友好协商解决。',
                '所有投诉和争议请通过 Telegram 客服（@cnwechatpro）或邮箱（support@cnwepro.com）提交。',
                '我们承诺在收到投诉后 24 小时内做出初步回复。',
            ]
        },
    ];

    return (
        <div className="max-w-4xl mx-auto section-container py-12 md:py-24 min-h-[70vh]">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400 text-sm font-semibold mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    平台保障
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                    服务条款与政策
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    请仔细阅读以下条款。使用 CNWePro 服务即表示您同意本协议。
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
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">有疑问？</h3>
                <p className="text-sm text-slate-500 mb-4">
                    如果您对条款有任何疑问，请随时联系我们的客服团队。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="https://t.me/cnwechatpro" target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Telegram 客服
                    </a>
                    <a href="mailto:support@cnwepro.com" className="btn-outline">
                        邮件联系
                    </a>
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-8">
                最后更新：2026年3月12日 · © CNWePro 保留所有权利
            </p>
        </div>
    );
}
