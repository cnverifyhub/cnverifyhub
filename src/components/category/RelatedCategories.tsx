import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon } from '@/components/ui/BrandIcons';
import { getLocalizedPath, t, type Lang } from '@/lib/i18n';
import Link from 'next/link';

interface RelatedCategoriesProps {
    currentCategory: string;
    lang: Lang;
}

const categories = [
    { id: 'wechat', name: { zh: '微信号', en: 'WeChat' }, icon: WeChatIcon, color: 'text-emerald-500', href: '/wechat/' },
    { id: 'alipay', name: { zh: '支付宝', en: 'Alipay' }, icon: AlipayIcon, color: 'text-blue-500', href: '/alipay/' },
    { id: 'douyin', name: { zh: '抖音号', en: 'Douyin' }, icon: DouyinIcon, color: 'text-slate-800 dark:text-white', href: '/douyin/' },
    { id: 'qq', name: { zh: 'QQ号', en: 'QQ' }, icon: QQIcon, color: 'text-sky-500', href: '/qq/' },
    { id: 'xianyu', name: { zh: '闲鱼号', en: 'Xianyu' }, icon: XianyuIcon, color: 'text-amber-500', href: '/xianyu/' },
    { id: 'taobao', name: { zh: '淘宝号', en: 'Taobao' }, icon: TaobaoIcon, color: 'text-orange-500', href: '/taobao/' },
    { id: 'xiaohongshu', name: { zh: '小红书', en: 'RED' }, icon: XiaohongshuIcon, color: 'text-red-500', href: '/xiaohongshu/' },
];

export function RelatedCategories({ currentCategory, lang }: RelatedCategoriesProps) {
    const filteredCategories = categories.filter(c => c.id !== currentCategory);

    return (
        <section className="section-container pb-16">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary-500 rounded-full"></div>
                    {lang === 'zh' ? '探索其他分类' : 'Explore Categories'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {filteredCategories.map((c) => (
                        <Link
                            key={c.id}
                            href={getLocalizedPath(c.href, lang)}
                            className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 flex items-center gap-4 mt-0"
                        >
                            <div className={`p-3 rounded-xl bg-slate-50 dark:bg-dark-800 group-hover:scale-110 transition-transform ${c.color}`}>
                                <c.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                    {c.name[lang]}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-medium">
                                    {lang === 'zh' ? '点击查看' : 'View More'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
