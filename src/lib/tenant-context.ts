import type { NextRequest } from 'next/server';

export const DEFAULT_TENANT_ID = 'cnverifyhub' as const;
export const SUPPORTED_TENANTS = ['cnverifyhub', 'cnwepro'] as const;
export type TenantId = typeof SUPPORTED_TENANTS[number];

/**
 * Extract tenant ID from a hostname string.
 */
export function getTenantFromHost(host?: string | null): TenantId {
  if (!host) return DEFAULT_TENANT_ID;
  const normalized = host.toLowerCase();
  if (normalized.includes('cnwepro')) {
    return 'cnwepro';
  }
  return 'cnverifyhub';
}

/**
 * Extract tenant ID from HTTP Headers object.
 */
export function getTenantFromHeaders(headers?: Headers | null): TenantId {
  if (!headers) return DEFAULT_TENANT_ID;
  
  // Check x-tenant-id header first
  const tenantHeader = headers.get('x-tenant-id');
  if (tenantHeader) {
    const normalized = tenantHeader.toLowerCase().trim();
    if (normalized === 'cnwepro') return 'cnwepro';
    if (normalized === 'cnverifyhub') return 'cnverifyhub';
  }

  // Fallback to host / x-forwarded-host header
  const host = headers.get('x-forwarded-host') || headers.get('host');
  return getTenantFromHost(host);
}

/**
 * Extract tenant ID from Request, NextRequest, Headers, or hostname string.
 */
export function getTenantId(
  input?: Request | NextRequest | Headers | string | null
): TenantId {
  if (!input) return DEFAULT_TENANT_ID;

  if (typeof input === 'string') {
    return getTenantFromHost(input);
  }

  if ('headers' in input && typeof input.headers?.get === 'function') {
    return getTenantFromHeaders(input.headers as Headers);
  }

  if (typeof (input as Headers).get === 'function') {
    return getTenantFromHeaders(input as Headers);
  }

  return DEFAULT_TENANT_ID;
}
