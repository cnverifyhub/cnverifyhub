-- Migration: 20260726_02_inventory.sql
-- Description: Inventory table for encrypted account credential storage and automated delivery

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(100) REFERENCES public.products(id) ON DELETE CASCADE,
    tenant_id VARCHAR(50) DEFAULT 'cnverifyhub',
    credentials_encrypted TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'delivered')),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    sold_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index on (product_id, tenant_id, status) for fast stock queries
CREATE INDEX IF NOT EXISTS idx_inventory_prod_tenant_status ON public.inventory(product_id, tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant_id ON public.inventory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_order_id ON public.inventory(order_id);

-- Enable RLS and set security policy
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Service role inventory access" ON public.inventory;
    CREATE POLICY "Service role inventory access" ON public.inventory
        FOR ALL USING (auth.uid() IS NULL OR auth.role() = 'service_role');
END $$;

NOTIFY pgrst, 'reload schema';
