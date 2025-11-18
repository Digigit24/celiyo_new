// src/lib/client.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './apiConfig';

// Token management for JWT tokens
const ACCESS_TOKEN_KEY = 'celiyo_access_token';
const REFRESH_TOKEN_KEY = 'celiyo_refresh_token';
const USER_KEY = 'celiyo_user';

export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    console.log('💾 Access token saved to localStorage');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    console.log('💾 Refresh token saved to localStorage');
  },
  
  removeTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    console.log('🗑️ Tokens removed from localStorage');
  },
  
  hasAccessToken: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Legacy methods for backward compatibility
  getToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  setToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  
  hasToken: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
};

// Create auth client for authentication API (port 8000)
const authClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.AUTH_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create CRM client for CRM API (port 8001)
const crmClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.CRM_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create HMS client for HMS API (port 8000 - doctors, patients, appointments)
const hmsClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.HMS_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create OPD client for OPD module (hms.celiyo.com - visits, bills, procedures)
const opdClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.OPD_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth client - attach token to requests
authClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Auth API request with token');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for CRM client - attach token and tenant headers
crmClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    
    console.log('📤 CRM API Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added Bearer token to CRM request');
    } else {
      console.warn('⚠️ No access token found for CRM request!');
    }

    // Multi-tenant header propagation (read from stored user)
    try {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        const tenant = user?.tenant;
        
        if (tenant) {
          // Get tenant ID (could be tenant.id or tenant.tenant_id)
          const tenantId = tenant.id || tenant.tenant_id;
          
          if (tenantId) {
            config.headers['X-Tenant-Id'] = tenantId;
            config.headers['tenanttoken'] = tenantId; // Your API uses 'tenanttoken' header
            
            console.log('🏢 Added tenant headers:', {
              'X-Tenant-Id': tenantId,
              'tenanttoken': tenantId
            });
          }
          
          if (tenant.slug) {
            config.headers['X-Tenant-Slug'] = tenant.slug;
          }
        } else {
          console.warn('⚠️ No tenant found in user object');
        }
      } else {
        console.warn('⚠️ No user found in localStorage');
      }
    } catch (error) {
      console.error('❌ Failed to parse user or attach tenant headers:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor for HMS client - attach token and tenant headers
hmsClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    
    console.log('📤 HMS API Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added Bearer token to HMS request');
    } else {
      console.warn('⚠️ No access token found for HMS request!');
    }

    // Multi-tenant header propagation (read from stored user)
    try {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        const tenant = user?.tenant;
        
        if (tenant) {
          // Get tenant ID (could be tenant.id or tenant.tenant_id)
          const tenantId = tenant.id || tenant.tenant_id;
          
          if (tenantId) {
            config.headers['X-Tenant-Id'] = tenantId;
            config.headers['tenanttoken'] = tenantId; // Your API uses 'tenanttoken' header
            
            console.log('🏢 Added tenant headers to HMS:', {
              'X-Tenant-Id': tenantId,
              'tenanttoken': tenantId
            });
          }
          
          if (tenant.slug) {
            config.headers['X-Tenant-Slug'] = tenant.slug;
          }
        } else {
          console.warn('⚠️ No tenant found in user object for HMS');
        }
      } else {
        console.warn('⚠️ No user found in localStorage for HMS');
      }
    } catch (error) {
      console.error('❌ Failed to parse user or attach tenant headers for HMS:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for auth client
authClient.interceptors.response.use(
  (response) => {
    console.log('✅ Auth API response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Auth API error:', {
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      tokenManager.removeTokens();
      localStorage.removeItem(USER_KEY);
      
      // Only redirect to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        console.log('↪️ Redirecting to login...');
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('🚫 Access forbidden:', error.response.data);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Response interceptor for CRM client
crmClient.interceptors.response.use(
  (response) => {
    console.log('✅ CRM API response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ CRM API error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('🔄 Attempting to refresh token...');

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // Try to refresh the token using auth client
          const response = await authClient.post(API_CONFIG.AUTH.REFRESH, {
            refresh: refreshToken
          });

          const { access, refresh } = response.data;
          tokenManager.setAccessToken(access);
          
          // Update refresh token if provided
          if (refresh) {
            tokenManager.setRefreshToken(refresh);
          }

          console.log('✅ Token refreshed, retrying original request');

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return crmClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Refresh failed, clear tokens and redirect to login
        tokenManager.removeTokens();
        localStorage.removeItem(USER_KEY);
        
        if (!window.location.pathname.includes('/login')) {
          console.log('↪️ Redirecting to login...');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - CRM module not enabled
    if (error.response?.status === 403) {
      console.error('🚫 CRM access forbidden:', error.response.data);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Response interceptor for HMS client
hmsClient.interceptors.response.use(
  (response) => {
    console.log('✅ HMS API response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ HMS API error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('🔄 Attempting to refresh token for HMS...');

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // Try to refresh the token using auth client
          const response = await authClient.post(API_CONFIG.AUTH.REFRESH, {
            refresh: refreshToken
          });

          const { access, refresh } = response.data;
          tokenManager.setAccessToken(access);
          
          // Update refresh token if provided
          if (refresh) {
            tokenManager.setRefreshToken(refresh);
          }

          console.log('✅ Token refreshed for HMS, retrying original request');

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return hmsClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed for HMS:', refreshError);
        
        // Refresh failed, clear tokens and redirect to login
        tokenManager.removeTokens();
        localStorage.removeItem(USER_KEY);
        
        if (!window.location.pathname.includes('/login')) {
          console.log('↪️ Redirecting to login...');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - HMS module not enabled
    if (error.response?.status === 403) {
      console.error('🚫 HMS access forbidden:', error.response.data);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor for OPD client - attach token and tenant headers
opdClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();

    console.log('📤 OPD API Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added Bearer token to OPD request');
    } else {
      console.warn('⚠️ No access token found for OPD request!');
    }

    // Multi-tenant header propagation (read from stored user)
    try {
      const userJson = localStorage.getItem(USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        const tenant = user?.tenant;

        if (tenant) {
          // Get tenant ID (could be tenant.id or tenant.tenant_id)
          const tenantId = tenant.id || tenant.tenant_id;

          if (tenantId) {
            config.headers['X-Tenant-Id'] = tenantId;
            config.headers['tenanttoken'] = tenantId; // Your API uses 'tenanttoken' header

            console.log('🏢 Added tenant headers to OPD:', {
              'X-Tenant-Id': tenantId,
              'tenanttoken': tenantId
            });
          }

          if (tenant.slug) {
            config.headers['X-Tenant-Slug'] = tenant.slug;
          }
        } else {
          console.warn('⚠️ No tenant found in user object for OPD');
        }
      } else {
        console.warn('⚠️ No user found in localStorage for OPD');
      }
    } catch (error) {
      console.error('❌ Failed to parse user or attach tenant headers for OPD:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for OPD client
opdClient.interceptors.response.use(
  (response) => {
    console.log('✅ OPD API response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ OPD API error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('🔄 Attempting to refresh token for OPD...');

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // Try to refresh the token using auth client
          const response = await authClient.post(API_CONFIG.AUTH.REFRESH, {
            refresh: refreshToken
          });

          const { access, refresh } = response.data;
          tokenManager.setAccessToken(access);

          // Update refresh token if provided
          if (refresh) {
            tokenManager.setRefreshToken(refresh);
          }

          console.log('✅ Token refreshed for OPD, retrying original request');

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return opdClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed for OPD:', refreshError);

        // Refresh failed, clear tokens and redirect to login
        tokenManager.removeTokens();
        localStorage.removeItem(USER_KEY);

        if (!window.location.pathname.includes('/login')) {
          console.log('↪️ Redirecting to login...');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - OPD module not enabled
    if (error.response?.status === 403) {
      console.error('🚫 OPD access forbidden:', error.response.data);
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Export all clients
export { authClient, crmClient, hmsClient, opdClient };

// Export auth client as default for backward compatibility
export default authClient;