// src/hooks/useTenant.ts
import { useState } from 'react';
import useSWR from 'swr';
import { tenantService } from '@/services/tenantService';
import type { Tenant, TenantListParams, PaginatedResponse } from '@/types/tenant.types';

export const useTenant = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get tenants with SWR caching
  const useTenantsList = (params?: TenantListParams) => {
    const key = ['tenants', params];

    return useSWR<PaginatedResponse<Tenant>>(
      key,
      () => tenantService.getTenants(params),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch tenants:', err);
          setError(err.message || 'Failed to fetch tenants');
        }
      }
    );
  };

  // Get single tenant with SWR caching
  const useTenantDetail = (id: string | null) => {
    const key = id ? ['tenant', id] : null;

    return useSWR<Tenant>(
      key,
      () => tenantService.getTenant(id!),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch tenant:', err);
          setError(err.message || 'Failed to fetch tenant');
        }
      }
    );
  };

  // Get current tenant
  const useCurrentTenant = () => {
    const key = 'current-tenant';

    return useSWR<Tenant>(
      key,
      () => tenantService.getCurrentTenant(),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch current tenant:', err);
          setError(err.message || 'Failed to fetch current tenant');
        }
      }
    );
  };

  return {
    useTenantsList,
    useTenantDetail,
    useCurrentTenant,
    isLoading,
    error,
  };
};
