import { supabase } from './client';

/**
 * Automatically assigns available accounts to a paid order.
 * @param orderId Internal Supabase UUID of the order
 * @param publicOrderId Public CNW-XXXX order ID
 */
export async function autoAssignAccountsToOrder(orderId: string, publicOrderId: string) {
    try {
        // 1. Fetch order items to know what was bought
        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('product_id, quantity')
            .eq('order_id', orderId);

        if (itemsError || !items) {
            console.error(`[Delivery] Failed to fetch items for order ${publicOrderId}:`, itemsError);
            return { success: false, error: 'Failed to fetch items' };
        }

        const deliveryLog: string[] = [];

        // 2. For each item, handle based on product type
        for (const item of items) {
            // Fetch product type and bundle info
            const { data: product, error: prodError } = await supabase
                .from('products')
                .select('type, subcategory')
                .eq('id', item.product_id)
                .single();

            if (prodError || !product) {
                console.error(`[Delivery] Failed to fetch product info for ${item.product_id}:`, prodError);
                continue;
            }

            if (product.type === 'bundle') {
                // Handle Bundle: Fetch components
                const { data: components, error: compError } = await supabase
                    .from('bundle_components')
                    .select('component_id, quantity')
                    .eq('bundle_id', item.product_id);

                if (compError || !components) {
                    console.error(`[Delivery] Failed to fetch bundle components for ${item.product_id}:`, compError);
                    continue;
                }

                for (const comp of components) {
                    const totalNeeded = comp.quantity * item.quantity;
                    await assignIndividualAccounts(comp.component_id, totalNeeded, orderId, publicOrderId, deliveryLog);
                }
            } else if (product.type === 'service') {
                // Handle Service: Create Service Order
                const { error: serviceError } = await supabase
                    .from('service_orders')
                    .insert({
                        order_id: orderId,
                        product_id: item.product_id,
                        customer_email: (await supabase.from('orders').select('email').eq('id', orderId).single()).data?.email,
                        customer_telegram: (await supabase.from('orders').select('telegram').eq('id', orderId).single()).data?.telegram,
                        status: 'pending'
                    });

                if (serviceError) {
                    console.error(`[Delivery] Failed to create service order for ${item.product_id}:`, serviceError);
                } else {
                    deliveryLog.push(`Initialized service workflow for ${item.product_id}`);
                }
            } else {
                // Default: Standard Account
                await assignIndividualAccounts(item.product_id, item.quantity, orderId, publicOrderId, deliveryLog);
            }
        }

        // 3. Update order status
        await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', orderId);

        return { success: true, log: deliveryLog };

    } catch (error) {
        console.error(`[Delivery] Critical error in auto-assignment for ${publicOrderId}:`, error);
        return { success: false, error: 'Internal error' };
    }
}

/**
 * Helper to assign standard accounts from vault
 */
async function assignIndividualAccounts(productId: string, quantity: number, orderId: string, publicOrderId: string, log: string[]) {
    const { data: available, error: availError } = await supabase
        .from('vault_accounts')
        .select('id')
        .eq('product_id', productId)
        .eq('is_sold', false)
        .limit(quantity)
        .order('created_at', { ascending: true });

    if (availError || !available || available.length < quantity) {
        console.warn(`[Delivery] Insufficient stock for ${productId} in order ${publicOrderId}. Needed ${quantity}, found ${available?.length || 0}`);
        log.push(`Insufficient stock for ${productId}`);
        return;
    }

    const accountIds = available.map(a => a.id);
    const { error: assignError } = await supabase
        .from('vault_accounts')
        .update({
            is_sold: true,
            assigned_order_id: orderId,
            sold_at: new Date().toISOString()
        })
        .in('id', accountIds);

    if (assignError) {
        console.error(`[Delivery] Failed to assign accounts for ${productId}:`, assignError);
        log.push(`Failed to assign ${productId}`);
    } else {
        log.push(`Successfully assigned ${quantity} x ${productId}`);
    }
}
