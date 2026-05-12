-- Core E-commerce Schema for CNVerifyHub
-- Updated with user profiles, bundles, services, and advanced tracking

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    telegram VARCHAR(255) UNIQUE,
    display_name VARCHAR(255),
    total_spent NUMERIC(10, 2) DEFAULT 0,
    vip_tier VARCHAR(20) DEFAULT 'bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(255) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) DEFAULT 'account', -- account, bundle, service
    name_en VARCHAR(255) NOT NULL,
    name_zh VARCHAR(255) NOT NULL,
    price_usdt NUMERIC(10, 2) NOT NULL,
    stock_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    telegram VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    txid VARCHAR(255) UNIQUE,
    tx_verified BOOLEAN DEFAULT false,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_network VARCHAR(50),
    delivery_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Vault Accounts (Digital Inventory)
CREATE TABLE IF NOT EXISTS public.vault_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    credentials TEXT NOT NULL,
    is_sold BOOLEAN DEFAULT false,
    assigned_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sold_at TIMESTAMP WITH TIME ZONE
);
