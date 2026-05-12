'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Zap, FileText, Shield, HelpCircle, ArrowUpRight, ExternalLink, MessageSquare } from 'lucide-react';
import { getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import {
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon,
    XianyuIcon, TaobaoIcon, XiaohongshuIcon,
    BundleIcon, VerificationIcon, FintechIcon
} from '@/components/ui/BrandIcons';

const iconMap: Record<string, React.ElementType> = {
    wechat: WeChatIcon, alipay: AlipayIcon, douyin: DouyinIcon,
    qq: QQIcon, xianyu: XianyuIcon, taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon, bundle: BundleIcon,
    verification: VerificationIcon, trading: FintechIcon,
};

const liveStats = [
    { label: { zh: '今日订单', en: 'Today Orders' }, value: '1,247' },
    { label: { zh: '在线用户', en: 'Online Users' }, value: '3,241' },
    { label: { zh: '平均发货', en: 'Avg Delivery' }, value: '<5min' },
    { label: { zh: '用户评分', en: 'User Rating' }, value: '4.97★' },
];

export default function Footer() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);

    const support = [
        { label: { zh: '帮助中心', en: 'FAQ Center' },     icon: HelpCircle,   href: '/faq' },
        { label: { zh: '订单追踪', en: 'Track Order' },    icon: ShieldCheck,  href: '/track' },
        { icon: MessageSquare, label: { zh: '客服', en: 'Support' }, href: 'https://t.me/cnverifyhub', external: true },
        { label: { zh: '隐私政策', en: 'Privacy' },        icon: Shield,       href: '/privacy' },
        { label: { zh: '退款政策', en: 'Refund Policy' },  icon: FileText,     href: '/refund-policy' },
    ];

    const blog = [
        { label: { zh: '博客首页', en: 'Blog Home' },       href: getLocalizedPath('/blog', lang) },
        { label: { zh: '安全指南', en: 'Security Guide' },  href: getLocalizedPath('/blog/avoid-wechat-account-suspension', lang) },
        { label: { zh: '实名教程', en: 'KYC Tutorial' },    href: getLocalizedPath('/blog/wechat-passport-realname-verification', lang) },
    ];

    return (
        <footer className="bg-[#030711] border-t border-[#1E2D45]">

            {/* ── Live stats bar ──────────────────── */}
            <div className="border-b border-[#1E2D45]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-[#1E2D45]">
                        {liveStats.map((s, i) => (
                            <div key={i} className={`flex flex-col items-center py-6 gap-0.5 ${i % 2 !== 0 && i < 2 ? 'border-l' : ''} ${i >= 2 ? 'border-t md:border-t-0 md:border-l' : ''} ${i === 2 ? 'md:border-l border-[#1E2D45]' : ''} border-[#1E2D45]`}>
                                <p className="font-mono-price text-base font-bold text-[#F0F4FF]">{s.value}</p>
                                <p className="text-[9px] text-[#7B91B0] uppercase tracking-wider">{s.label[lang]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main grid ───────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

                    {/* Brand column */}
                    <div className="lg:col-span-4">
                        <Link href={getLocalizedPath('/', lang)} className="inline-flex items-center gap-2 mb-4 group">
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-[#FF2D55] text-white font-syne font-black text-[10px] leading-none">
                                CV
                            </div>
                            <span className="font-syne font-bold text-base text-white">
                                CN<span className="text-[#00E5FF]">Verify</span>Hub
                            </span>
                        </Link>
                        <p className="text-xs text-[#7B91B0] leading-relaxed mb-5 max-w-xs">
                            {lang === 'zh'
                                ? 'CNVerifyHub是全网领先的中国数字资产交易平台。专注提供高权重一手老号，USDT TRC20自动发卡，全程担保交易，72小时质保。'
                                : 'CNVerifyHub is the leading Chinese digital asset exchange. High-authority aged accounts, USDT auto-delivery, full escrow, 72H warranty.'}
                        </p>
                        {/* Trust chips */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {[
                                { label: lang === 'zh' ? '百分百正品' : '100% Genuine',  color: '#07C160' },
                                { label: lang === 'zh' ? '平台担保'   : 'Escrow',        color: '#00E5FF' },
                                { label: lang === 'zh' ? '实名老号'   : 'Real-name',     color: '#FFB800' },
                            ].map((chip) => (
                                <span
                                    key={chip.label}
                                    className="text-[9px] font-bold px-2 py-1 rounded border"
                                    style={{ color: chip.color, borderColor: `${chip.color}30`, background: `${chip.color}0D` }}
                                >
                                    {chip.label}
                                </span>
                            ))}
                        </div>
                        {/* Payment methods */}
                        <p className="terminal-label mb-2">{lang === 'zh' ? '支付方式' : 'PAYMENT'}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                            {[
                                { label: 'USDT-TRC20', color: '#07C160', bg: '#07C16015' },
                                { label: 'USDT-ERC20', color: '#1677ff', bg: '#1677ff15' },
                                { label: 'Alipay',     color: '#1677ff', bg: '#1677ff10' },
                                { label: 'WeChat Pay', color: '#07C160', bg: '#07C16010' },
                            ].map((p) => (
                                <span
                                    key={p.label}
                                    className="text-[9px] font-mono font-bold px-2 py-1 rounded border"
                                    style={{ color: p.color, borderColor: `${p.color}30`, background: p.bg }}
                                >
                                    {p.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Categories column */}
                    <div className="lg:col-span-3">
                        <h4 className="terminal-label mb-4">{lang === 'zh' ? '全部品类' : 'CATEGORIES'}</h4>
                        <ul className="space-y-2.5">
                            {categories.map(c => {
                                const Icon = iconMap[c.id] || WeChatIcon;
                                return (
                                    <li key={c.id}>
                                        <Link
                                            href={getLocalizedPath(c.href, lang)}
                                            className="flex items-center gap-2 text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors group"
                                        >
                                            <Icon className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
                                            <span>{c.name[lang]}</span>
                                            {(c.id === 'verification' || c.id === 'trading') && (
                                                <span className="text-[8px] font-black text-[#00E5FF] border border-[#00E5FF]/25 px-1 rounded ml-auto">NEW</span>
                                            )}
                                            {c.id === 'bundle' && (
                                                <span className="text-[8px] font-black text-[#FF2D55] border border-[#FF2D55]/25 px-1 rounded ml-auto">HOT</span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Support column */}
                    <div className="lg:col-span-2">
                        <h4 className="terminal-label mb-4">{lang === 'zh' ? '客户支持' : 'SUPPORT'}</h4>
                        <ul className="space-y-2.5">
                            {support.map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        target={(item as any).external ? '_blank' : undefined}
                                        rel={(item as any).external ? 'noopener noreferrer' : undefined}
                                        className="flex items-center gap-2 text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors"
                                    >
                                        <item.icon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                        {item.label[lang]}
                                        {(item as any).external && <ExternalLink className="w-2.5 h-2.5 opacity-40 ml-auto" />}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Blog / Resources */}
                    <div className="lg:col-span-3">
                        <h4 className="terminal-label mb-4">{lang === 'zh' ? '安全资讯' : 'RESOURCES'}</h4>
                        <ul className="space-y-2.5 mb-6">
                            {blog.map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="flex items-center gap-2 text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors">
                                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                        {item.label[lang]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/* Telegram CTA */}
                        <a
                            href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}` : 'https://t.me/cnverifyhub'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded border border-[#1E2D45] hover:border-[#00E5FF]/40 bg-[#0D1526] hover:bg-[#142035] transition-all text-xs font-medium text-[#7B91B0] hover:text-white group"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                            {lang === 'zh' ? '加入官方频道' : 'Join Official Channel'}
                            <ExternalLink className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-100" />
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ──────────────────────── */}
            <div className="border-t border-[#1E2D45]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-[10px] text-[#7B91B0] font-mono">
                        CNVerifyHub © 2026. {lang === 'zh' ? '专业中国账号交易平台' : 'Professional Chinese Account Platform'}. All Rights Reserved.
                    </p>

                    {/* ICP + Public security badges */}
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        {/* ICP badge */}
                        <div className="flex items-center gap-1.5 border border-[#1E2D45] rounded px-2.5 py-1.5">
                            <div className="flex flex-col items-center justify-center w-7 h-5 bg-[#2f3542] rounded-sm relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-0.5 bg-[#FF2D55]" />
                                <span className="text-[7px] text-white font-black leading-none">ICP</span>
                            </div>
                            <div>
                                <p className="text-[9px] font-mono font-bold text-[#7B91B0] leading-none">京ICP备20240918号-1</p>
                                <p className="text-[7px] text-[#7B91B0]/60 uppercase tracking-tight">{lang === 'zh' ? '工业和信息化部' : 'MIIT Registered'}</p>
                            </div>
                        </div>
                        {/* Public security badge */}
                        <Link
                            href="https://www.beian.gov.cn/"
                            target="_blank"
                            className="flex items-center gap-1.5 border border-[#1E2D45] rounded px-2.5 py-1.5 hover:border-[#00E5FF]/30 transition-colors"
                        >
                            <div className="w-5 h-5 bg-[#1e3799] rounded-sm flex items-center justify-center shrink-0">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <p className="text-[9px] font-mono font-bold text-[#7B91B0] leading-none">京公网安备 11010502052468号</p>
                                <p className="text-[7px] text-[#7B91B0]/60 uppercase tracking-tight">{lang === 'zh' ? '公安网备案' : 'Public Security'}</p>
                            </div>
                        </Link>
                        {/* SSL badge */}
                        <div className="flex items-center gap-1.5 border border-[#07C160]/20 rounded px-2.5 py-1.5 bg-[#07C160]/5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#07C160]" />
                            <span className="text-[9px] font-bold text-[#07C160]">SSL Secured</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile safe-area spacer */}
            <div className="h-safe-area-inset-bottom md:hidden" />
        </footer>
    );
}
