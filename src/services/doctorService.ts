// src/services/doctorService.ts
import { hmsClient } from '@/lib/client';
import { API_CONFIG, buildQueryString } from '@/lib/apiConfig';
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

class DoctorService {
  // ==================== DOCTORS ====================

  // Get doctors with optional query parameters
  async getDoctors(params?: DoctorListParams): Promise<PaginatedResponse<Doctor>> {
    try {
      const queryString = buildQueryString(params);
      const response = await hmsClient.get<PaginatedResponse<Doctor>>(
        `${API_CONFIG.HMS.DOCTORS.PROFILES_LIST}${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch doctors';
      throw new Error(message);
    }
  }

  // Get single doctor by ID
  async getDoctor(id: number): Promise<ApiResponse<Doctor>> {
    try {
      const response = await hmsClient.get<ApiResponse<Doctor>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_DETAIL.replace(':id', id.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch doctor';
      throw new Error(message);
    }
  }

  // ==================== CREATE DOCTOR WITH USER (RECOMMENDED) ====================

  /**
   * Create doctor profile with optional user creation
   * This endpoint supports two modes:
   * 1. create_user=true: Creates user in SuperAdmin, then creates doctor profile
   * 2. create_user=false: Links doctor profile to existing user_id
   */
  async createDoctorWithUser(doctorData: DoctorCreateWithUserData): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.post<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.CREATE_WITH_USER,
        doctorData
      );
      return response.data;
    } catch (error: any) {
      // Extract error details from backend response
      const errorData = error.response?.data;

      if (errorData?.errors) {
        // Field-level errors
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to create doctor with user';
      throw new Error(message);
    }
  }

  // ==================== CREATE DOCTOR (LEGACY) ====================

  // Create new doctor (requires existing user_id)
  async createDoctor(doctorData: DoctorCreateData): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.post<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_CREATE,
        doctorData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to create doctor';
      throw new Error(message);
    }
  }

  // Register new doctor (alternative endpoint - legacy)
  async registerDoctor(doctorData: DoctorRegistrationData): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.post<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.REGISTER,
        doctorData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to register doctor';
      throw new Error(message);
    }
  }

  // ==================== UPDATE DOCTOR ====================

  // Update doctor (full update)
  async updateDoctor(id: number, doctorData: DoctorUpdateData): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.put<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_UPDATE.replace(':id', id.toString()),
        doctorData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to update doctor';
      throw new Error(message);
    }
  }

  // Partially update doctor
  async patchDoctor(id: number, doctorData: Partial<DoctorUpdateData>): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.patch<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_UPDATE.replace(':id', id.toString()),
        doctorData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to update doctor';
      throw new Error(message);
    }
  }

  // ==================== DELETE/ACTIVATE/DEACTIVATE ====================

  // Delete doctor (soft delete - sets status to inactive)
  async deleteDoctor(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await hmsClient.delete<ApiResponse<void>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_DELETE.replace(':id', id.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to delete doctor';
      throw new Error(message);
    }
  }

  // Activate doctor profile
  async activateDoctor(id: number): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.post<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_ACTIVATE.replace(':id', id.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to activate doctor';
      throw new Error(message);
    }
  }

  // Deactivate doctor profile
  async deactivateDoctor(id: number): Promise<ApiResponse<DoctorProfile>> {
    try {
      const response = await hmsClient.post<ApiResponse<DoctorProfile>>(
        API_CONFIG.HMS.DOCTORS.PROFILE_DEACTIVATE.replace(':id', id.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to deactivate doctor';
      throw new Error(message);
    }
  }

  // ==================== DOCTOR AVAILABILITY ====================

  // Get doctor availability
  async getDoctorAvailability(doctorId: number): Promise<ApiResponse<any>> {
    try {
      const response = await hmsClient.get<ApiResponse<any>>(
        API_CONFIG.HMS.DOCTORS.AVAILABILITY_LIST.replace(':id', doctorId.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch doctor availability';
      throw new Error(message);
    }
  }

  // Set doctor availability
  async setDoctorAvailability(doctorId: number, availabilityData: SetAvailabilityData): Promise<ApiResponse<any>> {
    try {
      const response = await hmsClient.post<ApiResponse<any>>(
        API_CONFIG.HMS.DOCTORS.AVAILABILITY_CREATE.replace(':id', doctorId.toString()),
        availabilityData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to set doctor availability';
      throw new Error(message);
    }
  }

  // ==================== DOCTOR STATISTICS ====================

  // Get doctor statistics
  async getDoctorStatistics(): Promise<ApiResponse<DoctorStatistics>> {
    try {
      const response = await hmsClient.get<ApiResponse<DoctorStatistics>>(
        API_CONFIG.HMS.DOCTORS.STATISTICS
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch doctor statistics';
      throw new Error(message);
    }
  }

  // ==================== SPECIALTIES ====================

  // Get specialties with optional query parameters
  async getSpecialties(params?: Record<string, any>): Promise<PaginatedResponse<Specialty>> {
    try {
      const queryString = buildQueryString(params);
      const response = await hmsClient.get<PaginatedResponse<Specialty>>(
        `${API_CONFIG.HMS.DOCTORS.SPECIALTIES_LIST}${queryString}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch specialties';
      throw new Error(message);
    }
  }

  // Get single specialty by ID
  async getSpecialty(id: number): Promise<ApiResponse<Specialty>> {
    try {
      const response = await hmsClient.get<ApiResponse<Specialty>>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_DETAIL.replace(':id', id.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to fetch specialty';
      throw new Error(message);
    }
  }

  // Create new specialty
  async createSpecialty(specialtyData: Partial<Specialty>): Promise<ApiResponse<Specialty>> {
    try {
      const response = await hmsClient.post<ApiResponse<Specialty>>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_CREATE,
        specialtyData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to create specialty';
      throw new Error(message);
    }
  }

  // Update specialty
  async updateSpecialty(id: number, specialtyData: Partial<Specialty>): Promise<ApiResponse<Specialty>> {
    try {
      const response = await hmsClient.put<ApiResponse<Specialty>>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_UPDATE.replace(':id', id.toString()),
        specialtyData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to update specialty';
      throw new Error(message);
    }
  }

  // Patch specialty
  async patchSpecialty(id: number, specialtyData: Partial<Specialty>): Promise<ApiResponse<Specialty>> {
    try {
      const response = await hmsClient.patch<ApiResponse<Specialty>>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_UPDATE.replace(':id', id.toString()),
        specialtyData
      );
      return response.data;
    } catch (error: any) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ');
        throw new Error(errorMessages);
      }

      const message = errorData?.error ||
                     errorData?.message ||
                     'Failed to update specialty';
      throw new Error(message);
    }
  }

  // Delete specialty
  async deleteSpecialty(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await hmsClient.delete<ApiResponse<void>>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_DELETE.replace(':id', id.toString())
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to delete specialty';
      throw new Error(message);
    }
  }
}

export const doctorService = new DoctorService();
