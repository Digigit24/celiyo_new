// src/pages/AdminSettings.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';

export const AdminSettings: React.FC = () => {
  // Get tenant from current session
  const { getTenant } = useAuth();
  const tenant = getTenant();
  const tenantId = tenant?.id || null;

  const { useTenantDetail } = useTenant();
  const { data: tenantData, error, isLoading, mutate } = useTenantDetail(tenantId);

  // Helper function to safely render field values (handles objects, arrays, strings)
  const renderFieldValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
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

      {/* Tenant Data Display */}
      {tenantData && (
        <>
          {/* Full Tenant Response */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Full Tenant Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs font-mono whitespace-pre-wrap">
                {JSON.stringify(tenantData, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Tenant Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm font-mono break-all">{tenantData.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{tenantData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Slug</p>
                  <p className="text-sm font-mono">{tenantData.slug}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Domain</p>
                  <p className="text-sm">{tenantData.domain}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User Count</p>
                  <p className="text-sm">{String(tenantData.user_count)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Database Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Database Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Database Name</p>
                  <p className="text-sm font-mono break-all">{tenantData.database_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Database URL</p>
                  <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                    {tenantData.database_url}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Module & Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Modules & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enabled Modules</p>
                  <pre className="text-xs font-mono break-all bg-muted p-2 rounded">
                    {renderFieldValue(tenantData.enabled_modules)}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Settings</p>
                  <pre className="text-xs font-mono break-all bg-muted p-2 rounded max-h-32 overflow-auto">
                    {renderFieldValue(tenantData.settings)}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Timestamps & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timestamps & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={tenantData.is_active ? 'default' : 'destructive'}>
                    {tenantData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trial Ends At</p>
                  <p className="text-sm">
                    {tenantData.trial_ends_at
                      ? new Date(tenantData.trial_ends_at).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-sm">
                    {new Date(tenantData.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                  <p className="text-sm">
                    {new Date(tenantData.updated_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
