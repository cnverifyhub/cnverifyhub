import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require the password
const publicPaths = ['/gate', '/api/auth', '/_next', '/favicon.ico', '/manifest.json'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current path is in the public paths list or matches static assets
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) ||
        pathname.match(/\.(png|jpg|jpeg|svg|webp)$/);

    // If it's a public path, let the request proceed normally
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Check for the access cookie
    const hasAccess = request.cookies.has('cnwepro_access');

    // If no access cookie, redirect to the gate page
    if (!hasAccess) {
        const url = new URL('/gate', request.url);
        return NextResponse.redirect(url);
    }

    // If authenticated, let the request proceed normally
    return NextResponse.next();
}

// Configure the paths where the middleware should run
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * This allows the middleware to be invoked on all pages and API routes.
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
