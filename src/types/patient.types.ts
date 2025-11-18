// src/types/patient.types.ts

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Patient {
  id: number;
  user: User;
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  allergies?: string;
  medical_history?: string;
  is_active: boolean;
  registration_date: string;
  last_visit_date?: string;
  total_visits: number;
  created_at: string;
  updated_at: string;
}

export interface PatientListParams {
  gender?: 'male' | 'female' | 'other';
  blood_group?: string;
  is_active?: boolean;
  city?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface PatientCreateData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  allergies?: string;
  medical_history?: string;
}

export interface PatientUpdateData {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  allergies?: string;
  medical_history?: string;
  is_active?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
