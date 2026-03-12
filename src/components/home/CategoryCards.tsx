import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, ShoppingBag, Video, UserCircle2, ArrowRight, Zap, Flame } from 'lucide-react';
import { categories, getTotalStock, getLowestPrice } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatUsdt } from '@/lib/utils';

// Configured width/height specifically for next/image. priority=true since these are usually above the fold on load.
const iconMap: Record<string, { icon: React.ReactNode, bgClass: string }> = {
    wechat: { icon: <Image src="https://play-lh.googleusercontent.com/QbSSiRcodmWx6HlezOtNu3vmZeuFqkQZQQO5Y2-Zg_jBRm-mXjhlXX5yFj8iphfqzQ" alt="WeChat" width={200} height={200} priority className="w-full h-full object-cover" />, bgClass: 'bg-white border border-slate-200 shadow-md' },
    alipay: { icon: <Image src="https://play-lh.googleusercontent.com/quzvssC112NXIlt4YBkclEo7f9ZnhaNtZ5fvaCs_P19X7KL71DiUqd2ysR8ZHsTaRTY" alt="Alipay" width={200} height={200} priority className="w-full h-full object-cover" />, bgClass: 'bg-white border border-slate-200 shadow-md' },
    douyin: { icon: <Image src="https://play-lh.googleusercontent.com/xey8dXOB53LtCR97JhDH7T-6np_sUBBE9iF7WP4Sp6T55oO28e6hic1LFTklCELw9Iw=w600-h300-pc0xffffff-pd" alt="Douyin" width={200} height={200} priority className="w-full h-full object-cover" />, bgClass: 'bg-white border border-slate-200 shadow-md' },
    qq: { icon: <Image src="https://play-lh.googleusercontent.com/2U-E-AGFKKEI-k6oRndaHvAsOpYZmBWm5hgpP0pVP5MTClOhk3fL3f_Sbl--9dnbUh0" alt="QQ" width={200} height={200} priority className="w-full h-full object-cover" />, bgClass: 'bg-white border border-slate-200 shadow-md' },
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

                                {/* Large Faded Background Overlay Icon */}
                                <div className="absolute -right-6 -top-6 w-32 h-32 md:w-40 md:h-40 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.05] transform scale-100 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700 ease-out pointer-events-none rounded-[2rem] overflow-hidden blur-[1px] group-hover:blur-none z-0">
                                    {iconMap[category.icon].icon}
                                </div>

                                <div className="relative z-10 flex flex-col h-full mt-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${iconMap[category.icon].bgClass} flex items-center justify-center shrink-0 transform group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all duration-300 overflow-hidden`}>
                                            {iconMap[category.icon].icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors tracking-tight leading-tight">
                                                {category.name[lang]}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/30">官方认证</span>
                                                <span className="text-[10px] bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded border border-orange-100 dark:border-orange-900/30">极速响应</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                        {category.description[lang]}
                                    </p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-[11px] py-2 border-t border-slate-100 dark:border-slate-800/50">
                                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                {t('category.inStock', lang)}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-white">{stock} {lang === 'zh' ? '个' : 'units'}</span>
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-dark-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors group-hover:bg-red-50 group-hover:border-red-100 dark:group-hover:bg-red-900/10 dark:group-hover:border-red-900/30">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">起售价 / Starting at</span>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-sm font-bold text-red-600 dark:text-red-500">USDT</span>
                                                    <span className={`text-2xl font-black ${category.color} tracking-tighter drop-shadow-sm transition-colors group-hover:text-red-600`}>
                                                        {formatUsdt(lowestPrice).replace(' USDT', '')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* The arrow button now triggers its hover state when ANY part of the card (group) is hovered */}
                                            <div className={`w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 group-hover:shadow-red-500/30 group-hover:scale-110`}>
                                                <ArrowRight className={`w-4 h-4 text-slate-500 transition-colors group-hover:text-white group-hover:translate-x-0.5`} />
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
