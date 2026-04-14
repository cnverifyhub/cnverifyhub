import { NextRequest, NextResponse } from 'next/server';
import {
    addToBlocklist,
    removeFromBlocklist,
    getRecentFraudEvents,
    getBlocklist,
} from '@/lib/fraud-detection';

const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin888';

function checkAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get('Authorization');
    return authHeader === `Bearer ${ADMIN_PASS}`;
}

// GET — Fetch fraud events and/or blocklist
// Query params: ?type=events|blocklist&limit=50
export async function GET(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'events';
        const limit = parseInt(searchParams.get('limit') || '50');

        if (type === 'blocklist') {
            const blocklist = await getBlocklist();
            return NextResponse.json({ blocklist });
        }

        const events = await getRecentFraudEvents(limit);
        return NextResponse.json({ events });
    } catch (error) {
        console.error('[Admin Fraud] GET error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST — Add to blocklist
// Body: { type: 'txid' | 'wallet' | 'ip' | 'email', value: string, reason?: string }
export async function POST(request: NextRequest) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { action, type, value, reason, id } = await request.json();

        if (action === 'remove' && id) {
            const result = await removeFromBlocklist(id);
            return NextResponse.json(result);
        }

        if (!type || !value) {
            return NextResponse.json({ error: 'type and value are required' }, { status: 400 });
        }

        const result = await addToBlocklist(value, type, reason);
        return NextResponse.json(result);
    } catch (error) {
        console.error('[Admin Fraud] POST error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
