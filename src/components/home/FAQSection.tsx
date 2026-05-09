import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { faqData } from '@/data/faq';
import { t, type Lang } from '@/lib/i18n';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function FAQSection({ lang }: { lang: Lang }) {
    return (
        <section className="py-24 bg-[#060B18] border-t border-[#1E2D45] relative overflow-hidden">
            {/* Background Flair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF0036]/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="section-container relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-start">

                    {/* FAQ Copy/Intro */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-px w-8 bg-[#FF0036]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF0036]"># FAQ</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                                {lang === 'zh' ? '常见问题解答' : 'Frequently Asked Questions'}
                            </h2>
                            <p className="text-[#7B91B0] text-lg mb-10 leading-relaxed">
                                {lang === 'zh'
                                    ? '我们为您整理了最常见的疑问。如果仍有不解，请随时联系我们的 24/7 在线人工支持。'
                                    : 'We\'ve compiled the most common questions. If you still have doubts, feel free to contact our 24/7 manual support.'}
                            </p>

                            <div className="bg-[#0D1526]/50 backdrop-blur-xl p-8 rounded-2xl border border-[#1E2D45] relative group">
                                <div className="absolute inset-0 bg-[#FF0036]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-[#FF0036]/10 flex items-center justify-center text-[#FF0036] border border-[#FF0036]/20 shadow-[0_0_15px_rgba(255,0,54,0.1)]">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        {lang === 'zh' ? '需要人工协助？' : 'Need Assistance?'}
                                    </h3>
                                </div>
                                <p className="text-sm text-[#7B91B0] mb-8 leading-relaxed relative z-10">
                                    {lang === 'zh' 
                                        ? '我们的专家团队全天候在线，随时准备为您解决任何技术或交易问题。' 
                                        : 'Our team of experts is online around the clock, ready to solve any technical or trading issues.'}
                                </p>
                                <Link 
                                    href={getLocalizedPath('/contact', lang)} 
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-white text-[#060B18] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#FF0036] hover:text-white transition-all duration-300 relative z-10 group/btn"
                                >
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    {t('contact.submit', lang)}
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* FAQ Accordions */}
                    <div className="lg:w-2/3 w-full">
                        <FAQAccordion items={faqData} lang={lang} limit={8} />

                        <div className="mt-12 text-center">
                            <Link
                                href={getLocalizedPath('/faq', lang)}
                                className="group inline-flex items-center gap-3 text-[#7B91B0] hover:text-white transition-all font-bold uppercase tracking-[0.15em] text-xs"
                            >
                                {lang === 'zh' ? '浏览完整文档库' : 'Explore Full Documentation'}
                                <span className="w-8 h-8 rounded-full border border-[#1E2D45] flex items-center justify-center group-hover:border-[#FF0036] group-hover:bg-[#FF0036] group-hover:text-white transition-all">
                                    <span aria-hidden="true">&rarr;</span>
                                </span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
