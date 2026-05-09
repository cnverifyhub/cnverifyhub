'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Clock, Users, CheckCircle, RefreshCcw } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

const badges = [
    {
        icon: <ShieldCheck className="w-10 h-10" />,
        title: 'USDT TRC20安全支付',
        subtitle: '加密货币，无需实名',
        color: '#FF0036'
    },
    {
        icon: <Zap className="w-10 h-10" />,
        title: '极速自动发货',
        subtitle: '支付后平均<5分钟到账',
        color: '#FFB800'
    },
    {
        icon: <CheckCircle className="w-10 h-10" />,
        title: '平台担保交易',
        subtitle: '买方付款后资金托管',
        color: '#00D68F'
    },
    {
        icon: <Users className="w-10 h-10" />,
        title: '100%实名认证',
        subtitle: '一手机房直供',
        color: '#FF0036'
    },
    {
        icon: <RefreshCcw className="w-10 h-10" />,
        title: '72小时质量质保',
        subtitle: '不满意免费补发',
        color: '#FFB800'
    },
    {
        icon: <Users className="w-10 h-10" />,
        title: '50,000+已服务用户',
        subtitle: '累计完成订单',
        color: '#00E5FF'
    }
];

export function TrustBadges() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(".trust-badge-card", {
            x: -40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
            }
        });

        gsap.to(".trust-badge-icon", {
            rotation: 360,
            duration: 0.6,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-12 bg-[#060B18]">
            <div className="section-container">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.map((badge, i) => (
                        <div 
                            key={i}
                            className="trust-badge-card group p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Accent line */}
                            <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#FF0036] scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                            
                            <div className="flex flex-col gap-4">
                                <div className="trust-badge-icon w-10 h-10 flex items-center justify-center" style={{ color: badge.color }}>
                                    {badge.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm md:text-base font-bold text-white mb-1">{badge.title}</h3>
                                    <p className="text-[11px] md:text-xs text-white/40">{badge.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
