import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('cf-connecting-ip') ||
               request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               '127.0.0.1';

    const body = await request.json().catch(() => ({}));
    const { email, lang = 'zh', tenant_id = 'cnverifyhub' } = body;

    // 1. Email format validation
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: lang === 'zh' ? '请输入有效的电子邮箱地址' : 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const tenantId = tenant_id === 'cnwepro' ? 'cnwepro' : 'cnverifyhub';

    // 2. Rate limiting check (e.g. 5 subscribes / min per IP)
    const rateLimit = await checkRateLimit(tenantId, ip, '/api/newsletter/subscribe');
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: lang === 'zh' ? '请求过于频繁，请稍后再试' : 'Too many requests, please try again later' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.reset.toString(),
          },
        }
      );
    }

    // 3. Database operation: Upsert / Insert into newsletter_subscribers
    if (supabaseUrl && supabaseKey) {
      try {
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .upsert(
            {
              email: cleanEmail,
              tenant_id: tenantId,
              discount_code: 'RECOVER5',
              status: 'subscribed',
              subscribed_at: new Date().toISOString(),
            },
            { onConflict: 'tenant_id,email' }
          );

        if (insertError) {
          console.warn('[Newsletter] Supabase insertion notice:', insertError.message);
        }
      } catch (dbErr) {
        console.warn('[Newsletter] DB connection error:', dbErr);
      }
    }

    // 4. Optional Resend Welcome Email confirmation
    if (resend) {
      try {
        const isZh = lang === 'zh';
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'CNVerifyHub <support@cnverifyhub.com>',
          to: cleanEmail,
          subject: isZh ? '🎉 欢迎订阅 CNVerifyHub！您的专属 95 折优惠码已送达' : '🎉 Welcome to CNVerifyHub! Your 5% OFF Coupon Code',
          html: isZh
            ? `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1526; color: #F0F4FF; padding: 32px; border-radius: 12px; border: 1px solid #1E2D45;">
                <h1 style="color: #00E5FF; margin-top: 0; font-size: 24px;">感谢您订阅 CNVerifyHub！</h1>
                <p style="color: #7B91B0; font-size: 15px; line-height: 1.6;">
                  这是您的专属 95 折无门槛新人优惠码：
                </p>
                <div style="background: #060B18; border: 2px dashed #00E5FF; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 28px; font-weight: bold; color: #FFFFFF; letter-spacing: 4px;">RECOVER5</span>
                </div>
                <p style="color: #7B91B0; font-size: 14px; line-height: 1.6;">
                  结账时在优惠码输入框中填入 <strong>RECOVER5</strong> 即可自动减免 5% 订单金额。<br />
                  我们平台全天候提供高权重微信老号、支付宝企业户、抖音万粉号等数字资产，支持 USDT 自动化 5 分钟发货与 72 小时售后质保。
                </p>
                <div style="margin-top: 32px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://cnverifyhub.com'}/#categories" style="display: inline-block; background: #FF0036; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">立即选购商品</a>
                </div>
              </div>
            `
            : `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1526; color: #F0F4FF; padding: 32px; border-radius: 12px; border: 1px solid #1E2D45;">
                <h1 style="color: #00E5FF; margin-top: 0; font-size: 24px;">Welcome to CNVerifyHub!</h1>
                <p style="color: #7B91B0; font-size: 15px; line-height: 1.6;">
                  Here is your exclusive 5% OFF coupon code:
                </p>
                <div style="background: #060B18; border: 2px dashed #00E5FF; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 28px; font-weight: bold; color: #FFFFFF; letter-spacing: 4px;">RECOVER5</span>
                </div>
                <p style="color: #7B91B0; font-size: 14px; line-height: 1.6;">
                  Enter <strong>RECOVER5</strong> at checkout to apply your 5% discount instantly.<br />
                  We provide 100% verified WeChat, Alipay, Douyin, and financial accounts with automated USDT delivery and a 72-hour warranty.
                </p>
                <div style="margin-top: 32px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://cnverifyhub.com'}/en/#categories" style="display: inline-block; background: #FF0036; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">Shop Marketplace</a>
                </div>
              </div>
            `,
        });
      } catch (emailErr) {
        console.warn('[Newsletter] Resend email dispatch notice:', emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        discountCode: 'RECOVER5',
        message: lang === 'zh' ? '订阅成功，优惠券已激活' : 'Subscribed successfully, coupon activated',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
