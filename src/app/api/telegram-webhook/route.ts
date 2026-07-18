import { Bot, webhookCallback } from 'grammy';
import { NextResponse } from 'next/server';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || 'dummy_token');

bot.command('start', (ctx) => ctx.reply('Welcome to CNVerifyHub Bot!'));
bot.command('status', (ctx) => ctx.reply('All systems operational.'));
bot.command('inventory', (ctx) => ctx.reply('Inventory check requires admin privileges.'));
bot.command('orders', (ctx) => ctx.reply('Recent orders query requires admin privileges.'));
bot.command('deliver', (ctx) => ctx.reply('Manual delivery trigger initiated.'));

const handleWebhook = webhookCallback(bot, 'std/http');

export async function POST(req: Request) {
    try {
        if (!process.env.TELEGRAM_BOT_TOKEN) {
            return NextResponse.json({ error: 'Bot token not set' }, { status: 500 });
        }
        
        // Wrap Next.js request into a standard Request for Grammy
        const response = await handleWebhook(req);
        return response;
    } catch (e: any) {
        console.error('Webhook error', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
