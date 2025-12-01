// src/pages/AdminSettings.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Loader2, AlertCircle, Save, Building2, Database, Settings as SettingsIcon, Image as ImageIcon, X } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { TenantUpdateData, TenantImage } from '@/types/tenant.types';

export const AdminSettings: React.FC = () => {
  // Get tenant from current session
  const { getTenant } = useAuth();
  const tenant = getTenant();
  const tenantId = tenant?.id || null;

  const {
    useTenantDetail,
    useTenantImages,
    updateTenant,
    uploadTenantImage,
    deleteTenantImage,
    isLoading: isMutating
  } = useTenant();

  const { data: tenantData, error, isLoading, mutate } = useTenantDetail(tenantId);
  const { data: tenantImages, mutate: mutateImages } = useTenantImages(tenantId);

  // Form state for basic information
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [domain, setDomain] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [trialEndsAt, setTrialEndsAt] = useState('');

  // Form state for database configuration
  const [databaseName, setDatabaseName] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');

  // Form state for modules
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [newModule, setNewModule] = useState('');

  // Form state for settings (JSON)
  const [settingsJson, setSettingsJson] = useState('{}');

  // Image upload state
  const [imageLabel, setImageLabel] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form with tenant data
  useEffect(() => {
    if (tenantData) {
      setName(tenantData.name || '');
      setSlug(tenantData.slug || '');
      setDomain(tenantData.domain || '');
      setIsActive(tenantData.is_active ?? true);
      setTrialEndsAt(tenantData.trial_ends_at ? new Date(tenantData.trial_ends_at).toISOString().split('T')[0] : '');
      setDatabaseName(tenantData.database_name || '');
      setDatabaseUrl(tenantData.database_url || '');
      setEnabledModules(tenantData.enabled_modules || []);
      setSettingsJson(JSON.stringify(tenantData.settings || {}, null, 2));
    }
  }, [tenantData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddModule = () => {
    if (newModule.trim() && !enabledModules.includes(newModule.trim())) {
      setEnabledModules([...enabledModules, newModule.trim()]);
      setNewModule('');
    }
  };

  const handleRemoveModule = (module: string) => {
    setEnabledModules(enabledModules.filter(m => m !== module));
  };

  const handleUploadImage = async () => {
    if (!imageFile || !imageLabel.trim() || !tenantId) {
      toast.error('Please provide both an image and a label');
      return;
    }

    try {
      await uploadTenantImage(tenantId, {
        image: imageFile,
        label: imageLabel.trim(),
        description: imageDescription.trim() || undefined,
      });

      toast.success('Image uploaded successfully');
      setImageFile(null);
      setImagePreview('');
      setImageLabel('');
      setImageDescription('');
      mutateImages();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!tenantId) return;

    try {
      await deleteTenantImage(tenantId, imageId);
      toast.success('Image deleted successfully');
      mutateImages();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete image');
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error('No tenant ID found');
      return;
    }

    try {
      // Parse settings JSON
      let parsedSettings = {};
      try {
        parsedSettings = JSON.parse(settingsJson);
      } catch (e) {
        toast.error('Invalid JSON in settings field');
        return;
      }

      const updateData: TenantUpdateData = {
        name,
        slug,
        domain: domain || null,
        database_name: databaseName || null,
        database_url: databaseUrl || null,
        enabled_modules: enabledModules,
        settings: parsedSettings,
        is_active: isActive,
        trial_ends_at: trialEndsAt || null,
      };

      await updateTenant(tenantId, updateData);
      toast.success('Tenant settings saved successfully');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save tenant settings');
    }
  };

  // Show error if no tenant ID is found
  if (!tenantId) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Tenant Configuration & System Information
            </p>
          </div>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              No Tenant Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Unable to retrieve tenant information from your session. Please try logging in again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tenant Configuration & System Information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tenantData && (
            <Badge variant={tenantData.is_active ? 'default' : 'destructive'} className="w-fit">
              {tenantData.is_active ? 'Active' : 'Inactive'}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Loading Tenant Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error.message || 'Failed to load tenant data'}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Tenant ID: {tenantId}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && !tenantData && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground">Loading tenant data...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tenant Settings Forms */}
      {tenantData && (
        <div className="space-y-6 max-w-6xl">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tenant Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter tenant name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="tenant-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trialEndsAt">Trial Ends At</Label>
                  <Input
                    id="trialEndsAt"
                    type="date"
                    value={trialEndsAt}
                    onChange={(e) => setTrialEndsAt(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <div className="flex items-center gap-2 h-10">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="isActive" className="font-normal cursor-pointer">
                      Active
                    </Label>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>ID: <span className="font-mono">{tenantData.id}</span></p>
                {tenantData.user_count !== undefined && (
                  <p>User Count: {tenantData.user_count}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Database Configuration Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle className="text-lg">Database Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="databaseName">Database Name</Label>
                <Input
                  id="databaseName"
                  placeholder="Neon database name"
                  value={databaseName}
                  onChange={(e) => setDatabaseName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="databaseUrl">Database URL</Label>
                <Textarea
                  id="databaseUrl"
                  placeholder="postgresql://..."
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                  rows={3}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Enabled Modules Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                <CardTitle className="text-lg">Enabled Modules</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {enabledModules.map((module) => (
                  <Badge key={module} variant="secondary" className="px-3 py-1">
                    {module}
                    <button
                      onClick={() => handleRemoveModule(module)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {enabledModules.length === 0 && (
                  <p className="text-sm text-muted-foreground">No modules enabled</p>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add module (e.g., crm, whatsapp, hms)"
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddModule()}
                />
                <Button onClick={handleAddModule} variant="outline">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings JSON Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                <CardTitle className="text-lg">Tenant Settings (JSON)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings">Settings Configuration</Label>
                <Textarea
                  id="settings"
                  placeholder='{"key": "value"}'
                  value={settingsJson}
                  onChange={(e) => setSettingsJson(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter valid JSON configuration. This will be merged with tenant-specific settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Images Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <CardTitle className="text-lg">Tenant Images</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload New Image */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium text-sm">Upload New Image</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageLabel">Label *</Label>
                    <Input
                      id="imageLabel"
                      placeholder="e.g., logo, banner, profile"
                      value={imageLabel}
                      onChange={(e) => setImageLabel(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageDescription">Description</Label>
                    <Input
                      id="imageDescription"
                      placeholder="Optional description"
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageFile">Image File</Label>
                  <div className="flex items-start gap-3">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer flex-1"
                    />
                    {imagePreview && (
                      <div className="w-16 h-16 border rounded overflow-hidden bg-background flex items-center justify-center flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleUploadImage}
                  disabled={!imageFile || !imageLabel.trim() || isMutating}
                  size="sm"
                >
                  {isMutating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-2" />
                  )}
                  Upload Image
                </Button>
              </div>

              {/* Existing Images */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Existing Images</h3>
                {tenantImages && tenantImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tenantImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-3 space-y-2">
                        <div className="aspect-video bg-muted rounded overflow-hidden flex items-center justify-center">
                          <img
                            src={image.image}
                            alt={image.label}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{image.label}</Badge>
                            {image.is_active && (
                              <Badge variant="default" className="text-xs">Active</Badge>
                            )}
                          </div>
                          {image.description && (
                            <p className="text-xs text-muted-foreground">{image.description}</p>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(image.id)}
                            disabled={isMutating}
                            className="w-full"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end sticky bottom-4 z-10">
            <Button
              onClick={handleSave}
              size="lg"
              className="shadow-lg"
              disabled={isMutating}
            >
              {isMutating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
