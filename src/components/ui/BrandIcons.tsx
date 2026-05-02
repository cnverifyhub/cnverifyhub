import React from 'react';
import Image from 'next/image';

interface BrandIconProps {
    className?: string;
}

// ✅ Use LOCAL flat .webp icons — no external CDN, no 3D Google Play icons
const ICON_PATHS: Record<string, string> = {
    wechat:       '/images/categories/wechat.webp',
    alipay:       '/images/categories/alipay.webp',
    douyin:       '/images/categories/douyin.webp',
    qq:           '/images/categories/qq.webp',
    xianyu:       '/images/categories/xianyu.webp',
    taobao:       '/images/categories/taobao.webp',
    xiaohongshu:  '/images/categories/xiaohongshu.webp',
    telegram:     '/images/categories/telegram.png',
    bundle:       '/images/categories/bundle.png',
    verification: '/images/categories/verification.png',
    fintech:      '/images/categories/verification.png', // Fallback for fintech
};

function BrandIcon({ name, className }: { name: string; className?: string }) {
    const src = ICON_PATHS[name] ?? ICON_PATHS.wechat;
    return (
        <div className={`relative overflow-hidden rounded-[22.5%] aspect-square ${className ?? ''} shadow-sm border border-slate-100/50`}>
            <Image
                src={src}
                alt={name}
                fill
                className="object-cover scale-100"
                sizes="(max-width: 128px) 100vw, 128px"
                priority={name === 'wechat' || name === 'alipay'}
            />
        </div>
    );
}

export function WeChatIcon({ className }: BrandIconProps) {
    return <BrandIcon name="wechat" className={className} />;
}

export function AlipayIcon({ className }: BrandIconProps) {
    return <BrandIcon name="alipay" className={className} />;
}

export function DouyinIcon({ className }: BrandIconProps) {
    return <BrandIcon name="douyin" className={className} />;
}

export function QQIcon({ className }: BrandIconProps) {
    return <BrandIcon name="qq" className={className} />;
}

export function XianyuIcon({ className }: BrandIconProps) {
    return <BrandIcon name="xianyu" className={className} />;
}

export function TaobaoIcon({ className }: BrandIconProps) {
    return <BrandIcon name="taobao" className={className} />;
}

export function XiaohongshuIcon({ className }: BrandIconProps) {
    return <BrandIcon name="xiaohongshu" className={className} />;
}

export function TelegramIcon({ className }: BrandIconProps) {
    return <BrandIcon name="telegram" className={className} />;
}

export function BundleIcon({ className }: BrandIconProps) {
    return <BrandIcon name="bundle" className={className} />;
}

export function VerificationIcon({ className }: BrandIconProps) {
    return <BrandIcon name="verification" className={className} />;
}

export function FintechIcon({ className }: BrandIconProps) {
    return <BrandIcon name="fintech" className={className} />;
}
