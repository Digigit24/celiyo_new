// src/hooks/opd/useVisit.hooks.ts

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { API_CONFIG, buildUrl } from '@/lib/apiConfig';
import {
  getVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
  getTodayVisits,
  getVisitQueue,
  callNextPatient,
  completeVisit,
  getVisitStatistics,
} from '@/services/opd/visit.service';
import {
  DEFAULT_SWR_OPTIONS,
  REALTIME_SWR_OPTIONS,
  QUEUE_SWR_OPTIONS,
  buildQueryString,
} from './common.hooks';
import type {
  Visit,
  VisitListParams,
  VisitCreateData,
  VisitUpdateData,
  VisitStatistics,
  PaginatedResponse,
} from '@/types/opd';

// ==================== QUERY HOOKS ====================

/**
 * Hook to fetch paginated visits list with filters
 */
export function useVisits(params?: VisitListParams) {
  const queryString = buildQueryString(params);
  const url = `${API_CONFIG.HMS.OPD.VISITS_LIST}${queryString}`;

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<Visit>>(
    url,
    () => getVisits(params),
    DEFAULT_SWR_OPTIONS
  );

  return {
    visits: data?.results || [],
    count: data?.count || 0,
    next: data?.next,
    previous: data?.previous,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch a single visit by ID
 */
export function useVisit(id: number | null) {
  const url = id ? buildUrl(API_CONFIG.HMS.OPD.VISIT_DETAIL, { id }, undefined, 'hms') : null;

  const { data, error, isLoading, mutate } = useSWR<Visit>(
    url,
    () => (id ? getVisitById(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    visit: data || null,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch today's visits with auto-refresh
 * Refreshes every 30 seconds automatically
 */
export function useTodayVisits() {
  const { data, error, isLoading, mutate } = useSWR<Visit[]>(
    API_CONFIG.HMS.OPD.VISITS_TODAY,
    getTodayVisits,
    REALTIME_SWR_OPTIONS
  );

  return {
    todayVisits: data || [],
    count: data?.length || 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch queue status with auto-refresh
 * Refreshes every 10 seconds automatically
 * Returns visits grouped by status: waiting, called, in_consultation
 */
export function useQueue() {
  const { data, error, isLoading, mutate } = useSWR(
    API_CONFIG.HMS.OPD.VISITS_QUEUE,
    getVisitQueue,
    QUEUE_SWR_OPTIONS
  );

  return {
    waiting: data?.waiting || [],
    called: data?.called || [],
    inConsultation: data?.in_consultation || [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook to fetch visit statistics for a date range
 */
export function useVisitStatistics(params?: {
  start_date?: string;
  end_date?: string;
}) {
  const queryString = buildQueryString(params);
  const url = `${API_CONFIG.HMS.OPD.VISITS_STATISTICS}${queryString}`;

  const { data, error, isLoading, mutate } = useSWR<VisitStatistics>(
    url,
    () => getVisitStatistics('day'),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    statistics: data || null,
    isLoading,
    error,
    mutate,
  };
}

// ==================== MUTATION HOOKS ====================

/**
 * Hook to create a new visit
 */
export function useCreateVisit() {
  const { trigger, isMutating, error } = useSWRMutation(
    API_CONFIG.HMS.OPD.VISIT_CREATE,
    async (_key: string, { arg }: { arg: VisitCreateData }) =>
      await createVisit(arg)
  );

  return {
    createVisit: trigger,
    isCreating: isMutating,
    error,
  };
}

/**
 * Hook to update a visit
 */
export function useUpdateVisit(id: number) {
  const url = buildUrl(API_CONFIG.HMS.OPD.VISIT_UPDATE, { id }, undefined, 'hms');

  const { trigger, isMutating, error } = useSWRMutation(
    url,
    async (_key: string, { arg }: { arg: VisitUpdateData }) =>
      await updateVisit(id, arg)
  );

  return {
    updateVisit: trigger,
    isUpdating: isMutating,
    error,
  };
}

/**
 * Hook to delete a visit
 */
export function useDeleteVisit() {
  const { trigger, isMutating, error } = useSWRMutation(
    API_CONFIG.HMS.OPD.VISITS_LIST,
    async (_key: string, { arg }: { arg: number }) => await deleteVisit(arg)
  );

  return {
    deleteVisit: trigger,
    isDeleting: isMutating,
    error,
  };
}

// ==================== ACTION HOOKS ====================

/**
 * Hook to call the next patient in queue
 */
export function useCallNextPatient() {
  const { trigger, isMutating, error, data } = useSWRMutation(
    API_CONFIG.HMS.OPD.VISITS_CALL_NEXT,
    async () => await callNextPatient()
  );

  return {
    callNext: trigger,
    isCalling: isMutating,
    error,
    result: data,
  };
}

/**
 * Hook to complete a visit
 */
export function useCompleteVisit(id: number) {
  const url = buildUrl(API_CONFIG.HMS.OPD.VISIT_COMPLETE, { id }, undefined, 'hms');

  const { trigger, isMutating, error } = useSWRMutation(
    url,
    async () => await completeVisit(id)
  );

  return {
    completeVisit: trigger,
    isCompleting: isMutating,
    error,
  };
}
