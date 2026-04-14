import Link from 'next/link';
import { ArrowRight, Zap, Flame } from 'lucide-react';
import { categories, getTotalStock, getLowestPrice } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import { MessageCircle, Wallet, Music, Tv2, ShoppingBag, Store, Camera } from 'lucide-react';

const iconMap: Record<string, { icon: React.ReactNode, bgClass: string }> = {
    wechat: { icon: <MessageCircle className="w-full h-full text-emerald-500" />, bgClass: 'bg-emerald-50/50 border border-emerald-100 shadow-sm' },
    alipay: { icon: <Wallet className="w-full h-full text-blue-500" />, bgClass: 'bg-blue-50/50 border border-blue-100 shadow-sm' },
    douyin: { icon: <Music className="w-full h-full text-slate-800 dark:text-white" />, bgClass: 'bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm' },
    qq: { icon: <Tv2 className="w-full h-full text-sky-500" />, bgClass: 'bg-sky-50/50 border border-sky-100 shadow-sm' },
    xianyu: { icon: <ShoppingBag className="w-full h-full text-amber-500" />, bgClass: 'bg-amber-50/50 border border-amber-100 shadow-sm' },
    taobao: { icon: <Store className="w-full h-full text-orange-500" />, bgClass: 'bg-orange-50/50 border border-orange-100 shadow-sm' },
    xiaohongshu: { icon: <Camera className="w-full h-full text-red-500" />, bgClass: 'bg-red-50/50 border border-red-100 shadow-sm' },
};

export function CategoryCards({ lang }: { lang: Lang }) {
    return (
        <section id="categories" className="py-20 bg-slate-50/50 dark:bg-dark-900/50">
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

                        return (
                            <Link
                                key={category.id}
                                href={getLocalizedPath(category.href, lang)}
                                className="group relative bg-white dark:bg-dark-950 rounded-2xl md:rounded-3xl p-4 md:p-5 lg:p-6 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/10 overflow-hidden flex flex-col h-full"
                            >
                                {/* Hot Search Badges (Taobao style) */}
                                {category.id === 'wechat' && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-l from-[#ff4d4f] to-[#ff8c00] text-white text-[10px] sm:text-xs font-black tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-2xl md:rounded-tr-3xl z-20 shadow-md flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 fill-current animate-pulse opacity-90" />
                                        热搜霸榜
                                    </div>
                                )}
                                {category.id === 'alipay' && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-indigo-500 text-white text-[10px] sm:text-xs font-black tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-2xl md:rounded-tr-3xl z-20 shadow-md flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5 fill-current opacity-90" />
                                        近期爆款
                                    </div>
                                )}
                                {category.id === 'douyin' && (
                                    <div className="absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] text-[10px] sm:text-xs font-black tracking-widest px-3 py-1 rounded-br-xl rounded-tl-2xl md:rounded-tl-3xl z-20 shadow-md flex items-center gap-1">
                                        新晋黑马
                                    </div>
                                )}

                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 ${iconMap[category.icon].bgClass} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none`}></div>

                                {/* Large Faded Background Overlay Icon - Animates on hover */}
                                <div className="absolute -right-4 -top-4 w-28 h-28 md:w-36 md:h-36 opacity-[0.04] dark:opacity-[0.03] group-hover:opacity-[0.1] dark:group-hover:opacity-[0.08] transform scale-90 group-hover:scale-100 group-hover:rotate-6 transition-all duration-500 ease-out pointer-events-none rounded-2xl overflow-hidden z-0">
                                    {iconMap[category.icon].icon}
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* App Icon with Hover Animation - Tilts organically on hover */}
                                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${iconMap[category.icon].bgClass} flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300 overflow-hidden group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-xl`}>
                                            {iconMap[category.icon].icon}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors tracking-tight leading-none mb-2">
                                                {category.name[lang]}
                                            </h3>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                <span className="text-[10px] bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/30">官方认证</span>
                                                <span className="text-[10px] bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-900/30">极速响应</span>
                                            </div>
                                            <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight opacity-80">
                                                {category.description[lang]}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                {t('category.inStock', lang)}: <span className="font-bold text-slate-700 dark:text-slate-300 ml-0.5">{stock}</span>
                                            </span>
                                            <div className="flex items-center gap-1 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                                <Wallet className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                                <MessageCircle className="w-4 h-4 text-slate-500 group-hover:text-emerald-500" />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-dark-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 group-hover:bg-red-50/50 group-hover:border-red-100 transition-all duration-300">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-0.5">起售价 / Starting at</span>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-xl md:text-2xl font-black text-red-600 transition-transform group-hover:scale-110">
                                                        {formatYuan(lowestPrice)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-9 h-9 rounded-full bg-white dark:bg-dark-800 shadow-md flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-tr group-hover:from-red-500 group-hover:to-orange-500 group-hover:shadow-red-500/40 group-hover:scale-110">
                                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
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
