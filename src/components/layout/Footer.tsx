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
    HelpCircle
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
    XiaohongshuIcon
} from '@/components/ui/BrandIcons';

const iconMap: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon
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
            icon: FileText,
            titleZh: '实名认证说明', 
            titleEn: 'ID Verification',
            gradient: 'from-blue-500/20 to-indigo-500/20',
            iconColor: 'text-blue-500',
            contentZh: '部分账号（如微信/支付宝）可能需要二次实名或特定设备登录。购买前请确保了解对应平台的风控规则。',
            contentEn: 'Some accounts may require ID verification or specific device login. Please understand platform rules before buying.'
        },
        { 
            id: 'warranty', 
            icon: Shield,
            titleZh: '售后质保条款', 
            titleEn: 'Warranty Terms',
            gradient: 'from-emerald-500/20 to-teal-500/20',
            iconColor: 'text-emerald-500',
            contentZh: '所有账号提供72小时首登质保。非账号质量问题（如由于IP不干净导致的封号）不在质保范围内。',
            contentEn: '72h first-login warranty. Issues caused by user IP or platform-specific bans are not covered.'
        },
        { 
            id: 'usage', 
            icon: Lock,
            titleZh: '使用规范', 
            titleEn: 'Usage Rules',
            gradient: 'from-orange-500/20 to-red-500/20',
            iconColor: 'text-orange-500',
            contentZh: '禁止将账号用于任何违法违规用途。若发现违规使用，本站有权立即收回账号并配合相关部门调查。',
            contentEn: 'Illegal use is strictly prohibited. We reserve the right to reclaim accounts used for non-compliant activities.'
        }
    ];

    return (
        <footer className="relative bg-white dark:bg-[#0a0a0f] pt-20 pb-24 md:pb-12 overflow-hidden z-10 border-t border-slate-100 dark:border-white/5">
            {/* Background Aesthetics */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            <div className="absolute -left-20 top-40 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full" />
            <div className="absolute -right-20 bottom-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
            
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                
                {/* 1. Service Commitment Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {[
                        { icon: Zap, title: lang === 'zh' ? '极速发货' : 'Instant', sub: lang === 'zh' ? '付款后自动秒发' : 'Auto Delivery', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                        { icon: ShieldCheck, title: lang === 'zh' ? '官方质保' : 'Warranty', sub: lang === 'zh' ? '72小时无忧售后' : '72h Guarantee', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { icon: Award, title: lang === 'zh' ? '高权老号' : 'Quality', sub: lang === 'zh' ? '严选实名优质老号' : 'Verified Accounts', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { icon: Clock, title: lang === 'zh' ? '全天支持' : '24/7 Support', sub: lang === 'zh' ? '专业售后实时在线' : 'Online Expert', color: 'text-purple-500', bg: 'bg-purple-500/10' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary-500/20 transition-all hover:translate-y-[-4px]">
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-slate-900 dark:text-white mb-1">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-tight uppercase">{item.sub}</p>
                        </div>
                    ))}
                </div>

                {/* 2. Impact Section: Risk & Purchase Notices */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                    <div className="lg:col-span-12 flex flex-col items-center text-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 mb-2">
                           <AlertTriangle className="w-3.5 h-3.5" />
                           Platform Safety Guidelines
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
                            {lang === 'zh' ? '账户安全及合规说明' : 'Account Safety & Compliance'}
                        </h3>
                    </div>

                    {/* Left: Risk Summary */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#1a1a24] dark:to-[#0a0a0f] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors" />
                        <div className="relative z-10">
                            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-orange-400" />
                                法律合规告知 / Legal Notice
                            </h4>
                            <p className="text-sm leading-relaxed text-slate-300 mb-8 opacity-80">
                                {lang === 'zh' 
                                    ? '本平台仅作为数字资产交易媒介，所有售出账号仅限用于合法合规的业务测试、技术研发等用途。严禁利用本平台账户从事包括但不限于诈骗、洗钱等违法活动。' 
                                    : 'Our platform acts only as a gateway for digital asset exchange. Purchased accounts must be used solely for legal business testing and R&D. Illegal activities are strictly prohibited.'}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    合法合规
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    安全测试
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Purchase Accordion */}
                    <div className="lg:col-span-7 space-y-3">
                        {purchaseNotices.map((notice) => {
                            const Icon = notice.icon;
                            const isOpen = openNotice === notice.id;
                            return (
                                <div 
                                    key={notice.id} 
                                    className={`group rounded-3xl border transition-all duration-300 ${isOpen ? 'bg-white dark:bg-white/5 shadow-xl border-primary-500/20' : 'bg-slate-50/50 dark:bg-white/5 border-transparent hover:bg-slate-100/50'}`}
                                >
                                    <button 
                                        onClick={() => toggleNotice(notice.id)}
                                        className="w-full flex items-center justify-between p-5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl ${notice.gradient} flex items-center justify-center ${notice.iconColor} group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-black text-sm text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                                                {lang === 'zh' ? notice.titleZh : notice.titleEn}
                                            </span>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-200/50 dark:bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary-500 text-white' : 'text-slate-400'}`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </button>
                                    <motion.div 
                                        initial={false}
                                        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-4">
                                            {lang === 'zh' ? notice.contentZh : notice.contentEn}
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Main Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 pt-16 border-t border-slate-100 dark:border-white/5">
                    {/* Brand Meta */}
                    <div className="lg:col-span-5">
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2 mb-6 group inline-flex">
                            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center p-2.5 shadow-xl shadow-primary-500/25 group-hover:rotate-6 group-hover:scale-110 transition-all">
                                <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-full h-full object-contain brightness-0 invert" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white leading-none">CNWePro</span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-widest uppercase mt-1">Digital Asset Authority</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium">
                            {t('site.description', lang)}
                        </p>
                        {/* Security Row */}
                        <div className="flex items-center gap-8">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 dark:border-white/5">
                                   <Lock className="w-4 h-4" />
                               </div>
                               <div>
                                   <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">SSL Secure</p>
                                   <p className="text-[9px] text-slate-400">256-bit Encrypted</p>
                               </div>
                           </div>
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 dark:border-white/5">
                                   < Globe className="w-4 h-4" />
                               </div>
                               <div>
                                   <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Cloudflare CDN</p>
                                   <p className="text-[9px] text-slate-400">Global Acceleration</p>
                               </div>
                           </div>
                        </div>
                    </div>

                    {/* Popular Categories */}
                    <div className="lg:col-span-4 translate-y-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600 mb-8 font-mono border-l-2 border-primary-500 pl-4">
                            {lang === 'zh' ? '人气分类' : 'Popular Categories'}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.slice(0, 6).map((c) => {
                                const Icon = iconMap[c.id] || WeChatIcon;
                                return (
                                    <Link 
                                        key={c.id} 
                                        href={getLocalizedPath(c.href, lang)}
                                        className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary-500/30 hover:shadow-lg transition-all group"
                                    >
                                        <div className="w-8 h-8 shrink-0 group-hover:scale-110 transition-transform">
                                            <Icon className="w-full h-full" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-500 transition-colors truncate">
                                            {c.name[lang]}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="lg:col-span-3 lg:pl-8 translate-y-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600 mb-8 font-mono border-l-2 border-primary-500 pl-4">
                            {lang === 'zh' ? '支持与导航' : 'Quick Access'}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { label: '常见问题', en: 'FAQ Center', icon: HelpCircle, href: '/faq' },
                                { label: '订单查询', en: 'Track Order', icon: Search, href: '/track' },
                                { label: '官方售后', en: 'Live Support', icon: LifeBuoy, href: 'https://t.me/cnwechatpro' },
                                { label: '隐私声明', en: 'Privacy', icon: Shield, href: '/privacy' }
                            ].map((item) => (
                                <Link 
                                    key={item.href}
                                    href={item.href.startsWith('http') ? item.href : getLocalizedPath(item.href, lang)}
                                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-colors"
                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-400 dark:text-slate-600 group-hover:text-primary-500 transition-colors">
                                            {item.icon && <item.icon className="w-4 h-4" />}
                                        </div>
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                                            {lang === 'zh' ? item.label : item.en}
                                        </span>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Support Contact Flex Bar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    <a href="https://t.me/cnwepro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 rounded-[2rem] bg-[#0088cc]/5 hover:bg-[#0088cc]/10 border border-[#0088cc]/10 transition-all group overflow-hidden relative">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-[#0088cc]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-14 h-14 bg-[#0088cc] rounded-2xl flex items-center justify-center p-3 shadow-2xl shadow-[#0088cc]/30 group-hover:scale-110 transition-transform">
                                <TelegramIcon className="w-full h-full brightness-0 invert" />
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 dark:text-white text-lg">Official Channel</h5>
                                <p className="text-xs text-slate-500 font-medium">Join 50k+ users for instant price updates & drops</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-[#0088cc] shadow-sm relative z-10">
                            <Send className="w-5 h-5" />
                        </div>
                    </a>
                    
                    <a href="https://t.me/cnwechatpro" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 rounded-[2rem] bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 transition-all group overflow-hidden relative">
                         <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
                         <div className="flex items-center gap-5 relative z-10">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center p-3 shadow-2xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 dark:text-white text-lg">7x24 Live Support</h5>
                                <p className="text-xs text-slate-500 font-medium">Speak with our platform experts for any account issues</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 relative z-10 mr-2">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active</span>
                                <div className="h-2 w-12 bg-emerald-500/20 rounded-full overflow-hidden mt-1">
                                    <div className="h-full w-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                {/* 5. Bottom Bar: Payments & Copyright */}
                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
                    {/* Copyright & Info */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase">
                            <span>京ICP备XXXXXXXX号-1</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                            <span>Trade Authority</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium text-center md:text-left">
                            © {new Date().getFullYear()} <span className="text-slate-950 dark:text-white font-black tracking-tighter text-sm">CNWePro</span>. High Performance Digital Asset Gateway. 🔏
                        </p>
                    </div>

                    {/* Highly Refined Payment Row */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {[
                            { icon: AlipayIcon, label: 'Alipay', w: 14, h: 4 },
                            { icon: WeChatIcon, label: 'WeChat', w: 14, h: 4 }
                        ].map((pay, i) => (
                            <div key={i} className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm opacity-50 hover:opacity-100 transition-all grayscale hover:grayscale-0 flex items-center justify-center">
                                <pay.icon className="w-16 h-4" />
                            </div>
                        ))}
                        <div className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm hover:border-emerald-500/20 transition-all flex items-center gap-2">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">T</div>
                            <span className="text-xs font-black tracking-tighter text-slate-900 dark:text-white italic">USDT<span className="text-[9px] opacity-40 ml-1">TRC20</span></span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 border-t border-white/20 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-white" />
                            <span className="text-[11px] font-black text-white italic tracking-tight">担保交易</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Final Background Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_20%,transparent_0%,rgba(0,0,0,0.02)_100%)] pointer-events-none" />
        </footer>
    );
}

// Mock Search icon
function Search(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
