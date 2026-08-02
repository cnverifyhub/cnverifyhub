'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { type Lang, getLocalizedPath } from '@/lib/i18n';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon } from '@/components/ui/BrandIcons';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseItem {
    id: string;
    titleZh: string;
    titleEn: string;
    taglineZh: string;
    taglineEn: string;
    badgeZh: string;
    badgeEn: string;
    color: string;
    icon: React.ReactNode;
    href: string;
    fallbackGradient: string;
    specs: { labelZh: string; labelEn: string; val: string }[];
}

const showcaseItems: ShowcaseItem[] = [
    {
        id: 'wechat',
        titleZh: '微信号',
        titleEn: 'WECHAT ACCOUNTS',
        taglineZh: '高权重实名老号 · 规避封号风险',
        taglineEn: 'Aged & Real-Name Verified Accounts',
        badgeZh: '爆款首选 #1',
        badgeEn: 'TOP SELLER #1',
        color: '#07C160',
        icon: <WeChatIcon className="w-full h-full" />,
        href: '/category/wechat',
        fallbackGradient: 'from-[#07C160]/20 via-[#07C160]/5 to-transparent',
        specs: [
            { labelZh: '注册年份', labelEn: 'Age', val: '2015-2022' },
            { labelZh: '实名状态', labelEn: 'Verification', val: '已完成' },
            { labelZh: '售后保障', labelEn: 'Warranty', val: '72小时质保' },
        ]
    },
    {
        id: 'alipay',
        titleZh: '支付宝账户',
        titleEn: 'ALIPAY ENTERPRISE',
        taglineZh: '企业法人户 / 个人V3高额度账户',
        taglineEn: 'Corporate & High-Limit V3 Personal',
        badgeZh: '大额交易',
        badgeEn: 'HIGH LIMIT',
        color: '#1677FF',
        icon: <AlipayIcon className="w-full h-full" />,
        href: '/category/alipay',
        fallbackGradient: 'from-[#1677FF]/20 via-[#1677FF]/5 to-transparent',
        specs: [
            { labelZh: '单日限额', labelEn: 'Daily Limit', val: '50万+' },
            { labelZh: '配对配套', labelEn: 'Includes', val: '全套对公' },
            { labelZh: '交付速度', labelEn: 'Delivery', val: '5分钟发货' },
        ]
    },
    {
        id: 'douyin',
        titleZh: '抖音万粉号',
        titleEn: 'DOUYIN INFLUENCER',
        taglineZh: '带货开通 · 千粉/万粉/百蓝号现货',
        taglineEn: '10K+ Followers · E-commerce Ready',
        badgeZh: '带货必备',
        badgeEn: 'BIZ READY',
        color: '#FF0036',
        icon: <DouyinIcon className="w-full h-full" />,
        href: '/category/douyin',
        fallbackGradient: 'from-[#FF0036]/20 via-[#FF0036]/5 to-transparent',
        specs: [
            { labelZh: '粉丝基数', labelEn: 'Followers', val: '10,000+' },
            { labelZh: '橱窗功能', labelEn: 'Showcase', val: '已开通' },
            { labelZh: '违规记录', labelEn: 'Violations', val: '0违规纯净' },
        ]
    },
    {
        id: 'qq',
        titleZh: 'QQ高级靓号',
        titleEn: 'PREMIUM QQ NUMBERS',
        taglineZh: '5位/6位/7位短号 · 太阳等级老号',
        taglineEn: 'Rare Short IDs · High Level Aged',
        badgeZh: '稀缺资源',
        badgeEn: 'RARE ITEM',
        color: '#12B7F5',
        icon: <QQIcon className="w-full h-full" />,
        href: '/category/qq',
        fallbackGradient: 'from-[#12B7F5]/20 via-[#12B7F5]/5 to-transparent',
        specs: [
            { labelZh: '号码位数', labelEn: 'Length', val: '6-8位短号' },
            { labelZh: '账号等级', labelEn: 'QQ Level', val: '48级(双太阳)' },
            { labelZh: '密保资料', labelEn: 'Security', val: '全套转移' },
        ]
    }
];

export function ShowcaseScroll({ lang }: { lang: Lang }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textColumnRef = useRef<HTMLDivElement>(null);
    const cardStackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current || !cardStackRef.current) return;

        const cards = gsap.utils.toArray<HTMLElement>('.showcase-card');
        const textElements = gsap.utils.toArray<HTMLElement>('.showcase-text-item');

        const totalSlides = showcaseItems.length;
        const scrollDistance = totalSlides * 100;

        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                start: 'top top',
                end: `+=${scrollDistance}%`,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        cards.forEach((card, index) => {
            if (index === 0) return;

            const prevCard = cards[index - 1];
            const prevText = textElements[index - 1];
            const currentText = textElements[index];

            const stepStart = (index - 1) / (totalSlides - 1);

            mainTimeline
                .to(prevCard, {
                    scale: 0.88,
                    opacity: 0.2,
                    filter: 'blur(8px)',
                    duration: 0.4,
                    ease: 'power2.inOut',
                }, stepStart)
                .fromTo(card,
                    { y: '100%', opacity: 0, scale: 0.95 },
                    { y: '0%', opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
                    stepStart
                )
                .to(prevText, { opacity: 0, y: -40, duration: 0.3 }, stepStart)
                .fromTo(currentText,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.4 },
                    stepStart + 0.1
                );
        });

    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="relative bg-[#030712] min-h-screen h-screen overflow-hidden flex items-center border-y border-white/5"
        >
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF0036]/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full py-16">
                
                <div ref={textColumnRef} className="md:col-span-6 relative z-10 flex flex-col justify-center h-full min-h-[300px]">
                    <div className="mb-4">
                        <span className="text-[11px] font-mono tracking-[0.3em] text-[#FF0036] uppercase font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF0036] animate-ping" />
                            FEATURED SHOWCASE
                        </span>
                    </div>

                    <div className="relative h-[240px] md:h-[300px]">
                        {showcaseItems.map((item, index) => (
                            <div 
                                key={item.id} 
                                className={`showcase-text-item absolute inset-0 flex flex-col justify-center ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-none mb-4">
                                    {lang === 'zh' ? item.titleZh : item.titleEn}
                                </h2>
                                <p className="text-lg lg:text-xl text-white/60 font-medium mb-6">
                                    {lang === 'zh' ? item.taglineZh : item.taglineEn}
                                </p>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={getLocalizedPath(item.href, lang)}
                                        className="inline-flex items-center gap-3 bg-[#FF0036] hover:bg-[#C0001A] text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#FF0036]/20 group"
                                    >
                                        <span>{lang === 'zh' ? '立即选购' : 'EXPLORE NOW'}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <span className="text-xs font-mono text-white/40 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
                                        0{index + 1} / 0{showcaseItems.length}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6 relative flex justify-center items-center h-[420px] md:h-[500px]">
                    <div ref={cardStackRef} className="relative w-full max-w-[440px] h-full">
                        {showcaseItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`showcase-card absolute inset-0 bg-[#0A0F1D] border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden backdrop-blur-xl ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
                                style={{ zIndex: index + 1 }}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${item.fallbackGradient} pointer-events-none`} />

                                <div className="relative z-10 flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl p-2 bg-white/5 border border-white/10 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white leading-tight">
                                                {lang === 'zh' ? item.titleZh : item.titleEn}
                                            </h3>
                                            <span className="text-[10px] font-mono text-white/40">VERIFIED ASSET</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white bg-[#FF0036] tracking-wider">
                                        {lang === 'zh' ? item.badgeZh : item.badgeEn}
                                    </span>
                                </div>

                                <div className="relative z-10 my-auto h-[200px] bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center overflow-hidden">
                                    <div 
                                        className="absolute inset-0 opacity-20"
                                        style={{ background: `radial-gradient(circle at 50% 50%, ${item.color} 0%, transparent 70%)` }}
                                    />
                                    <div className="w-16 h-16 mb-3 text-white/80 animate-pulse">
                                        {item.icon}
                                    </div>
                                    <p className="text-xs font-mono text-white/60 max-w-[260px] leading-relaxed">
                                        {lang === 'zh' ? '担保交易 · 72h售后 · 5分钟极速发货' : 'Escrow Secured · 72h Warranty · 5-Min Delivery'}
                                    </p>
                                </div>

                                <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                                    {item.specs.map((spec, sIdx) => (
                                        <div key={sIdx} className="bg-white/2 border border-white/5 rounded-xl p-2 text-center">
                                            <div className="text-[9px] text-white/40 font-mono mb-0.5">
                                                {lang === 'zh' ? spec.labelZh : spec.labelEn}
                                            </div>
                                            <div className="text-xs font-bold text-white truncate">
                                                {spec.val}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
