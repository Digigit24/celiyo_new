// src/components/task-drawer/TaskInfo.tsx
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { Task, CreateTaskPayload, TaskStatusEnum, PriorityEnum } from '@/types/crmTypes';
import type { TaskFormHandle } from '../TaskFormDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useCRM } from '@/hooks/useCRM';
import { TASK_STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/types/crmTypes';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  due_date: z.string().optional(),
  assigned_to_user_id: z.string().optional(),
  lead: z.number().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskInfoProps {
  task?: Task | null;
  mode: 'view' | 'edit' | 'create';
  onSuccess?: () => void;
}

const TaskInfo = forwardRef<TaskFormHandle, TaskInfoProps>(
  ({ task, mode, onSuccess }, ref) => {
    const { user } = useAuth();
    const { useLeads } = useCRM();
    const isReadOnly = mode === 'view';
    const [leadOpen, setLeadOpen] = useState(false);

    // Fetch all leads for the dropdown
    const { data: leadsData, isLoading: leadsLoading } = useLeads({
      page: 1,
      page_size: 1000,
      ordering: 'name',
    });

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<TaskFormData>({
      resolver: zodResolver(taskSchema),
      defaultValues: {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        due_date: '',
        assigned_to_user_id: user?.id || '',
        lead: undefined,
      },
    });

    useEffect(() => {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          due_date: task.due_date || '',
          assigned_to_user_id: task.assigned_to_user_id || user?.id || '',
          lead: task.lead || undefined,
        });
      } else if (mode === 'create') {
        reset({
          title: '',
          description: '',
          status: 'TODO',
          priority: 'MEDIUM',
          due_date: '',
          assigned_to_user_id: user?.id || '',
          lead: undefined,
        });
      }
    }, [task, mode, reset, user?.id]);

    useImperativeHandle(ref, () => ({
      getFormValues: async (): Promise<CreateTaskPayload | null> => {
        return new Promise((resolve) => {
          handleSubmit(
            (data) => {
              const cleanData: CreateTaskPayload = {
                title: data.title,
                description: data.description || undefined,
                status: data.status as TaskStatusEnum,
                priority: data.priority as PriorityEnum,
                due_date: data.due_date || undefined,
                assigned_to_user_id: data.assigned_to_user_id || undefined,
                lead: data.lead || undefined,
              };
              resolve(cleanData);
            },
            () => {
              resolve(null);
            }
          )();
        });
      },
    }));

    return (
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className={errors.title ? 'text-destructive' : ''}>
            Title <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="title"
                placeholder="Enter task title..."
                disabled={isReadOnly}
                className={errors.title ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="description"
                placeholder="Enter task description..."
                rows={4}
                disabled={isReadOnly}
              />
            )}
          />
          <p className="text-xs text-muted-foreground">
            Detailed description of the task
          </p>
        </div>

        {/* Status and Priority in a row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className={errors.status ? 'text-destructive' : ''}>
              Status <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isReadOnly}
                >
                  <SelectTrigger id="status" className={errors.status ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className={errors.priority ? 'text-destructive' : ''}>
              Priority <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isReadOnly}
                >
                  <SelectTrigger id="priority" className={errors.priority ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={isReadOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(new Date(field.value), 'PPP')
                      : 'Pick a due date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date.toISOString());
                      } else {
                        field.onChange('');
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          <p className="text-xs text-muted-foreground">
            Optional due date for this task
          </p>
        </div>

        {/* Lead - SEARCHABLE Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="lead">Associated Lead</Label>
          <Controller
            name="lead"
            control={control}
            render={({ field }) => (
              <Popover open={leadOpen} onOpenChange={setLeadOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={leadOpen}
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={isReadOnly || leadsLoading}
                  >
                    {field.value && leadsData?.results ? (
                      (() => {
                        const selectedLead = leadsData.results.find(l => l.id === field.value);
                        return selectedLead ? (
                          <div className="flex items-center gap-2 flex-1 text-left truncate">
                            <span className="font-medium">{selectedLead.name}</span>
                            {selectedLead.company && (
                              <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground text-sm truncate">
                                  {selectedLead.company}
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          `Lead #${field.value}`
                        );
                      })()
                    ) : (
                      <span>{leadsLoading ? 'Loading leads...' : 'Select lead (optional)...'}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search leads..." />
                    <CommandEmpty>
                      {leadsLoading ? 'Loading...' : 'No leads found.'}
                    </CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {/* Clear selection option */}
                      {field.value && (
                        <CommandItem
                          onSelect={() => {
                            field.onChange(undefined);
                            setLeadOpen(false);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4 opacity-0" />
                          <span className="text-muted-foreground italic">Clear selection</span>
                        </CommandItem>
                      )}
                      {leadsData?.results.map((lead) => (
                        <CommandItem
                          key={lead.id}
                          value={`${lead.name} ${lead.company || ''} ${lead.phone}`}
                          onSelect={() => {
                            field.onChange(lead.id);
                            setLeadOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === lead.id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lead.name}</span>
                              <span className="text-xs text-muted-foreground">#{lead.id}</span>
                            </div>
                            {lead.company && (
                              <span className="text-xs text-muted-foreground">{lead.company}</span>
                            )}
                            {lead.phone && (
                              <span className="text-xs text-muted-foreground">{lead.phone}</span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          <p className="text-xs text-muted-foreground">
            Link this task to a specific lead (optional)
          </p>
        </div>

        {/* Assigned To */}
        <div className="space-y-2">
          <Label htmlFor="assigned_to_user_id">Assigned To (User ID)</Label>
          <Controller
            name="assigned_to_user_id"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="assigned_to_user_id"
                placeholder="User ID"
                disabled={isReadOnly}
              />
            )}
          />
          <p className="text-xs text-muted-foreground">
            User ID of the person assigned to this task
          </p>
        </div>

        {/* View Mode: Display metadata */}
        {mode === 'view' && task && (
          <div className="space-y-2 pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between py-1">
                <span>Created:</span>
                <span>{format(new Date(task.created_at), 'PPP p')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Last Updated:</span>
                <span>{format(new Date(task.updated_at), 'PPP p')}</span>
              </div>
              {task.completed_at && (
                <div className="flex justify-between py-1">
                  <span>Completed:</span>
                  <span>{format(new Date(task.completed_at), 'PPP p')}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span>Tenant ID:</span>
                <span className="font-mono">{task.tenant_id}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Task ID:</span>
                <span className="font-mono">#{task.id}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TaskInfo.displayName = 'TaskInfo';

export default TaskInfo;
