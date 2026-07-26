/**
 * Helper to send alerts to Telegram via Bot API or Webhook.
 */
export async function sendTelegramAlert(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

  if (!message) return false;

  try {
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      return res.ok;
    }

    if (botToken && chatId) {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
      return res.ok;
    }

    console.warn('[Telegram Alert] Missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID or TELEGRAM_WEBHOOK_URL. Alert text:', message);
    return false;
  } catch (error) {
    console.error('[Telegram Alert] Error sending telegram notification:', error);
    return false;
  }
}
