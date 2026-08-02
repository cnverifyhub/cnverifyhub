import { getTenantConfig } from '@/lib/tenant-config';

export interface BaiduPushResponse {
    success: boolean;
    data?: {
        remain?: number;
        success?: number;
        not_same_site?: string[];
        not_valid?: string[];
        [key: string]: any;
    };
    error?: string;
}

export interface IndexNowResponse {
    success: boolean;
    status?: number;
    data?: any;
    error?: string;
}

/**
 * Submits URLs to Baidu Link Submission API (zz.bdstatic.com / data.zz.baidu.com)
 */
export async function submitBaiduUrls(urls: string[], host?: string | null): Promise<BaiduPushResponse> {
    try {
        if (!urls || urls.length === 0) {
            return { success: false, error: 'No URLs provided' };
        }

        const config = getTenantConfig(host);
        const baiduToken = process.env.BAIDU_PUSH_TOKEN;
        if (!baiduToken) {
            return { success: false, error: 'BAIDU_PUSH_TOKEN environment variable is not configured' };
        }

        const siteDomain = config.domain;
        const baiduApi = `http://data.zz.baidu.com/urls?site=${siteDomain}&token=${baiduToken}`;

        const response = await fetch(baiduApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: urls.join('\n'),
        });

        const data = await response.json();
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || String(error) };
    }
}

/**
 * Submits URLs to IndexNow API (shared search engine index protocol)
 */
export async function submitIndexNow(urls: string[], host?: string | null): Promise<IndexNowResponse> {
    try {
        if (!urls || urls.length === 0) {
            return { success: false, error: 'No URLs provided' };
        }

        const config = getTenantConfig(host);
        const key = process.env.INDEXNOW_KEY || process.env.INDEXNOW_API_KEY || 'cnverifyhub_indexnow_key';
        const siteDomain = config.domain;

        const payload = {
            host: siteDomain,
            key: key,
            keyLocation: `https://${siteDomain}/${key}.txt`,
            urlList: urls,
        };

        const response = await fetch('https://api.indexnow.org/IndexNow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok || response.status === 200 || response.status === 202) {
            return { success: true, status: response.status };
        } else {
            const text = await response.text();
            return { success: false, status: response.status, error: text };
        }
    } catch (error: any) {
        return { success: false, error: error.message || String(error) };
    }
}
