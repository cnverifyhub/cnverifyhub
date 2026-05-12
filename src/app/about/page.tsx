import type { Metadata } from 'next';
import { Shield, Users, Globe, Zap, Award, Heart, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: '关于我们 - CNVerifyHub | About Us',
    description: 'CNVerifyHub 是专业的中国数字账号交易平台，致力于为全球用户提供安全、便捷的微信、支付宝、抖音、QQ账号服务。About CNVerifyHub — the trusted Chinese digital account marketplace.',
    alternates: {
        canonical: `${SITE_URL}/about/`,
        languages: { 'zh-CN': `${SITE_URL}/about/`, 'en': `${SITE_URL}/en/about/` },
    },
    openGraph: {
        title: '关于 CNVerifyHub | About Us',
        description: '专业中国数字账号平台 — 50,000+ 成功订单',
    },
};

const stats = [
    { value: '50,000+', label: '成功订单', sublabel: 'Orders Completed' },
    { value: '3+', label: '年运营经验', sublabel: 'Years Experience' },
    { value: '24/7', label: '在线客服', sublabel: 'Live Support' },
    { value: '99.2%', label: '好评率', sublabel: 'Satisfaction Rate' },
];

const values = [
    { icon: Shield, title: '安全至上', titleEn: 'Security First', desc: '所有交易均通过USDT加密支付，保护您的隐私。72小时质保，让您无后顾之忧。', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { icon: Zap, title: '极速发货', titleEn: 'Instant Delivery', desc: '付款确认后5分钟内自动发货，行业领先的交付速度。无需等待，即买即用。', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: Users, title: '专业服务', titleEn: 'Expert Support', desc: '经验丰富的客服团队7×24小时在线，随时解答您的疑问。中英双语支持。', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { icon: Globe, title: '全球覆盖', titleEn: 'Global Reach', desc: '服务全球50+国家和地区的用户，支持多币种加密货币支付。', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { icon: Award, title: '品质保证', titleEn: 'Quality Guaranteed', desc: '严格筛选供应商，多重质检流程，确保每个账号的活跃度和安全性。', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
    { icon: Heart, title: '用户至上', titleEn: 'Customer Obsessed', desc: '倾听每一位客户的反馈，持续优化产品和服务。您的满意是我们的使命。', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/20' },
];

const milestones = [
    { year: '2023', event: '平台创立，专注微信账号服务' },
    { year: '2024', event: '扩展至支付宝、抖音、QQ全品类' },
    { year: '2025', event: '累计服务50,000+订单，好评率99.2%' },
    { year: '2026', event: '全新平台升级，支持自动化交付' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950">
            {/* Hero */}
            <section className="relative overflow-hidden bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />
                <div className="section-container py-16 md:py-24 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6">
                            <Globe className="w-4 h-4" />
                            关于我们 · About Us
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                            全球领先的
                            <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent"> 中国数字账号 </span>
                            交易平台
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            CNVerifyHub 致力于为全球用户提供安全、便捷、可靠的中国社交媒体与支付平台账号服务。凭借3年行业深耕，我们已成功完成超过50,000笔订单。
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800">
                <div className="section-container py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{stat.label}</div>
                                <div className="text-xs text-slate-400">{stat.sublabel}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="section-container py-16 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">
                        我们的故事
                    </h2>
                    <div className="bg-white dark:bg-dark-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            CNVerifyHub 诞生于一个简单的需求：海外企业和个人用户在拓展中国市场时，往往面临"无法注册中国社交账号"的难题。传统注册流程要求中国大陆手机号、身份证等本地化信息，让国际用户望而却步。
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            我们的团队深耕中国互联网行业多年，了解各平台的注册和验证机制。通过严格的供应商甄选和多重质检流程，我们确保每一个交付的账号都经过活跃度验证、安全检测和环境适配。
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            如今，CNVerifyHub 已发展为覆盖微信、支付宝、抖音、QQ四大平台的综合性账号服务商。支持USDT等加密货币匿名支付，保护用户隐私。我们的目标是：让每一位海外用户都能轻松接入中国数字生态。
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section-container pb-16 md:pb-20">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center">
                    核心价值观
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((v) => {
                        const Icon = v.icon;
                        return (
                            <div key={v.title} className="bg-white dark:bg-dark-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center ${v.color} mb-5`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{v.title}</h3>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">{v.titleEn}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Timeline */}
            <section className="section-container pb-16 md:pb-20">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center">
                    发展历程
                </h2>
                <div className="max-w-2xl mx-auto space-y-0">
                    {milestones.map((m, i) => (
                        <div key={m.year} className="flex gap-6 items-start">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg shadow-red-500/20">
                                    {m.year.slice(2)}
                                </div>
                                {i < milestones.length - 1 && <div className="w-0.5 h-16 bg-slate-200 dark:bg-slate-800" />}
                            </div>
                            <div className="pb-10">
                                <div className="text-sm font-black text-primary-600 dark:text-primary-400 mb-1">{m.year}</div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{m.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section-container pb-20">
                <div className="bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4aDZhNiA2IDAgMCAxIDAgMTJoLTZ6TTE4IDM2aDZhNiA2IDAgMCAxIDAgMTJoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black mb-4">准备好开始了吗？</h2>
                        <p className="text-white/80 mb-8 max-w-lg mx-auto">
                            浏览我们的账号分类，选择适合您的产品，5分钟内即可完成交付。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/pricing/" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-2xl font-black shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                                <CheckCircle2 className="w-5 h-5" />
                                查看全部产品
                            </Link>
                            <a href="https://t.me/cnverifyhub" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-black hover:bg-white/20 transition-all">
                                <Send className="w-5 h-5" />
                                Telegram 咨询
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
