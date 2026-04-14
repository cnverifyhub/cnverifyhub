'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, MessageCircle, Send, Wallet, Shield, Clock, Headphones, Award, ChevronDown, AlertTriangle, FileText, Lock } from 'lucide-react';
import { t, getLangFromPath, getLocalizedPath } from '@/lib/i18n';
import { categories } from '@/data/products';
import Image from 'next/image';
import { WeChatIcon, AlipayIcon, TelegramIcon } from '@/components/ui/BrandIcons';

const categoryIcons: Record<string, React.ReactNode> = {
    wechat: <Image src="https://play-lh.googleusercontent.com/QbSSiRcodmWx6HlezOtNu3vmZeuFqkQZQQO5Y2-Zg_jBRm-mXjhlXX5yFj8iphfqzQ" alt="WeChat" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
    alipay: <Image src="https://play-lh.googleusercontent.com/quzvssC112NXIlt4YBkclEo7f9ZnhaNtZ5fvaCs_P19X7KL71DiUqd2ysR8ZHsTaRTY" alt="Alipay" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
    douyin: <Image src="https://play-lh.googleusercontent.com/xey8dXOB53LtCR97JhDH7T-6np_sUBBE9iF7WP4Sp6T55oO28e6hic1LFTklCELw9Iw" alt="Douyin" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
    qq: <Image src="https://play-lh.googleusercontent.com/2U-E-AGFKKEI-k6oRndaHvAsOpYZmBWm5hgpP0pVP5MTClOhk3fL3f_Sbl--9dnbUh0" alt="QQ" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
    xianyu: <Image src="https://play-lh.googleusercontent.com/eaX5GSrLgAvCTKAe8N0baDkKA0gJ3siyG9X28sfmSO8yBmKVfPDQyJ3y_AvcCr8DSYU" alt="Xianyu" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
    taobao: <Image src="https://play-lh.googleusercontent.com/6F3ONMR_UowQyqKud-bqqz5iWHGtleHEWTPZEoUiWPJj02R9hPL-agPCt_C3KYQLYi8" alt="Taobao" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
    xiaohongshu: <Image src="https://play-lh.googleusercontent.com/c6Ipks61J7b4qgJMxo965UqsSo0M7ZwTDzQrmLKeBNneCk2gub-RitqSC-fnrmLGXTk3mNEceiBN5N3i26BmYHc" alt="Xiaohongshu" width={24} height={24} unoptimized className="w-full h-full object-contain" />,
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
            contentZh: '部分账号（如微信/支付宝）可能需要二次实名或特定设备登录。购买前请确保了解对应平台的风控规则。',
            contentEn: 'Some accounts may require ID verification or specific device login. Please understand platform rules before buying.'
        },
        { 
            id: 'warranty', 
            icon: Shield,
            titleZh: '售后质保条款', 
            titleEn: 'Warranty Terms',
            contentZh: '所有账号提供72小时首登质保。非账号质量问题（如由于IP不干净导致的封号）不在质保范围内。',
            contentEn: '72h first-login warranty. Issues caused by user IP or platform-specific bans are not covered.'
        },
        { 
            id: 'usage', 
            icon: Lock,
            titleZh: '使用规范', 
            titleEn: 'Usage Rules',
            contentZh: '禁止将账号用于任何违法违规用途。若发现违规使用，本站有权立即收回账号并配合相关部门调查。',
            contentEn: 'Illegal use is strictly prohibited. We reserve the right to reclaim accounts used for non-compliant activities.'
        }
    ];

    return (
        <footer className="relative bg-[#f5f5f5] dark:bg-[#0a0a0e] pt-12 pb-20 md:pb-10 overflow-hidden text-[#666] dark:text-[#999] text-[12px]">
            
            {/* 1. Risk Warning Banner */}
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-1">风险提示 / Risk Warning</p>
                        <p className="leading-relaxed">
                            {lang === 'zh' 
                                ? '本站所销售之账号资源仅供学习、测试及合规交流使用。请用户务必在遵守当地法律法规的前提下进行操作。因非法使用、违规操作产生的一切法律后果由使用者自行承担，本站概不负责。' 
                                : 'The accounts sold here are for testing and educational purposes only. Users must comply with local laws. We are not responsible for any legal issues arising from misuse.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Purchase Notice Accordion */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {lang === 'zh' ? '购买须知' : 'Purchase Notice'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {purchaseNotices.map((notice) => {
                        const Icon = notice.icon;
                        const isOpen = openNotice === notice.id;
                        return (
                            <div key={notice.id} className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <button 
                                    onClick={() => toggleNotice(notice.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                        <Icon className="w-4 h-4" />
                                        {lang === 'zh' ? notice.titleZh : notice.titleEn}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 animate-fade-in text-[11px] leading-relaxed">
                                        {lang === 'zh' ? notice.contentZh : notice.contentEn}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Main Footer Links & Trust */}
            <div className="max-w-7xl mx-auto px-4 border-t border-slate-200 dark:border-slate-800 pt-10 pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-2 space-y-4">
                        <Link href={getLocalizedPath('/', lang)} className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Logo" width={32} height={32} />
                            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">CNWePro</span>
                        </Link>
                        <p className="max-w-sm line-clamp-3">
                            {t('site.description', lang)}
                        </p>
                        {/* Security Certs */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <Lock className="w-3.5 h-3.5" />
                                <span className="font-bold">SSL加密</span>
                            </div>
                            <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="font-bold">256位安全证书</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{lang === 'zh' ? '服务指南' : 'Guides'}</h4>
                        <ul className="space-y-2">
                            <li><Link href={getLocalizedPath('/about', lang)} className="hover:text-red-500">关于我们</Link></li>
                            <li><Link href={getLocalizedPath('/faq', lang)} className="hover:text-red-500">常见问题</Link></li>
                            <li><Link href={getLocalizedPath('/terms', lang)} className="hover:text-red-500">服务条款</Link></li>
                            <li><Link href={getLocalizedPath('/privacy', lang)} className="hover:text-red-500">隐私政策</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{lang === 'zh' ? '官方社群' : 'Community'}</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="https://t.me/cnwepro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                    <TelegramIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">Telegram 频道</p>
                                        <p className="text-[10px] text-slate-500">最新账号 & 动态更新</p>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="https://t.me/cnwechatpro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                    <div className="relative">
                                        <TelegramIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-dark-950"></span>
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">7x24 在线售后</p>
                                        <p className="text-[10px] text-slate-500">专业人工极速回复</p>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* QR Code / Trust Logos */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">{lang === 'zh' ? '支付方式' : 'Payments'}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800 grayscale hover:grayscale-0 transition-all">
                                <AlipayIcon className="w-16 h-4" />
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800 grayscale hover:grayscale-0 transition-all">
                                <WeChatIcon className="w-16 h-4" />
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800 grayscale hover:grayscale-0 transition-all">
                                <div className="text-[10px] font-black tracking-tighter text-emerald-600">USDT</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800 grayscale hover:grayscale-0 transition-all">
                                <div className="text-[10px] font-black tracking-tighter text-amber-600">金牌担保</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Deep Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 border-t border-slate-200/60 dark:border-slate-800/40 py-8 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 opacity-70">
                    <p>© {new Date().getFullYear()} CNWePro. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <p className="font-mono">京ICP备XXXXXXXX号</p>
                        <p>Powered by CNWePro Team</p>
                    </div>
                </div>
            </div>

            {/* Background Aesthetic Line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />
        </footer>
    );
}
