// src/components/LeadsFormDrawer.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Trash2, Phone, Mail, Building2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

import type { Lead, CreateLeadPayload, UpdateLeadPayload } from '@/types/crmTypes';
import { useCRM } from '@/hooks/useCRM';

import LeadBasicInfo from './lead-drawer/LeadBasicInfo';
import LeadAddressInfo from './lead-drawer/LeadAddressInfo';
import LeadActivities from './lead-drawer/LeadActivities';
import LeadCustomFields from './lead-drawer/LeadCustomFields';
import { SideDrawer, type DrawerActionButton, type DrawerHeaderAction } from '@/components/SideDrawer';

// Form handle interface for collecting form values
export interface LeadFormHandle {
  /** Collects current form values with validation (async) for the drawer to submit */
  getFormValues: () => Promise<CreateLeadPayload | null>;
}

export interface PartialLeadFormHandle {
  /** Collects partial form values (for optional sections like address) */
  getFormValues: () => Promise<Partial<CreateLeadPayload> | null>;
}


interface LeadsFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: number | null;
  mode: 'view' | 'edit' | 'create';
  onSuccess?: () => void;
  onDelete?: (id: number) => void;
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
}

export function LeadsFormDrawer({
  open,
  onOpenChange,
  leadId,
  mode,
  onSuccess,
  onDelete,
  onModeChange,
}: LeadsFormDrawerProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [currentMode, setCurrentMode] = useState(mode);
  const [isSaving, setIsSaving] = useState(false);

  // Hooks
  const { useLead, createLead, updateLead, deleteLead } = useCRM();
  const { data: lead, isLoading, error, mutate: revalidate } = useLead(leadId);

  // Form refs to collect values
  const basicInfoRef = useRef<LeadFormHandle | null>(null);
  const addressInfoRef = useRef<PartialLeadFormHandle | null>(null);
  const customFieldsRef = useRef<PartialLeadFormHandle | null>(null);

  // Sync internal mode with prop
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Reset tab when opening
  useEffect(() => {
    if (open) {
      setActiveTab('basic');
    }
  }, [open]);

  const handleSuccess = useCallback(() => {
    if (currentMode !== 'create') {
      revalidate();
    }
    onSuccess?.();
  }, [currentMode, onSuccess, revalidate]);

  const handleClose = useCallback(() => {
    setActiveTab('basic');
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
    if (!leadId) return;

    if (
      window.confirm(
        `Are you sure you want to delete "${lead?.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteLead(leadId);
        toast.success('Lead deleted successfully');
        onDelete?.(leadId);
        handleClose();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete lead');
      }
    }
  }, [leadId, lead, deleteLead, onDelete, handleClose]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Collect values from all form tabs
      const basicValues = await basicInfoRef.current?.getFormValues();
      const addressValues = await addressInfoRef.current?.getFormValues();
      const customFieldsValues = await customFieldsRef.current?.getFormValues();

      if (!basicValues) {
        toast.error('Please fill in all required fields correctly');
        setActiveTab('basic');
        return;
      }

      // Merge all form values
      const allValues: CreateLeadPayload = {
        ...basicValues,
        ...addressValues,
        ...customFieldsValues,
      };

      console.log('Form values:', allValues);

      if (currentMode === 'create') {
        // CREATE FLOW
        await createLead(allValues);
        toast.success('Lead created successfully');
        handleSuccess();
        handleClose();
      } else if (currentMode === 'edit') {
        // EDIT FLOW
        if (!leadId) {
          toast.error('Lead ID is missing');
          return;
        }

        await updateLead(leadId, allValues as UpdateLeadPayload);
        toast.success('Lead updated successfully');
        handleSuccess();
        handleSwitchToView();
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(
        error?.response?.data?.detail ||
          error?.message ||
          'Failed to save lead'
      );
    } finally {
      setIsSaving(false);
    }
  }, [currentMode, leadId, createLead, updateLead, handleSuccess, handleClose, handleSwitchToView]);

  const drawerTitle =
    currentMode === 'create'
      ? 'Create New Lead'
      : lead?.name || 'Lead Details';

  const drawerDescription =
    currentMode === 'create'
      ? undefined
      : lead
      ? `${lead.phone}${lead.company ? ` • ${lead.company}` : ''}`
      : undefined;

  const headerActions: DrawerHeaderAction[] =
    currentMode === 'view' && lead
      ? [
          {
            icon: Phone,
            onClick: () => window.open(`tel:${lead.phone}`, '_self'),
            label: 'Call lead',
            variant: 'ghost',
          },
          ...(lead.email
            ? [
                {
                  icon: Mail as React.ComponentType<{ className?: string }>,
                  onClick: () => window.open(`mailto:${lead.email}`, '_self'),
                  label: 'Email lead',
                  variant: 'ghost' as const,
                },
              ]
            : []),
          {
            icon: Pencil,
            onClick: handleSwitchToEdit,
            label: 'Edit lead',
            variant: 'ghost',
          },
          {
            icon: Trash2,
            onClick: handleDelete,
            label: 'Delete lead',
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
            label: 'Create Lead',
            onClick: handleSave,
            variant: 'default',
            loading: isSaving,
          },
        ];

  const drawerContent = (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="custom">Custom Fields</TabsTrigger>
          <TabsTrigger value="activities" disabled={currentMode === 'create'}>
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6 space-y-6">
          <LeadBasicInfo
            ref={basicInfoRef}
            lead={lead}
            mode={currentMode}
            onSuccess={handleSuccess}
          />
        </TabsContent>

        <TabsContent value="address" className="mt-6 space-y-6">
          <LeadAddressInfo
            ref={addressInfoRef}
            lead={lead}
            mode={currentMode}
          />
        </TabsContent>

        <TabsContent value="custom" className="mt-6 space-y-6">
          <LeadCustomFields
            ref={customFieldsRef}
            lead={lead}
            mode={currentMode}
          />
        </TabsContent>

        <TabsContent value="activities" className="mt-6 space-y-6">
          {leadId && <LeadActivities leadId={leadId} />}
        </TabsContent>
      </Tabs>
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
      isLoading={isLoading}
      loadingText="Loading lead data..."
      size="lg"
      footerButtons={footerButtons}
      footerAlignment="right"
      showBackButton={true}
      resizable={true}
      storageKey="lead-drawer-width"
      onClose={handleClose}
    >
      {drawerContent}
    </SideDrawer>
  );
}