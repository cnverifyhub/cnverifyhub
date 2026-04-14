import { supabase } from '@/lib/supabase/client';

/* ============================================
   Fraud Detection Rules Engine — CNWePro
   Local rules-based (no AI costs)
   Designed for Chinese/HK crypto marketplace patterns
   ============================================ */

export type FraudSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FraudEventType =
    | 'rapid_fire_orders'
    | 'bulk_order'
    | 'test_payment'
    | 'blocked_wallet'
    | 'blocked_ip'
    | 'blocked_email'
    | 'suspicious_amount'
    | 'rate_limit'
    | 'unknown_source';

interface FraudResult {
    allowed: boolean;
    severity: FraudSeverity;
    events: FraudEvent[];
}

interface FraudEvent {
    type: FraudEventType;
    severity: FraudSeverity;
    reason: string;
    metadata?: Record<string, any>;
}

// ─── Thresholds (Chinese market optimized) ───
const THRESHOLDS = {
    /** Max orders per email in 24 hours */
    ORDERS_PER_EMAIL_24H: 3,
    /** Max order attempts per IP in 1 hour */
    ORDERS_PER_IP_1H: 5,
    /** Min quantity for "bulk order" flag */
    BULK_ORDER_THRESHOLD: 50,
    /** Total quantity in 24h that triggers bulk flag */
    BULK_VELOCITY_24H: 100,
    /** Min amount for "high-value" flag (USDT) */
    HIGH_VALUE_THRESHOLD: 500,
    /** TXID pattern: test payments often have very short or specific patterns */
    TEST_TXID_MIN_LENGTH: 10,
    /** Max same-wallet TXIDs in 1 hour */
    SAME_WALLET_TXID_1H: 3,
};

// ─── Known Chinese VPN / Proxy exit node ranges (abbreviated, common ones) ───
// These are commonly used IP ranges for Chinese VPN exits
const KNOWN_VPN_PREFIXES = [
    '154.', '155.', '45.', '103.28.', '103.75.', '103.131.',
    '162.', '172.', '198.', '192.', '104.',
];

/** Check blocklist */
async function checkBlocklist(value: string, type: 'txid' | 'wallet' | 'ip' | 'email'): Promise<FraudEvent | null> {
    try {
        const { data } = await supabase
            .from('fraud_blocklist')
            .select('id')
            .eq('type', type)
            .eq('value', value)
            .maybeSingle();

        if (data) {
            return {
                type: `blocked_${type}` as FraudEventType,
                severity: 'critical',
                reason: `${type.toUpperCase()} ${value.substring(0, 12)}... is on the blocklist`,
                metadata: { type, value },
            };
        }
    } catch {
        // If blocklist check fails, allow (fail-open for availability)
    }
    return null;
}

/** Check order velocity: how many orders in recent time window */
async function checkOrderVelocity(email?: string, ip?: string): Promise<FraudEvent[]> {
    const events: FraudEvent[] = [];
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const since1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    try {
        // Check email velocity (24h)
        if (email) {
            const { count: emailCount24h } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('email', email)
                .gte('created_at', since24h);

            if ((emailCount24h || 0) >= THRESHOLDS.ORDERS_PER_EMAIL_24H) {
                events.push({
                    type: 'rate_limit',
                    severity: 'high',
                    reason: `Email ${email.substring(0, 8)}... has ${emailCount24h} orders in 24h (limit: ${THRESHOLDS.ORDERS_PER_EMAIL_24H})`,
                    metadata: { email, count: emailCount24h, window: '24h' },
                });
            }
        }

        // Check IP velocity (1h)
        if (ip) {
            const { count: ipCount1h } = await supabase
                .from('fraud_events')
                .select('*', { count: 'exact', head: true })
                .eq('ip_address', ip)
                .eq('event_type', 'rapid_fire_orders')
                .gte('created_at', since1h);

            if ((ipCount1h || 0) >= THRESHOLDS.ORDERS_PER_IP_1H) {
                events.push({
                    type: 'rapid_fire_orders',
                    severity: 'high',
                    reason: `IP ${ip} has ${ipCount1h} rapid orders in 1h`,
                    metadata: { ip, count: ipCount1h, window: '1h' },
                });
            }
        }
    } catch {
        // Fail-open
    }

    return events;
}

/** Check bulk order pattern */
function checkBulkOrder(totalQuantity: number): FraudEvent | null {
    if (totalQuantity >= THRESHOLDS.BULK_ORDER_THRESHOLD) {
        return {
            type: 'bulk_order',
            severity: 'medium',
            reason: `Bulk order detected: ${totalQuantity} units (threshold: ${THRESHOLDS.BULK_ORDER_THRESHOLD})`,
            metadata: { quantity: totalQuantity },
        };
    }
    return null;
}

/** Check suspicious amount patterns */
function checkSuspiciousAmount(totalAmount: number, isFirstOrder: boolean): FraudEvent | null {
    // High-value first order (common pattern for stolen account purchases)
    if (totalAmount >= THRESHOLDS.HIGH_VALUE_THRESHOLD && isFirstOrder) {
        return {
            type: 'suspicious_amount',
            severity: 'medium',
            reason: `High-value first order: $${totalAmount} USDT`,
            metadata: { amount: totalAmount, isFirstOrder },
        };
    }

    // Exact round numbers (e.g., 100.00, 500.00) are often test amounts
    if (totalAmount > 10 && totalAmount % 100 === 0) {
        return {
            type: 'suspicious_amount',
            severity: 'low',
            reason: `Round number amount: $${totalAmount} USDT`,
            metadata: { amount: totalAmount },
        };
    }

    return null;
}

/** Check TXID for test patterns */
function checkTestTxidPattern(txid: string): FraudEvent | null {
    if (!txid || txid.length < THRESHOLDS.TEST_TXID_MIN_LENGTH) {
        return {
            type: 'test_payment',
            severity: 'medium',
            reason: `Suspiciously short TXID (${txid.length} chars)`,
            metadata: { txid: txid.substring(0, 8) },
        };
    }
    return null;
}

/** Check wallet TXID velocity (same wallet sending multiple TXIDs in 1h) */
async function checkWalletVelocity(fromWallet: string): Promise<FraudEvent | null> {
    try {
        const since1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count } = await supabase
            .from('fraud_events')
            .select('*', { count: 'exact', head: true })
            .eq('wallet_address', fromWallet)
            .gte('created_at', since1h);

        if ((count || 0) >= THRESHOLDS.SAME_WALLET_TXID_1H) {
            return {
                type: 'test_payment',
                severity: 'high',
                reason: `Same wallet ${fromWallet.substring(0, 8)}... sent ${count} TXIDs in 1h`,
                metadata: { wallet: fromWallet, count, window: '1h' },
            };
        }
    } catch {
        // Fail-open
    }
    return null;
}

// ─── Log fraud events ───
async function logFraudEvents(
    events: FraudEvent[],
    context: { email?: string; ip?: string; txid?: string; wallet?: string; orderId?: string }
) {
    for (const event of events) {
        try {
            await supabase.from('fraud_events').insert({
                event_type: event.type,
                severity: event.severity,
                email: context.email || null,
                ip_address: context.ip || null,
                txid: context.txid || null,
                wallet_address: context.wallet || null,
                order_id: context.orderId || null,
                metadata: { reason: event.reason, ...event.metadata },
            });
        } catch {
            // Don't let logging failures block the order
        }
    }
}

// ─── Main entry point: check before order creation ───
export async function checkOrderCreation(params: {
    email: string;
    ip?: string;
    totalQuantity: number;
    totalAmount: number;
    isFirstOrder?: boolean;
}): Promise<FraudResult> {
    const events: FraudEvent[] = [];

    // 1. Blocklist checks
    const blockChecks = await Promise.all([
        checkBlocklist(params.email, 'email'),
        params.ip ? checkBlocklist(params.ip, 'ip') : Promise.resolve(null),
    ]);
    blockChecks.forEach((e) => e && events.push(e));

    // 2. Velocity checks
    const velocityEvents = await checkOrderVelocity(params.email, params.ip);
    events.push(...velocityEvents);

    // 3. Bulk order check
    const bulkEvent = checkBulkOrder(params.totalQuantity);
    if (bulkEvent) events.push(bulkEvent);

    // 4. Suspicious amount check
    const amountEvent = checkSuspiciousAmount(params.totalAmount, params.isFirstOrder ?? true);
    if (amountEvent) events.push(amountEvent);

    // 5. Determine if order is allowed
    const criticalEvent = events.find((e) => e.severity === 'critical');
    const allowed = !criticalEvent;

    // 6. Log all events
    await logFraudEvents(events, { email: params.email, ip: params.ip });

    return {
        allowed,
        severity: events.length > 0 ? (events.reduce((worst, e) => {
            const order: Record<FraudSeverity, number> = { low: 1, medium: 2, high: 3, critical: 4 };
            return order[e.severity] > order[worst] ? e.severity : worst;
        }, 'low' as FraudSeverity)) : 'low',
        events,
    };
}

// ─── Check before payment verification ───
export async function checkPaymentVerification(params: {
    txid: string;
    fromWallet?: string;
    ip?: string;
}): Promise<FraudResult> {
    const events: FraudEvent[] = [];

    // 1. Blocklist check for TXID + wallet
    const blockChecks = await Promise.all([
        checkBlocklist(params.txid, 'txid'),
        params.fromWallet ? checkBlocklist(params.fromWallet, 'wallet') : Promise.resolve(null),
    ]);
    blockChecks.forEach((e) => e && events.push(e));

    // 2. TXID pattern check
    const txidEvent = checkTestTxidPattern(params.txid);
    if (txidEvent) events.push(txidEvent);

    // 3. Wallet velocity check
    if (params.fromWallet) {
        const walletEvent = await checkWalletVelocity(params.fromWallet);
        if (walletEvent) events.push(walletEvent);
    }

    // 4. Log events
    await logFraudEvents(events, {
        txid: params.txid,
        wallet: params.fromWallet,
        ip: params.ip,
    });

    return {
        allowed: true, // Never block verification — just flag for review
        severity: events.length > 0
            ? events.reduce((worst, e) => {
                const order: Record<FraudSeverity, number> = { low: 1, medium: 2, high: 3, critical: 4 };
                return order[e.severity] > order[worst] ? e.severity : worst;
            }, 'low' as FraudSeverity)
            : 'low',
        events,
    };
}

// ─── Admin: Add to blocklist ───
export async function addToBlocklist(
    value: string,
    type: 'txid' | 'wallet' | 'ip' | 'email',
    reason?: string,
    addedBy: string = 'admin'
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.from('fraud_blocklist').insert({
            type,
            value,
            reason: reason || null,
            added_by: addedBy,
        });
        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error('[Fraud] Blocklist insert error:', err);
        return { success: false, error: 'Failed to add to blocklist' };
    }
}

// ─── Admin: Remove from blocklist ───
export async function removeFromBlocklist(
    id: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.from('fraud_blocklist').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (err) {
        console.error('[Fraud] Blocklist delete error:', err);
        return { success: false, error: 'Failed to remove from blocklist' };
    }
}

// ─── Admin: Get recent fraud events ───
export async function getRecentFraudEvents(limit: number = 50) {
    try {
        const { data, error } = await supabase
            .from('fraud_events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('[Fraud] Fetch events error:', err);
        return [];
    }
}

// ─── Admin: Get blocklist ───
export async function getBlocklist() {
    try {
        const { data, error } = await supabase
            .from('fraud_blocklist')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('[Fraud] Fetch blocklist error:', err);
        return [];
    }
}
