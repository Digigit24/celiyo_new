// src/components/AppointmentTypes.tsx
import React, { useState } from 'react';
import { useAppointmentType } from '@/hooks/useAppointmentType';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DataTable, DataTableColumn } from '@/components/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import type { AppointmentType, AppointmentTypeCreateData, AppointmentTypeUpdateData } from '@/types/appointmentType.types';

export const AppointmentTypes: React.FC = () => {
  const {
    useAppointmentTypes,
    createAppointmentType,
    updateAppointmentType,
    deleteAppointmentType,
  } = useAppointmentType();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    duration_default: 30,
    base_consultation_fee: '0.00',
    is_active: true,
    color: '#3b82f6',
  });

  // Fetch appointment types
  const { data: typesData, isLoading, mutate } = useAppointmentTypes({
    search: searchTerm || undefined,
    page_size: 100,
  });

  const appointmentTypes = typesData?.results || [];

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      duration_default: 30,
      base_consultation_fee: '0.00',
      is_active: true,
      color: '#3b82f6',
    });
    setSelectedType(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (type: AppointmentType) => {
    setFormData({
      name: type.name,
      code: type.code,
      description: type.description || '',
      duration_default: type.duration_default || 30,
      base_consultation_fee: type.base_consultation_fee || '0.00',
      is_active: type.is_active,
      color: type.color || '#3b82f6',
    });
    setSelectedType(type);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDelete = async (type: AppointmentType) => {
    if (window.confirm(`Are you sure you want to delete "${type.name}"? This action cannot be undone.`)) {
      try {
        await deleteAppointmentType(type.id);
        toast.success('Appointment type deleted successfully');
        mutate();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete appointment type');
      }
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (!formData.code.trim()) {
      toast.error('Please enter a code');
      return;
    }
    if (formData.duration_default < 5) {
      toast.error('Duration must be at least 5 minutes');
      return;
    }

    setIsSaving(true);
    try {
      if (dialogMode === 'create') {
        const payload: AppointmentTypeCreateData = {
          name: formData.name.trim(),
          code: formData.code.trim(),
          description: formData.description.trim() || undefined,
          duration_default: formData.duration_default,
          base_consultation_fee: formData.base_consultation_fee,
          is_active: formData.is_active,
          color: formData.color,
        };
        await createAppointmentType(payload);
        toast.success('Appointment type created successfully');
      } else if (selectedType) {
        const payload: AppointmentTypeUpdateData = {
          name: formData.name.trim(),
          code: formData.code.trim(),
          description: formData.description.trim() || undefined,
          duration_default: formData.duration_default,
          base_consultation_fee: formData.base_consultation_fee,
          is_active: formData.is_active,
          color: formData.color,
        };
        await updateAppointmentType(selectedType.id, payload);
        toast.success('Appointment type updated successfully');
      }
      mutate();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save appointment type');
    } finally {
      setIsSaving(false);
    }
  };

  // DataTable columns
  const columns: DataTableColumn<AppointmentType>[] = [
    {
      header: 'Name',
      key: 'name',
      cell: (type) => (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: type.color || '#3b82f6' }}
          />
          <span className="font-medium">{type.name}</span>
        </div>
      ),
    },
    {
      header: 'Code',
      key: 'code',
      cell: (type) => (
        <Badge variant="outline" className="font-mono">
          {type.code}
        </Badge>
      ),
    },
    {
      header: 'Description',
      key: 'description',
      cell: (type) => (
        <span className="text-sm text-muted-foreground">
          {type.description || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'is_active',
      cell: (type) => (
        <Badge variant={type.is_active ? 'default' : 'secondary'}>
          {type.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  // Mobile card renderer
  const renderMobileCard = (type: AppointmentType, actions: any) => {
    return (
      <>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: type.color || '#3b82f6' }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{type.name}</h3>
              <p className="text-xs text-muted-foreground font-mono">{type.code}</p>
            </div>
          </div>
          <Badge variant={type.is_active ? 'default' : 'secondary'} className="ml-2">
            {type.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {type.description && (
          <p className="text-sm text-muted-foreground">{type.description}</p>
        )}

        <div className="flex gap-2 pt-2">
          {actions.edit && (
            <Button size="sm" variant="outline" onClick={actions.edit} className="flex-1">
              Edit
            </Button>
          )}
          {actions.askDelete && (
            <Button size="sm" variant="destructive" onClick={actions.askDelete}>
              Delete
            </Button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Appointment Types
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage appointment type configurations
          </p>
        </div>
        <Button onClick={handleCreate} size="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search appointment types..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Appointment Types</CardTitle>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            rows={appointmentTypes}
            isLoading={isLoading}
            columns={columns}
            renderMobileCard={renderMobileCard}
            getRowId={(type) => type.id}
            getRowLabel={(type) => type.name}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyTitle="No appointment types found"
            emptySubtitle="Create your first appointment type to get started"
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create Appointment Type' : 'Edit Appointment Type'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Consultation"
              />
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                placeholder="e.g., consultation"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier (lowercase, use underscores)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this appointment type..."
                rows={3}
              />
            </div>

            {/* Duration Default */}
            <div className="space-y-2">
              <Label htmlFor="duration_default">Default Duration (minutes) *</Label>
              <Input
                id="duration_default"
                type="number"
                min="5"
                step="5"
                value={formData.duration_default}
                onChange={(e) => setFormData({ ...formData, duration_default: parseInt(e.target.value) || 30 })}
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">
                Default appointment duration in minutes
              </p>
            </div>

            {/* Base Consultation Fee */}
            <div className="space-y-2">
              <Label htmlFor="base_consultation_fee">Base Consultation Fee</Label>
              <Input
                id="base_consultation_fee"
                type="number"
                min="0"
                step="0.01"
                value={formData.base_consultation_fee}
                onChange={(e) => setFormData({ ...formData, base_consultation_fee: e.target.value })}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Default fee for this appointment type
              </p>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="font-mono flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="is_active" className="cursor-pointer">Active Status</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {dialogMode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentTypes;
