import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { faqData } from '@/data/faq';
import { t, type Lang } from '@/lib/i18n';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/i18n';

export function FAQSection({ lang }: { lang: Lang }) {
    return (
        <section className="py-24 bg-white dark:bg-dark-950">
            <div className="section-container">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* FAQ Copy/Intro */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                            {t('nav.faq', lang)}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            {lang === 'zh'
                                ? '我们整理了一些客户最常问到的问题。如果您没有在这里找到答案，我们的客服团队将随时为您提供帮助。'
                                : 'We\'ve compiled the most frequently asked questions. If you can\'t find your answer here, our support team is ready to help.'}
                        </p>

                        <div className="glass-card p-6 rounded-2xl border-primary-100 dark:border-primary-900/30 bg-primary-50/50 dark:bg-primary-900/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white">
                                    {lang === 'zh' ? '还有其他问题？' : 'Still have questions?'}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                {lang === 'zh' ? '不要犹豫，通过 Telegram 或者我们的联系表单直接联系我们的人工客服。' : 'Don\'t hesitate to contact our manual support via Telegram or our contact form.'}
                            </p>
                            <Link href={getLocalizedPath('/contact', lang)} className="btn-primary w-full justify-center">
                                {t('contact.submit', lang)}
                            </Link>
                        </div>
                    </div>

                    {/* FAQ Accordions */}
                    <div className="lg:w-2/3 w-full">
                        {/* Show top 5 FAQs on homepage */}
                        <FAQAccordion items={faqData} lang={lang} limit={5} />

                        <div className="mt-8 text-center">
                            <Link
                                href={getLocalizedPath('/faq', lang)}
                                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold inline-flex items-center gap-2 hover:underline underline-offset-4 transition-all"
                            >
                                {lang === 'zh' ? '查看全部常见问题' : 'View all FAQs'}
                                <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
