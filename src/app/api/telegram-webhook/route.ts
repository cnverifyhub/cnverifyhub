import { Bot, webhookCallback } from 'grammy';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const token = process.env.TELEGRAM_BOT_TOKEN || 'dummy_token';
const bot = new Bot(token);

bot.command('start', (ctx) => {
    ctx.reply(
        '🚀 *CNVerifyHub Admin & Operations Bot*\n\n' +
        'Available commands:\n' +
        '• `/status` - Check live platform & database health\n' +
        '• `/orders` - View recent order volume\n' +
        '• `/deliver <order_id>` - Trigger manual order fulfillment\n',
        { parse_mode: 'Markdown' }
    );
});

bot.command('status', async (ctx) => {
    try {
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        
        ctx.reply(
            `🟢 *System Status: Operational*\n\n` +
            `• Products Active: *${productCount || 0}*\n` +
            `• Total Orders: *${orderCount || 0}*\n` +
            `• Timestamp: \`${new Date().toISOString()}\``,
            { parse_mode: 'Markdown' }
        );
    } catch (err: any) {
        ctx.reply(`⚠️ Status Check Error: ${err.message}`);
    }
});

bot.command('orders', async (ctx) => {
    try {
        const { data: recentOrders, error } = await supabase
            .from('orders')
            .select('id, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!recentOrders || recentOrders.length === 0) {
            return ctx.reply('No recent orders found.');
        }

        const msg = recentOrders
            .map(o => `• ID: \`${o.id}\` | Status: *${o.status || 'pending'}*`)
            .join('\n');

        ctx.reply(`📦 *Recent Orders (Last 5):*\n\n${msg}`, { parse_mode: 'Markdown' });
    } catch (err: any) {
        ctx.reply(`⚠️ Orders Fetch Error: ${err.message}`);
    }
});

bot.command('deliver', async (ctx) => {
    const text = ctx.message?.text || '';
    const parts = text.split(' ');
    const orderId = parts[1];

    if (!orderId) {
        return ctx.reply('⚠️ Please supply an order ID: `/deliver <order_id>`', { parse_mode: 'Markdown' });
    }

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'delivered', delivered_at: new Date().toISOString() })
            .eq('id', orderId);

        if (error) throw error;

        ctx.reply(`✅ Order \`${orderId}\` marked as delivered!`, { parse_mode: 'Markdown' });
    } catch (err: any) {
        ctx.reply(`❌ Delivery Error: ${err.message}`);
    }
});

const handleWebhook = webhookCallback(bot, 'std/http');

export async function POST(req: Request) {
    try {
        if (!process.env.TELEGRAM_BOT_TOKEN) {
            return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is missing in server environment' }, { status: 500 });
        }
        return await handleWebhook(req);
    } catch (e: any) {
        console.error('Telegram Webhook error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
