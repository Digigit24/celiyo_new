// src/pages/CRMTasks.tsx
import { useState, useCallback } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { useAuth } from '@/hooks/useAuth';
import { DataTable, type DataTableColumn, type RowActions } from '@/components/DataTable';
import { TaskFormDrawer } from '@/components/TaskFormDrawer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, CheckSquare, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import type {
  Task,
  TasksQueryParams,
  TaskStatusEnum,
  PriorityEnum,
} from '@/types/crmTypes';

type DrawerMode = 'view' | 'edit' | 'create';

export const CRMTasks: React.FC = () => {
  const { user } = useAuth();
  const { hasCRMAccess, useTasks, deleteTask } = useCRM();

  // Query parameters state
  const [queryParams, setQueryParams] = useState<TasksQueryParams>({
    page: 1,
    page_size: 20,
    ordering: '-created_at',
  });

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view');

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

  // Drawer handlers
  const handleCreateTask = useCallback(() => {
    setSelectedTaskId(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  }, []);

  const handleViewTask = useCallback((task: Task) => {
    setSelectedTaskId(task.id);
    setDrawerMode('view');
    setDrawerOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTaskId(task.id);
    setDrawerMode('edit');
    setDrawerOpen(true);
  }, []);

  const handleDrawerSuccess = useCallback(() => {
    mutate(); // Refresh the list
  }, [mutate]);

  const handleDrawerDelete = useCallback(() => {
    mutate(); // Refresh the list
  }, [mutate]);

  // Handle delete task (from DataTable)
  const handleDeleteTask = useCallback(async (task: Task) => {
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
      mutate(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
      throw err; // Re-throw so DataTable knows it failed
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

  // Desktop table columns
  const columns: DataTableColumn<Task>[] = [
    {
      header: 'Title',
      key: 'title',
      cell: (task) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{task.title}</span>
          {task.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {task.description}
            </span>
          )}
        </div>
      ),
      className: 'w-[250px]',
    },
    {
      header: 'Status',
      key: 'status',
      cell: (task) => getStatusBadge(task.status),
    },
    {
      header: 'Priority',
      key: 'priority',
      cell: (task) => getPriorityBadge(task.priority),
    },
    {
      header: 'Due Date',
      key: 'due_date',
      cell: (task) => (
        <div className="text-sm">
          {task.due_date ? (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-col">
                <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Assigned To',
      key: 'assigned_to',
      cell: (task) => (
        <div className="text-sm">
          {task.assigned_to_user_id ? (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-mono">{task.assigned_to_user_id}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Created',
      key: 'created_at',
      cell: (task) => (
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
        </span>
      ),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (task: Task, actions: RowActions<Task>) => (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{task.title}</h3>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {getStatusBadge(task.status)}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Priority:</span>
          {getPriorityBadge(task.priority)}
        </div>
        {task.due_date && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Due:</span>
            <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
          </div>
        )}
        {task.assigned_to_user_id && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Assigned:</span>
            <span className="font-mono text-xs">{task.assigned_to_user_id}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Created:</span>
          <span className="text-xs">
            {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t">
        {actions.view && (
          <Button variant="outline" size="sm" onClick={actions.view} className="flex-1">
            View
          </Button>
        )}
        {actions.edit && (
          <Button variant="outline" size="sm" onClick={actions.edit} className="flex-1">
            Edit
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
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
              <Button size="sm" onClick={handleCreateTask}>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {error ? (
            <div className="p-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-destructive">
                    <p>Failed to load tasks</p>
                    <p className="text-sm mt-2">{error}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <DataTable
              rows={tasksData?.results || []}
              isLoading={isLoading}
              columns={columns}
              renderMobileCard={renderMobileCard}
              getRowId={(task) => task.id}
              getRowLabel={(task) => task.title}
              onView={handleViewTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              emptyTitle="No tasks found"
              emptySubtitle="Get started by creating your first task"
            />
          )}
        </div>

        {/* Pagination */}
        {tasksData && tasksData.count > 0 && (
          <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 py-3">
              <div className="flex justify-center gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!tasksData.previous}
                  onClick={() =>
                    setQueryParams((prev) => ({
                      ...prev,
                      page: (prev.page || 1) - 1,
                    }))
                  }
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {queryParams.page || 1} of{' '}
                  {Math.ceil(tasksData.count / (queryParams.page_size || 20))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!tasksData.next}
                  onClick={() =>
                    setQueryParams((prev) => ({
                      ...prev,
                      page: (prev.page || 1) + 1,
                    }))
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Form Drawer */}
      <TaskFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        taskId={selectedTaskId}
        mode={drawerMode}
        onSuccess={handleDrawerSuccess}
        onDelete={handleDrawerDelete}
        onModeChange={setDrawerMode}
      />
    </>
  );
};
