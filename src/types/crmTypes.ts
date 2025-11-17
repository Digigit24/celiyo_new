// CRM Types based on Django models

export enum PriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum ActivityTypeEnum {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  NOTE = 'NOTE',
  SMS = 'SMS',
  OTHER = 'OTHER'
}

export enum TaskStatusEnum {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface LeadStatus {
  id: number;
  tenant_id: string;
  name: string;
  order_index: number;
  color_hex?: string;
  is_won: boolean;
  is_lost: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: number;
  tenant_id: string;
  lead: number;
  type: ActivityTypeEnum;
  content?: string;
  happened_at: string;
  by_user_id: string;
  meta?: Record<string, any>;
  file_url?: string;
  created_at: string;
}

export interface LeadOrder {
  id: number;
  tenant_id: string;
  lead: number;
  status: number;
  position: string; // DecimalField as string
  board_id?: number;
  updated_at: string;
}

export interface Task {
  id: number;
  tenant_id: string;
  title: string;
  description?: string;
  status: TaskStatusEnum;
  priority: PriorityEnum;
  due_date?: string;
  assigned_to_user_id?: string;
  lead?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  tenant_id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  title?: string;
  status?: LeadStatus | number; // Can be either LeadStatus object or number ID
  status_name?: string; // From serializer
  priority: PriorityEnum;
  value_amount?: string; // DecimalField as string
  value_currency?: string;
  source?: string;
  owner_user_id: string;
  last_contacted_at?: string;
  next_follow_up_at?: string;
  notes?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
  activities?: LeadActivity[]; // From serializer
}

// API Response Types
export interface LeadsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Lead[];
}

export interface LeadStatusesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LeadStatus[];
}

export interface LeadActivitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LeadActivity[];
}

export interface LeadOrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LeadOrder[];
}

export interface TasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

// Query Parameters Types
export interface LeadsQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: number;
  priority?: PriorityEnum;
  owner_user_id?: string;
  created_at__gte?: string;
  created_at__lte?: string;
  created_at?: string;
  updated_at__gte?: string;
  updated_at__lte?: string;
  next_follow_up_at__gte?: string;
  next_follow_up_at__lte?: string;
  next_follow_up_at__isnull?: boolean;
  city?: string;
  city__icontains?: string;
  state?: string;
  state__icontains?: string;
  country?: string;
  country__icontains?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface LeadStatusesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_won?: boolean;
  is_lost?: boolean;
  is_active?: boolean;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface LeadActivitiesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  lead?: number;
  type?: ActivityTypeEnum;
  by_user_id?: string;
  happened_at?: string;
  happened_at__gte?: string;
  happened_at__lte?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface LeadOrdersQueryParams {
  page?: number;
  page_size?: number;
  lead?: number;
  status?: number;
  board_id?: number;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface TasksQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: TaskStatusEnum;
  priority?: PriorityEnum;
  assigned_to_user_id?: string;
  lead?: number;
  due_date?: string;
  due_date__gte?: string;
  due_date__lte?: string;
  created_at__gte?: string;
  created_at__lte?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
}

// Create/Update Types
export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  title?: string;
  status?: number;
  priority?: PriorityEnum;
  value_amount?: string;
  value_currency?: string;
  source?: string;
  owner_user_id?: string;
  last_contacted_at?: string;
  next_follow_up_at?: string;
  notes?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {}

export interface CreateLeadStatusPayload {
  name: string;
  order_index: number;
  color_hex?: string;
  is_won?: boolean;
  is_lost?: boolean;
  is_active?: boolean;
}

export interface UpdateLeadStatusPayload extends Partial<CreateLeadStatusPayload> {}

export interface CreateLeadActivityPayload {
  lead: number;
  type: ActivityTypeEnum;
  content?: string;
  happened_at: string;
  by_user_id?: string;
  meta?: Record<string, any>;
  file_url?: string;
}

export interface UpdateLeadActivityPayload extends Partial<CreateLeadActivityPayload> {}

export interface CreateLeadOrderPayload {
  lead: number;
  status: number;
  position: string;
  board_id?: number;
}

export interface UpdateLeadOrderPayload extends Partial<CreateLeadOrderPayload> {}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatusEnum;
  priority?: PriorityEnum;
  due_date?: string;
  assigned_to_user_id?: string;
  lead?: number;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

// Filter and Sort Options
export const PRIORITY_OPTIONS = [
  { value: PriorityEnum.LOW, label: 'Low' },
  { value: PriorityEnum.MEDIUM, label: 'Medium' },
  { value: PriorityEnum.HIGH, label: 'High' }
];

export const ACTIVITY_TYPE_OPTIONS = [
  { value: ActivityTypeEnum.CALL, label: 'Call' },
  { value: ActivityTypeEnum.EMAIL, label: 'Email' },
  { value: ActivityTypeEnum.MEETING, label: 'Meeting' },
  { value: ActivityTypeEnum.NOTE, label: 'Note' },
  { value: ActivityTypeEnum.SMS, label: 'SMS' },
  { value: ActivityTypeEnum.OTHER, label: 'Other' }
];

export const LEAD_ORDERING_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: '-name', label: 'Name (Z-A)' },
  { value: 'created_at', label: 'Created (Oldest)' },
  { value: '-created_at', label: 'Created (Newest)' },
  { value: 'updated_at', label: 'Updated (Oldest)' },
  { value: '-updated_at', label: 'Updated (Newest)' },
  { value: 'priority', label: 'Priority (Low to High)' },
  { value: '-priority', label: 'Priority (High to Low)' },
  { value: 'value_amount', label: 'Value (Low to High)' },
  { value: '-value_amount', label: 'Value (High to Low)' },
  { value: 'next_follow_up_at', label: 'Follow-up (Earliest)' },
  { value: '-next_follow_up_at', label: 'Follow-up (Latest)' }
];

export const LEAD_STATUS_ORDERING_OPTIONS = [
  { value: 'order_index', label: 'Order (First to Last)' },
  { value: '-order_index', label: 'Order (Last to First)' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: '-name', label: 'Name (Z-A)' },
  { value: 'created_at', label: 'Created (Oldest)' },
  { value: '-created_at', label: 'Created (Newest)' },
  { value: 'updated_at', label: 'Updated (Oldest)' },
  { value: '-updated_at', label: 'Updated (Newest)' },
  { value: 'is_active', label: 'Active First' },
  { value: '-is_active', label: 'Inactive First' }
];

export const LEAD_ACTIVITY_ORDERING_OPTIONS = [
  { value: '-happened_at', label: 'Most Recent First' },
  { value: 'happened_at', label: 'Oldest First' },
  { value: 'type', label: 'Type (A-Z)' },
  { value: '-type', label: 'Type (Z-A)' },
  { value: 'created_at', label: 'Created (Oldest)' },
  { value: '-created_at', label: 'Created (Newest)' }
];

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatusEnum.TODO, label: 'To Do' },
  { value: TaskStatusEnum.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatusEnum.COMPLETED, label: 'Completed' },
  { value: TaskStatusEnum.CANCELLED, label: 'Cancelled' }
];

export const TASK_ORDERING_OPTIONS = [
  { value: 'due_date', label: 'Due Date (Earliest)' },
  { value: '-due_date', label: 'Due Date (Latest)' },
  { value: 'priority', label: 'Priority (Low to High)' },
  { value: '-priority', label: 'Priority (High to Low)' },
  { value: 'created_at', label: 'Created (Oldest)' },
  { value: '-created_at', label: 'Created (Newest)' },
  { value: 'updated_at', label: 'Updated (Oldest)' },
  { value: '-updated_at', label: 'Updated (Newest)' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: '-title', label: 'Title (Z-A)' },
  { value: 'status', label: 'Status (A-Z)' },
  { value: '-status', label: 'Status (Z-A)' }
];