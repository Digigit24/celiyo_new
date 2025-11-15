// src/pages/CRMLeads.tsx
import { useState, useCallback } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { useAuth } from '@/hooks/useAuth';
import { DataTable, type DataTableColumn } from '@/components/DataTable';
import { LeadsFormDrawer } from '@/components/LeadsFormDrawer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Building2, Phone, Mail, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import type { Lead, LeadsQueryParams, PriorityEnum } from '@/types/crmTypes';
import type { RowActions } from '@/components/DataTable';

type DrawerMode = 'view' | 'edit' | 'create';

export const CRMLeads: React.FC = () => {
  const { user, hasModuleAccess } = useAuth();
  const { hasCRMAccess, useLeads, deleteLead } = useCRM();

  // Query parameters state
  const [queryParams, setQueryParams] = useState<LeadsQueryParams>({
    page: 1,
    page_size: 20,
    ordering: '-created_at',
  });

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view');

  // Fetch leads
  const { data: leadsData, error, isLoading, mutate } = useLeads(queryParams);

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

  // Handlers
  const handleCreateLead = useCallback(() => {
    setSelectedLeadId(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  }, []);

  const handleViewLead = useCallback((lead: Lead) => {
    setSelectedLeadId(lead.id);
    setDrawerMode('view');
    setDrawerOpen(true);
  }, []);

  const handleEditLead = useCallback((lead: Lead) => {
    setSelectedLeadId(lead.id);
    setDrawerMode('edit');
    setDrawerOpen(true);
  }, []);

  const handleDeleteLead = useCallback(
    async (lead: Lead) => {
      try {
        await deleteLead(lead.id);
        toast.success(`Lead "${lead.name}" deleted successfully`);
        mutate(); // Refresh the list
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete lead');
        throw error;
      }
    },
    [deleteLead, mutate]
  );

  const handleDrawerSuccess = useCallback(() => {
    mutate(); // Refresh the list
  }, [mutate]);

  const handleModeChange = useCallback((mode: DrawerMode) => {
    setDrawerMode(mode);
  }, []);

  // Priority badge helper
  const getPriorityBadge = (priority: PriorityEnum) => {
    const variants = {
      LOW: 'bg-gray-100 text-gray-800 border-gray-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority}
      </Badge>
    );
  };

  // Status badge helper
  const getStatusBadge = (status?: { name: string; color_hex?: string; is_won: boolean; is_lost: boolean }) => {
    if (!status) return <Badge variant="outline">No Status</Badge>;

    const bgColor = status.color_hex || '#6B7280';
    const textColor = getContrastColor(bgColor);

    return (
      <Badge
        variant="outline"
        style={{
          backgroundColor: `${bgColor}20`,
          borderColor: bgColor,
          color: bgColor,
        }}
      >
        {status.name}
      </Badge>
    );
  };

  // Helper to get contrasting text color
  const getContrastColor = (hexColor: string): string => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Format currency
  const formatCurrency = (amount?: string, currency?: string) => {
    if (!amount) return '-';
    const formatted = parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency || '$'}${formatted}`;
  };

  // Desktop table columns
  const columns: DataTableColumn<Lead>[] = [
    {
      header: 'Name',
      key: 'name',
      cell: (lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{lead.name}</span>
          {lead.title && (
            <span className="text-xs text-muted-foreground">{lead.title}</span>
          )}
        </div>
      ),
      className: 'w-[200px]',
    },
    {
      header: 'Company',
      key: 'company',
      cell: (lead) => (
        <div className="flex items-center gap-2">
          {lead.company ? (
            <>
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{lead.company}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Contact',
      key: 'contact',
      cell: (lead) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{lead.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      cell: (lead) => getStatusBadge(lead.status),
    },
    {
      header: 'Priority',
      key: 'priority',
      cell: (lead) => getPriorityBadge(lead.priority),
    },
    {
      header: 'Value',
      key: 'value',
      cell: (lead) => (
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">
            {formatCurrency(lead.value_amount, lead.value_currency)}
          </span>
        </div>
      ),
      className: 'text-right',
    },
    {
      header: 'Last Updated',
      key: 'updated',
      cell: (lead) => (
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}
        </span>
      ),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (lead: Lead, actions: RowActions<Lead>) => (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{lead.name}</h3>
          {lead.title && (
            <p className="text-xs text-muted-foreground mt-0.5">{lead.title}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {getPriorityBadge(lead.priority)}
        </div>
      </div>

      {/* Company & Status */}
      <div className="flex flex-wrap items-center gap-2">
        {lead.company && (
          <div className="flex items-center gap-1.5 text-sm">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{lead.company}</span>
          </div>
        )}
        {getStatusBadge(lead.status)}
      </div>

      {/* Contact Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{lead.phone}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {/* Value */}
      {lead.value_amount && (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>{formatCurrency(lead.value_amount, lead.value_currency)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}
        </span>
        <div className="flex gap-2">
          {actions.edit && (
            <Button variant="outline" size="sm" onClick={actions.edit}>
              Edit
            </Button>
          )}
          {actions.view && (
            <Button variant="default" size="sm" onClick={actions.view}>
              View
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">CRM Leads</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your sales leads and pipeline
              </p>
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
              <Button onClick={handleCreateLead} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Lead
              </Button>
            </div>
          </div>

          {/* Stats */}
          {leadsData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {leadsData.count}
                </div>
                <div className="text-xs text-blue-800 dark:text-blue-300">Total Leads</div>
              </div>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {leadsData.results.length}
                </div>
                <div className="text-xs text-green-800 dark:text-green-300">This Page</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.ceil(leadsData.count / (queryParams.page_size || 20))}
                </div>
                <div className="text-xs text-purple-800 dark:text-purple-300">Total Pages</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {queryParams.page || 1}
                </div>
                <div className="text-xs text-orange-800 dark:text-orange-300">Current Page</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable
          rows={leadsData?.results || []}
          isLoading={isLoading}
          columns={columns}
          renderMobileCard={renderMobileCard}
          getRowId={(lead) => lead.id}
          getRowLabel={(lead) => lead.name}
          onView={handleViewLead}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          emptyTitle="No leads found"
          emptySubtitle="Get started by creating your first lead"
        />
      </div>

      {/* Pagination */}
      {leadsData && leadsData.count > 0 && (
        <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 py-3">
            <div className="flex justify-center gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={!leadsData.previous}
                onClick={() =>
                  setQueryParams((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
                }
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {queryParams.page || 1} of{' '}
                {Math.ceil(leadsData.count / (queryParams.page_size || 20))}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!leadsData.next}
                onClick={() =>
                  setQueryParams((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Drawer */}
      <LeadsFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        leadId={selectedLeadId}
        mode={drawerMode}
        onSuccess={handleDrawerSuccess}
        onDelete={(id) => {
          // Already handled in handleDeleteLead
        }}
        onModeChange={handleModeChange}
      />
    </div>
  );
};