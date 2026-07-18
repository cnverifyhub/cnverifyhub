import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only create ratelimit instance if env vars are present to avoid build errors
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;
if (redisUrl && redisToken) {
    const redis = new Redis({
        url: redisUrl,
        token: redisToken,
    });

    ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(100, "1 m"),
        analytics: true,
    });
}

export async function middleware(request: NextRequest) {
    // 1. Markdown Content Negotiation for AI Agents (RFC 8288 / llmstxt.org)
    // Priority: Handle agent-native requests first
    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/markdown')) {
        const isHomePage = request.nextUrl.pathname === '/' || 
                          request.nextUrl.pathname === '/en/' || 
                          request.nextUrl.pathname === '/zh/';
        
        if (isHomePage) {
            const markdown = `
# CNVerifyHub - Premium Digital Marketplace

Welcome to CNVerifyHub, the global leader in high-trust digital accounts and verification services.

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
- **Contact**: t.me/cnverifyhub

## Why Choose Us?
- **Cinema-Grade Quality**: Every account is verified and secured.
- **Instant Delivery**: Automated fulfillment for standard accounts.
- **Fraud Protection**: Advanced multi-chain payment verification.

---
© 2026 CNVerifyHub. All Rights Reserved.
            `.trim();

            return new NextResponse(markdown, {
                status: 200,
                headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'x-markdown-tokens': '240',
                    'Vary': 'Accept',
                    'X-Content-Type-Options': 'nosniff'
                }
            });
        }
    }

    // 2. Rate Limiting for API Routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const ip = request.ip || '127.0.0.1';
        
        if (ratelimit) {
            const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);
            
            if (!success) {
                return new NextResponse(
                    JSON.stringify({ error: 'Too Many Requests' }),
                    { 
                        status: 429, 
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-RateLimit-Limit': limit.toString(),
                            'X-RateLimit-Remaining': remaining.toString(),
                            'X-RateLimit-Reset': reset.toString()
                        } 
                    }
                );
            }
        }
    }

    // Pass the request along
    const response = NextResponse.next();
    
    // Add Vary: Accept to all responses to ensure correct caching
    response.headers.set('Vary', 'Accept');
    
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
