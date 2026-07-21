-- Migration: 20260721_phase2_conversion_schema.sql
-- Description: Phase 2 schema additions for stock triggers, cart recovery, and order state processing

-- 1. Cart Abandonment Tracking Table
CREATE TABLE IF NOT EXISTS public.cart_abandonment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  email TEXT,
  telegram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  recovered_at TIMESTAMP WITH TIME ZONE,
  email_sent_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.cart_abandonment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert/view own cart recovery" ON public.cart_abandonment
    FOR ALL USING (
        user_id = auth.uid() OR auth.uid() IS NULL
    );

-- 2. Stock Controls for Products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT -1,
ADD COLUMN IF NOT EXISTS stock_unlimited BOOLEAN DEFAULT true;

-- 3. Stock Decrement Function & Trigger
CREATE OR REPLACE FUNCTION public.decrement_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    -- If items exist in order JSONB array, update stock_count
    -- Assuming order record stores items in `items` JSONB array: [{ "productId": "...", "quantity": 1 }]
    IF NEW.items IS NOT NULL AND jsonb_typeof(NEW.items) = 'array' THEN
      UPDATE public.products p
      SET stock_count = GREATEST(0, p.stock_count - (item->>'quantity')::int),
          sold_count = p.sold_count + (item->>'quantity')::int
      FROM jsonb_array_elements(NEW.items) AS item
      WHERE p.id = item->>'productId' AND p.stock_unlimited = false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe trigger application on orders table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    DROP TRIGGER IF EXISTS trg_decrement_stock ON public.orders;
    CREATE TRIGGER trg_decrement_stock
      AFTER UPDATE OF status ON public.orders
      FOR EACH ROW
      EXECUTE FUNCTION public.decrement_product_stock();
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
