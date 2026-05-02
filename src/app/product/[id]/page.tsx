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
    if (product?.category === 'bundle') {
        return <BundleProductPageTemplate productId={params.id} lang="zh" />;
    }
    return <ProductPageTemplate productId={params.id} lang="zh" />;
}
