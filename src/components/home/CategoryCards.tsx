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
    fintech: { 
        icon: <FintechIcon className="w-full h-full" />, 
        accentColor: '#10b981',
        textColor: 'text-[#10b981]'
    },
};

export function CategoryCards({ lang }: { lang: Lang }) {
    return (
        <section id="categories" className="py-20 bg-[#f8f9fb] dark:bg-dark-900/50">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('home.categories.title', lang)}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('home.categories.subtitle', lang)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                    {categories.map((category) => {
                        const stock = getTotalStock(category.id);
                        const lowestPrice = getLowestPrice(category.id);
                        const config = iconMap[category.id] || iconMap.wechat;

                        return (
                            <Link
                                key={category.id}
                                href={getLocalizedPath(category.href, lang)}
                                className="group relative bg-white/40 dark:bg-dark-950/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-white/5 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
                            >
                                {/* Hot Search Badges */}
                                {category.id === 'wechat' && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ff4d4f] to-[#ff8c00] text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
                                        <Flame className="w-3 h-3 fill-current animate-pulse" />
                                        热搜霸榜
                                    </div>
                                )}
                                {category.id === 'alipay' && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#5271ff] to-[#1677ff] text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-bl-xl z-20 shadow-sm flex items-center gap-1">
                                        <Zap className="w-3 h-3 fill-current" />
                                        近期爆款
                                    </div>
                                )}
                                {category.id === 'douyin' && (
                                    <div className="absolute top-0 left-0 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-br-xl z-20 shadow-sm">
                                        新晋黑马
                                    </div>
                                )}

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 transform group-hover:scale-110 transition-transform duration-500">
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <h3 className={`text-xl md:text-2xl font-black ${config.textColor} tracking-tight mb-2 flex items-center gap-2`}>
                                                {category.name[lang]}
                                            </h3>
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                <span className="text-[10px] font-bold bg-red-50/50 text-red-500 dark:bg-red-500/10 px-2 py-0.5 rounded-md border border-red-100/50 dark:border-red-500/20">官方认证</span>
                                                <span className="text-[10px] font-bold bg-orange-50/50 text-orange-500 dark:bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-100/50 dark:border-orange-500/20">极速响应</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-6 opacity-90 font-medium">
                                        {category.description[lang]}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between mb-4 px-1">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-[#07c160] animate-pulse" />
                                                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                    有货
                                                </span>
                                            </div>
                                            <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-0.5">
                                                {stock} 个 <ArrowRight className="w-3 h-3 opacity-30" />
                                            </span>
                                        </div>

                                        <div className="bg-white/40 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between group-hover:bg-[#fff0f0] dark:group-hover:bg-red-500/5 transition-colors duration-300">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 leading-none">
                                                    起售价 / Starting at
                                                </span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl md:text-3xl font-black text-[#07c160] tracking-tighter">
                                                        {formatYuan(lowestPrice)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center group-hover:bg-[#ff5000] group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/25">
                                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
