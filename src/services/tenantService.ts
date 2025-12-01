// src/services/tenantService.ts
import { authClient } from '@/lib/client';
import { API_CONFIG, buildQueryString } from '@/lib/apiConfig';
import { Tenant, TenantListParams, PaginatedResponse } from '@/types/tenant.types';

/**
 * Tenant Service
 *
 * Service for managing tenant data and configuration
 */
class TenantService {
  // Get tenants with optional query parameters
  async getTenants(params?: TenantListParams): Promise<PaginatedResponse<Tenant>> {
    try {
      const queryString = buildQueryString(params);
      const response = await authClient.get<PaginatedResponse<Tenant>>(
        `${API_CONFIG.AUTH.TENANTS.LIST}${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch tenants';
      throw new Error(message);
    }
  }

  // Get single tenant by ID
  async getTenant(id: string): Promise<Tenant> {
    try {
      const response = await authClient.get<Tenant>(
        API_CONFIG.AUTH.TENANTS.DETAIL.replace(':id', id)
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch tenant';
      throw new Error(message);
    }
  }

  // Get current tenant (if API endpoint exists)
  async getCurrentTenant(): Promise<Tenant> {
    try {
      // Assuming there's a /tenants/me/ endpoint or similar
      // If not, you'll need to get the tenant ID from the user's context
      const response = await authClient.get<Tenant>(
        '/tenants/me/'
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch current tenant';
      throw new Error(message);
    }
  }
}

export const tenantService = new TenantService();
