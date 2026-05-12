import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting (placeholder logic)
// For production, use Upstash Redis or similar
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
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

    // 2. Rate Limiting Placeholder for API Routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const ip = request.ip || '127.0.0.1';
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const maxRequests = 100; // 100 requests per minute

        const userRecord = rateLimitMap.get(ip);
        
        if (!userRecord || (now - userRecord.timestamp > windowMs)) {
            rateLimitMap.set(ip, { count: 1, timestamp: now });
        } else {
            userRecord.count++;
            if (userRecord.count > maxRequests) {
                return new NextResponse(
                    JSON.stringify({ error: 'Too Many Requests' }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
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
