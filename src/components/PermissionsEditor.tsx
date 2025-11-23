// src/components/PermissionsEditor.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionsEditorProps {
  schema: Record<string, any>;
  value: Record<string, any>;
  onChange: (permissions: Record<string, any>) => void;
  disabled?: boolean;
}

export const PermissionsEditor: React.FC<PermissionsEditorProps> = ({
  schema,
  value = {},
  onChange,
  disabled = false,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());

  // Initialize with all modules and resources expanded
  useEffect(() => {
    const modules = Object.keys(schema);
    setExpandedModules(new Set(modules));

    const resources: string[] = [];
    modules.forEach((module) => {
      if (schema[module]?.resources) {
        Object.keys(schema[module].resources).forEach((resource) => {
          resources.push(`${module}.${resource}`);
        });
      }
    });
    setExpandedResources(new Set(resources));
  }, [schema]);

  const toggleModule = (moduleKey: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleKey)) {
        newSet.delete(moduleKey);
      } else {
        newSet.add(moduleKey);
      }
      return newSet;
    });
  };

  const toggleResource = (resourceKey: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resourceKey)) {
        newSet.delete(resourceKey);
      } else {
        newSet.add(resourceKey);
      }
      return newSet;
    });
  };

  const updatePermission = (
    moduleKey: string,
    resourceKey: string,
    actionKey: string,
    actionValue: boolean | string
  ) => {
    const newPermissions = { ...value };

    // Initialize nested structure if it doesn't exist
    if (!newPermissions[moduleKey]) {
      newPermissions[moduleKey] = {};
    }
    if (!newPermissions[moduleKey][resourceKey]) {
      newPermissions[moduleKey][resourceKey] = {};
    }

    // Set the permission value
    newPermissions[moduleKey][resourceKey][actionKey] = actionValue;

    onChange(newPermissions);
  };

  const getPermissionValue = (
    moduleKey: string,
    resourceKey: string,
    actionKey: string
  ): boolean | string | undefined => {
    return value?.[moduleKey]?.[resourceKey]?.[actionKey];
  };

  const renderAction = (
    moduleKey: string,
    resourceKey: string,
    actionKey: string,
    actionConfig: any
  ) => {
    const currentValue = getPermissionValue(moduleKey, resourceKey, actionKey);

    if (actionConfig.type === 'boolean') {
      return (
        <div key={actionKey} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded">
          <Label htmlFor={`${moduleKey}-${resourceKey}-${actionKey}`} className="text-sm capitalize cursor-pointer">
            {actionKey.replace(/_/g, ' ')}
          </Label>
          <Checkbox
            id={`${moduleKey}-${resourceKey}-${actionKey}`}
            checked={currentValue === true}
            onCheckedChange={(checked) => {
              updatePermission(moduleKey, resourceKey, actionKey, checked === true);
            }}
            disabled={disabled}
          />
        </div>
      );
    }

    if (actionConfig.type === 'scope') {
      return (
        <div key={actionKey} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded">
          <Label htmlFor={`${moduleKey}-${resourceKey}-${actionKey}`} className="text-sm capitalize">
            {actionKey.replace(/_/g, ' ')}
          </Label>
          <div className="flex items-center gap-2">
            <Select
              value={typeof currentValue === 'string' && currentValue !== '' ? currentValue : undefined}
              onValueChange={(newValue) => {
                updatePermission(moduleKey, resourceKey, actionKey, newValue);
              }}
              disabled={disabled}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                {actionConfig.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    <span className="capitalize">{option}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Clear button */}
            {currentValue && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  // Remove the permission by deleting the key
                  const newPermissions = { ...value };
                  if (newPermissions[moduleKey]?.[resourceKey]) {
                    delete newPermissions[moduleKey][resourceKey][actionKey];
                    onChange(newPermissions);
                  }
                }}
                disabled={disabled}
              >
                <span className="sr-only">Clear</span>
                ×
              </Button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (!schema || Object.keys(schema).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading permissions schema...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(schema).map(([moduleKey, moduleConfig]: [string, any]) => {
        const isModuleExpanded = expandedModules.has(moduleKey);

        return (
          <Card key={moduleKey}>
            <CardHeader className="py-3 px-4 cursor-pointer" onClick={() => toggleModule(moduleKey)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isModuleExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <CardTitle className="text-base">{moduleConfig.label || moduleKey}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Object.keys(moduleConfig.resources || {}).length} resources
                </Badge>
              </div>
            </CardHeader>

            {isModuleExpanded && (
              <CardContent className="px-4 pb-4 space-y-3">
                {Object.entries(moduleConfig.resources || {}).map(
                  ([resourceKey, resourceConfig]: [string, any]) => {
                    const resourceFullKey = `${moduleKey}.${resourceKey}`;
                    const isResourceExpanded = expandedResources.has(resourceFullKey);

                    return (
                      <div key={resourceKey} className="border rounded-lg">
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleResource(resourceFullKey)}
                        >
                          <div className="flex items-center gap-2">
                            {isResourceExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                            <span className="font-medium text-sm">
                              {resourceConfig.label || resourceKey}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {Object.keys(resourceConfig.actions || {}).length} actions
                          </Badge>
                        </div>

                        {isResourceExpanded && (
                          <div className="border-t px-3 pb-2 space-y-1">
                            {Object.entries(resourceConfig.actions || {}).map(
                              ([actionKey, actionConfig]: [string, any]) =>
                                renderAction(moduleKey, resourceKey, actionKey, actionConfig)
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
