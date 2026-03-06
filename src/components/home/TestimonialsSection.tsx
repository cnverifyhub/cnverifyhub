import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { testimonialsData } from '@/data/testimonials';
import { t, type Lang } from '@/lib/i18n';

export function TestimonialsSection({ lang }: { lang: Lang }) {
    return (
        <section className="py-24 bg-slate-50/50 dark:bg-dark-900/50 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-tr from-transparent via-primary-500/5 dark:via-primary-900/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('home.reviews.title', lang)}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t('home.reviews.subtitle', lang)}
                    </p>
                </div>

                <TestimonialCarousel testimonials={testimonialsData} lang={lang} />
            </div>
        </section>
    );
}
