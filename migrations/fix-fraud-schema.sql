ALTER TABLE fraud_blocklist ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE fraud_blocklist ADD COLUMN IF NOT EXISTS value VARCHAR(255);
ALTER TABLE fraud_blocklist ADD COLUMN IF NOT EXISTS added_by VARCHAR(100) DEFAULT 'admin';
ALTER TABLE fraud_blocklist ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS idx_fraud_blocklist_type_val ON fraud_blocklist(type, value);

ALTER TABLE fraud_events ADD COLUMN IF NOT EXISTS severity VARCHAR(20);
ALTER TABLE fraud_events ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE fraud_events ADD COLUMN IF NOT EXISTS txid VARCHAR(255);
ALTER TABLE fraud_events ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);
ALTER TABLE fraud_events ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE fraud_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_fraud_events_ip_event_created ON fraud_events(ip_address, event_type, created_at);

ALTER TABLE fraud_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_events ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
