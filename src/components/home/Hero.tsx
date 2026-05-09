'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Headset, Award, Lock, ChevronRight, Gift, X, Crown, TrendingUp, MessageSquare, Star, Truck, BadgeCheck, Send, Users } from 'lucide-react';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { categories } from '@/data/products';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon, BundleIcon, VerificationIcon, FintechIcon } from '@/components/ui/BrandIcons';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Danmu ──────────────────────────────────────────── */
const danmuMessages = {
    zh: ['账号已收到，质量很好！','发货速度超快👍','第三次购买了，非常靠谱','客服态度很好，售后有保障','微信号登录正常，好评！','批量购买价格很实惠','支付宝号秒发货','抖音号粉丝数量真实','QQ号质量很好','资金担保交易很安心','老客户了，品质一直稳定','推荐给朋友了','闲鱼芝麻信用号太好用了'],
    en: ['Account received, great quality!','Super fast delivery 👍','Third purchase, very reliable','Customer service is excellent','WeChat logged in fine, A+','Bulk prices are amazing','Alipay delivered instantly','Douyin followers are real','QQ account quality is solid','Escrow payment feels safe','Regular customer, always consistent','Recommended to friends','Xianyu Zhima credit account is amazing'],
};

function DanmuLayer({ lang }: { lang: Lang }) {
    const [mounted, setMounted] = useState(false);
    const [bullets, setBullets] = useState<{ id: number; text: string; top: number; duration: number }[]>([]);
    useEffect(() => {
        setMounted(true);
        const msgs = danmuMessages[lang];
        let counter = 0, index = 0;
        const spawn = () => {
            const id = counter++;
            setBullets(prev => [...prev.slice(-10), { id, text: msgs[index++ % msgs.length], top: 5 + (id * 37 % 80), duration: 12 + (id % 5) * 2 }]);
        };
        spawn();
        const iv = setInterval(spawn, 3500);
        return () => clearInterval(iv);
    }, [lang]);
    if (!mounted) return null;
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
            {bullets.map(b => (
                <span key={b.id} className="absolute whitespace-nowrap text-[11px] font-medium text-white/10" style={{ top: `${b.top}%`, right: '-300px', animation: `danmu-scroll ${b.duration}s linear forwards` }}>{b.text}</span>
            ))}
        </div>
    );
}

/* ── Social Proof Strip ─────────────────────────────── */
const proofItems = {
    zh: [
        { user: '138****9021', item: '微信实名号', time: '刚刚' },
        { user: '159****3347', item: '支付宝花呗号', time: '1分钟前' },
        { user: '186****7712', item: '抖音千粉号', time: '2分钟前' },
        { user: '177****4405', item: 'QQ太阳号', time: '3分钟前' },
        { user: '135****8890', item: '微信企业号', time: '5分钟前' },
        { user: '150****2218', item: '支付宝绑卡号', time: '6分钟前' },
        { user: '188****6633', item: '微信老号3年', time: '8分钟前' },
    ],
    en: [
        { user: '138****9021', item: 'WeChat Verified', time: 'Just now' },
        { user: '159****3347', item: 'Alipay Huabei', time: '1 min ago' },
        { user: '186****7712', item: 'Douyin 1K+', time: '2 min ago' },
        { user: '177****4405', item: 'QQ Sun Acc', time: '3 min ago' },
        { user: '135****8890', item: 'WeChat Business', time: '5 min ago' },
        { user: '150****2218', item: 'Alipay Bank-Linked', time: '6 min ago' },
        { user: '188****6633', item: 'WeChat 3yr Aged', time: '8 min ago' },
    ],
};

function SocialProofStrip({ lang }: { lang: Lang }) {
    const [idx, setIdx] = useState(0);
    const items = proofItems[lang];
    useEffect(() => {
        const iv = setInterval(() => setIdx(p => (p + 1) % items.length), 3000);
        return () => clearInterval(iv);
    }, [items.length]);
    return (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full max-w-2xl">
            {[0, 1, 2, 3].map(offset => {
                const p = items[(idx + offset) % items.length];
                return (
                    <motion.div key={`${p.user}-${offset}`} layout className="flex items-center gap-2 shrink-0 bg-white/8 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-white">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5000] to-[#FF0036] flex items-center justify-center text-[9px] font-black shrink-0">{p.user.slice(0,2)}</div>
                        <div><p className="text-[10px] font-bold whitespace-nowrap">{p.user} · {p.item}</p><p className="text-[9px] text-white/40">{p.time}</p></div>
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ── Floating Coupon ────────────────────────────────── */
function FloatingCoupon({ lang }: { lang: Lang }) {
    const [dismissed, setDismissed] = useState(false);
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), 30000); return () => clearTimeout(t); }, []);
    if (dismissed || !visible) return null;
    return (
        <div className="fixed right-3 top-1/3 z-40 animate-float-card scale-75 sm:scale-100 origin-right">
            <div className="relative bg-gradient-to-b from-[#ff4d4f] to-[#FF0036] text-white rounded-2xl p-4 pb-5 shadow-[0_20px_40px_-10px_rgba(255,0,54,0.5)] w-[76px] cursor-pointer" onClick={() => window.location.href = '#pricing'}>
                <button onClick={e => { e.stopPropagation(); setDismissed(true); }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-[#FF0036] flex items-center justify-center text-[10px] shadow-xl border-2 border-[#FF0036]/10"><X className="w-3 h-3" /></button>
                <Gift className="w-8 h-8 mx-auto mb-2 drop-shadow-lg text-yellow-300" />
                <p className="text-center text-[10px] font-black leading-tight uppercase">{lang === 'zh' ? '新人红包' : 'NEW GIFT'}</p>
                <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-700 rounded-xl py-1.5 mt-2 text-center"><span className="text-lg font-black">15U</span></div>
                <p className="text-center text-[9px] mt-2 opacity-90 font-black animate-pulse">{lang === 'zh' ? '立即抢' : 'GRAB IT'}</p>
                <div className="absolute bottom-0 left-0 right-0 h-3 flex justify-between px-1.5 overflow-hidden translate-y-1.5">{[...Array(6)].map((_,i) => <div key={i} className="w-3 h-3 rounded-full bg-[#0d0d14] -mb-2" />)}</div>
            </div>
        </div>
    );
}

/* ── Gold Seal ──────────────────────────────────────── */
function GoldSeal({ lang }: { lang: Lang }) {
    return (
        <div className="hidden md:flex absolute -bottom-4 right-4 lg:right-8 w-24 h-24 lg:w-28 lg:h-28 animate-spin-very-slow z-10">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 shadow-neon-gold flex items-center justify-center border-[3px] border-yellow-300/70 relative">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-yellow-300/50" />
                <div className="text-center z-10 animate-counter-spin-very-slow">
                    <p className="text-[11px] lg:text-xs font-black text-red-800 leading-tight">{lang === 'zh' ? '假一赔十' : 'FAKE=10x'}</p>
                    <p className="text-[8px] font-bold text-red-700/80 mt-0.5">{lang === 'zh' ? '品质保证' : 'REFUND'}</p>
                    <Award className="w-4 h-4 text-red-700 mx-auto mt-0.5" />
                </div>
            </div>
        </div>
    );
}

/* ── Main Hero ──────────────────────────────────────── */
export function Hero({ lang }: { lang: Lang }) {
    return (
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 lg:pt-32 lg:pb-28 bg-white dark:bg-[#0d0d14]">
            {/* Radial glow blobs - only visible in dark mode or subtle in light */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#FF0036]/5 dark:bg-[#FF0036]/8 rounded-full blur-[160px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF5000]/5 dark:bg-[#FF5000]/6 rounded-full blur-[140px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none bg-[url('/images/patterns/gplay.png')]" />

            <DanmuLayer lang={lang} />
            <FloatingCoupon lang={lang} />

            <div className="section-container relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    {/* Live online badge */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2 mb-6 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-1.5 backdrop-blur">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" /></span>
                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-white/50" />
                        <span className="text-[11px] font-black text-slate-600 dark:text-white/70 uppercase tracking-widest">{lang === 'zh' ? '实时在线 3,241人' : '3,241 Online Now'}</span>
                    </motion.div>

                    {/* Announcement bar */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="w-full max-w-2xl mx-auto mb-8 bg-[#FF0036]/10 border border-[#FF0036]/20 rounded-full py-1.5 px-3 flex items-center gap-3 overflow-hidden">
                        <span className="bg-gradient-to-r from-[#ff4d4f] to-[#FF0036] text-white text-[9px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" />{lang === 'zh' ? '福利' : 'DEAL'}
                        </span>
                        <div className="flex-1 text-[10px] sm:text-xs text-[#FF6B6B] font-bold whitespace-nowrap overflow-hidden">
                            <div className="animate-[pulse_3s_ease-in-out_infinite]">
                                {lang === 'zh' ? '🔥 满700¥限时直降100¥｜支持USDT TRC20/BEP20｜假一赔十担保' : '🔥 Orders 700¥+ save 100¥ | USDT TRC20/BEP20 | 10x Refund Guarantee'}
                            </div>
                        </div>
                    </motion.div>

                    {/* H1 */}
                    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[1.05]">
                        {t('hero.title.line1', lang)}{' '}
                        <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0036] via-[#FF5000] to-[#FF8C00]">
                            {t('hero.title.highlight', lang)}
                        </span>
                    </motion.h1>

                    {/* Subtitle with brand chips */}
                    <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-sm sm:text-lg text-slate-600 dark:text-white/60 mb-3 max-w-2xl leading-relaxed">
                        {t('hero.subtitle', lang)}
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-2 mb-8">
                        {[
                            { label: lang === 'zh' ? '微信' : 'WeChat', color: 'bg-[#07C160]/10 dark:bg-[#07C160]/15 text-[#07C160] border-[#07C160]/20 dark:border-[#07C160]/30' },
                            { label: lang === 'zh' ? '支付宝' : 'Alipay', color: 'bg-[#1677ff]/10 dark:bg-[#1677ff]/15 text-[#1677ff] border-[#1677ff]/20 dark:border-[#1677ff]/30' },
                            { label: lang === 'zh' ? '抖音' : 'Douyin', color: 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/15' },
                            { label: lang === 'zh' ? '淘宝/闲鱼' : 'Taobao/Xianyu', color: 'bg-[#FF5000]/10 dark:bg-[#FF5000]/15 text-[#FF8C00] border-[#FF5000]/20 dark:border-[#FF5000]/30' },
                            { label: lang === 'zh' ? '小红书' : 'Xiaohongshu', color: 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-500 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30' },
                        ].map((c, i) => (
                            <span key={i} className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur ${c.color}`}>{c.label}</span>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6 px-4 sm:px-0">
                        <Link href="#pricing" className="hero-cta-bounce relative overflow-hidden text-center w-full sm:w-auto px-10 py-4 text-base sm:text-lg font-black rounded-2xl text-white bg-gradient-to-r from-[#ff4d4f] to-[#FF0036] border-b-4 border-[#cc0000] shadow-[0_8px_32px_rgba(255,0,54,0.4)] hover:shadow-[0_12px_48px_rgba(255,0,54,0.55)] hover:-translate-y-1 transition-all duration-200 active:scale-95 flex justify-center items-center gap-2">
                            <Zap className="w-5 h-5 fill-current animate-pulse" />
                            <span className="relative z-10">{t('hero.cta.primary', lang)}</span>
                            <span className="absolute inset-0 hero-shine" />
                        </Link>
                        <div className="flex gap-3">
                            <a href="https://t.me/CNVerifyHub" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-4 text-sm font-bold rounded-2xl border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/8 hover:border-slate-300 dark:hover:border-white/25 transition-all backdrop-blur">
                                <Send className="w-4 h-4" />{t('hero.cta.channel', lang)}
                            </a>
                            <a href="https://t.me/cnwechatpro" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-4 text-sm font-bold rounded-2xl border border-slate-200 dark:border-white/15 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/8 hover:border-slate-300 dark:hover:border-white/25 transition-all backdrop-blur">
                                <MessageSquare className="w-4 h-4" />{t('hero.cta.personal', lang)}
                            </a>
                        </div>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap justify-center gap-2 mb-8">
                        {[
                            { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: lang === 'zh' ? '官方正品' : 'Verified', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                            { icon: <Zap className="w-3.5 h-3.5" />, label: lang === 'zh' ? '极速发货' : 'Instant', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                            { icon: <Headset className="w-3.5 h-3.5" />, label: '24/7', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                            { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: lang === 'zh' ? '实名专场' : 'KYC', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                            { icon: <TrendingUp className="w-3.5 h-3.5" />, label: lang === 'zh' ? '量化交易' : 'Trading', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                            { icon: <Lock className="w-3.5 h-3.5" />, label: 'SSL', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                        ].map((b, i) => (
                            <span key={i} className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${b.color}`}>{b.icon}{b.label}</span>
                        ))}
                    </motion.div>

                    {/* Service shortcut chips */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="flex flex-wrap justify-center gap-3 mb-10">
                        <Link href={getLocalizedPath('/verification', lang)} className="group flex items-center gap-2.5 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl hover:bg-indigo-500/20 hover:-translate-y-0.5 transition-all">
                            <VerificationIcon className="w-5 h-5" />
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">New</span>
                                <span className="text-xs font-black text-indigo-300">{lang === 'zh' ? '实名代认证' : 'KYC Verification'}</span>
                            </div>
                        </Link>
                        <Link href={getLocalizedPath('/trading', lang)} className="group flex items-center gap-2.5 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl hover:bg-amber-500/20 hover:-translate-y-0.5 transition-all">
                            <FintechIcon className="w-5 h-5" />
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Hot</span>
                                <span className="text-xs font-black text-amber-300">{lang === 'zh' ? '金融交易账户' : 'Trading Accounts'}</span>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Social Proof Strip */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="w-full flex flex-col items-center gap-2 mb-10">
                        <p className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mb-1">{lang === 'zh' ? '🔴 实时成交' : '🔴 Live Orders'}</p>
                        <SocialProofStrip lang={lang} />
                    </motion.div>

                    {/* Journey Steps */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="w-full max-w-xl mx-auto mb-10">
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 backdrop-blur border border-slate-200 dark:border-white/8 rounded-2xl px-4 py-3">
                            {[
                                { icon: <Star className="w-4 h-4" />, label: lang === 'zh' ? '选择账号' : 'Select', num: '1' },
                                { icon: <Lock className="w-4 h-4" />, label: lang === 'zh' ? '扫码支付' : 'Pay QR', num: '2' },
                                { icon: <Truck className="w-4 h-4" />, label: lang === 'zh' ? '自动发货' : 'Delivery', num: '3' },
                                { icon: <ShieldCheck className="w-4 h-4" />, label: lang === 'zh' ? '验证使用' : 'Verify', num: '4' },
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-1 shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF5000] to-[#FF0036] flex items-center justify-center text-white text-[10px] font-black shadow-neon-red-sm">{step.num}</div>
                                        <p className="text-[10px] font-bold text-slate-700 dark:text-white/70 whitespace-nowrap hidden sm:block">{step.label}</p>
                                    </div>
                                    {i < 3 && <div className="w-4 sm:w-10 h-px bg-gradient-to-r from-[#FF0036]/40 to-[#FF5000]/20 mx-1 sm:mx-2" />}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="w-full grid grid-cols-2 sm:grid-cols-5 gap-0 border-t border-slate-200 dark:border-white/8 pt-8">
                        {[
                            { end: 50, suffix: 'K+', label: t('hero.stat.orders', lang) },
                            { end: 12, suffix: ',480+', label: t('hero.stat.customers', lang) },
                            { end: 3, suffix: ',120+', label: lang === 'zh' ? '累计实名成功' : 'Verified KYC', color: 'text-indigo-600 dark:text-indigo-400' },
                            { val: '30 min', label: t('hero.stat.delivery', lang) },
                            { val: '24/7', label: t('hero.stat.support', lang) },
                        ].map((s, i) => (
                            <div key={i} className={`text-center px-2 py-2 ${i > 0 ? 'border-l border-slate-200 dark:border-white/8' : ''}`}>
                                <p className={`text-xl sm:text-2xl font-extrabold ${(s as any).color || 'text-slate-900 dark:text-white'}`}>
                                    {(s as any).val ?? <AnimatedCounter end={(s as any).end} suffix={(s as any).suffix} duration={2500} />}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-white/40 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    <GoldSeal lang={lang} />
                </div>
            </div>
        </section>
    );
}
