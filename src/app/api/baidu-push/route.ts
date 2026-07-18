import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { urls } = body;

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json({ error: 'Invalid urls' }, { status: 400 });
        }

        const baiduToken = process.env.BAIDU_PUSH_TOKEN;
        const siteDomain = 'cnverifyhub.com';

        if (!baiduToken) {
            return NextResponse.json({ error: 'Baidu token not configured' }, { status: 500 });
        }

        const baiduApi = `http://data.zz.baidu.com/urls?site=${siteDomain}&token=${baiduToken}`;

        const response = await fetch(baiduApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: urls.join('\n'),
        });

        const data = await response.json();

        return NextResponse.json({ success: true, baiduResponse: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
