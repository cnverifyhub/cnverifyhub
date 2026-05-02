-- migration: 20260503_schema_expansion.sql
-- Description: Expand schema to support bundles, services, and trading accounts

-- 1. Update Products Table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_zh TEXT,
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'account', -- account, bundle, service, document
ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USDT',
ADD COLUMN IF NOT EXISTS includes TEXT[],
ADD COLUMN IF NOT EXISTS requirements TEXT[],
ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(20) DEFAULT 'auto', -- auto, manual, scheduled
ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(100),
ADD COLUMN IF NOT EXISTS warranty_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS featured_image VARCHAR(255),
ADD COLUMN IF NOT EXISTS og_image VARCHAR(255),
ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- 2. Product Variants Table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) REFERENCES public.products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. "Basic", "Pro"
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bundle Composition Table
CREATE TABLE IF NOT EXISTS public.bundle_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id VARCHAR(255) REFERENCES public.products(id) ON DELETE CASCADE,
    component_id VARCHAR(255) REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(bundle_id, component_id)
);

-- 4. Service Orders Table
CREATE TABLE IF NOT EXISTS public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES public.products(id) ON DELETE SET NULL,
    customer_email VARCHAR(255),
    customer_telegram VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, awaiting_customer, completed, failed
    requirements_submitted BOOLEAN DEFAULT false,
    requirements_data JSONB DEFAULT '{}',
    result_data JSONB DEFAULT '{}',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- admin ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Service Orders
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own service orders" ON public.service_orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = service_orders.order_id AND orders.user_id = auth.uid())
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(type);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON public.service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_order_id ON public.service_orders(order_id);
