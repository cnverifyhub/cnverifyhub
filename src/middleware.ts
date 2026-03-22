import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otgewrynnrqmtsyvlzrj.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession();

    // Protected routes — redirect to login if not authenticated
    const protectedPaths = ['/account', '/en/account'];
    const isProtected = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !session) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is logged in and tries to access auth pages, redirect to account
    const authPaths = ['/auth/login', '/auth/signup'];
    const isAuthPage = authPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isAuthPage && session) {
        return NextResponse.redirect(new URL('/account', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/account/:path*',
        '/en/account/:path*',
        '/auth/:path*',
        '/admin/:path*',
        '/en/admin/:path*',
    ],
};
