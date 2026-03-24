import React from 'react';
import Image from 'next/image';

interface BrandIconProps {
    className?: string;
}

/* Local premium 3D-rendered icons stored in /public/images/categories/ */
const ICON_PATHS: Record<string, string> = {
    wechat: '/images/categories/wechat.webp',
    alipay: '/images/categories/alipay.webp',
    douyin: '/images/categories/douyin.webp',
    qq: '/images/categories/qq.webp',
    xianyu: '/images/categories/xianyu.webp',
    taobao: '/images/categories/taobao.webp',
    xiaohongshu: '/images/categories/xiaohongshu.webp',
};

function BrandIcon({ name, className }: { name: string; className?: string }) {
    return (
        <div className={`relative overflow-hidden rounded-[22%] aspect-square shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.2)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.05)] bg-slate-100 dark:bg-slate-800 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 ${className}`}>
            <Image
                src={ICON_PATHS[name] || ICON_PATHS.wechat}
                alt={name}
                fill
                className="object-cover p-[2%]"
                sizes="128px"
                unoptimized
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
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

