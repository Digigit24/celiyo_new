// src/components/opd-settings/GeneralSettingsTab.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useOPDTemplate } from '@/hooks/useOPDTemplate';
import { DataTable, type DataTableColumn } from '@/components/DataTable';
import { TemplateGroupFormDrawer } from './TemplateGroupFormDrawer';
import { TemplateListDrawer } from './TemplateListDrawer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Plus, RefreshCw, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import type { TemplateGroup, TemplateGroupsQueryParams } from '@/types/opdTemplate.types';

type DrawerMode = 'view' | 'edit' | 'create';

export const GeneralSettingsTab: React.FC = () => {
  const {
    useTemplateGroups,
    updateTemplateGroup,
    deleteTemplateGroup,
  } = useOPDTemplate();

  // Query parameters state
  const [queryParams, setQueryParams] = useState<TemplateGroupsQueryParams>({
    page: 1,
    page_size: 100,
    ordering: 'display_order',
    show_inactive: false,
  });

  // Drawer state for Template Group
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupDrawerMode, setGroupDrawerMode] = useState<DrawerMode>('view');

  // Drawer state for Templates
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [selectedGroupForTemplates, setSelectedGroupForTemplates] = useState<number | null>(null);

  // Fetch template groups
  const { data: groupsData, error, isLoading, mutate } = useTemplateGroups(queryParams);

  // Handlers for Template Group CRUD
  const handleCreateGroup = useCallback(() => {
    setSelectedGroupId(null);
    setGroupDrawerMode('create');
    setGroupDrawerOpen(true);
  }, []);

  const handleViewGroup = useCallback((group: TemplateGroup) => {
    setSelectedGroupId(group.id);
    setGroupDrawerMode('view');
    setGroupDrawerOpen(true);
  }, []);

  const handleEditGroup = useCallback((group: TemplateGroup) => {
    setSelectedGroupId(group.id);
    setGroupDrawerMode('edit');
    setGroupDrawerOpen(true);
  }, []);

  const handleDeleteGroup = useCallback(
    async (group: TemplateGroup) => {
      try {
        await deleteTemplateGroup(group.id);
        toast.success(`Template group "${group.name}" deleted successfully`);
        mutate(); // Refresh the list
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete template group');
      }
    },
    [deleteTemplateGroup, mutate]
  );

  const handleToggleActive = useCallback(
    async (group: TemplateGroup) => {
      try {
        await updateTemplateGroup(group.id, { is_active: !group.is_active });
        toast.success(
          `Template group "${group.name}" ${!group.is_active ? 'activated' : 'deactivated'}`
        );
        mutate(); // Refresh the list
      } catch (error: any) {
        toast.error(error.message || 'Failed to update template group');
      }
    },
    [updateTemplateGroup, mutate]
  );

  const handleViewTemplates = useCallback((group: TemplateGroup) => {
    setSelectedGroupForTemplates(group.id);
    setTemplateDrawerOpen(true);
  }, []);

  const handleGroupDrawerClose = useCallback(() => {
    setGroupDrawerOpen(false);
    setSelectedGroupId(null);
  }, []);

  const handleGroupDrawerSuccess = useCallback(() => {
    mutate(); // Refresh the list
    handleGroupDrawerClose();
  }, [mutate, handleGroupDrawerClose]);

  const handleTemplateDrawerClose = useCallback(() => {
    setTemplateDrawerOpen(false);
    setSelectedGroupForTemplates(null);
  }, []);

  // Define columns for desktop table
  const columns: DataTableColumn<TemplateGroup>[] = useMemo(
    () => [
      {
        header: 'Name',
        key: 'name',
        cell: (group) => (
          <div>
            <div className="font-medium">{group.name}</div>
            {group.description && (
              <div className="text-sm text-muted-foreground">{group.description}</div>
            )}
          </div>
        ),
      },
      {
        header: 'Display Order',
        key: 'display_order',
        cell: (group) => <span className="text-sm">{group.display_order}</span>,
        className: 'text-center',
      },
      {
        header: 'Status',
        key: 'is_active',
        cell: (group) => (
          <Badge variant={group.is_active ? 'default' : 'secondary'}>
            {group.is_active ? 'Active' : 'Inactive'}
          </Badge>
        ),
        className: 'text-center',
      },
      {
        header: 'Updated',
        key: 'updated_at',
        cell: (group) => (
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(group.updated_at), { addSuffix: true })}
          </span>
        ),
      },
    ],
    []
  );

  // Render mobile card
  const renderMobileCard = useCallback(
    (group: TemplateGroup, actions: any) => (
      <div className="p-4 border rounded-lg space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium">{group.name}</div>
            {group.description && (
              <div className="text-sm text-muted-foreground mt-1">{group.description}</div>
            )}
          </div>
          <Badge variant={group.is_active ? 'default' : 'secondary'}>
            {group.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Order: {group.display_order}</span>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(group.updated_at), { addSuffix: true })}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => handleViewTemplates(group)}>
            <FileText className="h-4 w-4 mr-1" />
            Templates
          </Button>
          {actions.view && (
            <Button size="sm" variant="outline" onClick={actions.view}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {actions.edit && (
            <Button size="sm" variant="outline" onClick={actions.edit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {actions.askDelete && (
            <Button size="sm" variant="outline" onClick={actions.askDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    ),
    [handleViewTemplates]
  );

  // Extra actions in dropdown
  const extraActions = useCallback(
    (group: TemplateGroup) => (
      <>
        <DropdownMenuItem onClick={() => handleViewTemplates(group)}>
          <FileText className="mr-2 h-4 w-4" />
          View Templates
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleActive(group)}>
          {group.is_active ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
      </>
    ),
    [handleViewTemplates, handleToggleActive]
  );

  return (
    <div className="space-y-6">
      {/* Page Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Template Groups</h2>
          <p className="text-muted-foreground">
            Manage template groups for different specialties and visit types
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutate()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Template Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={groupsData?.results || []}
            isLoading={isLoading}
            columns={columns}
            renderMobileCard={renderMobileCard}
            getRowId={(group) => group.id}
            getRowLabel={(group) => group.name}
            onView={handleViewGroup}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            extraActions={extraActions}
            emptyTitle="No template groups found"
            emptySubtitle="Create your first template group to get started"
          />
        </CardContent>
      </Card>

      {/* Template Group Form Drawer */}
      <TemplateGroupFormDrawer
        open={groupDrawerOpen}
        onOpenChange={setGroupDrawerOpen}
        mode={groupDrawerMode}
        groupId={selectedGroupId}
        onSuccess={handleGroupDrawerSuccess}
        onClose={handleGroupDrawerClose}
      />

      {/* Template List Drawer */}
      <TemplateListDrawer
        open={templateDrawerOpen}
        onOpenChange={setTemplateDrawerOpen}
        groupId={selectedGroupForTemplates}
        onClose={handleTemplateDrawerClose}
      />
    </div>
  );
};
