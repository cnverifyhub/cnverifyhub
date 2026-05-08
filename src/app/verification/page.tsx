import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: '实名认证代办服务 - 护照实名认证, 人脸识别验证',
    description: '提供专业的支付宝、微信及各大应用实名认证代办服务。支持护照实名、人脸识别验证协助、全套KYC资料包。安全高效，成功率高。',
    keywords: '支付宝实名代认证, 微信实名代办, 护照KYC, 人脸验证协助, 账号实名服务',
    alternates: {
        canonical: `${SITE_URL}/verification/`,
        languages: { 'zh-CN': `${SITE_URL}/verification/`, 'en': `${SITE_URL}/en/verification/` },
    },
};

export default function VerificationPage() {
    return (
        <>
            <CategoryPageTemplate categoryId="verification" lang="zh" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        专业实名认证代办服务
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        由于政策限制，许多海外用户在登录中国应用时会遇到严苛的实名要求。CNVerifyHub 提供全方位的认证支持服务，
                        帮助您跨越身份验证障碍，恢复账号全功能。
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        服务范围
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>护照实名认证：</strong>使用全球合法护照辅助完成支付宝、微信支付的实名。</li>
                        <li><strong>人脸验证协助：</strong>针对登录、提现等环节出现的二次人脸审核提供技术解决方案。</li>
                        <li><strong>KYC资料包：</strong>为合规需求提供完整的身份证明资料支持。</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="verification" lang="zh" />
        </>
    );
}
