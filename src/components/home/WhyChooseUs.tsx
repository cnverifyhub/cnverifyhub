import { Shield, Zap, Lock, HeadphonesIcon, ShieldCheck } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';

export function WhyChooseUs({ lang }: { lang: Lang }) {
    const features = [
        {
            icon: <Zap className="w-7 h-7" />,
            bgIcon: <Zap className="w-48 h-48" strokeWidth={1} />,
            title: { zh: '即时秒级发货', en: 'Instant Auto-Delivery' },
            desc: { zh: '白号产品支付确认后全自动发卡，立等可取，无需漫长等待。', en: 'Fully automated delivery for fresh accounts after payment confirmation. No waiting.' },
            gradient: 'from-[#ff8c00] to-[#ff4d4f] text-white',
            borderColor: 'group-hover:border-[#ff4d4f]',
            shadowColor: 'group-hover:shadow-[#ff4d4f]/20',
            badge: { zh: '极速', en: 'FAST' }
        },
        {
            icon: <Shield className="w-7 h-7" />,
            bgIcon: <Shield className="w-48 h-48" strokeWidth={1} />,
            title: { zh: '高信誉官方纯净号', en: 'Official Pure Accounts' },
            desc: { zh: '100%拒绝黑号机刷号！所有资源经过严格人工筛选，高权重防风控。', en: '100% genuine accounts. Strictly vetted manually for high trust scores, anti-ban.' },
            gradient: 'from-emerald-500 to-teal-500 text-white',
            borderColor: 'group-hover:border-emerald-500',
            shadowColor: 'group-hover:shadow-emerald-500/20',
            badge: { zh: '正品', en: 'OFFICIAL' }
        },
        {
            icon: <Lock className="w-7 h-7" />,
            bgIcon: <Lock className="w-48 h-48" strokeWidth={1} />,
            title: { zh: '全加密USDT交易', en: 'Encrypted Crypto' },
            desc: { zh: '采用无痕 USDT TRC20 去中心化结算，全链路匿名，隐私数据0泄露。', en: 'Decentralized USDT TRC20 settlement. Total anonymity, zero data leaks.' },
            gradient: 'from-purple-500 to-indigo-500 text-white',
            borderColor: 'group-hover:border-purple-500',
            shadowColor: 'group-hover:shadow-purple-500/20',
            badge: { zh: '隐私', en: 'PRIVATE' }
        },
        {
            icon: <HeadphonesIcon className="w-7 h-7" />,
            bgIcon: <HeadphonesIcon className="w-48 h-48" strokeWidth={1} />,
            title: { zh: '金牌无忧售后质保', en: 'Gold Warranty Support' },
            desc: { zh: '独家提供长达7天的硬件级账号质保！非人为违规封号包赔包退。', en: 'Exclusive 7-day hardware-level warranty. Free replacement for non-user bans.' },
            gradient: 'from-blue-500 to-sky-500 text-white',
            borderColor: 'group-hover:border-blue-500',
            shadowColor: 'group-hover:shadow-blue-500/20',
            badge: { zh: '保障', en: 'SECURED' }
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-dark-950 relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent -translate-y-1/2"></div>

            <div className="section-container relative z-10">
                <div className="text-center mb-16 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50 px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm">
                        <ShieldCheck className="w-4 h-4" />
                        {lang === 'zh' ? '平台全额担保交易' : '100% Escrow Protected Platform'}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        {t('home.why.title', lang)}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                        {t('home.why.subtitle', lang)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className={`group relative bg-white dark:bg-dark-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${feature.borderColor} ${feature.shadowColor} overflow-hidden`}>
                            {/* Animated Gradient Background on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.05] transition-opacity duration-500`}></div>

                            {/* Trust Shield Watermark (Dynamic) */}
                            <div className="absolute -right-10 -bottom-10 opacity-[0.02] dark:opacity-[0.02] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.04] transform scale-75 group-hover:scale-105 group-hover:-rotate-12 transition-all duration-700 pointer-events-none text-slate-900 dark:text-white">
                                {feature.bgIcon}
                            </div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <span className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-opacity-20 group-hover:text-current transition-colors border border-transparent group-hover:border-current`}>
                                        {feature.badge[lang]}
                                    </span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all duration-300">
                                    {feature.title[lang]}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium h-full flex items-end">
                                    {feature.desc[lang]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
