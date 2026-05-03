import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: '金融交易账户 - 已实名认证XM, HFM, Payoneer, Wise账户',
    description: '专业提供全球金融交易平台已实名认证账户：XM, HFM, Neteller, Skrill, Payoneer, Wise。USDT担保交易，极速发货，全天候售后支持。',
    keywords: 'XM账号购买, HFM账号, Payoneer实名号, Wise账户购买, 金融账号交易',
    alternates: {
        canonical: `${SITE_URL}/trading/`,
        languages: { 'zh-CN': `${SITE_URL}/trading/`, 'en': `${SITE_URL}/en/trading/` },
    },
};

export default function TradingPage() {
    return (
        <>
            <CategoryPageTemplate categoryId="trading" lang="zh" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        全球金融账户交易指南
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        CNWePro 为全球交易者提供安全、已认证的金融与支付账户。我们的账户均由真实身份完成 KYC 验证，
                        适用于外汇交易、跨境收款及全球电子钱包支付。支持 <strong>USDT</strong> 匿名支付，
                        保障您的个人信息安全与资金链路隐蔽。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        支持账户类型
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>外汇经纪商：</strong>XM、HFM (HotForex) 等主流平台已认证交易账户。</li>
                        <li><strong>电子钱包：</strong>Neteller、Skrill 等全球通用支付钱包。</li>
                        <li><strong>跨境收款：</strong>Payoneer (派安盈)、Wise 等多币种收款与换汇账户。</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="trading" lang="zh" />
        </>
    );
}
