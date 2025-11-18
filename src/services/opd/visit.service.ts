// src/services/opd/visit.service.ts
import { opdClient } from '@/lib/client';
import { API_CONFIG } from '@/lib/apiConfig';
import type {
  Visit,
  VisitCreateData,
  VisitUpdateData,
  VisitListParams,
  VisitStatistics,
  PaginatedResponse,
  ApiResponse,
} from '@/types/opd';

// Helper function to replace URL parameters
const replaceUrlParams = (url: string, params: Record<string, string | number>): string => {
  let result = url;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
};

// ==================== VISITS ====================

export const getVisits = async (
  params?: VisitListParams
): Promise<PaginatedResponse<Visit>> => {
  const response = await opdClient.get(API_CONFIG.HMS.OPD.VISITS_LIST, { params });
  return response.data;
};

export const getVisitById = async (id: number): Promise<Visit> => {
  const url = replaceUrlParams(API_CONFIG.HMS.OPD.VISIT_DETAIL, { id });
  const response = await opdClient.get<Visit>(url);
  // API returns visit directly, not wrapped
  return response.data;
};

export const createVisit = async (data: VisitCreateData): Promise<Visit> => {
  const response = await opdClient.post<ApiResponse<Visit>>(
    API_CONFIG.HMS.OPD.VISIT_CREATE,
    data
  );
  return response.data.data || response.data;
};

export const updateVisit = async (
  id: number,
  data: VisitUpdateData
): Promise<Visit> => {
  const url = replaceUrlParams(API_CONFIG.HMS.OPD.VISIT_UPDATE, { id });
  const response = await opdClient.patch<ApiResponse<Visit>>(url, data);
  return response.data.data || response.data;
};

export const deleteVisit = async (id: number): Promise<void> => {
  const url = replaceUrlParams(API_CONFIG.HMS.OPD.VISIT_DELETE, { id });
  await opdClient.delete(url);
};

// ==================== VISIT ACTIONS ====================

// Modified: Now returns just the Visit[] array for easier use in components
export const getTodayVisits = async (): Promise<Visit[]> => {
  const response = await opdClient.get<{
    success: boolean;
    count: number;
    data: Visit[];
  }>(API_CONFIG.HMS.OPD.VISITS_TODAY);
  return response.data.data || [];
};

// Keep original for backward compatibility
export const getTodayVisitsRaw = async (): Promise<{
  success: boolean;
  count: number;
  data: Visit[];
}> => {
  const response = await opdClient.get(API_CONFIG.HMS.OPD.VISITS_TODAY);
  return response.data;
};

export const getQueue = async (): Promise<{
  success: boolean;
  count: number;
  data: Visit[];
}> => {
  const response = await opdClient.get(API_CONFIG.HMS.OPD.VISITS_QUEUE);
  return response.data;
};

// NEW: Added for the new UI - returns structured queue data
export const getVisitQueue = async (): Promise<{
  waiting: Visit[];
  called: Visit[];
  in_consultation: Visit[];
}> => {
  const response = await opdClient.get<{
    success: boolean;
    data: {
      waiting: Visit[];
      called: Visit[];
      in_consultation: Visit[];
    };
  }>(API_CONFIG.HMS.OPD.VISITS_QUEUE);
  return response.data.data;
};

export const callNextPatient = async (): Promise<{
  success: boolean;
  message: string;
  data: Visit | null;
}> => {
  const response = await opdClient.post(API_CONFIG.HMS.OPD.VISITS_CALL_NEXT);
  return response.data;
};

export const completeVisit = async (
  id: number
): Promise<ApiResponse<Visit>> => {
  const url = replaceUrlParams(API_CONFIG.HMS.OPD.VISIT_COMPLETE, { id });
  const response = await opdClient.post<ApiResponse<Visit>>(url);
  return response.data;
};

// Modified: Now returns just the VisitStatistics data for easier use
export const getVisitStatistics = async (
  period: 'day' | 'week' | 'month' = 'day'
): Promise<VisitStatistics> => {
  const response = await opdClient.get<ApiResponse<VisitStatistics>>(
    API_CONFIG.HMS.OPD.VISITS_STATISTICS,
    { params: { period } }
  );
  return response.data.data || response.data;
};

// Keep original for backward compatibility
export const getVisitStatisticsRaw = async (
  params?: { start_date?: string; end_date?: string }
): Promise<ApiResponse<VisitStatistics>> => {
  const response = await opdClient.get<ApiResponse<VisitStatistics>>(
    API_CONFIG.HMS.OPD.VISITS_STATISTICS,
    { params }
  );
  return response.data;
};
