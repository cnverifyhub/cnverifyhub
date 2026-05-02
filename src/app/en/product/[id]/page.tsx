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
        title: product ? `${product.tierName.en} - Limited Offer` : 'Product Not Found',
        description: product?.description.en || 'Invalid product'
    };
}

export default function ProductPage({ params }: { params: { id: string } }) {
    const product = getProductById(params.id);
    if (product?.category === 'bundle') {
        return <BundleProductPageTemplate productId={params.id} lang="en" />;
    }
    return <ProductPageTemplate productId={params.id} lang="en" />;
}
