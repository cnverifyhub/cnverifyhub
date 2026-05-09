'use client';

import { Shield, Zap, Clock, Award } from 'lucide-react';
import { type Lang } from '@/lib/i18n';
import { motion } from 'framer-motion';

const features = {
    zh: [
        {
            icon: Shield,
            color: '#00E5FF',
            title: '平台担保交易',
            sub: '资金安全',
            desc: '全程托管交易，买家付款后自动触发审核流程，100%正品保障，不满意全额退款。',
        },
        {
            icon: Zap,
            color: '#FF2D55',
            title: '极速自动发货',
            sub: '平均<5分钟',
            desc: 'USDT TRC20支付确认后，系统全自动发卡。无需人工干预，全年365天×24小时不间断。',
        },
        {
            icon: Clock,
            color: '#FFB800',
            title: '72小时质量保障',
            sub: '售后无忧',
            desc: '收货后72小时内如有问题，提供免费补发或全额退款。没有繁琐流程，直接联系客服即可。',
        },
        {
            icon: Award,
            color: '#07C160',
            title: '一手机房货源',
            sub: '品质源头',
            desc: '直接与国内账号机房合作，全部账号经过实名认证，无中间商，保证质量最高、价格最低。',
        },
    ],
    en: [
        {
            icon: Shield,
            color: '#00E5FF',
            title: 'Full Escrow Protection',
            sub: 'Secured Funds',
            desc: 'End-to-end escrow trading. Payment triggers automatic verification. 100% genuine accounts, full refund guaranteed.',
        },
        {
            icon: Zap,
            color: '#FF2D55',
            title: 'Instant Auto-Delivery',
            sub: 'Avg < 5 minutes',
            desc: 'USDT payment confirmed → account delivered automatically. No human delays, 365×24 uptime.',
        },
        {
            icon: Clock,
            color: '#FFB800',
            title: '72-Hour Warranty',
            sub: 'Worry-free After-Sale',
            desc: 'Any issue within 72 hours? Free replacement or full refund. No complex process — just contact support.',
        },
        {
            icon: Award,
            color: '#07C160',
            title: 'Direct Farm Source',
            sub: 'Premium Quality',
            desc: 'Direct partnership with account farms. All real-name verified. No middlemen — best quality at lowest price.',
        },
    ],
};

export function WhyChooseUs({ lang }: { lang: Lang }) {
    const items = features[lang];
    return (
        <section className="py-20 bg-[#060B18]">
            <div className="section-container">
                {/* Header */}
                <div className="mb-12">
                    <span className="section-eyebrow"># {lang === 'zh' ? '为什么选择我们' : 'WHY CHOOSE US'}</span>
                    <h2 className="section-title">
                        {lang === 'zh' ? '平台核心优势' : 'Platform Advantages'}
                    </h2>
                </div>

                {/* 4-panel horizontal grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="group relative bg-[#0D1526] border border-[#1E2D45] hover:border-[#00E5FF]/30 p-6 transition-all duration-250 overflow-hidden"
                        >
                            {/* Left accent */}
                            <div
                                className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
                                style={{ background: item.color, opacity: 0.5 }}
                            />
                            <div
                                className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100"
                                style={{ background: '#00E5FF', boxShadow: '0 0 10px rgba(0,229,255,0.5)' }}
                            />
                            {/* Glow hover bg */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                style={{ background: `radial-gradient(ellipse at 50% 0%, ${item.color}08 0%, transparent 70%)` }}
                            />
                            {/* Content */}
                            <div className="relative z-10">
                                <div
                                    className="w-10 h-10 rounded flex items-center justify-center mb-4"
                                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                                >
                                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                </div>
                                <p className="terminal-label mb-1" style={{ color: item.color }}>{item.sub}</p>
                                <h3 className="text-sm font-semibold text-[#F0F4FF] mb-3 leading-snug">{item.title}</h3>
                                <p className="text-xs text-[#7B91B0] leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
