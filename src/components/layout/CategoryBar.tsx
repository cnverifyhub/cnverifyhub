'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { categories } from '@/data/products';
import { getLocalizedPath, getLangFromPath, t } from '@/lib/i18n';
import { 
    WeChatIcon, 
    AlipayIcon, 
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

export function CategoryBar() {
    const pathname = usePathname() || '/';
    const lang = getLangFromPath(pathname);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-[100px]" />;

    return (
        <div className="w-full bg-white dark:bg-dark-900 border-y border-slate-100 dark:border-slate-800 py-4 mb-8 overflow-hidden">
            <div className="section-container">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                        {t('home.categories.title', lang)}
                    </h3>
                    <Link 
                        href={getLocalizedPath('/pricing', lang)}
                        className="text-[10px] font-bold text-primary-500 hover:text-primary-600 transition-colors"
                    >
                        {t('category.viewAll', lang)} →
                    </Link>
                </div>
                
                {/* Responsive Layout: Flex row on desktop, wrap on mobile */}
                <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between gap-4 md:gap-6">
                    {categories.map((c, i) => {
                        const Icon = iconMap[c.id] || WeChatIcon;
                        return (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex-shrink-0"
                            >
                                <Link
                                    href={getLocalizedPath(c.href, lang)}
                                    className="flex flex-row lg:flex-col items-center gap-2 lg:gap-1.5 group"
                                >
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center p-1.5 lg:p-2 group-hover:scale-110 group-hover:shadow-md group-hover:border-primary-500/30 transition-all duration-300">
                                        <Icon className="w-full h-full" />
                                    </div>
                                    <span className="text-[11px] lg:text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors whitespace-nowrap">
                                        {c.name[lang].replace('账号', '')}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
