'use client';

import { useState, useEffect } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductById, getCategoryById } from '@/data/products';
import { t, type Lang, getLocalizedPath } from '@/lib/i18n';
import { formatYuan } from '@/lib/utils';
import {
    ChevronLeft, ShieldCheck, Zap, Clock, Star, Users, MessageCircle, Wallet, Music, Tv2,
    ShoppingCart, CheckCircle2, AlertCircle, Scissors, Eye
} from 'lucide-react';
import { StockBadge } from '../ui/StockBadge';
import { SlashPriceModal } from '../ui/SlashPriceModal';
import { ProductPreview } from './ProductPreview';
import { useCartStore } from '@/store/cartStore';
import { WeChatIcon, AlipayIcon, DouyinIcon, QQIcon, XianyuIcon, TaobaoIcon, XiaohongshuIcon } from '@/components/ui/BrandIcons';

const iconMap: Record<string, React.ElementType> = {
    wechat: WeChatIcon,
    alipay: AlipayIcon,
    douyin: DouyinIcon,
    qq: QQIcon,
    xianyu: XianyuIcon,
    taobao: TaobaoIcon,
    xiaohongshu: XiaohongshuIcon,
};

const iconColors: Record<string, string> = {
    wechat: "text-emerald-500",
    alipay: "text-blue-500",
    douyin: "text-slate-800 dark:text-white",
    qq: "text-sky-500",
    xianyu: "text-amber-500",
    taobao: "text-orange-500",
    xiaohongshu: "text-red-500",
};

interface ProductPageTemplateProps {
    productId: string;
    lang: Lang;
}

// Mock reviews data generator — deterministic to avoid SSR hydration mismatch
const generateMockReviews = (lang: Lang) => {
    const zhNames = ['李**', '张**', '王**', '赵**', '陈**', '刘**', '风**', '天**'];
    const enNames = ['Alex**', 'John**', 'Sarah**', 'Mike**', 'David**', 'Tom**'];
    const names = lang === 'zh' ? zhNames : enNames;

    const zhComments = [
        '发货真的秒到，账号质量很高！已经买了第三次了。',
        '客服态度非常好，账号登上去很稳定，推荐购买。',
        '非常丝滑，实名老号就是稳，还会再来。',
        '刚买的，目前用着没问题，号很干净。',
        '确实是私人老号，权重很高，秒批。'
    ];
    const enComments = [
        'Delivery was instant, very high quality account. Buying again!',
        'Support is very helpful, account is stable. Highly recommended.',
        'Extremely smooth, aged accounts are very solid.',
        'Just bought it, works perfectly fine so far.',
        'Real private aged account, high authority limit.'
    ];
    const comments = lang === 'zh' ? zhComments : enComments;

    // Deterministic dates (no Math.random)
    const dateBases = [3, 7, 12, 18];

    return Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        name: names[i % names.length],
        rating: 5,
        date: `2026-04-${String(dateBases[i]).padStart(2, '0')}`,
        comment: comments[i % comments.length]
    }));
};

export function ProductPageTemplate({ productId, lang }: ProductPageTemplateProps) {
    const router = useRouter();
    const product = getProductById(productId);
    const category = product ? getCategoryById(product.category) : null;
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state: any) => state.addItem);

    // Simulate active sale countdown (2hrs + random minutes based on product id)
    const [timeLeft, setTimeLeft] = useState(() => {
        const idSum = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return 7200 + (idSum % 3600); // Between 2 and 3 hours
    });

    // Mock live sales specifically for this product
    const [recentBuyer, setRecentBuyer] = useState<string | null>(null);
    const [isSlashModalOpen, setIsSlashModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (!product || product.stockCount === 0) return;

        // Timer
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);

        // Random live sales popups (simulating 1-2 per 30 mins)
        // For UI purposes, we'll trigger one initially, then random intervals
        const triggerSale = () => {
            const num = Math.floor(130 + Math.random() * 60);
            const digits = Math.floor(1000 + Math.random() * 9000);
            setRecentBuyer(`${num}****${digits}`);

            setTimeout(() => {
                setRecentBuyer(null);
            }, 5000); // Hide after 5 seconds
        };

        setTimeout(triggerSale, 2000); // First popup after 2s

        const saleInterval = setInterval(() => {
            // Trigger randomly based on probability
            if (Math.random() > 0.7) {
                triggerSale();
            }
        }, 45000); // Check every 45s

        return () => {
            clearInterval(timer);
            clearInterval(saleInterval);
        };
    }, [product]);

    if (!product || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{lang === 'zh' ? '商品不存在' : 'Product Not Found'}</h1>
                    <button onClick={() => router.push(getLocalizedPath('/', lang))} className="btn-primary">
                        {lang === 'zh' ? '返回首页' : 'Return Home'}
                    </button>
                </div>
            </div>
        );
    }

    const categoryIconUrl = category ? (iconMap[category.id] || iconMap['wechat']) : iconMap['wechat'];

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getUnitPrice = (qty: number) => {
        if (qty >= 200) return product.price.bulk200;
        if (qty >= 50) return product.price.bulk50;
        if (qty >= 10) return product.price.bulk10;
        return product.price.single;
    };

    const getOriginalPrice = (qty: number) => {
        if (!product.price.originalPrice) return null;
        if (qty >= 200) return product.price.originalPrice.bulk200;
        if (qty >= 50) return product.price.originalPrice.bulk50;
        if (qty >= 10) return product.price.originalPrice.bulk10;
        return product.price.originalPrice.single;
    };

    const currentPrice = getUnitPrice(quantity);
    const originalPrice = getOriginalPrice(quantity);
    const reviews = generateMockReviews(lang);
    const isOutOfStock = product.stockCount === 0;

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.tierName[lang],
        description: product.description[lang],
        image: `${SITE_URL}/images/products/${category.id}.png`,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'CNY',
            price: Math.round(currentPrice * 7.2),
            availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            url: `${SITE_URL}${getLocalizedPath(`/product/${product.id}`, lang)}`,
            seller: {
                '@type': 'Organization',
                name: 'CNWePro'
            }
        },
        brand: {
            '@type': 'Brand',
            name: 'CNWePro'
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: product.stockCount * 4 + 12
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-20 pb-24 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href={getLocalizedPath('/', lang)} className="hover:text-primary-600 transition-colors">
                        {lang === 'zh' ? '首页' : 'Home'}
                    </Link>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <Link href={getLocalizedPath(`/${product.category}`, lang)} className="hover:text-primary-600 transition-colors">
                        {category?.name[lang]}
                    </Link>
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    <span className="text-slate-900 dark:text-slate-300 font-medium truncate">
                        {product.tierName[lang]}
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left content: Images & Details */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Main Product Visual Block (Taobao High-Conversion Style) */}
                        <div className="bg-white dark:bg-dark-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden flex flex-col md:flex-row min-h-[300px]">
                            
                            {/* Left: Product Info / Logo */}
                            <div className="flex-1 p-6 md:p-8 z-10 flex flex-col justify-center">
                                <Link 
                                    href={getLocalizedPath(`/${product.category}`, lang)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border ${category ? iconColors[category.id].replace('text-', 'border-').replace('500', '500/30 font-bold bg-white/50 dark:bg-black/20') : ''}`}
                                >
                                    <ShieldCheck className="w-3 h-3" />
                                    {category?.name[lang]} {lang === 'zh' ? '认证自营' : 'Verified'}
                                </Link>
                                
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                                    {product.tierName[lang]}
                                    <span className="block text-sm md:text-base font-medium text-slate-500 mt-2">
                                        {product.description[lang]}
                                    </span>
                                </h1>

                                <div className="flex flex-wrap items-center gap-2 mt-auto">
                                    <div className={`p-2 rounded-xl bg-white dark:bg-dark-800 shadow-sm border border-slate-100 dark:border-slate-800 ${category ? iconColors[category.id] : ''}`}>
                                        {(() => {
                                            const BrandIcon = (category && iconMap[category.id]) || MessageCircle;
                                            return <BrandIcon className="w-8 h-8 md:w-10 md:h-10" />;
                                        })()}
                                    </div>
                                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
                                    <div className="flex flex-col text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <span>Official CNWePro</span>
                                        <span className="text-red-500">Premium Digital Good</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: AI-Generated Product Imagery */}
                            <div className="w-full md:w-[42%] relative overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                {category && (
                                    <Image
                                        src={`/images/products/${category.id}.png`}
                                        alt={category.name[lang]}
                                        fill
                                        priority
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Additional Product Info Card */}
                        <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            {/* Flash Sale Banner */}
                            {product.popular && !isOutOfStock && (
                                <div className="mb-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-3 md:p-4 flex items-center justify-between text-white shadow-md shadow-red-500/20 text-[12px]">
                                    <div className="flex items-center gap-2 font-bold">
                                        <Zap className="w-5 h-5 fill-current animate-pulse" />
                                        {lang === 'zh' ? '开启限时抢购' : 'Flash Sale Active'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium opacity-90">{lang === 'zh' ? '距结束' : 'Ends in'}</span>
                                        <div className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                            {formatTime(timeLeft)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-success-600 dark:text-success-400" />
                                        </div>
                                        <span>{feature[lang]}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Preview Button */}
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                className="flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-4"
                            >
                                <Eye className="w-4 h-4" />
                                {lang === 'zh' ? '预览账号详情' : 'Preview Account Details'}
                            </button>

                            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>{product.warranty[lang]}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                    <Clock className="w-4 h-4 text-primary-500" />
                                    <span>{lang === 'zh' ? '预计发货：' : 'Est. Delivery: '}{product.deliveryTime[lang]}</span>
                                </div>
                            </div>

                            {/* Shop Ratings (Taobao Style) */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 p-4 bg-slate-50 dark:bg-dark-800/50 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                                        店
                                    </div>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">CNWePro {lang === 'zh' ? '官方旗舰店' : 'Official Store'}</span>
                                    <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold ml-1 flex items-center gap-0.5">
                                        <ShieldCheck className="w-3 h-3" />
                                        {lang === 'zh' ? '金牌卖家' : 'Gold'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1">
                                        {lang === 'zh' ? '宝贝描述' : 'Item'} <span className="text-red-500 font-bold">4.9</span> <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-0.5 rounded leading-none pt-px">{lang === 'zh' ? '高' : 'Hi'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {lang === 'zh' ? '卖家服务' : 'Service'} <span className="text-red-500 font-bold">4.9</span> <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-0.5 rounded leading-none pt-px">{lang === 'zh' ? '高' : 'Hi'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {lang === 'zh' ? '物流服务' : 'Logistics'} <span className="text-red-500 font-bold">4.9</span> <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-0.5 rounded leading-none pt-px">{lang === 'zh' ? '高' : 'Hi'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Live Sales Notification (relative to column) */}
                        {recentBuyer && (
                            <div className="bg-white dark:bg-dark-900 border border-success-200 dark:border-success-900/30 rounded-xl p-3 shadow-md animate-fade-in-up flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {lang === 'zh' ? `用户 ${recentBuyer} 刚刚购买了该商品` : `User ${recentBuyer} just purchased this`}
                                    </span>
                                </div>
                                <span className="text-xs text-slate-400">
                                    {lang === 'zh' ? '刚刚' : 'Just now'}
                                </span>
                            </div>
                        )}

                        {/* Description & Detail Section */}
                        <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                                <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                                {lang === 'zh' ? '商品详情' : 'Product Details'}
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                                <p>
                                    {lang === 'zh'
                                        ? '本商品为纯原手工注册的高质量账号，防封防屏蔽，支持各种核心场景使用。所有账号在发货前均已经过严格的网络环境和人工质检，确保100%存活率。'
                                        : 'These accounts are hand-registered with high-quality IPs, designed to prevent bans and blocks. Supports all core usage scenarios. Quality is manually verified before delivery.'}
                                </p>
                                <ul>
                                    <li>{lang === 'zh' ? '购买后提供完整账号、密码及关联资料。' : 'Full account credentials and linked info provided upon purchase.'}</li>
                                    <li>{lang === 'zh' ? '如需批量验证，请联系客服获取API对接文档。' : 'For bulk verification, contact support for API documentation.'}</li>
                                    <li>{lang === 'zh' ? '因数字商品特殊性，发货后非质量问题不支持退换。' : 'Due to the nature of digital goods, no refunds after delivery unless there is a quality issue.'}</li>
                                </ul>

                                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4 mt-6 flex gap-3 text-rose-800 dark:text-rose-300">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold mb-1">{lang === 'zh' ? '防骗提醒' : 'Anti-Scam Warning'}</p>
                                        <p className="text-xs opacity-90">
                                            {lang === 'zh'
                                                ? '近期有不法分子冒充客服进行诈骗。本平台唯一付款方式为网站内TRC20付款，客服绝不会私下要求微信或支付宝转账。'
                                                : 'Beware of scammers impersonating our staff. Only pay via the official TRC20 address on this website.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white dark:bg-dark-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <div className="w-1 h-6 bg-gold-500 rounded-full"></div>
                                    {lang === 'zh' ? '买家评价' : 'Buyer Reviews'}
                                    <span className="text-sm font-normal text-slate-500 ml-2">({product.stockCount * 4 + 12})</span>
                                </h2>
                                <div className="flex items-center gap-1 text-gold-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold">4.9</span>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-5 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-sm">{review.name}</span>
                                                <div className="flex gap-0.5 text-gold-400">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 pl-10">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right content: Sticky Checkout Bar for Desktop */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-24 bg-white dark:bg-dark-900 rounded-3xl p-6 shadow-xl border-t-4 border-t-red-500 border-x border-b border-slate-200 dark:border-slate-800 lg:p-8">
                            <div className="mb-4 bg-red-50/50 dark:bg-red-900/10 p-4 -space-y-1 rounded-2xl border border-red-100 dark:border-red-900/30">
                                <div className="text-xs text-slate-500 mb-1 font-medium">{lang === 'zh' ? '到手价' : 'Final Price'}</div>
                                <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 text-red-600 dark:text-red-500">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {formatYuan(currentPrice * quantity)}
                                        </span>
                                    </div>

                                    {originalPrice !== null && originalPrice > currentPrice && (
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-400 line-through font-bold">
                                                {formatYuan(originalPrice * quantity)}
                                            </span>
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mt-1 uppercase">
                                                {lang === 'zh' ? '已省' : 'SAVE'} {formatYuan((originalPrice - currentPrice) * quantity)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3">
                                    <button
                                        onClick={() => setIsSlashModalOpen(true)}
                                        className="text-[11px] md:text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-red-900 font-extrabold px-3 py-1.5 rounded-full flex items-center justify-center gap-1 shadow-sm shadow-yellow-500/20 active:scale-95 transition-all w-[max-content] animate-pulse"
                                    >
                                        <Scissors className="w-3.5 h-3.5" />
                                        {lang === 'zh' ? '砍一刀拿更低价！' : 'Slash for Lower Price!'}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-red-100 dark:border-red-900/20">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StockBadge count={product.stockCount} lang={lang} />
                                        {product.popular && (
                                            <span className="text-[11px] bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                {lang === 'zh' ? '全网热销榜 No.1' : 'Top Selling'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Flash Sale Progress Bar (Fake scarcity) */}
                                    <div className="w-full mt-1">
                                        <div className="flex justify-between text-[10px] font-bold text-red-600 dark:text-red-400 mb-1">
                                            <span>{lang === 'zh' ? '本场疯抢中' : 'Flash Sale'}</span>
                                            <span>{lang === 'zh' ? '已抢 92%' : '92% Claimed'}</span>
                                        </div>
                                        <div className="h-2 w-full bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 w-[92%] rounded-full relative">
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20 animate-slide-right"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-dark-800 rounded-xl p-3 mb-6 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>{lang === 'zh' ? '支持平台担保交易' : 'Escrow Protected'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <Zap className="w-4 h-4 text-orange-500" />
                                    <span>{lang === 'zh' ? '自动发货' : 'Instant Auth'}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
                                    {lang === 'zh' ? '批发阶梯价' : 'Bulk Pricing'}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                                    {[
                                        { label: '1-9件', en: '1-9 pcs', price: product.price.single, min: 1 },
                                        { label: '10-49件', en: '10-49', price: product.price.bulk10, min: 10 },
                                        { label: '50-199件', en: '50-199', price: product.price.bulk50, min: 50 },
                                        { label: '≥200件', en: '≥200', price: product.price.bulk200, min: 200 }
                                    ].map((tier, idx) => {
                                        const isActive = quantity >= tier.min && (idx === 3 || quantity < [10, 50, 200][idx]);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => setQuantity(tier.min)}
                                                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 cursor-pointer transition-all ${isActive ? 'bg-red-50 border-red-500 dark:bg-red-900/20 text-red-700 dark:text-red-400 shadow-sm shadow-red-500/20' : 'bg-slate-50 border-transparent hover:border-red-200 dark:bg-dark-800 text-slate-600 dark:text-slate-400'}`}
                                            >
                                                <span className="text-[10px] md:text-xs font-medium mb-1 whitespace-nowrap">
                                                    {lang === 'zh' ? tier.label : tier.en}
                                                </span>
                                                <span className={`text-sm md:text-base font-black tabular-nums ${isActive ? 'text-red-600 dark:text-red-500' : ''}`}>
                                                    {formatYuan(tier.price)}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 dark:bg-dark-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {lang === 'zh' ? '购买数量' : 'Quantity'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 shadow-sm"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stockCount}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.min(product.stockCount, Math.max(1, parseInt(e.target.value) || 1)))}
                                            className="w-16 h-10 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 font-black focus:outline-none focus:ring-2 focus:ring-red-500"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                            className="w-10 h-10 rounded-lg bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 shadow-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {isOutOfStock ? (
                                <button
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-extrabold transition-all duration-200 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {lang === 'zh' ? '已售罄' : 'Sold Out'}
                                </button>
                            ) : (
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => addItem(product.id, quantity)}
                                        className="flex-[1] flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-extrabold transition-all duration-200 bg-orange-100 dark:bg-orange-500/20 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 shadow-sm"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {lang === 'zh' ? '加入购物车' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            addItem(product.id, quantity);
                                            router.push(getLocalizedPath('/checkout', lang));
                                        }}
                                        className="flex-[1.5] w-full flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-extrabold transition-all duration-200 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white shadow-xl shadow-red-500/30 hover:-translate-y-1 active:scale-95"
                                    >
                                        {lang === 'zh' ? '立即购买' : 'Buy Now'}
                                    </button>
                                </div>
                            )}

                            {/* Mobile Sticky Bottom CTA */}
                            {!isOutOfStock && (
                                <div className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 px-4 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex items-center justify-between gap-3 animate-fade-in-up">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                            {lang === 'zh' ? '合计' : 'Total'}
                                        </span>
                                        <span className="text-xl font-black text-red-600 dark:text-red-500 leading-none">
                                            {formatYuan(currentPrice * quantity)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <button
                                            onClick={() => addItem(product.id, quantity)}
                                            className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 active:scale-95"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                addItem(product.id, quantity);
                                                router.push(getLocalizedPath('/checkout', lang));
                                            }}
                                            className="flex-1 h-12 rounded-xl text-sm font-black bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/30 active:scale-95"
                                        >
                                            {lang === 'zh' ? '立即购买' : 'Buy Now'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {lang === 'zh' ? '安全交易' : 'Secure'}</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {lang === 'zh' ? '光速发货' : 'Fast'}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lang === 'zh' ? '真人客服' : 'Support'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductPreview
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                product={product}
                lang={lang}
            />

            <SlashPriceModal
                isOpen={isSlashModalOpen}
                onClose={() => setIsSlashModalOpen(false)}
                lang={lang}
                productName={product.tierName[lang]}
            />
        </div>
    );
}
