import { Hero } from '@/components/home/Hero';
import { CategoryCards } from '@/components/home/CategoryCards';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CustomerReviews } from '@/components/home/CustomerReviews';
import { PopularProducts } from '@/components/home/PopularProducts';
import { FAQSection } from '@/components/home/FAQSection';
import { ContactFloat } from '@/components/ui/ContactFloat';
import { LuckyWheel } from '@/components/home/LuckyWheel';

export default function Home() {
    const lang = 'zh';

    return (
        <div className="flex flex-col min-h-screen">
            <Hero lang={lang} />
            <CategoryCards lang={lang} />
            <PopularProducts lang={lang} />
            <WhyChooseUs lang={lang} />
            <CustomerReviews lang={lang} />
            <FAQSection lang={lang} />
            <ContactFloat lang={lang} />
            <LuckyWheel lang={lang} />
        </div>
    );
}
