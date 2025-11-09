// src/pages/CRMLeads.tsx
import React, { useState } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { LeadsQueryParams } from '@/types/crmTypes';

export const CRMLeads: React.FC = () => {
  const { user, hasModuleAccess } = useAuth();
  const { hasCRMAccess, useLeads, useLeadStatuses } = useCRM();
  
  // Query parameters state
  const [queryParams, setQueryParams] = useState<LeadsQueryParams>({
    page: 1,
    page_size: 20,
    ordering: '-created_at'
  });

  // Fetch leads and statuses
  const { data: leadsData, error: leadsError, isLoading: leadsLoading, mutate: mutateLeads } = useLeads(queryParams);
  const { data: statusesData, error: statusesError, isLoading: statusesLoading, mutate: mutateStatuses } = useLeadStatuses({
    is_active: true,
    ordering: 'order_index'
  });

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CRM API Test</h1>
          <p className="text-gray-600">
            Tenant: {user?.tenant.name || 'N/A'} | User: {user?.email}
          </p>
          <p className="text-sm text-gray-500">
            Tenant ID: {user?.tenant.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => mutateStatuses()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Statuses
          </Button>
          <Button onClick={() => mutateLeads()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Leads
          </Button>
        </div>
      </div>

      {/* Lead Statuses API Response */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Statuses API Response</CardTitle>
        </CardHeader>
        <CardContent>
          {statusesLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading statuses...</span>
            </div>
          )}
          
          {statusesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
              <p className="text-red-600">{statusesError.message}</p>
            </div>
          )}
          
          {statusesData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success!</h3>
                <p className="text-green-600">
                  Retrieved {statusesData.count} lead status(es)
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">API Endpoint:</h3>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                  GET /api/crm/statuses/?is_active=true&ordering=order_index
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-96 border border-gray-200">
                  {JSON.stringify(statusesData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads API Response */}
      <Card>
        <CardHeader>
          <CardTitle>Leads API Response</CardTitle>
        </CardHeader>
        <CardContent>
          {leadsLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading leads...</span>
            </div>
          )}
          
          {leadsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
              <p className="text-red-600">{leadsError.message}</p>
            </div>
          )}
          
          {leadsData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success!</h3>
                <p className="text-green-600">
                  Retrieved {leadsData.results.length} lead(s) out of {leadsData.count} total
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{leadsData.count}</div>
                  <div className="text-sm text-blue-800">Total Leads</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{leadsData.results.length}</div>
                  <div className="text-sm text-green-800">Current Page</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.ceil(leadsData.count / (queryParams.page_size || 20))}
                  </div>
                  <div className="text-sm text-purple-800">Total Pages</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">{queryParams.page || 1}</div>
                  <div className="text-sm text-orange-800">Current Page</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">API Endpoint:</h3>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                  GET /api/crm/leads/?page={queryParams.page}&page_size={queryParams.page_size}&ordering={queryParams.ordering}
                </code>
              </div>

              {/* Pagination Controls */}
              {leadsData.count > 0 && (
                <div className="flex justify-center gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!leadsData.previous}
                    onClick={() => setQueryParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {queryParams.page || 1} of {Math.ceil(leadsData.count / (queryParams.page_size || 20))}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!leadsData.next}
                    onClick={() => setQueryParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-96 border border-gray-200">
                  {JSON.stringify(leadsData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Query Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Current Query Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm border border-gray-200">
            {JSON.stringify(queryParams, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Authentication Info */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">User ID:</span>
              <span className="font-mono text-xs">{user?.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Tenant ID:</span>
              <span className="font-mono text-xs">{user?.tenant.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Tenant Name:</span>
              <span>{user?.tenant.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Tenant Slug:</span>
              <span>{user?.tenant.slug}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Enabled Modules:</span>
              <span>{user?.tenant.enabled_modules.join(', ')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">CRM Access:</span>
              <span className={hasCRMAccess ? 'text-green-600 font-semibold' : 'text-red-600'}>
                {hasCRMAccess ? '✅ Granted' : '❌ Denied'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};