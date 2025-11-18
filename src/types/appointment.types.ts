// src/types/appointment.types.ts

export interface Doctor {
  id: number;
  full_name: string;
  specialties: Array<{
    id: number;
    name: string;
    code: string;
  }>;
  consultation_fee: string;
}

export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
}

export interface Appointment {
  id: number;
  appointment_number: string;
  doctor: Doctor;
  patient: Patient;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  appointment_type: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  consultation_mode: 'online' | 'offline';
  reason_for_visit?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  fee_amount: string;
  payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded';
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  is_follow_up: boolean;
  parent_appointment_id?: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentListParams {
  doctor_id?: number;
  patient_id?: number;
  appointment_date?: string;
  appointment_type?: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';
  status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  consultation_mode?: 'online' | 'offline';
  payment_status?: 'pending' | 'paid' | 'partially_paid' | 'refunded';
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface AppointmentCreateData {
  doctor_id: number;
  patient_id: number;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  appointment_type: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';
  consultation_mode: 'online' | 'offline';
  reason_for_visit?: string;
  symptoms?: string;
  notes?: string;
  fee_amount?: number;
  is_follow_up?: boolean;
  parent_appointment_id?: number;
}

export interface AppointmentUpdateData {
  appointment_date?: string;
  appointment_time?: string;
  duration_minutes?: number;
  appointment_type?: 'consultation' | 'follow_up' | 'emergency' | 'routine_checkup';
  status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  consultation_mode?: 'online' | 'offline';
  reason_for_visit?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  fee_amount?: number;
  payment_status?: 'pending' | 'paid' | 'partially_paid' | 'refunded';
}

export interface AppointmentCancelData {
  cancellation_reason: string;
}

export interface AppointmentRescheduleData {
  new_appointment_date: string;
  new_appointment_time: string;
  reason?: string;
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
