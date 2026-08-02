import { NextResponse } from 'next/server';
import { submitBaiduUrls } from '@/lib/indexing';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { urls } = body;

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json({ error: 'Invalid urls parameter' }, { status: 400 });
        }

        const host = request.headers.get('host') || request.headers.get('x-forwarded-host');
        const result = await submitBaiduUrls(urls, host);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, baiduResponse: result.data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}
