import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const password = body?.password;

        if (!password || typeof password !== 'string' || password.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Password is required' },
                { status: 401 }
            );
        }

        const expectedPassword = process.env.GATE_SECRET || process.env.ADMIN_PASSWORD;

        if (!expectedPassword || password !== expectedPassword) {
            return NextResponse.json(
                { success: false, message: 'Invalid password' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({ success: true, message: 'Access granted' });

        response.cookies.set({
            name: 'CNVerifyHub_access',
            value: 'true',
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid request' },
            { status: 400 }
        );
    }
}

