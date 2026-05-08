import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://CNVerifyHub.com';

export const metadata: Metadata = {
    title: 'Verification Services - Passport KYC, Face Recognition Assistance',
    description: 'Professional real-name verification services for Alipay, WeChat, and other major apps. Global passport KYC, face recognition assistance, and full KYC data packages.',
    keywords: 'Alipay verification service, WeChat real-name assistance, Passport KYC, Face recognition bypass, Account verification',
    alternates: {
        canonical: `${SITE_URL}/en/verification/`,
        languages: { 'zh-CN': `${SITE_URL}/verification/`, 'en': `${SITE_URL}/en/verification/` },
    },
};

export default function EnglishVerificationPage() {
    return (
        <>
            <CategoryPageTemplate categoryId="verification" lang="en" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Professional Real-Name Verification Services
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        Due to policy restrictions, many international users face strict real-name requirements 
                        when using Chinese apps. CNVerifyHub provides comprehensive authentication support 
                        to help you overcome these hurdles and restore full account functionality.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Service Scope
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>Passport Verification:</strong> Assisted KYC using legal international passports for Alipay and WeChat Pay.</li>
                        <li><strong>Face Recognition Help:</strong> Solutions for secondary face audits during login or withdrawal processes.</li>
                        <li><strong>KYC Data Packages:</strong> Providing complete identity verification materials for compliance needs.</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="verification" lang="en" />
        </>
    );
}
