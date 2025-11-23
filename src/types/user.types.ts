// User Types

// Role interface
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Record<string, any>;
  is_active: boolean;
}

// User interface
export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  tenant: string;
  tenant_name?: string;
  roles: Role[];
  is_super_admin: boolean;
  profile_picture?: string | null;
  timezone?: string;
  is_active: boolean;
  date_joined: string;
}

// User list query parameters
export interface UserListParams {
  search?: string;
  is_active?: boolean;
  role?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
}

// User create data
export interface UserCreateData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
  timezone?: string;
  tenant?: string;
  role_ids?: string[];
}

// User update data
export interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  timezone?: string;
  is_active?: boolean;
  profile_picture?: string | null;
}

// Assign roles data
export interface AssignRolesData {
  role_ids: string[];
}

// Remove role data
export interface RemoveRoleData {
  role_id: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API response wrapper
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}
