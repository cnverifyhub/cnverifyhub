-- Core E-commerce Schema for CNWePro

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. CNW-123456
    email VARCHAR(255) NOT NULL,
    telegram VARCHAR(255),
    crypto_type VARCHAR(50) DEFAULT 'USDT',
    txid VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, completed, cancelled
    tx_verified BOOLEAN DEFAULT false,
    total_amount NUMERIC(10, 2) NOT NULL,
    verification_details JSONB, -- stores TronScan payload
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

-- Note: RLS is disabled by default, meaning all tables are accessible via the Data API.
-- For production security against malicious client-side writes:
-- We should enable RLS on orders and vault_accounts, and strictly manage them via Server environment (Service Role Key).
-- For now, the MVP relies on rapid deployment.
