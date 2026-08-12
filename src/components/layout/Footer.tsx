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
import { useTenantConfig } from '@/components/providers/TenantProvider';

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
    const tenantConfig = useTenantConfig();
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const telegramLink = tenantConfig.id === 'cnwepro' ? 'https://t.me/cnwepro_support' : 'https://t.me/cnverifyhub';
    const badgeText = tenantConfig.id === 'cnwepro' ? 'CW' : 'CV';

    const support = [
        { label: { zh: '帮助中心', en: 'FAQ Center' },     icon: HelpCircle,   href: '/faq' },
        { label: { zh: '订单追踪', en: 'Track Order' },    icon: ShieldCheck,  href: '/track' },
        { icon: MessageSquare, label: { zh: '客服', en: 'Support' }, href: telegramLink, external: true },
        { label: { zh: '隐私政策', en: 'Privacy' },        icon: Shield,       href: '/privacy' },
        { label: { zh: '退款政策', en: 'Refund Policy' },  icon: FileText,     href: '/refund-policy' },
    ];

    const blog = [
        { label: { zh: '博客首页', en: 'Blog Home' },       href: getLocalizedPath('/blog', lang) },
        { label: { zh: '安全指南', en: 'Security Guide' },  href: getLocalizedPath('/blog/avoid-wechat-account-suspension', lang) },
        { label: { zh: '实名教程', en: 'KYC Tutorial' },    href: getLocalizedPath('/blog/wechat-passport-realname-verification', lang) },
    ];

    return (
        <footer className="relative bg-[#030711] border-t-0">
            {/* Multi-color gradient top border */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#FF0036] via-[#00E5FF] to-[#07C160]" />

            {/* ── Live stats bar ──────────────────── */}
            <div className="border-b border-[#1E2D45]/60 bg-[#060B18]/50 backdrop-blur-md">
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
                            <div className="w-6 h-6 rounded flex items-center justify-center text-white font-syne font-black text-[10px] leading-none" style={{ backgroundColor: tenantConfig.branding.primary }}>
                                {badgeText}
                            </div>
                            <span className="font-syne font-bold text-base text-white">
                                {tenantConfig.name}
                            </span>
                        </Link>
                        <p className="text-xs text-[#7B91B0] leading-relaxed mb-5 max-w-xs">
                            {lang === 'zh'
                                ? `${tenantConfig.name}是全网领先的中国数字资产交易平台。专注提供高权重一手老号，USDT 自动发卡，全程担保交易，72小时质保。`
                                : `${tenantConfig.name} is the leading Chinese digital asset exchange. High-authority aged accounts, USDT auto-delivery, full escrow, 72H warranty.`}
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
                            <span className="text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded font-bold">USDT (TRC20/ERC20)</span>
                            {tenantConfig.id === 'cnverifyhub' && (
                                <>
                                    <span className="text-[10px] text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-1 rounded font-bold">Alipay</span>
                                    <span className="text-[10px] text-green-400 border border-green-500/30 bg-green-500/10 px-2 py-1 rounded font-bold">WeChat Pay</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-2">
                        <p className="terminal-label mb-4">{lang === 'zh' ? '商品分类' : 'CATEGORIES'}</p>
                        <ul className="space-y-2.5">
                            {categories.slice(0, 5).map((cat) => (
                                <li key={cat.id}>
                                    <Link href={getLocalizedPath(cat.href, lang)} className="text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors">
                                        {cat.name[lang]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <p className="terminal-label mb-4">{lang === 'zh' ? '更多服务' : 'SERVICES'}</p>
                        <ul className="space-y-2.5">
                            {categories.slice(5).map((cat) => (
                                <li key={cat.id}>
                                    <Link href={getLocalizedPath(cat.href, lang)} className="text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors">
                                        {cat.name[lang]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <p className="terminal-label mb-4">{lang === 'zh' ? '客户服务' : 'SUPPORT'}</p>
                        <ul className="space-y-2.5">
                            {support.map((item, i) => (
                                <li key={i}>
                                    {item.external ? (
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors">
                                            {item.label[lang]}
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </a>
                                    ) : (
                                        <Link href={getLocalizedPath(item.href, lang)} className="text-xs text-[#7B91B0] hover:text-[#F0F4FF] transition-colors">
                                            {item.label[lang]}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 flex flex-col justify-between">
                        <div>
                            <p className="terminal-label mb-4">{lang === 'zh' ? '最新文章' : 'BLOG'}</p>
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
                        </div>
                        {/* Telegram CTA with enhanced hover effects */}
                        <a
                            href={telegramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1E2D45] hover:border-[#00E5FF]/60 bg-[#0D1526]/80 hover:bg-[#00E5FF]/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] text-xs font-medium text-[#7B91B0] hover:text-white"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                            <span className="font-semibold">{lang === 'zh' ? '加入官方频道' : 'Join Official Channel'}</span>
                            <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </a>
                    </div>
                </div>
            </div>

            {/* ── Glassmorphic Metallic Security Badges Bottom Bar ──────────────────────── */}
            <div className="border-t border-[#1E2D45]/60 bg-[#060B18]/70 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-[10px] text-[#7B91B0] font-mono">
                        {tenantConfig.name} © 2026. {lang === 'zh' ? '专业中国账号交易平台' : 'Professional Chinese Account Platform'}. All Rights Reserved.
                    </p>

                    {/* Metallic Glassmorphism Badges (SSL 256-bit, TRC20 Fast Settlement, Escrow Guarantee) */}
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/50 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] text-[10px] font-bold text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>SSL 256-Bit Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/50 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] text-[10px] font-bold text-cyan-400">
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            <span>TRC20 Instant Settlement</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/50 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] text-[10px] font-bold text-amber-400">
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <span>Escrow Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile safe-area spacer */}
            <div className="h-safe-area-inset-bottom md:hidden" />
        </footer>
    );
}
