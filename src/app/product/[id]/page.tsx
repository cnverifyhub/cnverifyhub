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
        title: product ? `${product.tierName.zh} - 特价抢购` : '无效商品',
        description: product?.description.zh || '商品不存在'
    };
}

export default function ProductPage({ params }: { params: { id: string } }) {
    return <ProductPageTemplate productId={params.id} lang="zh" />;
}
