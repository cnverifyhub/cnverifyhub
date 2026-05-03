import type { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/category/CategoryPageTemplate';
import { RelatedCategories } from '@/components/category/RelatedCategories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cnwepro.com';

export const metadata: Metadata = {
    title: 'Combo Bundles - Alipay + Xianyu / Taobao / 1688 Linked Sets',
    description: 'Multi-platform linked account sets: Alipay + Xianyu, Alipay + Taobao, WeChat + JD, and more. Pre-linked and ready to use, solving verification hurdles instantly.',
    keywords: 'Alipay Xianyu bundle, Taobao verified set, 1688 wholesale account, WeChat JD combo',
    alternates: {
        canonical: `${SITE_URL}/en/bundle/`,
        languages: { 'zh-CN': `${SITE_URL}/bundle/`, 'en': `${SITE_URL}/en/bundle/` },
    },
};

export default function EnglishBundlePage() {
    return (
        <>
            <CategoryPageTemplate categoryId="bundle" lang="en" />
            
            {/* SEO Content Section */}
            <section className="section-container py-12 md:py-16">
                <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Multi-Platform Combo Bundles
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        To solve complex verification issues across different platforms, we offer carefully 
                        calibrated combo sets. These accounts are cross-platform linked and real-name 
                        synchronized during registration, ensuring a seamless experience when switching 
                        between different applications.
                    </p>
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-4">
                        Why Choose a Bundle?
                    </h3>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                        <li><strong>No Linking Hassles:</strong> Alipay is pre-linked with Xianyu, Taobao, or 1688.</li>
                        <li><strong>Higher Authority:</strong> Combo sets have real-world social and e-commerce linkage, leading to better stability.</li>
                        <li><strong>Best Value:</strong> Save more compared to purchasing accounts individually.</li>
                    </ul>
                </div>
            </section>

            <RelatedCategories currentCategory="bundle" lang="en" />
        </>
    );
}
