import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantConfig } from '@/lib/tenant-config';
import { getTenantId } from '@/lib/tenant-context';
import { checkRateLimit, RateLimitResult } from '@/lib/ratelimit';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || request.nextUrl.hostname;
    const tenantId = getTenantId(request);
    const tenantConfig = getTenantConfig(hostname);

    // 1. Universal Markdown Content Negotiation for AI Agents (RFC 8288 / llmstxt.org)
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/markdown')) {
        const pathname = request.nextUrl.pathname;
        const isEn = pathname.startsWith('/en');
        const telegramHandle = tenantConfig.id === 'cnwepro' ? 't.me/cnwepro_support' : 't.me/cnverifyhub';
        
        let title = `${tenantConfig.name} - ${tenantConfig.psychology.headlines[0]}`;
        let body = '';

        if (pathname.includes('/wechat')) {
            title = isEn ? 'Buy Verified WeChat Accounts | CNVerifyHub' : '微信高权重实名账号购买 | CNVerifyHub';
            body = isEn ? `
# Buy Verified WeChat Accounts (Instant USDT Delivery)
- **Real-Name Verified**: Fully verified accounts ready for instant scan & login.
- **Aged Accounts**: 1 to 5+ year registered accounts with established transaction history.
- **Bank-Linked**: High-trust accounts suitable for cross-border transactions and WeChat Pay.
- **72H Warranty**: Complete non-user failure replacement policy.
- **Price Range**: Starting at ¥29 ($4.20)
` : `
# 微信实名老号/高权重账号现货发售
- **实名认证**: 已过二要素/三要素实名，支持直接使用。
- **高权重老号**: 1-5年注册号，带朋友圈历史与自然交易权重。
- **绑卡收付款**: 支持微信支付、二维码收款及大额转账。
- **72小时质保**: 非人工违规封号提供免费换号服务。
- **起售价**: ¥29 起
`;
        } else if (pathname.includes('/alipay')) {
            title = isEn ? 'Buy Real-Name Alipay Accounts | CNVerifyHub' : '支付宝实名账号/企业户购买 | CNVerifyHub';
            body = isEn ? `
# Verified Alipay Accounts (Personal & Business)
- **Personal Real-Name**: Passport/ID verified Alipay personal accounts.
- **Huabei Enabled**: Pre-activated credit lines ready for immediate payment.
- **Enterprise Accounts**: Verified Chinese company business accounts for high volume.
- **USDT Escrow**: Instant 5-minute automated blockchain delivery.
` : `
# 支付宝实名号/花呗号/企业户现货
- **个人实名**: 已完成实名认证，支持跨境汇款与扫码支付。
- **花呗开通**: 预置花呗额度，即买即用。
- **企业户**: 适用于大额资金往来与商户结算。
- **USDT担保**: 5分钟自动发码，秒级确认。
`;
        } else if (pathname.includes('/douyin')) {
            title = isEn ? 'Buy Verified Douyin Accounts | CNVerifyHub' : '抖音万粉号/蓝V号购买 | CNVerifyHub';
            body = isEn ? `
# High-Authority Douyin Accounts (TikTok China)
- **Creator Verified**: 1,000+ to 10,000+ follower accounts with live streaming unlocked.
- **Blue V Business**: Corporate verified accounts for brand marketing.
- **Clean History**: Zero penalty record, ready for e-commerce store linkage.
` : `
# 抖音千粉/万粉/蓝V营销账号
- **直播权限**: 已开通千粉/万粉直播与商品橱窗功能。
- **企业蓝V**: 认证企业蓝V账号，提升品牌信任度。
- **无违规记录**: 纯净粉丝历史，适合直播带货与品牌营销。
`;
        } else {
            // General / Homepage Markdown
            body = `
# ${tenantConfig.name} - ${tenantConfig.psychology.headlines[0]}

Welcome to ${tenantConfig.name}, ${tenantConfig.psychology.subheadlines[0]}.

## Official Crypto Payment Settlement Addresses
- **USDT (TRC20)**: \`TPdyaSUty1yFnjU2kGM7Uc9yBY7yz9KRvY\`
- **USDT (BEP20)**: \`0x95EEa6cA1CCCB2f281E9d9F9BBbD19315B971fe3\`
- **USDT (ERC20)**: \`0x95EEa6cA1CCCB2f281E9d9F9BBbD19315B971fe3\`
- **Solana (SOL)**: \`2bPuP5T4NXp3u7p52RT7BgJdJpwRquvmf2mCh329sHHM\`

## Core Services & Inventory
- **WeChat Accounts**: Fresh, aged, bank-linked, and merchant-verified accounts.
- **Alipay Accounts**: Verified personal and business accounts with Huabei support.
- **Verification Services**: Passport and KYC verification for global platforms.
- **Trading Accounts**: Verified XM, HFM, Neteller, Skrill, Wise, and Revolut accounts.
- **Social Media**: High-authority Douyin, QQ, Xianyu, Taobao, and Xiaohongshu accounts.

## API & Discovery Links
- **Sitemap**: /sitemap.xml
- **Documentation**: /llms.txt
- **Telegram Support**: ${telegramHandle}

## Guarantee & Delivery
- **Instant Delivery**: ${tenantConfig.delivery.promiseText}.
- **Escrow Protection**: Full 72-hour warranty on all accounts.
`.trim();
        }

        const fullMarkdown = `# ${title}\n\n${body}\n\n---\n© 2026 ${tenantConfig.name}. All Rights Reserved.`;
        const approxTokens = Math.ceil(fullMarkdown.length / 4);

        return new NextResponse(fullMarkdown, {
            status: 200,
            headers: {
                'Content-Type': 'text/markdown; charset=utf-8',
                'x-markdown-tokens': approxTokens.toString(),
                'Vary': 'Accept',
                'X-Content-Type-Options': 'nosniff',
                'x-tenant-id': tenantId,
            }
        });
    }

    // 2. Per-Endpoint Rate Limiting for API Routes
    let rateLimitResult: RateLimitResult | null = null;

    if (request.nextUrl.pathname.startsWith('/api/')) {
        const rawIp =
            request.headers.get('cf-connecting-ip') ||
            request.headers.get('x-real-ip') ||
            request.ip ||
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            '127.0.0.1';

        rateLimitResult = await checkRateLimit(tenantId, rawIp, request.nextUrl.pathname);

        if (!rateLimitResult.success) {
            return new NextResponse(
                JSON.stringify({ error: 'Too Many Requests' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                        'x-tenant-id': tenantId,
                    }
                }
            );
        }
    }

    // 3. Forward request with tenant ID and pathname headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenantId);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);
    requestHeaders.set('x-url', request.url);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    
    // Add tenant, pathname & rate limiting headers to response
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-pathname', request.nextUrl.pathname);
    response.headers.set('Vary', 'Accept');

    if (rateLimitResult) {
        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
    }
    
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
