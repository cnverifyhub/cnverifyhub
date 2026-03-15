import React from 'react';
import Image from 'next/image';

interface BrandIconProps {
    className?: string;
}

const ICON_URLS = {
    wechat: 'https://play-lh.googleusercontent.com/QbSSiRcodmWx6HlezOtNu3vmZeuFqkQZQQO5Y2-Zg_jBRm-mXjhlXX5yFj8iphfqzQ',
    alipay: 'https://play-lh.googleusercontent.com/quzvssC112NXIlt4YBkclEo7f9ZnhaNtZ5fvaCs_P19X7KL71DiUqd2ysR8ZHsTaRTY',
    douyin: 'https://play-lh.googleusercontent.com/xey8dXOB53LtCR97JhDH7T-6np_sUBBE9iF7WP4Sp6T55oO28e6hic1LFTklCELw9Iw=w600-h300-pc0xffffff-pd',
    qq: 'https://play-lh.googleusercontent.com/2U-E-AGFKKEI-k6oRndaHvAsOpYZmBWm5hgpP0pVP5MTClOhk3fL3f_Sbl--9dnbUh0'
};

export function WeChatIcon({ className }: BrandIconProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image 
                src={ICON_URLS.wechat} 
                alt="WeChat" 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    );
}

export function AlipayIcon({ className }: BrandIconProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image 
                src={ICON_URLS.alipay} 
                alt="Alipay" 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    );
}

export function DouyinIcon({ className }: BrandIconProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image 
                src={ICON_URLS.douyin} 
                alt="Douyin" 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    );
}

export function QQIcon({ className }: BrandIconProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image 
                src={ICON_URLS.qq} 
                alt="QQ" 
                fill 
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    );
}
