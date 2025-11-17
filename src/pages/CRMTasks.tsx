// src/pages/CRMTasks.tsx
import { useState, useCallback } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { useAuth } from '@/hooks/useAuth';
import { DataTable, type DataTableColumn } from '@/components/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import type {
  Task,
  TasksQueryParams,
  TaskStatusEnum,
  PriorityEnum,
  TASK_STATUS_OPTIONS,
  PRIORITY_OPTIONS
} from '@/types/crmTypes';
import type { RowActions } from '@/components/DataTable';

export const CRMTasks: React.FC = () => {
  const { user } = useAuth();
  const { hasCRMAccess, useTasks, deleteTask } = useCRM();

  // Query parameters state
  const [queryParams, setQueryParams] = useState<TasksQueryParams>({
    page: 1,
    page_size: 20,
    ordering: '-created_at',
  });

  // Fetch tasks
  const { data: tasksData, error, isLoading, mutate } = useTasks(queryParams);

  // Check access
  if (!hasCRMAccess) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">CRM Access Required</h2>
              <p className="text-gray-600">
                CRM module is not enabled for your account. Please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle delete task
  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully');
      mutate(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    }
  }, [deleteTask, mutate]);

  // Get status badge variant
  const getStatusBadge = (status: TaskStatusEnum) => {
    const statusConfig = {
      TODO: { label: 'To Do', variant: 'secondary' as const },
      IN_PROGRESS: { label: 'In Progress', variant: 'default' as const },
      COMPLETED: { label: 'Completed', variant: 'success' as const },
      CANCELLED: { label: 'Cancelled', variant: 'destructive' as const },
    };
    const config = statusConfig[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Get priority badge variant
  const getPriorityBadge = (priority: PriorityEnum) => {
    const priorityConfig = {
      LOW: { label: 'Low', variant: 'secondary' as const },
      MEDIUM: { label: 'Medium', variant: 'default' as const },
      HIGH: { label: 'High', variant: 'destructive' as const },
    };
    const config = priorityConfig[priority] || { label: priority, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Define table columns
  const columns: DataTableColumn<Task>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (task) => (
        <div className="font-medium">{task.title}</div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (task) => (
        <div className="text-sm text-muted-foreground max-w-md truncate">
          {task.description || '-'}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (task) => getStatusBadge(task.status),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (task) => getPriorityBadge(task.priority),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      sortable: true,
      render: (task) => (
        <div className="text-sm">
          {task.due_date ? (
            <>
              <div>{format(new Date(task.due_date), 'MMM dd, yyyy')}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
              </div>
            </>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (task) => (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </div>
      ),
    },
  ];

  // Define row actions
  const rowActions: RowActions<Task> = [
    {
      label: 'View',
      onClick: (task) => {
        // TODO: Implement view task modal
        toast.info('View task feature coming soon');
      },
    },
    {
      label: 'Edit',
      onClick: (task) => {
        // TODO: Implement edit task modal
        toast.info('Edit task feature coming soon');
      },
    },
    {
      label: 'Delete',
      onClick: (task) => handleDelete(task.id),
      variant: 'destructive',
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Tasks</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => toast.info('Create task feature coming soon')}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-destructive">
                <p>Failed to load tasks</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DataTable
            columns={columns}
            data={tasksData?.results || []}
            rowActions={rowActions}
            pagination={{
              page: queryParams.page || 1,
              pageSize: queryParams.page_size || 20,
              total: tasksData?.count || 0,
              onPageChange: (page) => setQueryParams({ ...queryParams, page }),
              onPageSizeChange: (pageSize) =>
                setQueryParams({ ...queryParams, page_size: pageSize, page: 1 }),
            }}
            sorting={{
              sortBy: queryParams.ordering || '-created_at',
              onSortChange: (ordering) => setQueryParams({ ...queryParams, ordering }),
            }}
            loading={isLoading}
          />
        )}
      </div>
    </div>
  );
};
