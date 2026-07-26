import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantConfig } from '@/lib/tenant-config';
import { getTenantId } from '@/lib/tenant-context';
import { checkRateLimit, RateLimitResult } from '@/lib/ratelimit';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || request.nextUrl.hostname;
    const tenantId = getTenantId(request);
    const tenantConfig = getTenantConfig(hostname);

    // 1. Markdown Content Negotiation for AI Agents (RFC 8288 / llmstxt.org)
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/markdown')) {
        const isHomePage = request.nextUrl.pathname === '/' || 
                          request.nextUrl.pathname === '/en/' || 
                          request.nextUrl.pathname === '/zh/';
        
        if (isHomePage) {
            const telegramHandle = tenantConfig.id === 'cnwepro' ? 't.me/cnwepro_support' : 't.me/cnverifyhub';
            const markdown = `
# ${tenantConfig.name} - ${tenantConfig.psychology.headlines[0]}

Welcome to ${tenantConfig.name}, ${tenantConfig.psychology.subheadlines[0]}.

## Core Services
- **WeChat Accounts**: Fresh, aged, and merchant-verified accounts.
- **Alipay Accounts**: Verified personal and business accounts with Huabei support.
- **Verification Services**: Passport and KYC verification for global platforms.
- **Trading Accounts**: Verified XM, HFM, Neteller, and Skrill accounts.
- **Social Media**: High-authority Douyin, QQ, and Xiaohongshu accounts.

## API & Discovery
- **API Catalog**: /.well-known/api-catalog
- **Sitemap**: /sitemap.xml
- **Documentation**: /llms.txt
- **Contact**: ${telegramHandle}

## Why Choose Us?
- **Cinema-Grade Quality**: Every account is verified and secured.
- **Instant Delivery**: ${tenantConfig.delivery.promiseText}.
- **Escrow Guarantee**: ${tenantConfig.psychology.ctaText} with full warranty.

---
© 2026 ${tenantConfig.name}. All Rights Reserved.
            `.trim();

            return new NextResponse(markdown, {
                status: 200,
                headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'x-markdown-tokens': '240',
                    'Vary': 'Accept',
                    'X-Content-Type-Options': 'nosniff',
                    'x-tenant-id': tenantId,
                }
            });
        }
    }

    // 2. Per-Endpoint Rate Limiting for API Routes
    let rateLimitResult: RateLimitResult | null = null;

    if (request.nextUrl.pathname.startsWith('/api/')) {
        const rawIp = request.ip ||
            request.headers.get('cf-connecting-ip') ||
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
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

    // 3. Forward request with tenant ID header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenantId);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    
    // Add tenant & rate limiting headers to response
    response.headers.set('x-tenant-id', tenantId);
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
