import { ProductPageTemplate } from '@/components/product/ProductPageTemplate';
import { BundleProductPageTemplate } from '@/components/product/BundleProductPageTemplate';
import { getProductById, allProducts } from '@/data/products';
import { Metadata } from 'next';

export function generateStaticParams() {
    return allProducts.map((p) => ({
        id: p.id,
    }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
    const product = getProductById(params.id);
    if (product?.category === 'bundle') {
        return {
            title: `Buy ${product.tierName.en} | Pre-Linked Verified Chinese Accounts`,
            description: "Skip China phone verification. Buy pre-linked Alipay + Xianyu accounts. Instant delivery. 7-day warranty. Start selling on Xianyu today."
        }
    }
    return {
        title: product ? `${product.tierName.zh} - 特价抢购` : '无效商品',
        description: product?.description.zh || '商品不存在'
    };
}

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = getProductById(params.id);
    if (!product) return <div>Product not found</div>;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.tierName.en,
        description: product.description.en,
        image: `https://cnverifyhub.com/images/products/${product.category}.webp`,
        offers: {
            '@type': 'Offer',
            price: product.price.single.toString(),
            priceCurrency: 'USD',
            availability: product.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://cnverifyhub.com/product/${product.id}`
        }
    };

    if (product.category === 'bundle') {
        return (
            <>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <BundleProductPageTemplate productId={params.id} lang="zh" />
            </>
        );
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ProductPageTemplate productId={params.id} lang="zh" />
        </>
    );
}
