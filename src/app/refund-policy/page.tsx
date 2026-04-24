import type { Metadata } from 'next';
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle, MessageCircle, Send, ArrowRight } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '退款与质保政策 - CNWePro | Refund & Warranty Policy',
    description: 'CNWePro 退款政策：72小时质保、免费换号、USDT原路退款。了解完整的售后保障条款。Refund & warranty policy — 72h guarantee, free replacements, USDT refunds.',
    alternates: {
        canonical: `${SITE_URL}/refund-policy/`,
        languages: { 'zh-CN': `${SITE_URL}/refund-policy/`, 'en': `${SITE_URL}/en/refund-policy/` },
    },
};

const timeline = [
    { step: 1, title: '发现问题', desc: '在72小时质保期内发现账号异常（登录失败、被封禁等）。', icon: AlertTriangle, color: 'text-amber-500' },
    { step: 2, title: '提交申请', desc: '通过 Telegram 或邮件联系客服，提供订单号、TXID、问题截图。', icon: MessageCircle, color: 'text-blue-500' },
    { step: 3, title: '审核处理', desc: '客服在6小时内完成审核，确认问题原因。', icon: Clock, color: 'text-purple-500' },
    { step: 4, title: '换号/退款', desc: '审核通过后24小时内完成换号或USDT原路退款。', icon: CheckCircle2, color: 'text-emerald-500' },
];

const eligible = [
    '购买后72小时内账号无法正常登录',
    '收到的账号信息与购买类型不符',
    '账号在质保期内被平台封禁（非用户操作导致）',
    '未收到账号信息（付款已确认）',
];

const ineligible = [
    '超过72小时质保期限的问题',
    '用户自行修改密码、绑定信息导致的封号',
    '用户违反社交平台使用规则导致的封禁',
    '用户从事违法活动导致的账号冻结',
    '因用户设备环境（VPN、IP异常）导致的风控触发',
    '主观不满意（如"账号不够活跃"等非缺陷问题）',
];

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            {/* Hero */}
            <section className="bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 py-16 md:py-20">
                <div className="section-container text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        售后保障 · Warranty & Refund
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                        退款与质保政策
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        CNWePro 承诺为每一位客户提供透明、公正的售后保障。所有账号均享有 <span className="font-bold text-emerald-600 dark:text-emerald-400">72 小时质量保证期</span>。
                    </p>
                </div>
            </section>

            <div className="section-container py-12 md:py-16 max-w-4xl mx-auto space-y-12">
                {/* Core Promise */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/30 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">72 小时无忧质保</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
                        自账号交付起 72 小时内，如出现非用户操作导致的质量问题，我们提供免费换号或全额退款服务。
                    </p>
                </div>

                {/* Refund Process Timeline */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <div className="w-1 h-5 bg-primary-500 rounded-full" />
                        退款/换号流程
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {timeline.map((t) => {
                            const Icon = t.icon;
                            return (
                                <div key={t.step} className="flex gap-4 bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                                    <div className={`w-12 h-12 rounded-xl bg-slate-50 dark:bg-dark-800 flex items-center justify-center ${t.color} shrink-0`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 mb-1">步骤 {t.step}</div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Eligible / Ineligible */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-dark-900 rounded-2xl p-7 border border-emerald-200 dark:border-emerald-900/30">
                        <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-5 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            可申请退款/换号
                        </h3>
                        <ul className="space-y-3">
                            {eligible.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-dark-900 rounded-2xl p-7 border border-red-200 dark:border-red-900/30">
                        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-5 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            不适用退款/换号
                        </h3>
                        <ul className="space-y-3">
                            {ineligible.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-7">
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        重要说明
                    </h3>
                    <ul className="space-y-2 text-sm text-amber-900/80 dark:text-amber-300/80">
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0" />
                            退款以 USDT (TRC20) 原路退回，处理时间为审核通过后 24 小时内。
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0" />
                            区块链网络手续费（Gas Fee）由平台承担，您将收到全额退款。
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0" />
                            换号服务：我们将在审核通过后立即发送同类型替换账号。
                        </li>
                        <li className="flex items-start gap-2">
                            <ArrowRight className="w-3.5 h-3.5 mt-1 shrink-0" />
                            批量订单的退款/换号政策可能有所不同，具体请联系客服确认。
                        </li>
                    </ul>
                </div>

                {/* Contact CTA */}
                <div className="text-center bg-white dark:bg-dark-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
                    <MessageCircle className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">需要售后帮助？</h3>
                    <p className="text-sm text-slate-500 mb-6">请准备好订单号和问题截图，联系我们的客服团队。</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="https://t.me/cnwechatpro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#24A1DE] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                            <Send className="w-4 h-4" />
                            Telegram 客服
                        </a>
                        <a href="mailto:support@cnwepro.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-dark-800 transition-all">
                            邮件联系
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
