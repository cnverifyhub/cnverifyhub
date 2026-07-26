'use client';

import React, { createContext, useContext } from 'react';
import { TenantConfig, tenantConfigs } from '@/lib/tenant-config';

const TenantContext = createContext<TenantConfig>(tenantConfigs.cnverifyhub);

export function TenantProvider({
  initialConfig,
  children,
}: {
  initialConfig: TenantConfig;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={initialConfig}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantConfig(): TenantConfig {
  const context = useContext(TenantContext);
  if (!context) {
    return tenantConfigs.cnverifyhub;
  }
  return context;
}
