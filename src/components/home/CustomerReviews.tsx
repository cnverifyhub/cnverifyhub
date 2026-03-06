'use client';

import { Star, CheckCircle2, ThumbsUp } from 'lucide-react';
import { t, type Lang } from '@/lib/i18n';
import { useState, useEffect } from 'react';

const baseReviews = [
    { sku: "微信实名高级号", text: "买了好几次了，这次的号还可以。就是客服回复稍慢了一点，不过资料给了很全，防封教程也有用。给个好评吧。", en: "Bought several times, this account is okay. CS response was a bit slow, but got full details and the anti-ban tutorial helped. Good rating anyway." },
    { sku: "支付宝老号", text: "发货是秒发，真的牛。拿到手看了一下权重很高，拿去跑业务非常稳。之前在别家买的被坑了，这家确实比较靠谱。", en: "Delivery is instant, truly amazing. Checked the account trust score and it's high, steady for business. Got scammed elsewhere before, this place is solid." },
    { sku: "抖音精养号", text: "老顾客了，质量一如既往的稳定。最近风控严，只有买这家的白号才敢用，一分钱一分货，稍微有点贵，但也值了！", en: "Return customer, quality is stable. Risk control is strict recently, only dare to use these pure accounts. You get what you pay for, slightly pricey but worth it!" },
    { sku: "微信实名企业号", text: "找了很久才找到支持USDT的，USDT手续费稍微有丢丢高，不过全匿名不用留痕迹，我很放心。账号资料齐全！", en: "Searched long for USDT support. USDT fees are a bit high, but being fully anonymous is what I need. Account details are complete!" },
    { sku: "QQ老号", text: "很满意的购物体验，买来给工作室打游戏的。质保7天让人安心。虽然中间碰到点小问题，但也解决了。", en: "Satisfied experience, bought for my studio's gaming. 7-day warranty is reassuring. Hit a minor issue but they solved it." },
    { sku: "支付宝代实名", text: "牛逼，真的是纯手工号，不是机器刷的。跑了一周了一点风控都没触发，强推！", en: "Awesome, truly handmade accounts. Ran for a week without triggering any risk control, highly recommend!" },
    { sku: "抖音千粉号", text: "买来开直播带货的，自带1000真人粉，刚开播流量没有想象的那么爆炸，但号确实是白号没违规，慢慢养吧。", en: "Bought for dropshipping live stream. Comes with 1000 followers. Traffic wasn't instantly explosive as expected, but the account is perfectly clean, will grow it slowly." },
    { sku: "微信支付开通号", text: "付款后自己研究了半天才登上去，主要是为了安全防封。测试一下收付款完全稳定。客服态度还是不错的。", en: "Took a while to log in myself after paying, mostly due to strict security measures. Payment features are perfectly stable. CS attitude is nice." },
    { sku: "海外Apple ID", text: "终于可以下国外的APP了！安全不锁区。建议大家拿到手立马自己改个密保更稳妥一点。速度刚刚的！", en: "Finally can download global apps! No region lock. I suggest everyone change the security questions immediately for peace of mind. Speed is top!" },
    { sku: "支付宝老号", text: "双十一做活动跑量用的，一口气拿了50个号，掉了2个，联系客服立马补发了，售后还可以的。整体成活率很高。", en: "Used for 11.11 promo volume pushing. Took 50, lost 2, but CS immediately replaced them. After-sales is decent. Overall high survival rate." },
    { sku: "小红书千粉号", text: "太给力了，买来发引流笔记，流量不错。价格要是能再便宜点就好了，下次有活动再来囤货。", en: "Awesome, bought to post traffic-driving notes, good traffic. Wish the price was slightly cheaper, will stockpile more during next promo." },
    { sku: "快手直播号", text: "非常丝滑。价格比我预期的要便宜，而且一上号就能直接开播，没有任何限制，真稳。", en: "Very smooth. Price is better than expected, and can stream immediately upon logging in without restrictions, really steady." },
    { sku: "淘宝买家号", text: "帮公司采购买的，核实了下实名状态确实没问题。登录需要验证费了点时间，总体还是可以的。", en: "Bought for company purchasing. Verified the real-name status is solid. Login authentication took some time, but overall acceptable." },
    { sku: "京东Plus会员", text: "用来薅羊毛简直神器。账号信息给的很详细，支持担保交易没有坑。", en: "Magical tool for finding bargains. Account info provided is very detailed, escrow transaction means no scams." },
    { sku: "微信满月号", text: "朋友推荐过来的，果然号很耐用。我自己也试过别家，只有这家的最省心。贵一点有贵的好处。", en: "Recommended by a friend, indeed durable accounts. Tried others myself, this one gives the most peace of mind. You pay for quality." },
    { sku: "Twitter推特老号", text: "账号质量很高，年份很久了。用来做海外营销推广非常好用。目前一切正常。", en: "High quality account, very aged. Extremely useful for overseas marketing. Everything normal so far." }
];

const namesPool = ["手机用户3812", "阿***", "158****9921", "T***m", "王***", "S***2", "匿名买家", "无名氏", "wx_***992", "M***K", "y***0", "刘***生", "风***去", "夜***雪", "陈***哥", "719****882", "张***三", "W***n", "大***佬", "猫***咪", "深***海", "星***光", "188****2311"];
const avatarsPool = ["Felix", "Aneka", "Jasper", "Sadie", "Leo", "Mia", "Liam", "Nola", "Chen", "Jack", "Aiden", "Brook", "Chase", "Eden", "Harley", "Jocelyn", "Kimberly", "Mason", "Riley", "Sawyer", "Jessica"];
const colorsPool = ["f87171", "38bdf8", "4ade80", "c084fc", "fbbf24", "a3e635", "f472b6", "818cf8", "14b8a6", "fb923c", "fca5a5", "93c5fd"];

const generateRandomDate = () => {
    // 2023, 2024, 2025, 2026 strictly
    const years = [2023, 2024, 2025, 2026];
    const year = years[Math.floor(Math.random() * years.length)];
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function CustomerReviews({ lang }: { lang: Lang }) {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        // Shuffle base reviews and assign random names, avatars, and dates
        const shuffled = [...baseReviews].sort(() => Math.random() - 0.5);
        const mapped = shuffled.map(review => {
            const randomName = namesPool[Math.floor(Math.random() * namesPool.length)];
            const randomAvatar = avatarsPool[Math.floor(Math.random() * avatarsPool.length)];
            const randomColor = colorsPool[Math.floor(Math.random() * colorsPool.length)];
            const randomDate = generateRandomDate();

            // Generate Organic Rating: 60% 5-star, 30% 4-star, 10% 3-star
            const rand = Math.random();
            const organicRating = rand > 0.4 ? 5 : rand > 0.1 ? 4 : 3;

            return {
                ...review,
                user: randomName,
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${randomAvatar}&backgroundColor=${randomColor}`,
                date: randomDate,
                rating: organicRating
            };
        });
        setReviews(mapped);
    }, []);

    // Provide skeleton if not mounted yet to avoid hydration mismatch and pop-in jarring
    if (reviews.length === 0) {
        return <div className="py-20 bg-slate-50 dark:bg-dark-950 min-h-[500px]"></div>;
    }

    // Split reviews into two distinct rows and quadruple them for the marquee looping effect
    const mid = Math.ceil(reviews.length / 2);
    const row1Reviews = reviews.slice(0, mid);
    const row2Reviews = reviews.slice(mid);
    const marqueeRow1 = [...row1Reviews, ...row1Reviews, ...row1Reviews, ...row1Reviews];
    const marqueeRow2 = [...row2Reviews, ...row2Reviews, ...row2Reviews, ...row2Reviews];

    return (
        <section className="py-20 bg-slate-50 dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-red-200 dark:border-red-800/50">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {lang === 'zh' ? '真实买家评价' : 'Verified Buyer Reviews'}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            {lang === 'zh' ? '已累计服务 50,000+ 单' : 'Over 50,000+ Orders Completed'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 bg-white dark:bg-dark-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="text-center">
                            <div className="text-2xl font-black text-orange-500">4.92</div>
                            <div className="text-xs text-slate-500 font-medium">综合评分</div>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex flex-col gap-1">
                            <div className="flex text-orange-500">
                                {[...Array(4)].map((_, i) => <Star key={`main-filled-${i}`} className="w-3.5 h-3.5 fill-current" />)}
                                <Star className="w-3.5 h-3.5 fill-current opacity-70" />
                            </div>
                            <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                好评率 <span className="font-bold text-slate-900 dark:text-white">98.6%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marquee Wrapper - Row 1 (Left Scrolling) */}
            <div className="relative w-full flex overflow-x-hidden group mb-6">
                <div className="animate-marquee flex gap-6 px-3 whitespace-nowrap group-hover:pause">
                    {marqueeRow1.map((review, index) => (
                        <div
                            key={`review-r1-${index}`}
                            className="w-[320px] shrink-0 bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow whitespace-normal"
                        >
                            {/* Header: Avatar, Name, Stars */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                                        <img src={review.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {review.user}
                                        </span>
                                        <div className="flex mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={`r1-star-${i}`}
                                                    className={`w-3 h-3 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-300 dark:text-slate-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                            </div>

                            {/* Review Content */}
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                                "{lang === 'zh' ? review.text : review.en}"
                            </p>

                            {/* SKU / Product Info Footer */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                    {lang === 'zh' ? '购买版本：' : 'Variant: '} {review.sku}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-500 font-medium">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {lang === 'zh' ? '已核实' : 'Verified'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-slate-50 dark:from-dark-950 to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-slate-50 dark:from-dark-950 to-transparent pointer-events-none z-10"></div>
            </div>

            {/* Marquee Wrapper - Row 2 (Right Scrolling / Reverse) */}
            <div className="relative w-full flex overflow-x-hidden group pt-2">
                <div className="animate-marquee-reverse flex gap-6 px-3 whitespace-nowrap group-hover:pause">
                    {marqueeRow2.map((review, index) => (
                        <div
                            key={`review-r2-${index}`}
                            className="w-[320px] shrink-0 bg-white dark:bg-dark-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow whitespace-normal"
                        >
                            {/* Header: Avatar, Name, Stars */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                                        <img src={review.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {review.user}
                                        </span>
                                        <div className="flex mt-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={`r2-star-${i}`}
                                                    className={`w-3 h-3 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-300 dark:text-slate-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                            </div>

                            {/* Review Content */}
                            <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                                "{lang === 'zh' ? review.text : review.en}"
                            </p>

                            {/* SKU / Product Info Footer */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                                    {lang === 'zh' ? '购买版本：' : 'Variant: '} {review.sku}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-500 font-medium">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {lang === 'zh' ? '已核实' : 'Verified'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-slate-50 dark:from-dark-950 to-transparent pointer-events-none z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-slate-50 dark:from-dark-950 to-transparent pointer-events-none z-10"></div>
            </div>
        </section>
    );
}
