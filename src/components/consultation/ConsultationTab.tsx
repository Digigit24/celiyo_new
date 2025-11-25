// src/components/consultation/ConsultationTab.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Printer, Save, Loader2 } from 'lucide-react';
import { OpdVisit } from '@/types/opdVisit.types';
import { toast } from 'sonner';
import { useOPDTemplate } from '@/hooks/useOPDTemplate';
import type { Template, TemplateField } from '@/types/opdTemplate.types';

interface ConsultationTabProps {
  visit: OpdVisit;
}

export const ConsultationTab: React.FC<ConsultationTabProps> = ({ visit }) => {
  const { useTemplateGroups, useTemplates, useTemplateFields } = useOPDTemplate();
  const [mode, setMode] = useState<'entry' | 'preview'>('entry');
  const [selectedTemplateGroup, setSelectedTemplateGroup] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Fetch template groups
  const { data: groupsData, isLoading: isLoadingGroups } = useTemplateGroups({
    show_inactive: false,
    ordering: 'display_order',
  });

  // Fetch templates for selected group
  const { data: templatesData, isLoading: isLoadingTemplates } = useTemplates({
    group: selectedTemplateGroup ? parseInt(selectedTemplateGroup) : undefined,
    is_active: true,
    ordering: 'display_order',
  });

  // Fetch fields for selected template
  const { data: fieldsData, isLoading: isLoadingFields } = useTemplateFields({
    template: selectedTemplate ? parseInt(selectedTemplate) : undefined,
    is_active: true,
    ordering: 'display_order',
  });

  // Reset template selection when group changes
  useEffect(() => {
    setSelectedTemplate('');
    setFormData({});
  }, [selectedTemplateGroup]);

  // Reset form data when template changes
  useEffect(() => {
    setFormData({});
  }, [selectedTemplate]);

  // Log fetched data
  useEffect(() => {
    if (groupsData) {
      console.log('Template Groups:', groupsData);
    }
  }, [groupsData]);

  useEffect(() => {
    if (templatesData) {
      console.log('Templates:', templatesData);
    }
  }, [templatesData]);

  useEffect(() => {
    if (fieldsData) {
      console.log('Template Fields:', fieldsData);
    }
  }, [fieldsData]);

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    toast.success('Consultation saved successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const renderField = (field: TemplateField) => {
    const value = formData[field.field_key] || '';

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.field_key}
              type={field.field_type === 'email' ? 'email' : field.field_type === 'phone' ? 'tel' : field.field_type === 'url' ? 'url' : 'text'}
              placeholder={field.placeholder || ''}
              value={value}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
              required={field.is_required}
              minLength={field.min_length}
              maxLength={field.max_length}
              pattern={field.pattern}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.field_key}
              placeholder={field.placeholder || ''}
              value={value}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
              required={field.is_required}
              minLength={field.min_length}
              maxLength={field.max_length}
              rows={4}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.field_key}
              type="number"
              placeholder={field.placeholder || ''}
              value={value}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
              required={field.is_required}
              min={field.min_value}
              max={field.max_value}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.field_key}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
              required={field.is_required}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'datetime':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.field_key}
              type="datetime-local"
              value={value}
              onChange={(e) => handleFieldChange(field.field_key, e.target.value)}
              required={field.is_required}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.field_key}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.field_key, checked)}
            />
            <Label htmlFor={field.field_key} className="cursor-pointer">
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.help_text && (
              <p className="text-xs text-muted-foreground ml-2">({field.help_text})</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.field_key}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.field_key, val)}
            >
              <SelectTrigger id={field.field_key}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options && field.options.length > 0 ? (
                  field.options
                    .filter(opt => opt.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No options available</div>
                )}
              </SelectContent>
            </Select>
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => handleFieldChange(field.field_key, val)}
            >
              {field.options && field.options.length > 0 ? (
                field.options
                  .filter(opt => opt.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${field.field_key}-${option.value}`} />
                      <Label htmlFor={`${field.field_key}-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">No options available</p>
              )}
            </RadioGroup>
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {field.options && field.options.length > 0 ? (
                field.options
                  .filter(opt => opt.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((option) => {
                    const selectedValues = value || [];
                    const isChecked = selectedValues.includes(option.value);
                    return (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${field.field_key}-${option.value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValues = checked
                              ? [...selectedValues, option.value]
                              : selectedValues.filter((v: string) => v !== option.value);
                            handleFieldChange(field.field_key, newValues);
                          }}
                        />
                        <Label htmlFor={`${field.field_key}-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    );
                  })
              ) : (
                <p className="text-sm text-muted-foreground">No options available</p>
              )}
            </div>
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (mode === 'preview') {
    return (
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMode('entry')}>
              <FileText className="h-4 w-4 mr-2" />
              Edit Mode
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <Card>
          <CardHeader>
            <CardTitle>Consultation Documentation - Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate && fieldsData?.results ? (
              fieldsData.results
                .sort((a, b) => a.display_order - b.display_order)
                .map((field) => {
                  const value = formData[field.field_key];
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;

                  return (
                    <div key={field.id}>
                      <h3 className="font-semibold text-sm">{field.field_label}</h3>
                      <p className="text-sm">
                        {Array.isArray(value) ? value.join(', ') :
                         typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                         value}
                      </p>
                    </div>
                  );
                })
            ) : (
              <p className="text-muted-foreground text-center">No data to preview. Please fill out the form.</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Group Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="template-group">Template Group</Label>
            <Select
              value={selectedTemplateGroup}
              onValueChange={setSelectedTemplateGroup}
              disabled={isLoadingGroups}
            >
              <SelectTrigger id="template-group" className="w-full">
                <SelectValue placeholder={isLoadingGroups ? "Loading template groups..." : "Select a template group"} />
              </SelectTrigger>
              <SelectContent>
                {isLoadingGroups ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : groupsData?.results && groupsData.results.length > 0 ? (
                  groupsData.results.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No template groups available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Template Dropdown - Only show if group is selected */}
          {selectedTemplateGroup && (
            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
                disabled={isLoadingTemplates}
              >
                <SelectTrigger id="template" className="w-full">
                  <SelectValue placeholder={isLoadingTemplates ? "Loading templates..." : "Select a template"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Loading...</span>
                    </div>
                  ) : templatesData?.results && templatesData.results.length > 0 ? (
                    templatesData.results.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No templates available for this group
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Form Fields - Only show if template is selected */}
      {selectedTemplate && (
        <>
          {/* Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMode('preview')}>
                <FileText className="h-4 w-4 mr-2" />
                Preview Mode
              </Button>
            </div>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Consultation
            </Button>
          </div>

          {isLoadingFields ? (
            <Card>
              <CardContent className="p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading template fields...</span>
              </CardContent>
            </Card>
          ) : fieldsData?.results && fieldsData.results.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {templatesData?.results.find(t => t.id.toString() === selectedTemplate)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {fieldsData.results
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((field) => renderField(field))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No fields configured for this template
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Show message when no template is selected */}
      {!selectedTemplate && selectedTemplateGroup && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Please select a template to continue
          </CardContent>
        </Card>
      )}

      {!selectedTemplateGroup && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Please select a template group to begin
          </CardContent>
        </Card>
      )}
    </div>
  );
};
