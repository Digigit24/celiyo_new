// src/services/specialty.service.ts
import { hmsClient } from '@/lib/client';
import { API_CONFIG, buildQueryString } from '@/lib/apiConfig';
import {
  Specialty,
  SpecialtyListParams,
  SpecialtyCreateData,
  SpecialtyUpdateData,
  PaginatedResponse,
  ApiResponse
} from '@/types/specialty.types';

class SpecialtyService {
  // ==================== SPECIALTIES ====================

  // Get specialties with optional query parameters
  async getSpecialties(params?: SpecialtyListParams): Promise<PaginatedResponse<Specialty>> {
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
  async getSpecialty(id: number): Promise<Specialty> {
    try {
      const response = await hmsClient.get<Specialty>(
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
  async createSpecialty(specialtyData: SpecialtyCreateData): Promise<Specialty> {
    try {
      const response = await hmsClient.post<Specialty>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_CREATE,
        specialtyData
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to create specialty';
      throw new Error(message);
    }
  }

  // Update specialty (full update)
  async updateSpecialty(id: number, specialtyData: SpecialtyUpdateData): Promise<Specialty> {
    try {
      const response = await hmsClient.put<Specialty>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_UPDATE.replace(':id', id.toString()),
        specialtyData
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to update specialty';
      throw new Error(message);
    }
  }

  // Partially update specialty (patch)
  async patchSpecialty(id: number, specialtyData: Partial<SpecialtyUpdateData>): Promise<Specialty> {
    try {
      const response = await hmsClient.patch<Specialty>(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_UPDATE.replace(':id', id.toString()),
        specialtyData
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to update specialty';
      throw new Error(message);
    }
  }

  // Delete specialty
  async deleteSpecialty(id: number): Promise<void> {
    try {
      await hmsClient.delete(
        API_CONFIG.HMS.DOCTORS.SPECIALTY_DELETE.replace(':id', id.toString())
      );
    } catch (error: any) {
      const message = error.response?.data?.error ||
                     error.response?.data?.message ||
                     'Failed to delete specialty';
      throw new Error(message);
    }
  }
}

export const specialtyService = new SpecialtyService();
