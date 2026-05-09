'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Clock, ChevronRight, TrendingUp, Users, Package, Star, MousePointer2 } from 'lucide-react';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { categories, getTotalStock, getLowestPrice } from '@/data/products';
import type { CategoryId } from '@/types';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon } from '@/components/ui/BrandIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function ParticleBackground() {
    const ref = useRef<any>();
    const [sphere] = useState(() => {
        const positions = new Float32Array(3000 * 3);
        for(let i=0; i<3000; i++) {
            positions[i*3] = (Math.random() - 0.5) * 15;
            positions[i*3+1] = (Math.random() - 0.5) * 15;
            positions[i*3+2] = (Math.random() - 0.5) * 15;
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y -= delta / 10;
            ref.current.rotation.x -= delta / 15;
            ref.current.position.y = (ref.current.position.y + delta * 0.2) % 5;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial transparent color="#FF0036" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
            </Points>
        </group>
    );
}

/* ── Live price feed panel data ─────────────── */
const liveFeedCategories = [
    { id: 'wechat',      icon: <WeChatIcon className="w-full h-full" />,      color: '#07C160' },
    { id: 'alipay',      icon: <AlipayIcon className="w-full h-full" />,      color: '#1677ff' },
    { id: 'douyin',      icon: <DouyinIcon className="w-full h-full" />,      color: '#ffffff' },
    { id: 'qq',          icon: <QQIcon className="w-full h-full" />,          color: '#12B7F5' },
    { id: 'xianyu',      icon: <XianyuIcon className="w-full h-full" />,      color: '#FFB300' },
    { id: 'taobao',      icon: <TaobaoIcon className="w-full h-full" />,      color: '#FF5000' },
    { id: 'xiaohongshu', icon: <XiaohongshuIcon className="w-full h-full" />, color: '#ff2442' },
];

function formatPrice(p: number) {
    return `¥${Math.round(p)}`;
}

import { TextScramble } from '@/utils/textScramble';

function ScrambleText({ lines }: { lines: string[] }) {
    const elRef = useRef<HTMLSpanElement>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!elRef.current) return;
        const fx = new TextScramble(elRef.current);
        
        const next = () => {
            fx.setText(lines[index]).then(() => {
                setTimeout(() => {
                    setIndex((prev) => (prev + 1) % lines.length);
                }, 2000);
            });
        };
        
        next();
    }, [index, lines]);

    return (
        <span ref={elRef} className="font-mono text-[#00E5FF] min-w-[120px] inline-block" />
    );
}

/* ── Social proof strip ─────────────────────── */
const proofItems = {
    zh: [
        { user: '138****9021', item: '微信实名号 ×3', time: '刚刚' },
        { user: '159****3347', item: '支付宝花呗号', time: '1分钟前' },
        { user: '186****7712', item: '抖音千粉号 ×2', time: '2分钟前' },
        { user: '177****4405', item: 'QQ太阳号', time: '3分钟前' },
        { user: '135****8890', item: '多平台套餐包', time: '4分钟前' },
    ],
    en: [
        { user: '138****9021', item: 'WeChat Verified ×3', time: 'Just now' },
        { user: '159****3347', item: 'Alipay Huabei', time: '1 min ago' },
        { user: '186****7712', item: 'Douyin 1K+ ×2', time: '2 min ago' },
        { user: '177****4405', item: 'QQ Sun Account', time: '3 min ago' },
        { user: '135****8890', item: 'Multi-platform bundle', time: '4 min ago' },
    ],
};

function SocialProofStrip({ lang }: { lang: Lang }) {
    const [idx, setIdx] = useState(0);
    const items = proofItems[lang];
    useEffect(() => {
        const iv = setInterval(() => setIdx(p => (p + 1) % items.length), 2800);
        return () => clearInterval(iv);
    }, [items.length]);
    const item = items[idx];
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-[11px] text-[#7B91B0]"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-[#07C160] animate-pulse shrink-0" />
                <span className="font-mono-price text-[#F0F4FF] font-medium">{item.user}</span>
                <span>{lang === 'zh' ? '购买了' : 'purchased'}</span>
                <span className="text-[#00E5FF] font-medium">{item.item}</span>
                <span className="ml-auto text-[#7B91B0]">{item.time}</span>
            </motion.div>
        </AnimatePresence>
    );
}

/* ── Live Price Feed (right panel) ──────────── */
function LivePriceFeed({ lang }: { lang: Lang }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const iv = setInterval(() => {
            setActiveIdx(i => (i + 1) % liveFeedCategories.length);
            setTick(t => t + 1);
        }, 2500);
        return () => clearInterval(iv);
    }, []);

    return (
        <div className="relative rounded-lg overflow-hidden border border-[#1E2D45] bg-[#0D1526] h-full">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E2D45] bg-[#060B18]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF2D55]/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFB800]/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#07C160]/70" />
                    </div>
                    <span className="terminal-label">{lang === 'zh' ? '实时行情' : 'LIVE MARKET'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#07C160] animate-pulse" />
                    <span className="terminal-label text-[#07C160]">LIVE</span>
                </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 gap-0 px-4 py-2 border-b border-[#1E2D45] text-[9px] font-mono font-medium text-[#7B91B0] uppercase tracking-widest">
                <span className="col-span-5">{lang === 'zh' ? '品类' : 'ASSET'}</span>
                <span className="col-span-3 text-right">{lang === 'zh' ? '起售价' : 'PRICE'}</span>
                <span className="col-span-2 text-right">{lang === 'zh' ? '库存' : 'STOCK'}</span>
                <span className="col-span-2 text-right">{lang === 'zh' ? '状态' : 'STATUS'}</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#1E2D45]">
                {liveFeedCategories.map((cat, i) => {
                    const catData = categories.find(c => c.id === cat.id);
                    if (!catData) return null;
                    const price = getLowestPrice(cat.id as CategoryId);
                    const stock = getTotalStock(cat.id as CategoryId);
                    const isActive = i === activeIdx;
                    return (
                        <motion.div
                            key={cat.id}
                            className={`grid grid-cols-12 gap-0 px-4 py-3 transition-colors duration-300 ${isActive ? 'bg-[#00E5FF]/5' : 'hover:bg-white/[0.02]'}`}
                            animate={isActive ? { x: [0, 2, 0] } : { x: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="col-span-5 flex items-center gap-2">
                                <div className="w-5 h-5 shrink-0">{cat.icon}</div>
                                <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-[#7B91B0]'}`}>
                                    {catData.name[lang]}
                                </span>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={`${cat.id}-${tick}`}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="col-span-3 text-right font-mono-price text-xs font-bold text-[#F0F4FF]"
                                >
                                    {formatPrice(price)}
                                </motion.span>
                            </AnimatePresence>
                            <span className="col-span-2 text-right text-[10px] font-mono text-[#7B91B0]">{stock}+</span>
                            <div className="col-span-2 flex justify-end">
                                <span className="text-[9px] font-bold text-[#07C160] bg-[#07C160]/10 px-1.5 py-0.5 rounded">
                                    {lang === 'zh' ? '现货' : 'IN STOCK'}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom strip */}
            <div className="px-4 py-2.5 border-t border-[#1E2D45] bg-[#060B18]">
                <p className="terminal-label text-[10px]">
                    {lang === 'zh' ? '更新于: ' : 'Updated: '}
                    <span className="text-[#F0F4FF]">{new Date().toLocaleTimeString()}</span>
                    <span className="ml-2 text-[#FF2D55]">● {lang === 'zh' ? '实时数据' : 'Real-time'}</span>
                </p>
            </div>
        </div>
    );
}

/* ── Main Hero ──────────────────────────────── */
export function Hero({ lang }: { lang: Lang }) {
    const typewriterLines = lang === 'zh'
        ? ['一手机房老号', '实名认证专场', '量化交易账户', 'USDT安全结算', '72小时质量保障']
        : ['Real-name verified', 'Aged social accounts', 'KYC-compliant assets', 'USDT secure payment', '72H quality guarantee'];

    const trustBadges = [
        { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: lang === 'zh' ? '担保交易' : 'Escrow', color: '#00E5FF' },
        { icon: <Zap className="w-3.5 h-3.5" />,         label: lang === 'zh' ? '极速秒发' : 'Instant', color: '#FFB800' },
        { icon: <Clock className="w-3.5 h-3.5" />,       label: '24/7',                               color: '#07C160' },
    ];

    const stats = [
        { icon: <Package className="w-4 h-4" />,      val: 50,    suffix: 'K+', label: lang === 'zh' ? '累计订单' : 'Orders',   isCounter: true },
        { icon: <Users className="w-4 h-4" />,         val: 12480, suffix: '+',  label: lang === 'zh' ? '活跃用户' : 'Users',    isCounter: true },
        { icon: <TrendingUp className="w-4 h-4" />,    val: null,  suffix: '',   label: lang === 'zh' ? '平均评分' : 'Rating',   isCounter: false, display: '4.97★' },
        { icon: <Zap className="w-4 h-4" />,           val: null,  suffix: '',   label: lang === 'zh' ? '发货时效' : 'Delivery', isCounter: false, display: '<5min' },
    ];

    const splitText = (text: string, delayOffset = 0) => {
        return text.split('').map((char, index) => (
            <motion.span
                key={index}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    ease: [0.2, 0.65, 0.3, 0.9],
                    delay: delayOffset + index * 0.04
                }}
                className="inline-block"
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ));
    };

    return (
        <section className="relative min-h-[calc(100vh-96px)] flex items-center overflow-hidden bg-[#060B18]">
            {/* Particle Background */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="absolute inset-0 bg-[#060B18]" />}>
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ParticleBackground />
                    </Canvas>
                </Suspense>
                {/* Radial dark gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
            </div>

            <div className="section-container relative z-10 py-16 lg:py-24 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* ── Left panel (7/12) ─────────────────── */}
                    <div className="lg:col-span-7 flex flex-col">
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-3 mb-8"
                        >
                            <span className="terminal-label"># CNVerifyHub</span>
                            <span className="h-px flex-1 max-w-[60px] bg-[#1E2D45]" />
                            <span className="text-[10px] font-mono font-medium text-[#07C160]">● ONLINE</span>
                        </motion.div>

                        {/* H1 */}
                        <h1 className="heading-syne text-white mb-4 leading-[1.05] text-[clamp(32px,8vw,64px)]">
                            {lang === 'zh' ? (
                                <>
                                    <span className="block overflow-hidden pb-2">{splitText('中国数字资产', 0.1)}</span>
                                    <span className="text-gradient-red block overflow-hidden pb-2">{splitText('正规交易平台', 0.5)}</span>
                                </>
                            ) : (
                                <>
                                    <span className="block overflow-hidden pb-2">{splitText('Chinese Digital', 0.1)}</span>
                                    <span className="text-gradient-red block overflow-hidden pb-2">{splitText('Asset Exchange', 0.5)}</span>
                                </>
                            )}
                        </h1>

                        {/* Typewriter subtitle */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 mb-8 text-lg sm:text-xl"
                        >
                            <span className="text-[#7B91B0] font-dm">{lang === 'zh' ? '专注于' : 'Specializing in'}</span>
                            <ScrambleText lines={typewriterLines} />
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 mb-10 flex-wrap"
                        >
                            {trustBadges.map((b, i) => (
                                <span
                                    key={i}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border"
                                    style={{ color: b.color, borderColor: `${b.color}30`, background: `${b.color}0D` }}
                                >
                                    {b.icon}{b.label}
                                </span>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-col sm:flex-row gap-3 mb-10"
                        >
                            <Link
                                href={getLocalizedPath('/wechat', lang)}
                                className="cyber-btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-sm"
                            >
                                <Zap className="w-4 h-4" />
                                {lang === 'zh' ? '立即选购' : 'Shop Now'}
                                <span className="ml-1 text-[10px] opacity-70 font-mono">→</span>
                            </Link>
                            <Link
                                href="https://t.me/CNVerifyHub"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cyber-btn-ghost flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-sm"
                            >
                                {lang === 'zh' ? '联系客服' : 'Contact Support'}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Social proof strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="border border-[#1E2D45] rounded-lg px-4 py-3 bg-[#0D1526] mb-10"
                        >
                            <p className="terminal-label mb-2">{lang === 'zh' ? '实时成交' : 'LIVE ORDERS'}</p>
                            <SocialProofStrip lang={lang} />
                        </motion.div>

                        {/* Stats row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-4 gap-0 border border-[#1E2D45] rounded-lg overflow-hidden"
                        >
                            {stats.map((s, i) => (
                                <div key={i} className={`flex flex-col items-center py-4 px-2 ${i > 0 ? 'border-l border-[#1E2D45]' : ''} bg-[#0D1526]`}>
                                    <div className="text-[#7B91B0] mb-1.5">{s.icon}</div>
                                    <p className="font-mono-price text-base font-bold text-white leading-none mb-1">
                                        {s.isCounter ? (
                                            <AnimatedCounter end={s.val!} suffix={s.suffix} duration={2000} />
                                        ) : s.display}
                                    </p>
                                    <p className="text-[9px] text-[#7B91B0] uppercase tracking-wider text-center">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Right panel (5/12) ─────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 h-[540px] hidden lg:block"
                    >
                        <LivePriceFeed lang={lang} />
                    </motion.div>

                </div>

                {/* ── Category chip scroll (mobile-only) ──── */}
                <div className="lg:hidden mt-10 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.slice(0, 7).map((cat) => (
                        <Link
                            key={cat.id}
                            href={getLocalizedPath(cat.href, lang)}
                            className="flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-lg border border-[#1E2D45] bg-[#0D1526] text-xs font-medium text-[#7B91B0] hover:text-white hover:border-[#00E5FF]/30 transition-colors"
                        >
                            {cat.name[lang]}
                        </Link>
                    ))}
                </div>

                {/* ── How it works ────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-16 grid grid-cols-4 gap-0 border border-[#1E2D45] rounded-lg overflow-hidden"
                >
                    {[
                        { num: '01', label: lang === 'zh' ? '选择品类' : 'Select', sub: lang === 'zh' ? '海量账号类型' : 'Browse categories' },
                        { num: '02', label: lang === 'zh' ? '扫码支付' : 'Pay',    sub: lang === 'zh' ? 'USDT TRC20' : 'USDT / CNY' },
                        { num: '03', label: lang === 'zh' ? '自动发货' : 'Receive', sub: lang === 'zh' ? '平均<5分钟' : 'Avg <5 minutes' },
                        { num: '04', label: lang === 'zh' ? '验证使用' : 'Verify',  sub: lang === 'zh' ? '72小时质保' : '72H warranty' },
                    ].map((step, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-4 bg-[#0D1526] ${i > 0 ? 'border-l border-[#1E2D45]' : ''}`}>
                            <span className="font-mono-price text-2xl font-black text-[#1E2D45] leading-none shrink-0">{step.num}</span>
                            <div>
                                <p className="text-sm font-semibold text-white">{step.label}</p>
                                <p className="text-[10px] text-[#7B91B0]">{step.sub}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
                
                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                >
                    <span className="text-[10px] font-mono font-medium text-[#7B91B0] uppercase tracking-[0.2em]">{lang === 'zh' ? '向下滚动' : 'Scroll'}</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-12 bg-gradient-to-b from-[#FF0036] to-transparent"
                    />
                </motion.div>
            </div>
        </section>
    );
}
