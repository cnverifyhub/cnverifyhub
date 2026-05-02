import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting (placeholder logic)
// For production, use Upstash Redis or similar
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
    // 1. Rate Limiting Placeholder for API Routes
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
