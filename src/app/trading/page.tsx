import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { getProductsByCategory } from '@/data/products';
import { RelatedCategories } from '@/components/category/RelatedCategories';
import { WiseIcon, XmIcon, NetellerIcon, SkrillIcon, HfmIcon, RevolutIcon, PayoneerIcon } from '@/components/icons/FinancialBrandIcons';

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
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-12 mb-6 text-center">
                        支持账户类型
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8 not-prose">
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <WiseIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Wise</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <XmIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">XM Trading</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <NetellerIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Neteller</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <SkrillIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Skrill</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <HfmIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">HFM</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <RevolutIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Revolut</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                            <PayoneerIcon className="w-12 h-12 mb-3" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Payoneer</span>
                        </div>
                    </div>
                </div>
            </section>

            <RelatedCategories currentCategory="trading" lang="zh" />
        </>
    );
}
