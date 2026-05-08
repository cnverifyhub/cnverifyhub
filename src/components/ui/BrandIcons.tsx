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
    bundle:       '/icons/alipay-xianyu-bundle.svg',
    verification: '/images/categories/verification.png',
    fintech:      '/images/categories/fintech.png',
    
    // New Bundles
    'bundle-alipay-xianyu': '/icons/alipay-xianyu-bundle.svg',
    'bundle-alipay-taobao': '/icons/alipay-taobao-bundle.svg',
    'bundle-alipay-1688':   '/icons/alipay-1688-bundle.svg',
    'bundle-wechat-jd':     '/icons/wechat-jd-bundle.svg',
    'bundle-full-suite':    '/icons/full-ecommerce-suite.svg',
    
    // New Verification
    'verify-passport':      '/icons/passport-verification.svg',
    'verify-face':          '/icons/face-verification.svg',
    'verify-kyc':           '/icons/kyc-package.svg',
    'verify-wechat':        '/icons/wechat-realname.svg',
    'verify-alipay':        '/icons/alipay-realname.svg',
    
    // New Trading/FinTech
    'xm-account':           '/icons/xm-account.svg',
    'hfm-account':          '/icons/hfm-account.svg',
    'neteller-account':     '/icons/neteller-account.svg',
    'skrill-account':       '/icons/skrill-account.svg',
    'payoneer-account':     '/icons/payoneer-account.svg',
    'wise-account':         '/icons/wise-account.svg',
    'revolut-account':      '/icons/revolut.svg',
    'google-play':          '/icons/google-play.svg',
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

// Bundle Specifics
export function AlipayXianyuIcon({ className }: BrandIconProps) { return <BrandIcon name="bundle-alipay-xianyu" className={className} />; }
export function AlipayTaobaoIcon({ className }: BrandIconProps) { return <BrandIcon name="bundle-alipay-taobao" className={className} />; }
export function Alipay1688Icon({ className }: BrandIconProps) { return <BrandIcon name="bundle-alipay-1688" className={className} />; }
export function WechatJdIcon({ className }: BrandIconProps) { return <BrandIcon name="bundle-wechat-jd" className={className} />; }
export function FullSuiteIcon({ className }: BrandIconProps) { return <BrandIcon name="bundle-full-suite" className={className} />; }

// Verification Specifics
export function PassportVerifyIcon({ className }: BrandIconProps) { return <BrandIcon name="verify-passport" className={className} />; }
export function FaceVerifyIcon({ className }: BrandIconProps) { return <BrandIcon name="verify-face" className={className} />; }
export function KycPackageIcon({ className }: BrandIconProps) { return <BrandIcon name="verify-kyc" className={className} />; }
export function WechatRealnameIcon({ className }: BrandIconProps) { return <BrandIcon name="verify-wechat" className={className} />; }
export function AlipayRealnameIcon({ className }: BrandIconProps) { return <BrandIcon name="verify-alipay" className={className} />; }

// Trading Specifics
export { XmIcon, HfmIcon, NetellerIcon, SkrillIcon, PayoneerIcon, WiseIcon, RevolutIcon } from '../icons/FinancialBrandIcons';
export function GooglePlayIcon({ className }: BrandIconProps) { return <BrandIcon name="google-play" className={className} />; }
