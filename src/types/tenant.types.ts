// src/types/tenant.types.ts

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  database_name: string;
  database_url: string;
  enabled_modules: string;
  settings: string;
  is_active: boolean;
  trial_ends_at: string;
  user_count: string;
  created_at: string;
  updated_at: string;
}

export interface TenantListParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
