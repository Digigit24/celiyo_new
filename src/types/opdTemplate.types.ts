// src/types/opdTemplate.types.ts

// ==================== TEMPLATE GROUP ====================
export interface TemplateGroup {
  id: number;
  tenant_id: string;
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateGroupPayload {
  name: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateTemplateGroupPayload {
  name?: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface TemplateGroupsQueryParams {
  show_inactive?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

export interface TemplateGroupsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TemplateGroup[];
}

// ==================== TEMPLATE ====================
export interface Template {
  id: number;
  tenant_id: string;
  name: string;
  code: string;
  group: number;
  group_name?: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  fields?: TemplateField[];
}

export interface CreateTemplatePayload {
  name: string;
  code: string;
  group: number;
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateTemplatePayload {
  name?: string;
  code?: string;
  group?: number;
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface TemplatesQueryParams {
  group?: number;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

export interface TemplatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Template[];
}

// ==================== TEMPLATE FIELD ====================
export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime'
  | 'checkbox'
  | 'select'
  | 'radio'
  | 'multiselect'
  | 'email'
  | 'phone'
  | 'url';

export interface TemplateField {
  id: number;
  tenant_id: string;
  template: number;
  field_type: FieldType;
  field_label: string;
  field_name: string;
  field_key: string;
  placeholder?: string;
  help_text?: string;
  is_required: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  default_value?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  options?: TemplateFieldOption[];
}

export interface CreateTemplateFieldPayload {
  template: number;
  field_type: FieldType;
  field_label: string;
  field_name: string;
  field_key: string;
  placeholder?: string;
  help_text?: string;
  is_required?: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  default_value?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateTemplateFieldPayload {
  field_type?: FieldType;
  field_label?: string;
  field_name?: string;
  field_key?: string;
  placeholder?: string;
  help_text?: string;
  is_required?: boolean;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  pattern?: string;
  default_value?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface TemplateFieldsQueryParams {
  template?: number;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface TemplateFieldsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TemplateField[];
}

// ==================== TEMPLATE FIELD OPTION ====================
export interface TemplateFieldOption {
  id: number;
  tenant_id: string;
  field: number;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateFieldOptionPayload {
  field: number;
  label: string;
  value: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateTemplateFieldOptionPayload {
  label?: string;
  value?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface TemplateFieldOptionsQueryParams {
  field?: number;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface TemplateFieldOptionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TemplateFieldOption[];
}
