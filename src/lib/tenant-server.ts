import { headers } from 'next/headers';
import { getTenantConfig, TenantConfig } from '@/lib/tenant-config';

/**
 * Server-side helper to resolve TenantConfig from incoming request headers.
 */
export function getTenantConfigFromHeaders(): TenantConfig {
  const headersList = headers();
  const host = headersList.get('host') || headersList.get('x-forwarded-host') || null;
  return getTenantConfig(host);
}
