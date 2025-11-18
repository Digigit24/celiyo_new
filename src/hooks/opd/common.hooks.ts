// src/hooks/opd/common.hooks.ts

// Common SWR options for OPD hooks
export const DEFAULT_SWR_OPTIONS = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: false,
};

export const REALTIME_SWR_OPTIONS = {
  ...DEFAULT_SWR_OPTIONS,
  refreshInterval: 30000, // 30 seconds
};

export const QUEUE_SWR_OPTIONS = {
  ...DEFAULT_SWR_OPTIONS,
  refreshInterval: 10000, // 10 seconds
};

// Helper to build query string
export const buildQueryString = (
  params?: Record<string, string | number | boolean | undefined>
): string => {
  if (!params) return '';

  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};
