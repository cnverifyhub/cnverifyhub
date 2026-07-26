import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase/admin';
import { getTenantId } from '@/lib/tenant-context';
import { decryptCredentials } from '@/lib/encryption';
import { sendTelegramAlert } from '@/lib/telegram';
import { sendDeliveryEmail, logNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const orderId = resolvedParams.id;
    const tenantId = getTenantId(request);

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch order details from database
    let { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`id.eq.${orderId},public_id.eq.${orderId}`)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    // Fallback search without tenant_id filter if strict query fails
    if (!order) {
      const { data: fallbackOrder } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`id.eq.${orderId},public_id.eq.${orderId}`)
        .maybeSingle();
      order = fallbackOrder;
    }

    if (orderErr || !order) {
      console.error(`[Auto-Delivery] Order not found: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Verify payment status
    const validPaymentStatuses = ['paid', 'completed', 'stripe_pending', 'verified'];
    if (!validPaymentStatuses.includes(order.status)) {
      console.warn(`[Auto-Delivery] Payment not confirmed for order ${orderId}, status: ${order.status}`);
      return NextResponse.json(
        { error: 'Order payment is not confirmed', status: order.status },
        { status: 400 }
      );
    }

    // 3. Idempotency Check: if order is already delivered
    if (order.status === 'delivered') {
      console.log(`[Auto-Delivery] Order ${orderId} already delivered`);
      const { data: existingInventory } = await supabase
        .from('inventory')
        .select('credentials_encrypted')
        .eq('order_id', order.id);

      const credentials = (existingInventory || []).map(row =>
        decryptCredentials(row.credentials_encrypted)
      );

      return NextResponse.json({
        status: 'already_delivered',
        credentials: credentials.length > 0 ? credentials : (order.delivered_credentials || [])
      });
    }

    // 4. Identify product ID & quantity needed
    const firstItem = order.order_items?.[0] || order.items?.[0];
    const targetProductId = order.product_id || firstItem?.product_id || firstItem?.productId;
    const requiredQuantity = order.quantity || firstItem?.quantity || 1;

    if (!targetProductId) {
      console.error(`[Auto-Delivery] Missing product ID for order ${order.id}`);
      return NextResponse.json({ error: 'Missing product details on order' }, { status: 400 });
    }

    // 5. Query inventory for available credentials
    const { data: availableItems, error: invErr } = await supabase
      .from('inventory')
      .select('*')
      .eq('product_id', targetProductId)
      .eq('tenant_id', tenantId)
      .eq('status', 'available')
      .limit(requiredQuantity);

    if (invErr) {
      console.error(`[Auto-Delivery] Inventory query error for product ${targetProductId}:`, invErr);
      return NextResponse.json({ error: 'Database inventory error' }, { status: 500 });
    }

    // 6. Handle Insufficient Inventory -> queue for manual fulfillment
    if (!availableItems || availableItems.length < requiredQuantity) {
      console.warn(`[Auto-Delivery] Insufficient inventory for order ${order.id} (required: ${requiredQuantity}, found: ${availableItems?.length || 0})`);
      
      // Update order status to manual_queue
      await supabase
        .from('orders')
        .update({ status: 'manual_queue', updated_at: new Date().toISOString() })
        .eq('id', order.id);

      const alertMsg = `⚠️ <b>Stock Alert - Manual Queue</b>\n` +
        `Order ID: <code>${order.public_id || order.id}</code>\n` +
        `Tenant: <code>${tenantId}</code>\n` +
        `Product: <code>${targetProductId}</code>\n` +
        `Required: ${requiredQuantity} | Available: ${availableItems?.length || 0}\n` +
        `Customer Email: ${order.email || 'N/A'}`;

      // Alert via Telegram and Email log
      sendTelegramAlert(alertMsg).catch(() => {});
      if (order.email) {
        logNotification({
          orderId: order.id,
          type: 'manual_queue_alert',
          recipientEmail: order.email,
          status: 'queued'
        });
      }

      return NextResponse.json({
        status: 'manual_queue',
        message: 'Insufficient stock queued for manual fulfillment'
      });
    }

    // 7. Sufficient stock -> decrypt credentials & deliver
    const decryptedCredentials: string[] = [];
    const itemIdsToMark: string[] = [];

    for (const item of availableItems) {
      decryptedCredentials.push(decryptCredentials(item.credentials_encrypted));
      itemIdsToMark.push(item.id);
    }

    const nowIso = new Date().toISOString();

    // Mark inventory items as sold
    const { error: markErr } = await supabase
      .from('inventory')
      .update({
        status: 'sold',
        order_id: order.id,
        sold_at: nowIso
      })
      .in('id', itemIdsToMark);

    if (markErr) {
      console.error(`[Auto-Delivery] Failed to update inventory status:`, markErr);
      return NextResponse.json({ error: 'Failed to reserve inventory items' }, { status: 500 });
    }

    // Update order status to delivered
    await supabase
      .from('orders')
      .update({
        status: 'delivered',
        updated_at: nowIso
      })
      .eq('id', order.id);

    // Decrement product stock count
    const { data: product } = await supabase
      .from('products')
      .select('stock_count, sold_count, stock_unlimited')
      .eq('id', targetProductId)
      .single();

    if (product && !product.stock_unlimited) {
      const currentStock = product.stock_count || 0;
      const currentSold = product.sold_count || 0;
      await supabase
        .from('products')
        .update({
          stock_count: Math.max(0, currentStock - requiredQuantity),
          sold_count: currentSold + requiredQuantity
        })
        .eq('id', targetProductId);
    }

    // Send Delivery Email (fire-and-forget)
    if (order.email) {
      sendDeliveryEmail({
        to: order.email,
        publicId: order.public_id || order.id,
        accounts: decryptedCredentials
      }).then(() => {
        logNotification({
          orderId: order.id,
          type: 'delivery_complete',
          recipientEmail: order.email,
          status: 'sent'
        });
      }).catch((err) => {
        console.error('[Auto-Delivery] Failed to send delivery email:', err);
      });
    }

    // Send Telegram Notification
    const successAlert = `✅ <b>Auto-Delivery Completed</b>\n` +
      `Order ID: <code>${order.public_id || order.id}</code>\n` +
      `Tenant: <code>${tenantId}</code>\n` +
      `Product: <code>${targetProductId}</code>\n` +
      `Items Delivered: ${decryptedCredentials.length}`;
    sendTelegramAlert(successAlert).catch(() => {});

    return NextResponse.json({
      status: 'delivered',
      credentials: decryptedCredentials
    });

  } catch (error: any) {
    console.error('[Auto-Delivery] Server Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
