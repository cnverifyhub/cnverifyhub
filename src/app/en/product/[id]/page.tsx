import { ProductPageTemplate } from '@/components/product/ProductPageTemplate';
import { getProductById, allProducts } from '@/data/products';
import { Metadata } from 'next';

export function generateStaticParams() {
    return allProducts.map((p) => ({
        id: p.id,
    }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
    const product = getProductById(params.id);
    return {
        title: product ? `${product.tierName.en} - Limited Offer` : 'Product Not Found',
        description: product?.description.en || 'Invalid product'
    };
}

export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageTemplate productId={params.id} lang="en" />;
}
