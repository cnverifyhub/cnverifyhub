'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * BaiduPush Component
 * Triggers Baidu's auto-push indexing script on every route change.
 * Essential for SPA/Next.js SEO in the Chinese market.
 */
export default function BaiduPush() {
    const pathname = usePathname();

    useEffect(() => {
        // Only run in production and in browser
        if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') return;

        try {
            // Remove any existing push scripts to prevent duplicates
            const existingScripts = document.querySelectorAll('script[src*="push.js"]');
            existingScripts.forEach(s => s.remove());

            const bp = document.createElement('script');
            const curProtocol = window.location.protocol.split(':')[0];
            if (curProtocol === 'https') {
                bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
            } else {
                bp.src = 'http://push.zhanzhang.baidu.com/push.js';
            }
            const s = document.getElementsByTagName("script")[0];
            s.parentNode?.insertBefore(bp, s);
        } catch (e) {
            // Silently fail to not interrupt UX
        }
    }, [pathname]);

    return null;
}
