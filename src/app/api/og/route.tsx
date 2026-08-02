import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || 'CNVerifyHub';
        const subtitle = searchParams.get('subtitle') || 'Buy Verified Chinese Accounts & Services';
        const category = searchParams.get('category') || 'Verified Service';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: '#0a0a0a',
                        padding: '60px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                            style={{
                                backgroundColor: '#FF0036',
                                color: '#ffffff',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                            }}
                        >
                            {category}
                        </span>
                        <span style={{ color: '#a1a1aa', fontSize: '18px' }}>CNVerifyHub</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h1 style={{ fontSize: '52px', fontWeight: 'bold', color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
                            {title}
                        </h1>
                        <p style={{ fontSize: '24px', color: '#a1a1aa', margin: 0 }}>
                            {subtitle}
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ color: '#FF0036', fontSize: '20px', fontWeight: 'bold' }}>
                            Instant Delivery • Escrow Protected
                        </span>
                        <span style={{ color: '#71717a', fontSize: '18px' }}>
                            cnverifyhub.com
                        </span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate the OG image: ${e.message || String(e)}`, {
            status: 500,
        });
    }
}
