'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to check if component has successfully mounted in client environment.
 * Useful for bypassing SSR for client-only UI paths.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

/**
 * Safely accesses window.localStorage during rendering without triggering SSR crashes.
 */
export function safeLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
