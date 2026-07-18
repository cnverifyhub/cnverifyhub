import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'CNVerifyHub <support@cnverifyhub.com>';
const SITE_URL = 'https://cnverifyhub.com';

// ─── Helper ───
function baseHtml(content: string): string {
    return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CNVerifyHub</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#dc2626,#991b1b);padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:900;letter-spacing:-0.5px;">🇨🇳 CNVerifyHub</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">中国数字账号专业服务平台</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:36px 40px;color:#e2e8f0;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #334155;text-align:center;">
            <p style="margin:0;color:#64748b;font-size:12px;">
              © ${new Date().getFullYear()} CNVerifyHub · 
              <a href="${SITE_URL}" style="color:#dc2626;text-decoration:none;">cnverifyhub.com</a> · 
              <a href="https://t.me/cnverifyhub" style="color:#dc2626;text-decoration:none;">Telegram Support</a>
            </p>
            <p style="margin:8px 0 0;color:#475569;font-size:11px;">
              This email was sent to you because you placed an order on CNVerifyHub.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Status Badge ───
function statusBadge(label: string, color: string): string {
    return `<span style="display:inline-block;background:${color};color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>`;
}

// ─── Order Created Email ───
export async function sendOrderCreatedEmail({
    to,
    publicId,
    totalAmount,
    cryptoType = 'USDT',
    items = [],
}: {
    to: string;
    publicId: string;
    totalAmount: number;
    cryptoType?: string;
    items?: Array<{ productId: string; quantity: number; priceAtTime: number }>;
}) {
    const itemsHtml = items.length > 0
        ? items.map(i => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #334155;color:#94a3b8;font-size:13px;">${i.productId}</td>
              <td style="padding:10px 0;border-bottom:1px solid #334155;color:#fff;font-size:13px;text-align:center;">×${i.quantity}</td>
              <td style="padding:10px 0;border-bottom:1px solid #334155;color:#fbbf24;font-size:13px;text-align:right;font-weight:700;">$${(i.priceAtTime * i.quantity).toFixed(2)}</td>
            </tr>`).join('')
        : `<tr><td colspan="3" style="padding:10px 0;color:#64748b;font-size:13px;text-align:center;">—</td></tr>`;

    const content = `
        <div style="text-align:center;margin-bottom:28px;">
          ${statusBadge('订单已创建 · Order Created', '#2563eb')}
        </div>
        <h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">您的订单已收到 🎉</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
          感谢您的购买！我们已收到您的订单，正在等待区块链付款确认。<br/>
          <em style="color:#64748b;font-size:12px;">Thank you! Your order has been received and is awaiting payment confirmation.</em>
        </p>

        <!-- Order ID box -->
        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">订单号 / Order ID</td>
              <td style="text-align:right;">
                <span style="font-family:monospace;color:#fff;font-size:15px;font-weight:800;">${publicId}</span>
              </td>
            </tr>
            <tr>
              <td style="color:#64748b;font-size:12px;padding-top:12px;">支付方式 / Payment</td>
              <td style="text-align:right;padding-top:12px;">
                <span style="color:#10b981;font-weight:700;font-size:13px;">${cryptoType}</span>
              </td>
            </tr>
            <tr>
              <td style="color:#64748b;font-size:12px;padding-top:12px;">应付金额 / Amount Due</td>
              <td style="text-align:right;padding-top:12px;">
                <span style="color:#fbbf24;font-weight:900;font-size:18px;">$${totalAmount.toFixed(2)}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Items -->
        ${items.length > 0 ? `
        <h3 style="margin:0 0 12px;color:#cbd5e1;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">订单商品 / Items</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          ${itemsHtml}
        </table>
        ` : ''}

        <!-- CTA -->
        <div style="text-align:center;margin:28px 0;">
          <a href="${SITE_URL}/client?id=${publicId}" 
             style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
            查询订单状态 / Track Order →
          </a>
        </div>

        <p style="margin:0;color:#64748b;font-size:12px;line-height:1.8;background:#0f172a;border-radius:10px;padding:16px;">
          ⏱ 请在付款后提交交易哈希(TXID)以完成验证。付款确认通常需要 2-5 分钟。<br/>
          ❓ 有疑问？请通过 <a href="https://t.me/cnverifyhub" style="color:#dc2626;">Telegram</a> 联系客服。
        </p>
    `;

    return resend.emails.send({
        from: FROM,
        to,
        subject: `✅ 订单已创建 ${publicId} · CNVerifyHub`,
        html: baseHtml(content),
    });
}

// ─── Payment Verified Email ───
export async function sendPaymentVerifiedEmail({
    to,
    publicId,
    amount,
    network,
    txid,
}: {
    to: string;
    publicId: string;
    amount: number;
    network: string;
    txid?: string;
}) {
    const networkLabel = network.toUpperCase().replace('_', ' ');
    const content = `
        <div style="text-align:center;margin-bottom:28px;">
          ${statusBadge('付款已验证 · Payment Verified', '#059669')}
        </div>
        <h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">付款确认成功 ✓</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
          您的区块链付款已通过验证！我们正在为您处理发货，账号信息将很快送达。<br/>
          <em style="color:#64748b;font-size:12px;">Your blockchain payment has been verified! We are processing your delivery now.</em>
        </p>

        <div style="background:#064e3b;border:1px solid #059669;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#6ee7b7;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">订单号</td>
              <td style="text-align:right;font-family:monospace;color:#fff;font-weight:800;">${publicId}</td>
            </tr>
            <tr>
              <td style="color:#6ee7b7;font-size:12px;padding-top:12px;">验证金额</td>
              <td style="text-align:right;padding-top:12px;color:#fbbf24;font-weight:900;font-size:18px;">$${amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="color:#6ee7b7;font-size:12px;padding-top:12px;">区块链网络</td>
              <td style="text-align:right;padding-top:12px;color:#34d399;font-weight:700;">${networkLabel}</td>
            </tr>
            ${txid ? `
            <tr>
              <td style="color:#6ee7b7;font-size:12px;padding-top:12px;">交易哈希</td>
              <td style="text-align:right;padding-top:12px;font-family:monospace;color:#94a3b8;font-size:10px;">${txid.slice(0, 20)}...</td>
            </tr>` : ''}
          </table>
        </div>

        <div style="text-align:center;margin:28px 0;">
          <a href="${SITE_URL}/account" 
             style="display:inline-block;background:linear-gradient(135deg,#059669,#047857);color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            前往账号中心 / View Dashboard →
          </a>
        </div>

        <p style="margin:0;color:#64748b;font-size:12px;line-height:1.8;background:#0f172a;border-radius:10px;padding:16px;">
          🚀 系统正在自动为您分配账号，通常在 5-15 分钟内完成。完成后您将收到另一封包含账号信息的邮件。<br/>
          ❓ 有疑问？请通过 <a href="https://t.me/cnverifyhub" style="color:#dc2626;">Telegram</a> 联系客服。
        </p>
    `;

    return resend.emails.send({
        from: FROM,
        to,
        subject: `💳 付款验证成功 ${publicId} · CNVerifyHub`,
        html: baseHtml(content),
    });
}

// ─── Delivery Complete Email ───
export async function sendDeliveryEmail({
    to,
    publicId,
    accounts = [],
    deliveryDetails,
}: {
    to: string;
    publicId: string;
    accounts?: string[];
    deliveryDetails?: Record<string, string>;
}) {
    // Build account cards
    const accountsHtml = accounts.length > 0
        ? accounts.map((acc, i) => `
            <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;margin-bottom:10px;font-family:monospace;font-size:13px;color:#e2e8f0;word-break:break-all;">
              <span style="color:#64748b;font-size:11px;display:block;margin-bottom:4px;">账号 ${i + 1} / Account ${i + 1}</span>
              ${acc}
            </div>`).join('')
        : '';

    // Build manual delivery details table
    const detailsHtml = deliveryDetails
        ? Object.entries(deliveryDetails)
            .filter(([, v]) => v)
            .map(([k, v]) => `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;color:#64748b;font-size:12px;text-transform:capitalize;">${k}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #1e293b;color:#fff;font-size:13px;font-weight:700;font-family:monospace;word-break:break-all;">${v}</td>
                </tr>`).join('')
        : '';

    const hasContent = accounts.length > 0 || (deliveryDetails && Object.keys(deliveryDetails).length > 0);

    const content = `
        <div style="text-align:center;margin-bottom:28px;">
          ${statusBadge('发货完成 · Delivery Complete', '#7c3aed')}
        </div>
        <h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">您的账号已发货 🎁</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
          您的订单已完成！请妥善保存以下账号信息，建议立即修改密码。<br/>
          <em style="color:#64748b;font-size:12px;">Your order is complete! Please save the account details below and change passwords promptly.</em>
        </p>

        <!-- Order ref -->
        <div style="background:#0f172a;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;justify-content:space-between;">
          <span style="color:#64748b;font-size:12px;">订单号</span>
          <span style="font-family:monospace;color:#a78bfa;font-weight:800;">${publicId}</span>
        </div>

        ${hasContent ? `
        <!-- Accounts / Details -->
        <h3 style="margin:0 0 12px;color:#cbd5e1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">账号信息 / Account Info</h3>

        ${accountsHtml}

        ${detailsHtml ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
          ${detailsHtml}
        </table>` : ''}
        ` : `
        <div style="background:#1e3a5f;border:1px solid #3b82f6;border-radius:12px;padding:20px;text-align:center;color:#93c5fd;font-size:14px;">
          账号正在处理中，客服将很快与您联系。<br/>
          <small style="color:#60a5fa;">Account being processed. Support will contact you shortly.</small>
        </div>
        `}

        <div style="text-align:center;margin:28px 0;">
          <a href="${SITE_URL}/account" 
             style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            查看订单详情 / View Order →
          </a>
        </div>

        <div style="background:#450a0a;border:1px solid #991b1b;border-radius:10px;padding:16px;margin-top:4px;">
          <p style="margin:0;color:#fca5a5;font-size:12px;line-height:1.8;">
            🔒 <strong>安全提示：</strong>请在24小时内登录账号并修改密码及密保信息。虚拟商品发货后不支持退换，如有异常请在质保期内联系客服。<br/>
            <span style="color:#f87171;font-size:11px;">Security: Please log in and change password within 24 hours. No refunds on delivered digital goods.</span>
          </p>
        </div>
    `;

    return resend.emails.send({
        from: FROM,
        to,
        subject: `🎁 账号已发货 ${publicId} · CNVerifyHub`,
        html: baseHtml(content),
    });
}

// ─── Log notification to DB (fire-and-forget) ───
export async function logNotification({
    orderId,
    type,
    recipientEmail,
    status = 'sent',
}: {
    orderId?: string;
    type: string;
    recipientEmail: string;
    status?: string;
}) {
    try {
        // Lazy import to avoid circular deps
        const { supabaseAdmin } = await import('./supabase/admin');
        await supabaseAdmin.from('order_emails').insert({
            order_id: orderId || null,
            email_type: type,
            recipient_email: recipientEmail,
            status,
        });
    } catch (e) {
        console.error('[Email Log] Failed to insert notification log into order_emails:', e);
    }
}

// ─── Phase 5: T+0 Welcome Email ───
export async function sendT0WelcomeEmail({
    to,
    publicId,
    amount,
    accounts = [],
}: {
    to: string;
    publicId: string;
    amount: number;
    accounts?: string[];
}) {
    const accountsHtml = accounts.length > 0
        ? accounts.map((acc, i) => `
            <div style="background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 16px;margin-bottom:10px;font-family:monospace;font-size:13px;color:#e2e8f0;word-break:break-all;">
              <span style="color:#64748b;font-size:11px;display:block;margin-bottom:4px;">账号 ${i + 1} / Account ${i + 1}</span>
              ${acc}
            </div>`).join('')
        : `<div style="background:#1e3a5f;border:1px solid #3b82f6;border-radius:12px;padding:20px;text-align:center;color:#93c5fd;font-size:14px;">
             账号正在自动分配中，通常在 5-15 分钟内完成。<br/>
             <small style="color:#60a5fa;">Account is being automatically provisioned. Usually takes 5-15 mins.</small>
           </div>`;

    const content = `
        <div style="text-align:center;margin-bottom:28px;">
          ${statusBadge('发货完成 · Welcome & Delivery', '#7c3aed')}
        </div>
        <h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">欢迎使用 CNVerifyHub 🎉</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
          您的订单已支付成功，感谢您的购买！以下是您的账号凭证：<br/>
          <em style="color:#64748b;font-size:12px;">Your payment succeeded. Thank you! Here are your credentials:</em>
        </p>

        <div style="background:#0f172a;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;justify-content:space-between;">
          <span style="color:#64748b;font-size:12px;">订单号 / Order ID</span>
          <span style="font-family:monospace;color:#a78bfa;font-weight:800;">${publicId}</span>
        </div>

        <h3 style="margin:0 0 12px;color:#cbd5e1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">交付详情 / Delivery Details</h3>
        ${accountsHtml}

        <div style="text-align:center;margin:28px 0;">
          <a href="${SITE_URL}/client?id=${publicId}" 
             style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            管理我的订单 / View Order Details →
          </a>
        </div>
    `;

    return resend.emails.send({
        from: FROM,
        to,
        subject: `🎁 欢迎使用 CNVerifyHub - 订单 ${publicId} 已发货`,
        html: baseHtml(content),
    });
}

// ─── Phase 5: T+1 Safety Guide & Review Request ───
export async function sendT1GuideEmail({
    to,
    publicId,
}: {
    to: string;
    publicId: string;
}) {
    const content = `
        <div style="text-align:center;margin-bottom:28px;">
          ${statusBadge('账号安全指南 · Safety Guide', '#2563eb')}
        </div>
        <h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">您的账号安全使用指南 🛡️</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
          为了防止您的微信/支付宝账号被限制，请遵循以下关键安全策略：<br/>
          <em style="color:#64748b;font-size:12px;">To prevent limitations on your newly purchased accounts, please follow these guidelines:</em>
        </p>

        <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;margin-bottom:24px;">
          <ul style="margin:0;padding-left:20px;color:#e2e8f0;font-size:13px;line-height:1.8;">
            <li><strong>不要立刻修改绑定手机号：</strong>建议登录 3-5 天后再尝试修改安全设置。</li>
            <li><strong>使用干净的IP环境：</strong>避免使用公共代理，保持登录IP稳定。</li>
            <li><strong>逐步增加活跃度：</strong>前几天不要群发广告或频繁加好友。</li>
          </ul>
        </div>

        <h3 style="margin:0 0 8px;color:#cbd5e1;font-size:14px;font-weight:700;">对我们的服务满意吗？</h3>
        <p style="margin:0 0 20px;color:#94a3b8;font-size:13px;line-height:1.6;">
          您的反馈对我们至关重要。请花 1 分钟为我们的服务评分，可获得专属客服 VIP 通道服务！
        </p>

        <div style="text-align:center;margin:28px 0;">
          <a href="${SITE_URL}/review?order_id=${publicId}" 
             style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            提交服务评价 / Submit Review →
          </a>
        </div>
    `;

    return resend.emails.send({
        from: FROM,
        to,
        subject: `🛡️ 账号安全使用指南与服务评价 - 订单 ${publicId}`,
        html: baseHtml(content),
    });
}

// ─── Phase 5: T+7 Referral & Cross-Sell ───
export async function sendT7ReviewEmail({
    to,
    referralCode,
}: {
    to: string;
    referralCode: string;
}) {
    const content = `
        <div style="text-align:center;margin-bottom:28px;">
          ${statusBadge('推荐好友返利 · Share & Earn', '#10b981')}
        </div>
        <h2 style="margin:0 0 8px;color:#fff;font-size:20px;font-weight:800;">邀请好友返现，再享5%优惠 💰</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px;line-height:1.6;">
          将您的专属推荐码分享给好友，好友下单立减 5%，您可赚取 3% 佣金返利！<br/>
          <em style="color:#64748b;font-size:12px;">Share your referral code. Friends get 5% off, you get 3% commission!</em>
        </p>

        <div style="background:#064e3b;border:1px solid #059669;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="color:#6ee7b7;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:8px;">您的专属推荐码 / Your Referral Code</span>
          <span style="font-family:monospace;color:#fff;font-size:24px;font-weight:900;letter-spacing:2px;background:rgba(0,0,0,0.2);padding:6px 16px;border-radius:8px;display:inline-block;">${referralCode}</span>
        </div>

        <h3 style="margin:0 0 12px;color:#cbd5e1;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">热销商品推荐 / Recommended Products</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;color:#e2e8f0;font-size:13px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #334155;">微信高级实名号 / WeChat Advanced Account</td>
            <td style="padding:10px 0;border-bottom:1px solid #334155;text-align:right;color:#fbbf24;font-weight:700;">$32.00</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #334155;">企业微信尊享版 / WeChat Enterprise Pro</td>
            <td style="padding:10px 0;border-bottom:1px solid #334155;text-align:right;color:#fbbf24;font-weight:700;">$90.00</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #334155;">实名支付宝 / Verified Alipay</td>
            <td style="padding:10px 0;border-bottom:1px solid #334155;text-align:right;color:#fbbf24;font-weight:700;">$45.00</td>
          </tr>
        </table>

        <div style="text-align:center;margin:28px 0;">
          <a href="${SITE_URL}/account" 
             style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            进入推广中心 / View Referral Dashboard →
          </a>
        </div>
    `;

    return resend.emails.send({
        from: FROM,
        to,
        subject: `💰 专属推荐返利已送达！分享赚取 3% 佣金 - CNVerifyHub`,
        html: baseHtml(content),
    });
}

