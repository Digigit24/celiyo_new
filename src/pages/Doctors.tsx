// src/pages/Doctors.tsx
import React, { useState } from 'react';
import { useDoctor } from '@/hooks/useDoctor';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { DoctorListParams } from '@/types/doctor.types';

export const Doctors: React.FC = () => {
  const { user, hasModuleAccess } = useAuth();
  const { hasHMSAccess, useDoctors, useSpecialties, useDoctorStatistics } = useDoctor();
  
  // Query parameters state
  const [queryParams, setQueryParams] = useState<DoctorListParams>({
    page: 1,
    search: ''
  });

  // Fetch doctors, specialties, and statistics
  const { data: doctorsData, error: doctorsError, isLoading: doctorsLoading, mutate: mutateDoctors } = useDoctors(queryParams);
  const { data: specialtiesData, error: specialtiesError, isLoading: specialtiesLoading, mutate: mutateSpecialties } = useSpecialties({
    is_active: true
  });
  const { data: statisticsData, error: statisticsError, isLoading: statisticsLoading, mutate: mutateStatistics } = useDoctorStatistics();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">HMS Doctors API Test</h1>
          <p className="text-gray-600">
            Tenant: {user?.tenant.name || 'N/A'} | User: {user?.email}
          </p>
          <p className="text-sm text-gray-500">
            Tenant ID: {user?.tenant.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => mutateStatistics()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Stats
          </Button>
          <Button onClick={() => mutateSpecialties()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Specialties
          </Button>
          <Button onClick={() => mutateDoctors()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Doctors
          </Button>
        </div>
      </div>

      {/* Doctor Statistics API Response */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Statistics API Response</CardTitle>
        </CardHeader>
        <CardContent>
          {statisticsLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading statistics...</span>
            </div>
          )}
          
          {statisticsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
              <p className="text-red-600">{statisticsError.message}</p>
            </div>
          )}
          
          {statisticsData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success!</h3>
                <p className="text-green-600">
                  Retrieved doctor statistics
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">API Endpoint:</h3>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                  GET /api/doctors/profiles/statistics/
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-96 border border-gray-200">
                  {JSON.stringify(statisticsData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specialties API Response */}
      <Card>
        <CardHeader>
          <CardTitle>Specialties API Response</CardTitle>
        </CardHeader>
        <CardContent>
          {specialtiesLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading specialties...</span>
            </div>
          )}
          
          {specialtiesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
              <p className="text-red-600">{specialtiesError.message}</p>
            </div>
          )}
          
          {specialtiesData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success!</h3>
                <p className="text-green-600">
                  Retrieved {specialtiesData.count} specialt{specialtiesData.count === 1 ? 'y' : 'ies'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">API Endpoint:</h3>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                  GET /api/doctors/specialties/?is_active=true
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-96 border border-gray-200">
                  {JSON.stringify(specialtiesData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctors API Response */}
      <Card>
        <CardHeader>
          <CardTitle>Doctors API Response</CardTitle>
        </CardHeader>
        <CardContent>
          {doctorsLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading doctors...</span>
            </div>
          )}
          
          {doctorsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
              <p className="text-red-600">{doctorsError.message}</p>
            </div>
          )}
          
          {doctorsData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">✅ Success!</h3>
                <p className="text-green-600">
                  Retrieved {doctorsData.results.length} doctor(s) out of {doctorsData.count} total
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{doctorsData.count}</div>
                  <div className="text-sm text-blue-800">Total Doctors</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{doctorsData.results.length}</div>
                  <div className="text-sm text-green-800">Current Page</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">
                    {doctorsData.results.filter(d => d.status === 'active').length}
                  </div>
                  <div className="text-sm text-purple-800">Active Doctors</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">
                    {doctorsData.results.filter(d => d.is_available_online).length}
                  </div>
                  <div className="text-sm text-orange-800">Online Available</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">API Endpoint:</h3>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                  GET /api/doctors/profiles/?page={queryParams.page}&search={queryParams.search}
                </code>
              </div>

              {/* Pagination Controls */}
              {doctorsData.count > 0 && (
                <div className="flex justify-center gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!doctorsData.previous}
                    onClick={() => setQueryParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {queryParams.page || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!doctorsData.next}
                    onClick={() => setQueryParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Raw Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs max-h-96 border border-gray-200">
                  {JSON.stringify(doctorsData, null, 2)}
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
              <span className="font-semibold">HMS Access:</span>
              <span className={hasHMSAccess ? 'text-green-600 font-semibold' : 'text-red-600'}>
                {hasHMSAccess ? '✅ Granted' : '❌ Denied'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};