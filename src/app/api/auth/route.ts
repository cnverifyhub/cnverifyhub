import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Check if the password matches the environment variable, or a default fallback for local dev
        const correctPassword = process.env.SITE_PASSWORD || '888';

        if (password === correctPassword) {
            // Create a response that redirects or just returns success
            const response = NextResponse.json({ success: true, message: 'Access granted' });

            // Set the access cookie (expires in 30 days)
            response.cookies.set({
                name: 'cnwepro_access',
                value: 'true',
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });

            return response;
        }

        // Return error if password does not match
        return NextResponse.json(
            { success: false, message: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid request' },
            { status: 400 }
        );
    }
}
