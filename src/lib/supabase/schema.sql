-- Core E-commerce Schema for CNWePro
-- Updated with user profiles and RLS

-- 0. Profiles Table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    telegram VARCHAR(255),
    display_name VARCHAR(255),
    total_spent NUMERIC(10, 2) DEFAULT 0,
    vip_tier VARCHAR(20) DEFAULT 'bronze',
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

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. CNW-123456
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- auth user link
    email VARCHAR(255) NOT NULL,
    telegram VARCHAR(255),
    crypto_type VARCHAR(50) DEFAULT 'USDT',
    txid VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, processing, completed, cancelled
    tx_verified BOOLEAN DEFAULT false,
    total_amount NUMERIC(10, 2) NOT NULL,
    verification_details JSONB, -- stores TronScan/BSCScan/Etherscan payload
    payment_wallet VARCHAR(255), -- which wallet address received the payment
    payment_network VARCHAR(50), -- trc20, bep20, erc20
    delivery_details JSONB, -- stores manual login credentials sent by admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Vault Accounts (Digital Inventory)
CREATE TABLE IF NOT EXISTS public.vault_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) NOT NULL,
    credentials TEXT NOT NULL, -- e.g. Username:Password:BackupCode
    is_sold BOOLEAN DEFAULT false,
    assigned_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sold_at TIMESTAMP WITH TIME ZONE
);

-- 4. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Anon/service can insert orders (for checkout)
CREATE POLICY "Anyone can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Users can view their order items
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

-- Service role can do everything (admin panel)
-- Note: Service role key bypasses RLS automatically

-- 5. Fraud Detection Tables
-- 5a. Blocklist of suspicious wallet addresses / TXIDs / IPs / emails
CREATE TABLE IF NOT EXISTS public.fraud_blocklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('txid', 'wallet', 'ip', 'email')),
    value VARCHAR(255) NOT NULL,
    reason VARCHAR(255),
    added_by VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(type, value)
);

-- 5b. Fraud event log
CREATE TABLE IF NOT EXISTS public.fraud_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    txid VARCHAR(255),
    wallet_address VARCHAR(255),
    order_id VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_fraud_blocklist_type_value ON public.fraud_blocklist(type, value);
CREATE INDEX IF NOT EXISTS idx_fraud_events_created ON public.fraud_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_events_type ON public.fraud_events(event_type);
CREATE INDEX IF NOT EXISTS idx_fraud_events_severity ON public.fraud_events(severity);
CREATE INDEX IF NOT EXISTS idx_orders_email_created ON public.orders(email, created_at DESC);

-- 6. Products Table (for stock management)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(255) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255) NOT NULL,
    stock_count INTEGER DEFAULT 0,
    price_usdt NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed some products from the static catalog
INSERT INTO public.products (id, category, name_en, name_zh, price_usdt, stock_count)
VALUES 
('wechat-standard-v1', 'wechat', 'Standard Individual Account', '标准个人账号', 29.00, 50),
('wechat-aged-2023', 'wechat', '2023 Aged Account', '2023年老号', 45.00, 25),
('wechat-merchant-verified', 'wechat', 'Merchant Verified Account', '商家认证账号', 120.00, 10),
('alipay-personal-standard', 'alipay', 'Personal Standard Account', '个人标准账号', 35.00, 40),
('alipay-merchant-full', 'alipay', 'Full Merchant Verified', '全认证商家号', 150.00, 5)
ON CONFLICT (id) DO NOTHING;
