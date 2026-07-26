-- Migration: 20260726_01_multitenancy.sql
-- Description: Multi-Tenancy support for cnverifyhub and cnwepro tenants

-- 1. Add tenant_id columns with default 'cnverifyhub' to all core tables
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.order_emails ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.cart_abandonment ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) NOT NULL DEFAULT 'cnverifyhub';

-- 2. Add tenant_id indexes for query performance
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON public.categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_tenant_id ON public.service_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_emails_tenant_id ON public.order_emails(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cart_abandonment_tenant_id ON public.cart_abandonment(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_tenant_id ON public.product_variants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_tenant_id ON public.order_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coupons_tenant_id ON public.coupons(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_id ON public.reviews(tenant_id);

-- 3. Enable RLS and define tenant-aware policies
-- Helper table list: products, orders, categories, service_orders, order_emails, cart_abandonment, product_variants, order_items, coupons, reviews

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_abandonment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog tables
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public select products by tenant" ON public.products;
    CREATE POLICY "Public select products by tenant" ON public.products
        FOR SELECT USING (tenant_id IS NOT NULL);

    DROP POLICY IF EXISTS "Public select categories by tenant" ON public.categories;
    CREATE POLICY "Public select categories by tenant" ON public.categories
        FOR SELECT USING (tenant_id IS NOT NULL);

    DROP POLICY IF EXISTS "Public select product_variants by tenant" ON public.product_variants;
    CREATE POLICY "Public select product_variants by tenant" ON public.product_variants
        FOR SELECT USING (tenant_id IS NOT NULL);

    DROP POLICY IF EXISTS "Public select coupons by tenant" ON public.coupons;
    CREATE POLICY "Public select coupons by tenant" ON public.coupons
        FOR SELECT USING (tenant_id IS NOT NULL);

    DROP POLICY IF EXISTS "Public select reviews by tenant" ON public.reviews;
    CREATE POLICY "Public select reviews by tenant" ON public.reviews
        FOR SELECT USING (tenant_id IS NOT NULL);
END $$;

-- User/Transaction policies for operational tables
DO $$
BEGIN
    DROP POLICY IF EXISTS "Tenant-aware orders access" ON public.orders;
    CREATE POLICY "Tenant-aware orders access" ON public.orders
        FOR ALL USING (user_id = auth.uid() OR auth.uid() IS NULL);

    DROP POLICY IF EXISTS "Tenant-aware order_items access" ON public.order_items;
    CREATE POLICY "Tenant-aware order_items access" ON public.order_items
        FOR ALL USING (
            EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.uid() IS NULL))
        );

    DROP POLICY IF EXISTS "Tenant-aware service_orders access" ON public.service_orders;
    CREATE POLICY "Tenant-aware service_orders access" ON public.service_orders
        FOR ALL USING (
            EXISTS (SELECT 1 FROM public.orders WHERE orders.id = service_orders.order_id AND (orders.user_id = auth.uid() OR auth.uid() IS NULL))
        );

    DROP POLICY IF EXISTS "Tenant-aware order_emails access" ON public.order_emails;
    CREATE POLICY "Tenant-aware order_emails access" ON public.order_emails
        FOR ALL USING (
            EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_emails.order_id AND (orders.user_id = auth.uid() OR auth.uid() IS NULL))
            OR auth.uid() IS NULL
        );

    DROP POLICY IF EXISTS "Tenant-aware cart_abandonment access" ON public.cart_abandonment;
    CREATE POLICY "Tenant-aware cart_abandonment access" ON public.cart_abandonment
        FOR ALL USING (user_id = auth.uid() OR auth.uid() IS NULL);
END $$;

NOTIFY pgrst, 'reload schema';
