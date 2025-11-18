// src/types/opd/common.types.ts

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Common query parameters for list endpoints
 */
export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Common error response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
