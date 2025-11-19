// src/hooks/useDoctor.ts
import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { doctorService } from '@/services/doctorService';
import {
  Doctor,
  DoctorProfile,
  Specialty,
  DoctorListParams,
  DoctorCreateData,
  DoctorUpdateData,
  DoctorCreateWithUserData,
  DoctorRegistrationData,
  SetAvailabilityData,
  DoctorStatistics,
  PaginatedResponse,
  ApiResponse
} from '@/types/doctor.types';
import { useAuth } from './useAuth';

export const useDoctor = () => {
  const { hasModuleAccess } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has HMS access
  const hasHMSAccess = hasModuleAccess('hms');

  // ==================== DOCTORS HOOKS ====================

  // Get doctors with SWR caching
  const useDoctors = (params?: DoctorListParams) => {
    const key = ['doctors', params];

    return useSWR<PaginatedResponse<Doctor>>(
      key,
      () => doctorService.getDoctors(params),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch doctors:', err);
          setError(err.message || 'Failed to fetch doctors');
        }
      }
    );
  };

  // Get single doctor with SWR caching
  const useDoctor = (id: number | null) => {
    const key = id ? ['doctor', id] : null;

    return useSWR<ApiResponse<Doctor>>(
      key,
      () => doctorService.getDoctor(id!),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch doctor:', err);
          setError(err.message || 'Failed to fetch doctor');
        }
      }
    );
  };

  // ==================== CREATE DOCTOR WITH USER (RECOMMENDED) ====================

  /**
   * Create doctor profile with optional user creation
   * This is the recommended way to create doctors
   * Supports two modes:
   * 1. create_user=true: Creates user in SuperAdmin, then creates doctor profile
   * 2. create_user=false: Links doctor profile to existing user_id
   */
  const createDoctorWithUser = useCallback(async (doctorData: DoctorCreateWithUserData) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.createDoctorWithUser(doctorData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create doctor with user';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // ==================== CREATE DOCTOR (LEGACY) ====================

  // Create doctor (requires existing user_id)
  const createDoctor = useCallback(async (doctorData: DoctorCreateData) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.createDoctor(doctorData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Register doctor (alternative endpoint - legacy)
  const registerDoctor = useCallback(async (doctorData: DoctorRegistrationData) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.registerDoctor(doctorData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // ==================== UPDATE DOCTOR ====================

  // Update doctor (full update)
  const updateDoctor = useCallback(async (id: number, doctorData: DoctorUpdateData) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.updateDoctor(id, doctorData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Patch doctor (partial update)
  const patchDoctor = useCallback(async (id: number, doctorData: Partial<DoctorUpdateData>) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.patchDoctor(id, doctorData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // ==================== DELETE/ACTIVATE/DEACTIVATE ====================

  // Delete doctor (soft delete - sets status to inactive)
  const deleteDoctor = useCallback(async (id: number) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      await doctorService.deleteDoctor(id);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Activate doctor profile
  const activateDoctor = useCallback(async (id: number) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.activateDoctor(id);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to activate doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Deactivate doctor profile
  const deactivateDoctor = useCallback(async (id: number) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.deactivateDoctor(id);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to deactivate doctor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // ==================== DOCTOR AVAILABILITY HOOKS ====================

  // Get doctor availability with SWR caching
  const useDoctorAvailability = (doctorId: number | null) => {
    const key = doctorId ? ['doctor-availability', doctorId] : null;

    return useSWR<ApiResponse<any>>(
      key,
      () => doctorService.getDoctorAvailability(doctorId!),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch doctor availability:', err);
          setError(err.message || 'Failed to fetch doctor availability');
        }
      }
    );
  };

  // Set doctor availability
  const setDoctorAvailability = useCallback(async (doctorId: number, availabilityData: SetAvailabilityData) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await doctorService.setDoctorAvailability(doctorId, availabilityData);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to set doctor availability';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // ==================== DOCTOR STATISTICS HOOKS ====================

  // Get doctor statistics with SWR caching
  const useDoctorStatistics = () => {
    const key = ['doctor-statistics'];

    return useSWR<ApiResponse<DoctorStatistics>>(
      key,
      () => doctorService.getDoctorStatistics(),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch doctor statistics:', err);
          setError(err.message || 'Failed to fetch doctor statistics');
        }
      }
    );
  };

  // ==================== SPECIALTIES HOOKS ====================

  // Get specialties with SWR caching
  const useSpecialties = (params?: Record<string, any>) => {
    const key = ['specialties', params];

    return useSWR<PaginatedResponse<Specialty>>(
      key,
      () => doctorService.getSpecialties(params),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch specialties:', err);
          setError(err.message || 'Failed to fetch specialties');
        }
      }
    );
  };

  // Get single specialty with SWR caching
  const useSpecialty = (id: number | null) => {
    const key = id ? ['specialty', id] : null;

    return useSWR<ApiResponse<Specialty>>(
      key,
      () => doctorService.getSpecialty(id!),
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        onError: (err) => {
          console.error('Failed to fetch specialty:', err);
          setError(err.message || 'Failed to fetch specialty');
        }
      }
    );
  };

  // Create specialty
  const createSpecialty = useCallback(async (specialtyData: Partial<Specialty>) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.createSpecialty(specialtyData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create specialty';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Update specialty (full update)
  const updateSpecialty = useCallback(async (id: number, specialtyData: Partial<Specialty>) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.updateSpecialty(id, specialtyData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update specialty';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Patch specialty (partial update)
  const patchSpecialty = useCallback(async (id: number, specialtyData: Partial<Specialty>) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await doctorService.patchSpecialty(id, specialtyData);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update specialty';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  // Delete specialty
  const deleteSpecialty = useCallback(async (id: number) => {
    if (!hasHMSAccess) {
      throw new Error('HMS module not enabled for this user');
    }

    setIsLoading(true);
    setError(null);

    try {
      await doctorService.deleteSpecialty(id);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete specialty';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasHMSAccess]);

  return {
    hasHMSAccess,
    isLoading,
    error,

    // Doctors (SWR Queries)
    useDoctors,
    useDoctor,

    // Doctors (Mutations)
    createDoctorWithUser,  // RECOMMENDED - supports user creation
    createDoctor,          // Legacy - requires existing user_id
    registerDoctor,        // Legacy
    updateDoctor,
    patchDoctor,
    deleteDoctor,
    activateDoctor,
    deactivateDoctor,

    // Doctor Availability
    useDoctorAvailability,
    setDoctorAvailability,

    // Doctor Statistics
    useDoctorStatistics,

    // Specialties (SWR Queries)
    useSpecialties,
    useSpecialty,

    // Specialties (Mutations)
    createSpecialty,
    updateSpecialty,
    patchSpecialty,
    deleteSpecialty,
  };
};
