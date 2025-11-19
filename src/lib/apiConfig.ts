// ==================== API CONFIGURATION ====================
// Celiyo Multi-Tenant API Configuration
// Auth API: http://127.0.0.1:8000/api (port 8000)
// CRM API: http://127.0.0.1:8001/api (port 8001)
// WhatsApp API: http://127.0.0.1:8002/api (port 8002)

export const API_CONFIG = {
  // ==================== BASE URLS ====================
  // You can override these via Vite env vars in .env/.env.local
  // VITE_AUTH_BASE_URL, VITE_CRM_BASE_URL, VITE_WHATSAPP_BASE_URL, VITE_WHATSAPP_WS_URL
  AUTH_BASE_URL: import.meta.env.VITE_AUTH_BASE_URL || 'https://admin.celiyo.com/api',
  CRM_BASE_URL: import.meta.env.VITE_CRM_BASE_URL || 'https://crm.celiyo.com/api',
  HMS_BASE_URL: import.meta.env.VITE_HMS_BASE_URL || 'https://hms.celiyo.com/api',
  WHATSAPP_BASE_URL: import.meta.env.VITE_WHATSAPP_BASE_URL || 'https://whatsapp.dglinkup.com/api',
  
  // ✅ WebSocket URL for real-time WhatsApp updates
  WHATSAPP_WS_URL: import.meta.env.VITE_WHATSAPP_WS_URL || 'wss://whatsapp.dglinkup.com',
  
  // For development, set in .env.local instead of editing code:
  // VITE_AUTH_BASE_URL=http://localhost:8000/api
  // VITE_CRM_BASE_URL=http://localhost:8001/api
  // VITE_WHATSAPP_BASE_URL=http://localhost:8002/api
  // VITE_WHATSAPP_WS_URL=ws://localhost:8002

  // ==================== AUTHENTICATION ====================
  AUTH: {
    LOGIN: '/auth/login/',
    REFRESH: '/auth/token/refresh/',
    VERIFY: '/auth/token/verify/',
    LOGOUT: '/auth/logout/',
  },

  // ==================== HMS ====================
  HMS: {
    DOCTORS: {
      PROFILES_LIST: '/doctors/profiles/',
      PROFILE_DETAIL: '/doctors/profiles/:id/',
      PROFILE_CREATE: '/doctors/profiles/',
      PROFILE_UPDATE: '/doctors/profiles/:id/',
      PROFILE_DELETE: '/doctors/profiles/:id/',
      REGISTER: '/doctors/profiles/register/',
      AVAILABILITY_LIST: '/doctors/profiles/:id/availability/',
      AVAILABILITY_CREATE: '/doctors/profiles/:id/set_availability/',
      STATISTICS: '/doctors/profiles/statistics/',
      SPECIALTIES_LIST: '/doctors/specialties/',
      SPECIALTY_DETAIL: '/doctors/specialties/:id/',
      SPECIALTY_CREATE: '/doctors/specialties/',
      SPECIALTY_UPDATE: '/doctors/specialties/:id/',
      SPECIALTY_DELETE: '/doctors/specialties/:id/',
    },
    PATIENTS: {
      PROFILES_LIST: '/patients/profiles/',
      PROFILE_DETAIL: '/patients/profiles/:id/',
      PROFILE_CREATE: '/patients/profiles/',
      PROFILE_UPDATE: '/patients/profiles/:id/',
      PROFILE_DELETE: '/patients/profiles/:id/',
      REGISTER: '/patients/profiles/register/',
      STATISTICS: '/patients/profiles/statistics/',
    },
    APPOINTMENTS: {
      LIST: '/appointments/',
      DETAIL: '/appointments/:id/',
      CREATE: '/appointments/',
      UPDATE: '/appointments/:id/',
      DELETE: '/appointments/:id/',
      STATISTICS: '/appointments/statistics/',
      BY_DOCTOR: '/appointments/by-doctor/:doctor_id/',
      BY_PATIENT: '/appointments/by-patient/:patient_id/',
      UPCOMING: '/appointments/upcoming/',
      CANCEL: '/appointments/:id/cancel/',
      COMPLETE: '/appointments/:id/complete/',
      RESCHEDULE: '/appointments/:id/reschedule/',
    },
    OPD: {
      VISITS: {
        LIST: '/opd/visits/',
        DETAIL: '/opd/visits/:id/',
        CREATE: '/opd/visits/',
        UPDATE: '/opd/visits/:id/',
        DELETE: '/opd/visits/:id/',
        STATISTICS: '/opd/visits/statistics/',
        TODAY: '/opd/visits/today/',
        QUEUE: '/opd/visits/queue/',
        CALL_NEXT: '/opd/visits/call_next/',
        COMPLETE: '/opd/visits/:id/complete/',
      },
      BILLS: {
        LIST: '/opd/opd-bills/',
        DETAIL: '/opd/opd-bills/:id/',
        CREATE: '/opd/opd-bills/',
        UPDATE: '/opd/opd-bills/:id/',
        DELETE: '/opd/opd-bills/:id/',
        RECORD_PAYMENT: '/opd/opd-bills/:id/record_payment/',
        PRINT: '/opd/opd-bills/:id/print/',
        STATISTICS: '/opd/opd-bills/statistics/',
      },
      CLINICAL_NOTES: {
        LIST: '/opd/clinical-notes/',
        DETAIL: '/opd/clinical-notes/:id/',
        CREATE: '/opd/clinical-notes/',
        UPDATE: '/opd/clinical-notes/:id/',
        DELETE: '/opd/clinical-notes/:id/',
      },
      VISIT_FINDINGS: {
        LIST: '/opd/visit-findings/',
        DETAIL: '/opd/visit-findings/:id/',
        CREATE: '/opd/visit-findings/',
        UPDATE: '/opd/visit-findings/:id/',
        DELETE: '/opd/visit-findings/:id/',
      },
      PROCEDURE_MASTERS: {
        LIST: '/opd/procedure-masters/',
        DETAIL: '/opd/procedure-masters/:id/',
        CREATE: '/opd/procedure-masters/',
        UPDATE: '/opd/procedure-masters/:id/',
        DELETE: '/opd/procedure-masters/:id/',
      },
      PROCEDURE_PACKAGES: {
        LIST: '/opd/procedure-packages/',
        DETAIL: '/opd/procedure-packages/:id/',
        CREATE: '/opd/procedure-packages/',
        UPDATE: '/opd/procedure-packages/:id/',
        DELETE: '/opd/procedure-packages/:id/',
      },
      PROCEDURE_BILLS: {
        LIST: '/opd/procedure-bills/',
        DETAIL: '/opd/procedure-bills/:id/',
        CREATE: '/opd/procedure-bills/',
        UPDATE: '/opd/procedure-bills/:id/',
        DELETE: '/opd/procedure-bills/:id/',
        RECORD_PAYMENT: '/opd/procedure-bills/:id/record_payment/',
        PRINT: '/opd/procedure-bills/:id/print/',
        ITEMS_LIST: '/opd/procedure-bill-items/',
        ITEM_DETAIL: '/opd/procedure-bill-items/:id/',
      },
      ATTACHMENTS: {
        LIST: '/opd/visit-attachments/',
        DETAIL: '/opd/visit-attachments/:id/',
        CREATE: '/opd/visit-attachments/',
        UPDATE: '/opd/visit-attachments/:id/',
        DELETE: '/opd/visit-attachments/:id/',
      }
    }
  },


  // ==================== CRM ====================
  CRM: {
    // Lead endpoints (note: no /crm/ prefix since base URL already includes it)
    LEADS: '/crm/leads/',
    LEAD_DETAIL: '/crm/leads/:id/',
    LEAD_CREATE: '/crm/leads/',
    LEAD_UPDATE: '/crm/leads/:id/',
    LEAD_DELETE: '/crm/leads/:id/',
    
    // Lead Status endpoints
    LEAD_STATUSES: '/crm/statuses/',
    LEAD_STATUS_DETAIL: '/crm/statuses/:id/',
    LEAD_STATUS_CREATE: '/crm/statuses/',
    LEAD_STATUS_UPDATE: '/crm/statuses/:id/',
    LEAD_STATUS_DELETE: '/crm/statuses/:id/',
    
    // Lead Activity endpoints
    LEAD_ACTIVITIES: '/crm/activities/',
    LEAD_ACTIVITY_DETAIL: '/crm/activities/:id/',
    LEAD_ACTIVITY_CREATE: '/crm/activities/',
    LEAD_ACTIVITY_UPDATE: '/crm/activities/:id/',
    LEAD_ACTIVITY_DELETE: '/crm/activities/:id/',
    
    // Lead Order endpoints (Kanban positioning)
    LEAD_ORDERS: '/crm/orders/',
    LEAD_ORDER_DETAIL: '/crm/orders/:id/',
    LEAD_ORDER_CREATE: '/crm/orders/',
    LEAD_ORDER_UPDATE: '/crm/orders/:id/',
    LEAD_ORDER_DELETE: '/crm/orders/:id/',
  },

  // ==================== WHATSAPP ====================
  WHATSAPP: {
    // Chat & Messages endpoints
    SEND_TEXT: '/messages/send',
    CONVERSATIONS: '/messages/conversations/',
    CONVERSATION_DETAIL: '/messages/conversations/:phone',
    DELETE_CONVERSATION: '/messages/conversations/:phone',
    MESSAGES: '/messages/messages',
    STATS: '/messages/stats',
    
    // Contacts endpoints
    CONTACTS: '/contacts/',
    CONTACT_DETAIL: '/contacts/:phone/',
    CONTACT_CREATE: '/contacts/',
    CONTACT_UPDATE: '/contacts/:phone/',
    CONTACT_DELETE: '/contacts/:phone/',
    
    // Groups endpoints
    GROUPS: '/groups/',
    GROUP_DETAIL: '/groups/:group_id',
    GROUP_CREATE: '/groups/',
    GROUP_UPDATE: '/groups/:group_id',
    GROUP_DELETE: '/groups/:group_id',
    
    // Templates endpoints (aligned to backend: id-based + name route)
    TEMPLATES: '/templates/',
    TEMPLATE_DETAIL: '/templates/:id',
    TEMPLATE_CREATE: '/templates/',
    TEMPLATE_UPDATE: '/templates/:id',
    TEMPLATE_DELETE: '/templates/:id',
    TEMPLATE_BY_NAME: '/templates/name/:template_name',
    
    // Campaigns endpoints (align with FastAPI router without trailing slashes)
    CAMPAIGN_BROADCAST: '/campaigns/broadcast',
    CAMPAIGNS: '/campaigns/',
    CAMPAIGN_DETAIL: '/campaigns/:id',
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Build full URL with appropriate base URL
 * @param endpoint - API endpoint path
 * @param params - URL parameters to replace (e.g., {id: '1'})
 * @param apiType - 'auth' | 'crm' | 'whatsapp' to determine base URL
 * @returns Full URL string
 */
export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number>,
  apiType: 'auth' | 'crm' | 'hms' | 'whatsapp' = 'auth'
): string => {
  const baseUrl =
    apiType === 'auth' ? API_CONFIG.AUTH_BASE_URL :
    apiType === 'crm' ? API_CONFIG.CRM_BASE_URL :
    apiType === 'hms' ? API_CONFIG.HMS_BASE_URL :
    API_CONFIG.WHATSAPP_BASE_URL;
  
  let url = `${baseUrl}${endpoint}`;

  // Replace URL parameters (e.g., :id, :phone, :name) with URL-encoded values
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const encoded = encodeURIComponent(String(value));
      url = url.replace(`:${key}`, encoded);
    });
  }

  return url;
};

/**
 * Build query string from params object
 * @param params - Query parameters object
 * @returns Query string (e.g., '?key1=value1&key2=value2')
 */
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

/**
 * Get full URL with query parameters
 * @param endpoint - API endpoint path
 * @param urlParams - URL parameters to replace (e.g., {id: '1'})
 * @param queryParams - Query parameters object
 * @param apiType - 'auth' | 'crm' | 'whatsapp' to determine base URL
 * @returns Full URL with query string
 */
export const getFullUrl = (
  endpoint: string,
  urlParams?: Record<string, string | number>,
  queryParams?: Record<string, string | number | boolean | undefined>,
  apiType: 'auth' | 'crm' | 'hms' | 'whatsapp' = 'auth'
): string => {
  const baseUrl = buildUrl(endpoint, urlParams, apiType);
  const queryString = buildQueryString(queryParams);
  return `${baseUrl}${queryString}`;
};