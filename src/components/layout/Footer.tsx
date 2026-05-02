'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    MessageCircle, 
    Shield, 
    Clock, 
    ChevronDown, 
    AlertTriangle, 
    FileText, 
    Lock,
    Globe,
    ArrowUpRight,
    Zap,
    LifeBuoy,
    CheckCircle2,
    Award,
    HelpCircle,
    Search
} from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import Image from 'next/image';
import { 
    WeChatIcon, 
    AlipayIcon, 
    TelegramIcon,
    DouyinIcon,
    QQIcon,
    XianyuIcon,
    TaobaoIcon,
    XiaohongshuIcon,
    BundleIcon,
    VerificationIcon,
    FintechIcon
} from '@/components/ui/BrandIcons';

const iconMap: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
    bundle: BundleIcon,
    verification: VerificationIcon,
    fintech: FintechIcon
};

export default function Footer() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const [openNotice, setOpenNotice] = useState<string | null>(null);

    const toggleNotice = (id: string) => {
        setOpenNotice(openNotice === id ? null : id);
    };

    const purchaseNotices = [
        { 
            id: 'real-name', 
            icon: ShieldCheck,
            titleZh: '合规实名认证', 
            titleEn: 'Real-Name KYC',
            gradient: 'from-emerald-500/20 to-teal-500/20',
            iconColor: 'text-[#07C160]',
            contentZh: '响应国家法规政策，部分核心资产业务需要二次实名核验。确保账户财产安全。合法合规交易。',
            contentEn: 'Compliant with regulations, some core services require real-name KYC for asset security.'
        },
        { 
            id: 'warranty', 
            icon: Shield,
            titleZh: '官方72H质保', 
            titleEn: '72H Warranty',
            gradient: 'from-[#1677ff]/20 to-blue-500/20',
            iconColor: 'text-[#1677ff]',
            contentZh: '全站商品支持72小时包首登质保。由于买家本地网络IP不纯净导致的账号封禁/异常不在售后范围，请务必保证网络环境安全。',
            contentEn: '72h first-login warranty. Account bans due to user unclean IP/network are not covered.'
        },
        { 
            id: 'usage', 
            icon: Lock,
            titleZh: '规范使用协议', 
            titleEn: 'TOS Agreement',
            gradient: 'from-[#FF0036]/20 to-[#FF5000]/20',
            iconColor: 'text-[#FF0036]',
            contentZh: '本站所有数字资产仅限合法业务测试及研究使用。严禁用于任何违法诈骗、洗钱等刑事违规使用。违者直接冻结报警。',
            contentEn: 'Assets are for legal business testing only. Illegal activities will result in an immediate ban.'
        }
    ];

    return (
        <footer className="relative bg-white dark:bg-[#0a0a0f] pt-10 pb-20 md:pb-8 overflow-hidden z-20 border-t-2 border-[#FF0036] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(255,255,255,0.02)]">
            {/* Background Aesthetics */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF0036] to-transparent opacity-50" />
            <div className="absolute -left-20 top-20 w-96 h-96 bg-[#FF0036]/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -right-20 bottom-0 w-96 h-96 bg-[#1677ff]/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 relative z-30">
                
                {/* 1. High-Density Trust Badges Banner (Taobao Style) */}
                <div className="flex flex-wrap justify-between items-center gap-4 py-6 border-b border-slate-100 dark:border-white/5 mb-8">
                    {[
                        { icon: Zap, title: lang === 'zh' ? '极速秒发' : 'Instant Delivery', color: 'text-[#FF5000]' },
                        { icon: ShieldCheck, title: lang === 'zh' ? '正规一手渠道' : 'Verified Source', color: 'text-[#07C160]' },
                        { icon: Award, title: lang === 'zh' ? '金牌老店' : 'Premium Store', color: 'text-[#FFD700]' },
                        { icon: Lock, title: lang === 'zh' ? '加密担保交易' : 'Escrow Secured', color: 'text-[#1677ff]' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 lg:gap-3 group">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs lg:text-sm tracking-wide">{item.title}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
                    {/* Left: Chinese SEO & About (Dense text strategy) */}
                    <div className="md:col-span-2 lg:col-span-4">
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2 mb-4 group inline-flex">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF0036] to-[#FF5000] rounded-xl flex items-center justify-center p-2 shadow-lg shadow-[#FF0036]/20">
                                <Image src="/logo.png" alt="Logo" width={32} height={32} className="w-full h-full object-contain brightness-0 invert" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">CNWePro</span>
                                <span className="text-[10px] font-bold text-[#FF0036] tracking-widest mt-1">官方正品 · 安全保证</span>
                            </div>
                        </Link>
                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4 font-medium text-justify">
                            {lang === 'zh' ? 'CNWePro是全网领先的数字资产服务保障平台。致力于提供优质的微信、支付宝、抖音、小红书等高权重一手机房老号。使用USDT匿名结算，全网独家TRC20自动发卡验证系统。' : 'Premium Chinese Digital Asset Gateway providing high-authority accounts with exclusive instant TRC20 verification system.'}
                        </p>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-1.5 bg-[#07C160]/10 border border-[#07C160]/20 text-[#07C160] px-2 py-1 rounded text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> 百分百真人号
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#1677ff]/10 border border-[#1677ff]/20 text-[#1677ff] px-2 py-1 rounded text-[10px] font-bold">
                                <ShieldCheck className="w-3 h-3" /> 平台担保
                            </div>
                        </div>
                    </div>

                    {/* Middle: Fast Links (Dense Grid) */}
                    <div className="md:col-span-1 lg:col-span-5 grid grid-cols-3 gap-2 lg:gap-4">
                        <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                                <div className="w-1 h-3 bg-[#FF0036] rounded-full" />
                                {lang === 'zh' ? '热销专区' : 'Top Categories'}
                            </h4>
                            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-2.5 gap-x-4">
                                {categories.slice(0, 8).map(c => {
                                    const Icon = iconMap[c.id] || WeChatIcon;
                                    return (
                                        <li key={c.id}>
                                            <Link href={getLocalizedPath(c.href, lang)} className="text-[11px] lg:text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#FF0036] dark:hover:text-[#FF0036] flex items-center gap-1.5 transition-colors">
                                                <Icon className="w-3.5 h-3.5" /> <span className="truncate">{c.name[lang]}</span> {c.id === 'bundle' && <span className="text-[9px] bg-[#FF0036] text-white px-1 rounded-sm shrink-0">HOT</span>}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                                <div className="w-1 h-3 bg-[#1677ff] rounded-full" />
                                {lang === 'zh' ? '客户服务' : 'Support'}
                            </h4>
                            <ul className="space-y-2.5">
                                {[
                                    { label: '帮助中心', en: 'FAQ Center', icon: HelpCircle, href: '/faq' },
                                    { label: '订单查询', en: 'Track Order', icon: Search, href: '/track' },
                                    { label: '在线客服', en: 'Live Support', icon: LifeBuoy, href: 'https://t.me/cnwechatpro' },
                                    { label: '隐私合规', en: 'Privacy', icon: Shield, href: '/privacy' }
                                ].map((item, idx) => (
                                    <li key={idx}>
                                        <Link href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} className="text-[11px] lg:text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#1677ff] dark:hover:text-[#1677ff] flex items-center gap-1.5 transition-colors">
                                            <item.icon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{lang === 'zh' ? item.label : item.en}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                                <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                {lang === 'zh' ? '资源' : 'Resources'}
                            </h4>
                            <ul className="space-y-2.5">
                                {[
                                    { label: '博客首页', en: 'Blog Home', icon: FileText, href: getLocalizedPath('/blog', lang) },
                                    { label: '最新文章', en: 'Latest Posts', icon: AlertTriangle, href: getLocalizedPath('/blog', lang) },
                                    { label: '安全指南', en: 'Security Guide', icon: ShieldCheck, href: getLocalizedPath('/blog/wechat-security-guide', lang) },
                                    { label: '营销技巧', en: 'Marketing Tips', icon: ArrowUpRight, href: getLocalizedPath('/blog/wechat-marketing-strategies', lang) }
                                ].map((item, idx) => (
                                    <li key={idx}>
                                        <Link href={item.href} className="text-[11px] lg:text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-500 flex items-center gap-1.5 transition-colors">
                                            <item.icon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{lang === 'zh' ? item.label : item.en}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Security & Notice Accordions (Compact) */}
                    <div className="md:col-span-1 lg:col-span-3">
                         <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                            <div className="w-1 h-3 bg-red-500 rounded-full" />
                            {lang === 'zh' ? '重要安全须知' : 'Security Notice'}
                        </h4>
                        <div className="space-y-2">
                            {purchaseNotices.map((notice) => {
                                const Icon = notice.icon;
                                const isOpen = openNotice === notice.id;
                                return (
                                    <div key={notice.id} className={`rounded-lg border transition-all ${isOpen ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                        <button onClick={() => toggleNotice(notice.id)} className="w-full flex items-center justify-between p-2.5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                                                <Icon className={`w-3.5 h-3.5 ${notice.iconColor}`} />
                                                {lang === 'zh' ? notice.titleZh : notice.titleEn}
                                            </div>
                                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div className="px-3 pb-3 text-[11px] leading-relaxed text-slate-500 border-t border-slate-100 dark:border-white/5 pt-2">
                                                {lang === 'zh' ? notice.contentZh : notice.contentEn}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Payments & Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/5 mt-8">
                    {/* Copyright & Info */}
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                            <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-300">营业执照</Link>
                            <span className="w-px h-2.5 bg-slate-300 dark:bg-slate-700" />
                            <span>京ICP备XXXXXXXX号-1</span>
                            <span className="w-px h-2.5 bg-slate-300 dark:bg-slate-700" />
                            <Link href="#" className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-300"><Shield className="w-3 h-3 text-red-500" />网安备案主体</Link>
                        </div>
                        <p className="text-[10px] text-slate-400">
                            © {new Date().getFullYear()} CNWePro. All Rights Reserved. 专业数字资产交易网.
                        </p>
                    </div>

                    {/* Highly Refined Payment Row */}
                    <div className="flex items-center gap-3">
                        <div className="px-2 py-1 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                            <AlipayIcon className="w-12 h-4 text-[#1677ff]" />
                        </div>
                        <div className="px-2 py-1 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                            <WeChatIcon className="w-12 h-4 text-[#07C160]" />
                        </div>
                        <div className="px-2 py-1 rounded bg-white dark:bg-white/5 border border-[#07C160]/30 flex items-center gap-1 shadow-sm">
                            <div className="w-4 h-4 bg-[#07C160] rounded-sm flex items-center justify-center text-[9px] text-white font-black">T</div>
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">USDT-TRC20</span>
                        </div>
                        <div className="px-3 py-1 rounded bg-gradient-to-r from-[#FF0036] to-[#FF5000] shadow-md shadow-[#FF0036]/20 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-white" />
                            <span className="text-[11px] font-bold text-white tracking-wide">官方担保</span>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}


