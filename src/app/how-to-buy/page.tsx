import type { Metadata } from 'next';
import { ShoppingCart, Search, CreditCard, Download, ShieldCheck, HelpCircle, Send, CheckCircle2, ArrowRight, Wallet, Smartphone, Clock } from 'lucide-react';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: '如何购买 - 购买指南 | How to Buy - CNVerifyHub',
    description: '5分钟学会在CNVerifyHub购买微信、支付宝、抖音、QQ账号。支持USDT TRC20支付，即买即用。Step-by-step guide to buying Chinese social accounts with USDT.',
    alternates: {
        canonical: `${SITE_URL}/how-to-buy/`,
        languages: { 'zh-CN': `${SITE_URL}/how-to-buy/`, 'en': `${SITE_URL}/en/how-to-buy/` },
    },
};

const steps = [
    {
        step: 1,
        icon: Search,
        title: '选择账号类型',
        titleEn: 'Choose Account Type',
        desc: '浏览微信、支付宝、抖音、QQ四大分类，根据您的需求选择合适的账号等级（白号、实名号、绑卡号、高级号等）。',
        tip: '💡 不确定选哪个？查看每个产品的详细说明，或联系客服获取推荐。',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        step: 2,
        icon: ShoppingCart,
        title: '加入购物车',
        titleEn: 'Add to Cart',
        desc: '选好产品后，设置购买数量。批量购买享受阶梯折扣（10件起8折，50件起更低）。点击"加入购物车"或"立即购买"。',
        tip: '💰 新用户首单可享受额外折扣，请关注 Telegram 频道获取最新优惠码。',
        color: 'from-orange-500 to-red-500',
    },
    {
        step: 3,
        icon: CreditCard,
        title: 'USDT 支付',
        titleEn: 'Pay with USDT',
        desc: '系统生成唯一的USDT (TRC20) 收款地址。使用您的加密钱包发送对应金额。推荐使用 TronLink、Trust Wallet、OKX 等主流钱包。',
        tip: '⚠️ 请务必通过 TRC20 网络发送，其他网络（ERC20等）发送的资金可能无法到账。',
        color: 'from-emerald-500 to-teal-500',
    },
    {
        step: 4,
        icon: Download,
        title: '确认收货',
        titleEn: 'Receive Account',
        desc: '区块链确认后（通常1-3分钟），系统自动处理您的订单。账号信息将通过页面和 Telegram 双渠道推送给您。',
        tip: '📱 收到账号后，请立即按照《账号安全指南》进行登录和养号操作。',
        color: 'from-purple-500 to-pink-500',
    },
];

const faqs = [
    { q: '我没有USDT怎么办？', a: '您可以在主流交易所（如 Binance、OKX、Bybit）使用信用卡或银行转账购买 USDT，然后提币到 TRC20 地址即可。' },
    { q: '付款后多久能收到账号？', a: '付款经区块链确认后（约1-3分钟），系统将自动处理并发货。正常情况下5分钟内即可收到。' },
    { q: '可以批量购买吗？', a: '当然可以！10件起享8折优惠，50件起价格更低。超过200件请直接联系 Telegram 客服获取最低出厂价。' },
    { q: '账号有售后保障吗？', a: '所有账号均享72小时质保。质保期内如有非用户操作导致的问题，免费换号或全额退款。' },
];

export default function HowToBuyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            {/* Hero */}
            <section className="bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 py-16 md:py-20">
                <div className="section-container text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                        <ShoppingCart className="w-4 h-4" />
                        购买指南 · How to Buy
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                        4步完成购买，<span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">5分钟发货</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        从浏览到收货，全程极简操作。支持 USDT (TRC20) 加密货币匿名支付。
                    </p>

                    {/* Quick badges */}
                    <div className="flex flex-wrap gap-3 justify-center mt-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-900/30">
                            <Wallet className="w-3.5 h-3.5" />
                            USDT TRC20
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900/30">
                            <Clock className="w-3.5 h-3.5" />
                            5分钟发货
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-200 dark:border-purple-900/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            72小时质保
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="section-container py-16 md:py-20">
                <div className="max-w-3xl mx-auto space-y-8">
                    {steps.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.step} className="bg-white dark:bg-dark-900 rounded-3xl p-7 md:p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-5">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-black text-slate-400 tracking-widest">STEP {s.step}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{s.title}</h3>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">{s.titleEn}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{s.desc}</p>
                                        <div className="bg-slate-50 dark:bg-dark-800 rounded-xl px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                                            {s.tip}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Mini FAQ */}
            <section className="section-container pb-16 md:pb-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary-500" />
                        常见问题
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{faq.q}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-container pb-20">
                <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-8 md:p-12 text-white">
                    <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-black mb-3">准备好了？开始购买</h2>
                    <p className="text-white/70 mb-8 text-sm">选择您需要的账号类型，即刻开始</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/wechat/" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-600 rounded-xl font-black hover:shadow-xl transition-all">
                            微信账号
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/alipay/" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-black hover:bg-white/20 transition-all">
                            支付宝账号
                        </Link>
                        <Link href="/douyin/" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-black hover:bg-white/20 transition-all">
                            抖音账号
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
