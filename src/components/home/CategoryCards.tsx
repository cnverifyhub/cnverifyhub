import Link from 'next/link';
import { ArrowRight, Zap, Flame } from 'lucide-react';
import { categories, getTotalStock, getLowestPrice } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { 
    WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, 
    XianyuIcon, TaobaoIcon, XiaohongshuIcon,
    BundleIcon, VerificationIcon, FintechIcon
} from '@/components/ui/BrandIcons';

const iconMap: Record<string, { icon: React.ReactNode, accentColor: string, textColor: string }> = {
    wechat: { 
        icon: <WeChatIcon className="w-full h-full" />, 
        accentColor: '#07c160',
        textColor: 'text-[#07c160]'
    },
    alipay: { 
        icon: <AlipayIcon className="w-full h-full" />, 
        accentColor: '#1677ff',
        textColor: 'text-[#1677ff]'
    },
    douyin: { 
        icon: <DouyinIcon className="w-full h-full" />, 
        accentColor: '#000000',
        textColor: 'text-slate-900 dark:text-white'
    },
    qq: { 
        icon: <QQIcon className="w-full h-full" />, 
        accentColor: '#12b7f5',
        textColor: 'text-slate-900 dark:text-white'
    },
    xianyu: { 
        icon: <XianyuIcon className="w-full h-full" />, 
        accentColor: '#ffe400',
        textColor: 'text-slate-900 dark:text-white'
    },
    taobao: { 
        icon: <TaobaoIcon className="w-full h-full" />, 
        accentColor: '#ff5000',
        textColor: 'text-[#ff5000]'
    },
    xiaohongshu: { 
        icon: <XiaohongshuIcon className="w-full h-full" />, 
        accentColor: '#ff2442',
        textColor: 'text-slate-900 dark:text-white'
    },
    bundle: { 
        icon: <BundleIcon className="w-full h-full" />, 
        accentColor: '#8b5cf6',
        textColor: 'text-[#8b5cf6]'
    },
    verification: { 
        icon: <VerificationIcon className="w-full h-full" />, 
        accentColor: '#6366f1',
        textColor: 'text-[#6366f1]'
    },
    trading: { 
        icon: <FintechIcon className="w-full h-full" />, 
        accentColor: '#f59e0b',
        textColor: 'text-[#f59e0b]'
    },
};

export function CategoryCards({ lang }: { lang: Lang }) {
    const accountCategories = categories.filter(c => !['bundle', 'verification', 'trading'].includes(c.id));
    const bundleCategories = categories.filter(c => c.id === 'bundle');
    const serviceCategories = categories.filter(c => ['verification', 'trading'].includes(c.id));

    const renderCategoryGrid = (categoryList: typeof categories, title: string) => (
        <div className="mb-20 last:mb-0">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
                <h3 className="text-xl md:text-2xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                    {title}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {categoryList.map((category) => {
                    const stock = getTotalStock(category.id);
                    const lowestPrice = getLowestPrice(category.id);
                    const config = iconMap[category.id] || iconMap.wechat;

                    return (
                        <Link
                            key={category.id}
                            href={getLocalizedPath(category.href, lang)}
                            className="group relative bg-white dark:bg-dark-950/40 rounded-3xl p-4 sm:p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
                        >
                            {/* Hot Search Badges */}
                            {category.id === 'wechat' && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ff4d4f] to-[#ff8c00] text-white text-[9px] sm:text-xs font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current animate-pulse" />
                                    热搜霸榜
                                </div>
                            )}
                            {category.id === 'bundle' && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#8b5cf6] to-[#6366f1] text-white text-[9px] sm:text-xs font-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
                                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                                    极速发货
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 sm:mb-6 text-center sm:text-left">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                                        {config.icon}
                                    </div>
                                    <div className="flex-1 pt-0 sm:pt-1">
                                        <h3 className={`text-lg sm:text-xl md:text-2xl font-black ${config.textColor} tracking-tight mb-1 sm:mb-2`}>
                                            {category.name[lang]}
                                        </h3>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5">
                                            <span className="text-[8px] sm:text-[10px] font-bold bg-slate-50 text-slate-500 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-100 dark:border-white/5">官方质保</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 sm:mb-6 opacity-90 font-medium hidden sm:block">
                                    {category.description[lang]}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#07c160] animate-pulse" />
                                            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                有货
                                            </span>
                                        </div>
                                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-0.5">
                                            {stock} <span className="opacity-40 font-bold ml-1">PCS</span>
                                        </span>
                                    </div>

                                    <div className="bg-[#f8f9fb] dark:bg-white/5 p-3 sm:p-4 rounded-2xl flex items-center justify-between group-hover:bg-[#fff0f0] dark:group-hover:bg-red-500/5 transition-colors duration-300">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 leading-none">
                                                STARTING AT
                                            </span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#07c160] tracking-tighter">
                                                    {formatYuan(lowestPrice)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center group-hover:bg-[#ff5000] group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/25">
                                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <section id="categories" className="py-20 bg-white dark:bg-dark-900/50">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        {t('home.categories.title', lang)}
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        {t('home.categories.subtitle', lang)}
                    </p>
                </div>

                {renderCategoryGrid(accountCategories, lang === 'zh' ? '全球数字账号' : 'GLOBAL ACCOUNTS')}
                {renderCategoryGrid(bundleCategories, lang === 'zh' ? '多平台组合包' : 'COMBO BUNDLES')}
                {renderCategoryGrid(serviceCategories, lang === 'zh' ? '专业认证服务' : 'PROFESSIONAL SERVICES')}
            </div>
        </section>
    );
}
