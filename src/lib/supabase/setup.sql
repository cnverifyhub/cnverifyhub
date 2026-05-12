-- ===================================================
-- CNVerifyHub v3 — PRODUCTION INFRASTRUCTURE SETUP
-- Run this in your Supabase SQL Editor
-- ===================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES (User Identity & VIP Tiers)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    telegram VARCHAR(255) UNIQUE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    vip_tier VARCHAR(20) DEFAULT 'bronze' CHECK (vip_tier IN ('bronze', 'silver', 'gold', 'diamond')),
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. PRODUCTS (Catalog & Stock Control)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(255) PRIMARY KEY,
    category VARCHAR(100) NOT NULL, -- e.g. wechat, alipay, trading, verification
    subcategory VARCHAR(100),       -- e.g. aged, standard, kyc
    type VARCHAR(50) DEFAULT 'account' CHECK (type IN ('account', 'bundle', 'service')),
    name_en VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_zh TEXT,
    price_usdt NUMERIC(10, 2) NOT NULL,
    stock_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BUNDLE COMPONENTS
CREATE TABLE IF NOT EXISTS public.bundle_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id VARCHAR(255) REFERENCES public.products(id) ON DELETE CASCADE,
    component_id VARCHAR(255) REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS (Sales & Payments)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(50) NOT NULL UNIQUE, -- CNV-XXXXXX
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    telegram VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled')),
    txid VARCHAR(255) UNIQUE,
    tx_verified BOOLEAN DEFAULT false,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_network VARCHAR(50), -- trc20, bep20, erc20, manual
    payment_wallet VARCHAR(255),
    verification_details JSONB,
    delivery_details JSONB, -- Final delivery log
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. VAULT ACCOUNTS (Digital Inventory)
CREATE TABLE IF NOT EXISTS public.vault_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    credentials TEXT NOT NULL, -- Username:Password:Token
    is_sold BOOLEAN DEFAULT false,
    assigned_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- 8. SERVICE ORDERS (Manual Fulfillment)
CREATE TABLE IF NOT EXISTS public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_telegram VARCHAR(255),
    input_data JSONB, -- User provided info for service
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. REVIEWS & TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) REFERENCES public.products(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. COUPONS & DISCOUNTS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_uses INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. FRAUD DETECTION
CREATE TABLE IF NOT EXISTS public.fraud_blocklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('txid', 'wallet', 'ip', 'email')),
    value VARCHAR(255) NOT NULL,
    reason TEXT,
    added_by VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(type, value)
);

CREATE TABLE IF NOT EXISTS public.fraud_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    txid VARCHAR(255),
    wallet_address VARCHAR(255),
    order_id VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. ANNOUNCEMENTS (Dynamic Site Ticker)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_zh TEXT NOT NULL,
    content_en TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- SECURITY & ACCESS CONTROL (RLS)
-- ===================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Users view/update own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Users view own by ID or Email
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Reviews: Anyone can read, only authenticated users can write
CREATE POLICY "Anyone can view public reviews" ON public.reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ===================================================
-- INDEXES (Performance)
-- ===================================================
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_id, email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_products_cat_active ON public.products(category, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_vault_avail ON public.vault_accounts(product_id) WHERE is_sold = false;
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id) WHERE is_public = true;

-- ===================================================
-- TRIGGERS
-- ===================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_ts BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_products_ts BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_orders_ts BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_service_orders_ts BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

-- ===================================================
-- SEED DATA
-- ===================================================
INSERT INTO public.products (id, category, type, name_en, name_zh, price_usdt, stock_count, is_featured, sort_order)
VALUES 
('wechat-standard', 'wechat', 'account', 'WeChat Standard Account', '微信标准个人账号', 29.00, 100, true, 1),
('wechat-6m-aged', 'wechat', 'account', 'WeChat 6m Aged Account', '微信6个月高权重老号', 59.00, 45, true, 2),
('alipay-personal', 'alipay', 'account', 'Alipay Personal Verified', '支付宝个人实名认证号', 45.00, 80, true, 1),
('trading-forex-v1', 'trading', 'service', 'Forex Trading Account Setup', '外汇交易账户代开通', 199.00, 999, false, 1)
ON CONFLICT (id) DO UPDATE SET price_usdt = EXCLUDED.price_usdt;
