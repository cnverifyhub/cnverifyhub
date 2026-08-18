-- Migration: 20260816_01_job_queue_and_revenue.sql
-- Description: Creates _job_queue, newsletter_subscribers, adds missing columns, seeds RECOVER5 coupon & verified reviews

-- 1. Create _job_queue Table for background workers & auto-delivery pipeline
CREATE TABLE IF NOT EXISTS public._job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) DEFAULT 'cnverifyhub',
  task_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_job_queue_tenant_status ON public._job_queue(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_job_queue_created_at ON public._job_queue(created_at);

ALTER TABLE public._job_queue ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Service role and tenant access _job_queue" ON public._job_queue;
  CREATE POLICY "Service role and tenant access _job_queue" ON public._job_queue
    FOR ALL USING (tenant_id IS NOT NULL);
END $$;

-- 2. Create newsletter_subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(50) DEFAULT 'cnverifyhub',
  email VARCHAR(255) NOT NULL,
  discount_code VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  source VARCHAR(100) DEFAULT 'footer',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_newsletter_tenant_email UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_tenant_email ON public.newsletter_subscribers(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON public.newsletter_subscribers(status);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
  CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (tenant_id IS NOT NULL);

  DROP POLICY IF EXISTS "Tenant view newsletter subscribers" ON public.newsletter_subscribers;
  CREATE POLICY "Tenant view newsletter subscribers" ON public.newsletter_subscribers
    FOR SELECT USING (tenant_id IS NOT NULL);
END $$;

-- 3. Schema Alterations with Safe Idempotency
-- Add discount_code and subscribed_at to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS discount_code VARCHAR(50);
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMPTZ DEFAULT NOW();

-- Add order_id and delivered_to_order to inventory
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS order_id UUID;
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS delivered_to_order UUID;

-- Add country_code to reviews
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS country_code VARCHAR(10) DEFAULT 'CN';
CREATE INDEX IF NOT EXISTS idx_reviews_country_code ON public.reviews(country_code);

-- Add reminder_count and last_reminder_sent_at to cart_abandonment
ALTER TABLE public.cart_abandonment ADD COLUMN IF NOT EXISTS reminder_count INT DEFAULT 0;
ALTER TABLE public.cart_abandonment ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMPTZ;

-- Add tenant_id to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(50) DEFAULT 'cnverifyhub';
CREATE INDEX IF NOT EXISTS idx_posts_tenant_id ON public.posts(tenant_id);

-- 4. Seed RECOVER5 5% Discount Coupon
INSERT INTO public.coupons (code, discount_type, discount_value, max_uses, used_count, expires_at, tenant_id)
VALUES ('RECOVER5', 'percent', 5.00, 10000, 0, NOW() + INTERVAL '1 year', 'cnverifyhub')
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  tenant_id = EXCLUDED.tenant_id;

-- 5. Seed Initial Verified Reviews with Country Codes
INSERT INTO public.reviews (product_id, rating, review_zh, review_en, reviewer_name, verified, country_code, tenant_id)
VALUES
  ('wechat-enterprise', 5, '企业号实名过审很快，对接客服技术指导非常专业，当天就上线开通微信支付。', 'Enterprise account real-name approval was very fast. Technical support was professional, opened WeChat Pay same day.', '陈总 (海外电商)', true, 'CN', 'cnverifyhub'),
  ('alipay-aged', 5, '老号权重极高，带历史账单，跑了两个月零风控，发货秒发，强烈推荐！', 'Aged account has top trust score with billing history. Ran 2 months with zero bans. Instant delivery, highly recommended!', 'Alex_SG', true, 'SG', 'cnverifyhub'),
  ('douyin-live', 5, '买来做跨境直播带货的，千粉真人纯白号，当晚开播就进自然流，非常给力。', 'Bought for cross-border livestream dropshipping. 1k real followers clean account. Got organic traffic immediately.', 'Kevin H.', true, 'HK', 'cnverifyhub'),
  ('qq-aged-svip', 5, '纯手工老号，密保换绑顺畅，带SVIP年费，工作室跑业务首选。', 'Handmade aged account, smooth security question binding, comes with annual SVIP, top choice for studios.', 'GamingStudio_TW', true, 'TW', 'cnverifyhub'),
  ('wechat-personal-aged', 5, '匿名USDT支付秒到账，防封教程写的很详细，小白也能轻松上号。', 'Anonymous USDT payment confirmed instantly, anti-ban tutorial is comprehensive, easy for beginners.', 'Marcus W.', true, 'US', 'cnverifyhub'),
  ('alipay-personal-v2', 5, '马来西亚做代购找了很久才找到这么稳的渠道，转账收款丝滑无卡顿。', 'Malaysia personal shopper here. Hard to find such reliable channels. Transfers and payouts are super smooth.', 'Lim_KL', true, 'MY', 'cnverifyhub')
ON CONFLICT DO NOTHING;

-- 6. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
