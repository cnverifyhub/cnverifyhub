-- Drop existing tables to ensure clean slate (careful in production)
-- DROP TABLE IF EXISTS orders, products, posts, categories;

-- ============================================
-- 1. Categories Table
-- ============================================
CREATE TABLE categories (
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
CREATE TABLE products (
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
  features JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of objects: { zh: string, en: string }
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

-- ============================================
-- 3. Posts (Blog) Table
-- ============================================
CREATE TABLE posts (
  id VARCHAR(100) PRIMARY KEY,
  title_zh VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  excerpt_zh TEXT NOT NULL,
  excerpt_en TEXT NOT NULL,
  content_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  date VARCHAR(50) NOT NULL, -- e.g., '2026-03-20'
  read_time VARCHAR(20) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Orders Table (For future use)
-- ============================================
CREATE TABLE orders (
  id VARCHAR(100) PRIMARY KEY,
  product_id VARCHAR(100) REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  txid VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set Row Level Security (RLS) policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog data
CREATE POLICY "Public profiles are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone." ON posts FOR SELECT USING (true);

-- Only authenticated admins can modify catalog data (you will need to setup auth later if managing via a dash)
-- Orders can only be read by the owner (using email/txid logic later) 
