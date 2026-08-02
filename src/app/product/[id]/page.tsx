import { ProductPageTemplate } from '@/components/product/ProductPageTemplate';
import { BundleProductPageTemplate } from '@/components/product/BundleProductPageTemplate';
import { getProductById, allProducts } from '@/data/products';
import { Metadata } from 'next';
import { getSeoAlternates } from '@/lib/seo-utils';

export function generateStaticParams() {
    return allProducts.map((p) => ({
        id: p.id,
    }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
    const product = getProductById(params.id);
    const productName = product?.name?.zh || product?.name?.en || product?.tierName?.zh || product?.tierName?.en || 'Verified Account';
    const productDesc = product?.description?.zh || product?.description?.en || 'Buy verified Chinese accounts with instant delivery.';
    const categoryName = product?.category || 'Account';
    
    const alternates = getSeoAlternates(null, `/product/${params.id}`);
    const siteUrl = alternates.canonical;

    const title = product ? `${productName} - 特价抢购 | CNVerifyHub` : '无效商品 | CNVerifyHub';
    const description = productDesc;
    const ogImageUrl = `https://cnverifyhub.com/api/og?title=${encodeURIComponent(productName)}&subtitle=${encodeURIComponent(description)}&category=${encodeURIComponent(categoryName)}`;

    return {
        title,
        description,
        alternates,
        openGraph: {
            title,
            description,
            url: siteUrl,
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: productName,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
    };
}

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = getProductById(params.id);
    if (!product) return <div>Product not found</div>;

    const productName = product?.name?.zh || product?.name?.en || product?.tierName?.zh || product?.tierName?.en || 'Verified Account';
    const productDescription = product?.description?.zh || product?.description?.en || '';
    const productPrice = product?.price?.single !== undefined ? product.price.single.toString() : '0';
    const stockStatus = (product?.stockCount ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
    const sku = product?.sku || product?.id || `CNV-${params.id}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productName,
        description: productDescription,
        image: `https://cnverifyhub.com/images/products/${product?.category || 'account'}.webp`,
        sku: sku,
        brand: {
            '@type': 'Organization',
            name: 'CNVerifyHub',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127',
            bestRating: '5',
            worstRating: '1',
        },
        offers: {
            '@type': 'Offer',
            price: productPrice,
            priceCurrency: 'USD',
            availability: stockStatus,
            url: `https://cnverifyhub.com/product/${product?.id}`,
        },
    };

    if (product?.category === 'bundle') {
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
