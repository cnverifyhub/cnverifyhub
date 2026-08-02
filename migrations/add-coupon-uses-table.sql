-- Migration: Add coupon_uses table for tracking single-use coupons per email
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  coupon_code VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_coupon_code_email UNIQUE(coupon_code, email)
);

ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_coupon_uses_email_code ON coupon_uses(email, coupon_code);

NOTIFY pgrst, 'reload schema';
