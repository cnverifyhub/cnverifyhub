-- Consolidated schema script for CNVerifyHub Supabase instance.
-- Supports brand-new databases and upgrades to existing databases.

-- ============================================
-- 1. Categories Table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name_zh VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  gradient VARCHAR(100) NOT NULL,
  href VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Products Table
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
  tier_name_zh VARCHAR(255) NOT NULL,
  tier_name_en VARCHAR(255) NOT NULL,
  tier_slug VARCHAR(100) NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  price_single DECIMAL(10, 2) NOT NULL,
  price_bulk10 DECIMAL(10, 2) NOT NULL,
  price_bulk50 DECIMAL(10, 2) NOT NULL,
  price_bulk200 DECIMAL(10, 2) NOT NULL,
  original_price_single DECIMAL(10, 2),
  original_price_bulk10 DECIMAL(10, 2),
  original_price_bulk50 DECIMAL(10, 2),
  original_price_bulk200 DECIMAL(10, 2),
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  warranty_zh VARCHAR(255) NOT NULL,
  warranty_en VARCHAR(255) NOT NULL,
  delivery_time_zh VARCHAR(255) NOT NULL,
  delivery_time_en VARCHAR(255) NOT NULL,
  stock_count INTEGER NOT NULL DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  badge_zh VARCHAR(50),
  badge_en VARCHAR(50),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all possible columns exist on the products table in case it was already created:
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tier_name_zh VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tier_name_en VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tier_slug VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_zh TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_single DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_bulk10 DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_bulk50 DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_bulk200 DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price_single DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price_bulk10 DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price_bulk50 DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price_bulk200 DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_zh VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_en VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_time_zh VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_time_en VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_zh VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge_en VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'account';
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USDT';
ALTER TABLE products ADD COLUMN IF NOT EXISTS includes TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_method VARCHAR(20) DEFAULT 'auto';
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_time VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_hours INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_image VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS og_image VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_zh TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_usdt NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_old_usdt NUMERIC(10,2) DEFAULT 0;

ALTER TABLE products ADD COLUMN IF NOT EXISTS price_bulk_10 NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_bulk_50 NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_bulk_200 NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_old_bulk_10 NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_old_bulk_50 NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_old_bulk_200 NUMERIC(10,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add generated columns for CNY pricing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price_cny') THEN
        ALTER TABLE products ADD COLUMN price_cny NUMERIC(10,2)
        GENERATED ALWAYS AS (ROUND(price_usdt * 7.2, 2)) STORED;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price_old_cny') THEN
        ALTER TABLE products ADD COLUMN price_old_cny NUMERIC(10,2)
        GENERATED ALWAYS AS (ROUND(price_old_usdt * 7.2, 2)) STORED;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price_bulk_10_cny') THEN
        ALTER TABLE products ADD COLUMN price_bulk_10_cny NUMERIC(10,2)
        GENERATED ALWAYS AS (ROUND(price_bulk_10 * 7.2, 2)) STORED;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price_bulk_50_cny') THEN
        ALTER TABLE products ADD COLUMN price_bulk_50_cny NUMERIC(10,2)
        GENERATED ALWAYS AS (ROUND(price_bulk_50 * 7.2, 2)) STORED;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price_bulk_200_cny') THEN
        ALTER TABLE products ADD COLUMN price_bulk_200_cny NUMERIC(10,2)
        GENERATED ALWAYS AS (ROUND(price_bulk_200 * 7.2, 2)) STORED;
    END IF;
END $$;

-- ============================================
-- 3. Product Variants Table
-- ============================================
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 4. Bundle Composition Table
-- ============================================
CREATE TABLE IF NOT EXISTS bundle_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    component_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(bundle_id, component_id)
);

-- ============================================
-- 5. Posts (Blog) Table
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(100) PRIMARY KEY,
  title_zh VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  excerpt_zh TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  content_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  read_time VARCHAR(20) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  txid VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure all new columns exist on the orders table in case it was already created:
ALTER TABLE orders ADD COLUMN IF NOT EXISTS telegram VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS crypto_type VARCHAR(50) DEFAULT 'USDT';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_wallet VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_network VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tx_verified BOOLEAN DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS verification_details JSONB;

-- ============================================
-- 7. Order Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price_at_time NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 8. Service Orders Table
-- ============================================
CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
    customer_email VARCHAR(255),
    customer_telegram VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    requirements_submitted BOOLEAN DEFAULT false,
    requirements_data JSONB DEFAULT '{}',
    result_data JSONB DEFAULT '{}',
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 9. Order Emails (Email Outbox Queue)
-- ============================================
CREATE TABLE IF NOT EXISTS order_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    email_type VARCHAR(100) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_telegram VARCHAR(255),
    subject_zh VARCHAR(255),
    subject_en VARCHAR(255),
    body_zh TEXT,
    body_en TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- Row Level Security (RLS) policies
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_emails ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog data
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own service orders" ON service_orders;
CREATE POLICY "Users can view own service orders" ON service_orders
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = service_orders.order_id AND orders.user_id = auth.uid())
    );

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active_published ON products(is_active, is_published);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_order_id ON service_orders(order_id);

-- ============================================
-- Triggers and Procedures
-- ============================================

-- Re-apply products updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- completed order -> Trustpilot review request
CREATE OR REPLACE FUNCTION queue_trustpilot_review_request()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
        INSERT INTO order_emails (
            order_id,
            email_type,
            recipient_email,
            recipient_telegram,
            subject_zh,
            subject_en,
            body_zh,
            body_en,
            status,
            created_at
        ) VALUES (
            NEW.id,
            'trustpilot_review_request',
            NEW.email,
            NEW.telegram,
            '您的订单已交付 - 邀请您为 CNVerifyHub 评分',
            'Your order has been delivered - Invite to review CNVerifyHub',
            '亲爱的客户，您的订单已顺利发货并确认完成。为了不断改进我们的服务品质，诚挚邀请您前往 Trustpilot 为我们留下宝贵的评分与使用反馈：https://cnverifyhub.com/review?order_id=' || NEW.id || '\nThank you for choosing CNVerifyHub!',
            'Dear Customer, your order has been successfully delivered and completed. To help us improve, we invite you to share your feedback on Trustpilot: https://cnverifyhub.com/review?order_id=' || NEW.id || '\nThank you for choosing CNVerifyHub!',
            'pending',
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_order_completed_trustpilot ON orders;
CREATE TRIGGER trigger_on_order_completed_trustpilot
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION queue_trustpilot_review_request();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
-- ============================================
-- 10. Fraud Tables
-- ============================================
CREATE TABLE IF NOT EXISTS fraud_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(45),
  fingerprint VARCHAR(255),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS fraud_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(45),
  fingerprint VARCHAR(255),
  event_type VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- Stock Decrement Trigger
-- ============================================
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    UPDATE products
    SET stock_count = stock_count - NEW.quantity
    WHERE id = NEW.product_id AND stock_count >= NEW.quantity;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_decrement_stock_on_order ON orders;
CREATE TRIGGER trigger_decrement_stock_on_order
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION decrement_stock_on_order();
-- ============================================
-- 11. Cart Recoveries
-- ============================================
CREATE TABLE IF NOT EXISTS cart_recoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cart_snapshot JSONB NOT NULL,
  recovered BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 12. Reviews
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id VARCHAR(100) REFERENCES products(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_zh TEXT,
  review_en TEXT,
  reviewer_name TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE OR REPLACE FUNCTION mark_cart_recovered()
RETURNS TRIGGER AS $
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    UPDATE cart_recoveries
    SET recovered = true
    WHERE email = NEW.email AND recovered = false;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_mark_cart_recovered ON orders;
CREATE TRIGGER trigger_mark_cart_recovered
  AFTER UPDATE OF status ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION mark_cart_recovered();





-- ==========================================
-- PHASE 4: SCALE & AUTOMATION
-- ==========================================

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) REFERENCES products(id),
    credential_data JSONB NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available','reserved','delivered')),
    delivered_to_order UUID REFERENCES orders(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percent','fixed')),
    discount_value NUMERIC(10,2) NOT NULL,
    max_uses INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_user_id UUID,
    referral_code TEXT UNIQUE NOT NULL,
    referred_orders INTEGER DEFAULT 0,
    commission_earned NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger: On orders.status = 'paid' -> Reserve inventory
CREATE OR REPLACE FUNCTION handle_paid_order_inventory()
RETURNS TRIGGER AS \$\$
DECLARE
    inv_id UUID;
BEGIN
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status <> 'paid') THEN
        -- Find available inventory
        SELECT id INTO inv_id FROM inventory 
        WHERE product_id = NEW.product_id AND status = 'available' 
        LIMIT 1 FOR UPDATE SKIP LOCKED;

        IF FOUND THEN
            -- Reserve inventory
            UPDATE inventory SET status = 'reserved', delivered_to_order = NEW.id WHERE id = inv_id;
            -- Queue webhook/telegram delivery
            INSERT INTO _job_queue (task_type, payload) VALUES ('deliver_credentials', jsonb_build_object('order_id', NEW.id, 'inventory_id', inv_id));
        ELSE
            -- No inventory -> pending_manual
            UPDATE orders SET status = 'pending_manual' WHERE id = NEW.id;
            NEW.status := 'pending_manual';
            INSERT INTO _job_queue (task_type, payload) VALUES ('notify_admin_no_stock', jsonb_build_object('order_id', NEW.id, 'product_id', NEW.product_id));
        END IF;
    END IF;
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_handle_paid_order_inventory ON orders;
CREATE TRIGGER trigger_handle_paid_order_inventory
    BEFORE UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION handle_paid_order_inventory();


-- ==========================================
-- PHASE 5: OPTIMIZE
-- ==========================================

CREATE TABLE IF NOT EXISTS order_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    email_type TEXT NOT NULL CHECK (email_type IN ('t0_welcome', 't1_guide', 't7_review')),
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to queue t0_welcome on order completion
CREATE OR REPLACE FUNCTION queue_t0_welcome_email()
RETURNS TRIGGER AS \$\$
BEGIN
    IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status <> 'paid') THEN
        INSERT INTO order_emails (order_id, email_type) VALUES (NEW.id, 't0_welcome');
        INSERT INTO order_emails (order_id, email_type) VALUES (NEW.id, 't1_guide');
        INSERT INTO order_emails (order_id, email_type) VALUES (NEW.id, 't7_review');
    END IF;
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_queue_t0_welcome_email ON orders;
CREATE TRIGGER trigger_queue_t0_welcome_email
    AFTER UPDATE OF status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION queue_t0_welcome_email();

