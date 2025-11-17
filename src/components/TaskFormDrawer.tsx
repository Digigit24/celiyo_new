// src/components/TaskFormDrawer.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/crmTypes';
import { useCRM } from '@/hooks/useCRM';

import TaskInfo from './task-drawer/TaskInfo';
import { SideDrawer, type DrawerActionButton, type DrawerHeaderAction } from '@/components/SideDrawer';

// Form handle interface for collecting form values
export interface TaskFormHandle {
  /** Collects current form values with validation (async) for the drawer to submit */
  getFormValues: () => Promise<CreateTaskPayload | null>;
}

interface TaskFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number | null;
  mode: 'view' | 'edit' | 'create';
  onSuccess?: () => void;
  onDelete?: (id: number) => void;
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
}

export function TaskFormDrawer({
  open,
  onOpenChange,
  taskId,
  mode,
  onSuccess,
  onDelete,
  onModeChange,
}: TaskFormDrawerProps) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const { useTask, createTask, updateTask, patchTask, deleteTask } = useCRM();

  // Fetch single task
  const { data: task, isLoading, mutate: revalidate } = useTask(taskId);

  // Form ref to collect values
  const formRef = useRef<TaskFormHandle | null>(null);

  // Sync internal mode with prop
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleSuccess = useCallback(() => {
    if (currentMode !== 'create') {
      revalidate();
    }
    onSuccess?.();
  }, [currentMode, onSuccess, revalidate]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSwitchToEdit = useCallback(() => {
    setCurrentMode('edit');
    onModeChange?.('edit');
  }, [onModeChange]);

  const handleSwitchToView = useCallback(() => {
    setCurrentMode('view');
    onModeChange?.('view');
  }, [onModeChange]);

  const handleDelete = useCallback(async () => {
    if (!taskId) return;

    if (
      window.confirm(
        'Are you sure you want to delete this task? This action cannot be undone.'
      )
    ) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
        onDelete?.(taskId);
        handleClose();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete task');
      }
    }
  }, [taskId, deleteTask, onDelete, handleClose]);

  const handleMarkComplete = useCallback(async () => {
    if (!taskId || !task) return;

    try {
      await patchTask(taskId, {
        status: 'COMPLETED',
      });
      toast.success('Task marked as completed');
      revalidate();
      handleSuccess();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to mark task as completed');
    }
  }, [taskId, task, patchTask, revalidate, handleSuccess]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const values = await formRef.current?.getFormValues();

      if (!values) {
        toast.error('Please fill in all required fields correctly');
        return;
      }

      console.log('Form values:', values);

      if (currentMode === 'create') {
        // CREATE FLOW
        await createTask(values);
        toast.success('Task created successfully');
        handleSuccess();
        handleClose();
      } else if (currentMode === 'edit') {
        // EDIT FLOW
        if (!taskId) {
          toast.error('Task ID is missing');
          return;
        }

        await updateTask(taskId, values as UpdateTaskPayload);
        toast.success('Task updated successfully');
        handleSuccess();
        handleSwitchToView();
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          'Failed to save task'
      );
    } finally {
      setIsSaving(false);
    }
  }, [currentMode, taskId, createTask, updateTask, handleSuccess, handleClose, handleSwitchToView]);

  const drawerTitle =
    currentMode === 'create'
      ? 'Create New Task'
      : task
      ? task.title
      : 'Task Details';

  const drawerDescription =
    currentMode === 'create'
      ? undefined
      : task
      ? `${task.status.replace('_', ' ')} • ${task.priority} priority`
      : undefined;

  const headerActions: DrawerHeaderAction[] =
    currentMode === 'view' && task
      ? [
          ...(task.status !== 'COMPLETED'
            ? [
                {
                  icon: CheckCircle2 as React.ComponentType<{ className?: string }>,
                  onClick: handleMarkComplete,
                  label: 'Mark as completed',
                  variant: 'ghost' as const,
                },
              ]
            : []),
          {
            icon: Pencil,
            onClick: handleSwitchToEdit,
            label: 'Edit task',
            variant: 'ghost',
          },
          {
            icon: Trash2,
            onClick: handleDelete,
            label: 'Delete task',
            variant: 'ghost',
          },
        ]
      : [];

  const footerButtons: DrawerActionButton[] =
    currentMode === 'view'
      ? [
          {
            label: 'Close',
            onClick: handleClose,
            variant: 'outline',
          },
        ]
      : currentMode === 'edit'
      ? [
          {
            label: 'Cancel',
            onClick: handleSwitchToView,
            variant: 'outline',
            disabled: isSaving,
          },
          {
            label: 'Save Changes',
            onClick: handleSave,
            variant: 'default',
            loading: isSaving,
          },
        ]
      : [
          {
            label: 'Cancel',
            onClick: handleClose,
            variant: 'outline',
            disabled: isSaving,
          },
          {
            label: 'Create Task',
            onClick: handleSave,
            variant: 'default',
            loading: isSaving,
          },
        ];

  const drawerContent = (
    <div className="space-y-6">
      <TaskInfo
        ref={formRef}
        task={task}
        mode={currentMode}
        onSuccess={handleSuccess}
      />
    </div>
  );

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={drawerTitle}
      description={drawerDescription}
      mode={currentMode}
      headerActions={headerActions}
      isLoading={isLoading && currentMode !== 'create'}
      loadingText="Loading task data..."
      size="lg"
      footerButtons={footerButtons}
      footerAlignment="right"
      showBackButton={true}
      resizable={true}
      storageKey="task-drawer-width"
      onClose={handleClose}
    >
      {drawerContent}
    </SideDrawer>
  );
}
