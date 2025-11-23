// src/pages/Roles.tsx
import React, { useState } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Eye } from 'lucide-react';
import { RoleListParams } from '@/types/user.types';

export const Roles: React.FC = () => {
  const {
    useRolesList,
    usePermissionsSchema,
    createRole,
    deleteRole,
    isLoading: mutationLoading,
  } = useRoles();

  const [currentPage, setCurrentPage] = useState(1);

  // Build query params
  const queryParams: RoleListParams = {
    page: currentPage,
  };

  // Fetch roles
  const {
    data: rolesData,
    error: rolesError,
    isLoading: rolesLoading,
    mutate: mutateRoles
  } = useRolesList(queryParams);

  // Fetch permissions schema
  const {
    data: permissionsSchema,
    error: schemaError,
    isLoading: schemaLoading
  } = usePermissionsSchema();

  const roles = rolesData?.results || [];
  const totalCount = rolesData?.count || 0;
  const hasNext = !!rolesData?.next;
  const hasPrevious = !!rolesData?.previous;

  // Handlers
  const handleCreate = async () => {
    try {
      const newRole = await createRole({
        name: `Test Role ${Date.now()}`,
        description: 'A test role created from the frontend',
        permissions: { crm: { leads: { view: 'team', create: true } } },
        is_active: true
      });
      console.log('Role created:', newRole);
      mutateRoles();
    } catch (error: any) {
      console.error('Create failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await deleteRole(id);
      console.log('Role deleted:', id);
      mutateRoles();
    } catch (error: any) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Roles Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage roles and permissions
          </p>
        </div>
        <Button onClick={handleCreate} size="default" disabled={mutationLoading}>
          {mutationLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Test Role
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold">{totalCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Schema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Permissions Schema</span>
            {schemaLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schemaError ? (
            <div className="text-destructive">
              <p>Error: {schemaError.message}</p>
            </div>
          ) : schemaLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs sm:text-sm">
              {JSON.stringify(permissionsSchema, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Roles List (Raw API Response)</span>
            {rolesLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rolesError ? (
            <div className="text-destructive">
              <p>Error: {rolesError.message}</p>
            </div>
          ) : rolesLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Raw JSON Display */}
              <div>
                <h3 className="font-semibold mb-2">Full API Response:</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs sm:text-sm">
                  {JSON.stringify(rolesData, null, 2)}
                </pre>
              </div>

              {/* Individual Roles */}
              <div className="space-y-3">
                <h3 className="font-semibold">Individual Roles ({roles.length}):</h3>
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-semibold text-lg">{role.name}</h4>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">ID:</span>{' '}
                              <span className="font-mono text-xs">{role.id}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>{' '}
                              <span className={role.is_active ? 'text-green-600' : 'text-red-600'}>
                                {role.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Created By:</span>{' '}
                              {role.created_by_email || role.created_by}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Members:</span>{' '}
                              {role.member_count || 0}
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-muted-foreground">Tenant:</span>{' '}
                              <span className="font-mono text-xs">{role.tenant}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Permissions:</p>
                            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(role.permissions, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => console.log('View role:', role)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(role.id)}
                            disabled={mutationLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {roles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No roles found. Click "Create Test Role" to create one.
                  </div>
                )}
              </div>

              {/* Pagination */}
              {roles.length > 0 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {roles.length} of {totalCount} role(s)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasPrevious}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasNext}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
