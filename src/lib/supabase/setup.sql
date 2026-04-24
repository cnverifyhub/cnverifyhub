-- CNWEPRO COMPLETE INFRASTRUCTURE SETUP
-- Run this in your Supabase SQL Editor (SQL Tools > New Query)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
-- Supports Email or Telegram as primary identity
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    telegram VARCHAR(255) UNIQUE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    total_spent NUMERIC(10, 2) DEFAULT 0,
    vip_tier VARCHAR(20) DEFAULT 'bronze' CHECK (vip_tier IN ('bronze', 'silver', 'gold', 'diamond')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE (Inventory Control)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(255) PRIMARY KEY,
    category VARCHAR(100) NOT NULL, -- e.g., wechat, alipay
    variant VARCHAR(100) NOT NULL,  -- e.g., standard, aged_6m, merchant
    name_en VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255) NOT NULL,
    stock_count INTEGER DEFAULT 0,
    price_usdt NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE (Core Sales)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(50) NOT NULL UNIQUE, -- CNW-XXXXXX or CNW-MANUAL-XXXXXX
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
    delivery_details JSONB, -- Stores account credentials for manual fulfillment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. VAULT ACCOUNTS (Digital Inventory)
CREATE TABLE IF NOT EXISTS public.vault_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    credentials TEXT NOT NULL,
    is_sold BOOLEAN DEFAULT false,
    assigned_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- 7. FRAUD DETECTION
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

-- 8. INDEXES (Speed Optimization)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_public_id ON public.orders(public_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category, is_active);
CREATE INDEX IF NOT EXISTS idx_vault_stock ON public.vault_accounts(product_id) WHERE is_sold = false;

-- 9. RLS POLICIES (Zero Trust Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 9a. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 9b. Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- 10. SEED PRODUCTS DATA
INSERT INTO public.products (id, category, variant, name_en, name_zh, price_usdt, stock_count)
VALUES 
('wechat-white', 'wechat', 'White Account', 'WeChat White Account', '微信新手白号', 25.00, 100),
('wechat-6m-aged', 'wechat', '6 Months Aged', 'WeChat 6m Aged', '微信6个月老号', 55.00, 30),
('alipay-personal-verified', 'alipay', 'Verified Personal', 'Alipay Personal Verified', '支付宝个人认证号', 45.00, 50),
('alipay-merchant-full', 'alipay', 'Full Merchant', 'Alipay Merchant Verified', '支付宝全认证商家号', 145.00, 15)
ON CONFLICT (id) DO UPDATE SET 
    price_usdt = EXCLUDED.price_usdt,
    stock_count = EXCLUDED.stock_count;

-- 11. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
