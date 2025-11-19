// ==================== DOCTOR TYPES ====================
// Types matching Django HMS backend exactly

// ==================== SPECIALTY ====================
export interface Specialty {
  id: number;
  name: string;
  code: string;
  description: string | null;
  department: string | null;
  is_active: boolean;
  doctors_count: number;
  created_at: string;
  updated_at: string;
}

// ==================== DOCTOR AVAILABILITY ====================
export interface DoctorAvailability {
  id?: number;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  day_display?: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_appointments: number;
  created_at?: string;
  updated_at?: string;
}

// ==================== DOCTOR PROFILE ====================
export interface DoctorProfile {
  id: number;

  // Tenant & User (from backend)
  tenant_id?: string;  // UUID - auto-populated by backend
  user_id: string;     // UUID - SuperAdmin user ID

  // License Information
  medical_license_number: string;
  license_issuing_authority: string | null;
  license_issue_date: string | null;
  license_expiry_date: string | null;
  is_license_valid: boolean | null;

  // Professional Information
  qualifications: string | null;
  specialties: Specialty[];
  years_of_experience: number;

  // Consultation Settings
  consultation_fee: string;  // Decimal from backend
  follow_up_fee: string;     // Decimal from backend
  consultation_duration: number;
  is_available_online: boolean;
  is_available_offline: boolean;

  // Status
  status: 'active' | 'on_leave' | 'inactive';

  // Statistics (read-only)
  average_rating: string;
  total_reviews: number;
  total_consultations: number;

  // Additional
  signature: string | null;
  languages_spoken: string | null;

  // Availability (optional)
  availability?: DoctorAvailability[];

  // Timestamps
  created_at: string;
  updated_at: string;
}

// ==================== CREATE DOCTOR WITH USER ====================
// Matches DoctorWithUserCreationSerializer from backend

export interface DoctorCreateWithUserData {
  // User Creation Mode
  create_user: boolean;

  // User fields (required if create_user=true)
  user_id?: string;  // UUID - required if create_user=false
  email?: string;
  password?: string;
  password_confirm?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  timezone?: string;
  role_ids?: string[];  // Array of UUIDs

  // Doctor Profile fields (required)
  medical_license_number: string;
  license_issuing_authority: string;
  license_issue_date: string;
  license_expiry_date: string;
  qualifications: string;
  specialty_ids?: number[];
  years_of_experience?: number;
  consultation_fee?: number;
  follow_up_fee?: number;
  consultation_duration?: number;
  is_available_online?: boolean;
  is_available_offline?: boolean;
  status?: 'active' | 'on_leave' | 'inactive';
  signature?: string;
  languages_spoken?: string;
}

// ==================== CREATE/UPDATE DOCTOR ====================
// Matches DoctorProfileCreateUpdateSerializer from backend

export interface DoctorCreateData {
  user_id: string;  // UUID - required
  medical_license_number: string;
  license_issuing_authority: string;
  license_issue_date: string;
  license_expiry_date: string;
  qualifications: string;
  specialty_ids?: number[];
  years_of_experience?: number;
  consultation_fee?: number;
  follow_up_fee?: number;
  consultation_duration?: number;
  is_available_online?: boolean;
  is_available_offline?: boolean;
  status?: 'active' | 'on_leave' | 'inactive';
  signature?: string;
  languages_spoken?: string;
}

export interface DoctorUpdateData {
  medical_license_number?: string;
  license_issuing_authority?: string;
  license_issue_date?: string;
  license_expiry_date?: string;
  qualifications?: string;
  specialty_ids?: number[];
  years_of_experience?: number;
  consultation_fee?: number;
  follow_up_fee?: number;
  consultation_duration?: number;
  is_available_online?: boolean;
  is_available_offline?: boolean;
  status?: 'active' | 'on_leave' | 'inactive';
  signature?: string;
  languages_spoken?: string;
}

// ==================== DOCTOR REGISTRATION ====================
// Matches DoctorRegistrationSerializer from backend
// (Note: This seems to be a legacy endpoint - prefer create_with_user)

export interface DoctorRegistrationData {
  user_id: string;  // UUID
  medical_license_number: string;
  license_issuing_authority: string;
  license_issue_date: string;
  license_expiry_date: string;
  qualifications: string;
  specialty_ids?: number[];
  years_of_experience?: number;
  consultation_fee?: number;
  consultation_duration?: number;
  is_available_online?: boolean;
  is_available_offline?: boolean;
  status?: 'active' | 'on_leave' | 'inactive';
  signature?: string;
  languages_spoken?: string;
}

// ==================== DOCTOR AVAILABILITY ====================

export interface SetAvailabilityData {
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  is_available: boolean;
  max_appointments: number;
}

// ==================== QUERY PARAMS ====================

export interface DoctorListParams {
  // Filters
  specialty?: string;
  status?: 'active' | 'on_leave' | 'inactive';
  available?: boolean;
  city?: string;
  min_rating?: number;
  min_fee?: number;
  max_fee?: number;

  // Search & Pagination
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;

  [key: string]: string | number | boolean | undefined;
}

// ==================== DOCTOR STATISTICS ====================

export interface DoctorStatistics {
  total_doctors: number;
  active_doctors: number;
  on_leave_doctors: number;
  inactive_doctors: number;
  average_rating: number;
  average_experience: number;
  average_consultation_fee: number;
  generated_at: string;
}

// ==================== API RESPONSES ====================

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
  error?: string;
  errors?: Record<string, string[]>;
}

// ==================== LEGACY SUPPORT ====================
// For backward compatibility with existing code

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface Doctor {
  id: number;
  user_id: string;  // Changed from user object to user_id

  // Include all DoctorProfile fields
  medical_license_number: string;
  license_issuing_authority: string | null;
  license_issue_date: string | null;
  license_expiry_date: string | null;
  is_license_valid: boolean | null;
  qualifications: string | null;
  specialties: Specialty[];
  years_of_experience: number;
  consultation_fee: string;
  follow_up_fee: string;
  consultation_duration: number;
  is_available_online: boolean;
  is_available_offline: boolean;
  average_rating: string;
  total_reviews: number;
  total_consultations: number;
  status: 'active' | 'on_leave' | 'inactive';
  signature: string | null;
  languages_spoken: string | null;
  availability?: DoctorAvailability[];
  created_at: string;
  updated_at: string;

  // Computed properties (optional)
  full_name?: string;
}
