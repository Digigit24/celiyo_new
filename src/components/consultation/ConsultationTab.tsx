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
import { FileText, Printer, Save, Loader2, Download } from 'lucide-react';
import { OpdVisit } from '@/types/opdVisit.types';
import { toast } from 'sonner';
import { useOPDTemplate } from '@/hooks/useOPDTemplate';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';
import type { Template, TemplateField } from '@/types/opdTemplate.types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ConsultationTabProps {
  visit: OpdVisit;
}

export const ConsultationTab: React.FC<ConsultationTabProps> = ({ visit }) => {
  const { useTemplateGroups, useTemplates, useTemplate } = useOPDTemplate();
  const { getTenant } = useAuth();
  const { useTenantDetail } = useTenant();
  const [mode, setMode] = useState<'entry' | 'preview'>('entry');
  const [selectedTemplateGroup, setSelectedTemplateGroup] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Get tenant from current session
  const tenant = getTenant();
  const tenantId = tenant?.id || null;

  // Fetch tenant settings for branding
  const { data: tenantData } = useTenantDetail(tenantId);
  const tenantSettings = tenantData?.settings || {};

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

  // Fetch template details with fields (includes nested options)
  const { data: templateData, isLoading: isLoadingTemplate } = useTemplate(
    selectedTemplate ? parseInt(selectedTemplate) : null
  );

  // Extract fields from template data
  const fieldsData = templateData?.fields || [];
  const isLoadingFields = isLoadingTemplate;

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
      console.log('First field with options check:', fieldsData[0]);
      if (fieldsData.length > 0) {
        fieldsData.forEach((field, idx) => {
          console.log(`Field ${idx} (${field.field_label}):`, {
            type: field.field_type,
            hasOptions: !!field.options,
            optionsCount: field.options?.length || 0,
            options: field.options
          });
        });
      }
    }
  }, [fieldsData]);

  const handleFieldChange = (fieldId: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    console.log('Fields:', fieldsData);
    toast.success('Consultation saved successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.querySelector('.preview-container') as HTMLElement;
    if (!element) {
      toast.error('Preview container not found');
      return;
    }

    try {
      toast.info('Generating PDF...');

      // Capture the element as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // A4 dimensions in mm
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename with patient name and date
      const patientName = visit.patient_details?.full_name?.replace(/\s+/g, '_') || 'Patient';
      const date = new Date().toISOString().split('T')[0];
      const filename = `Consultation_${patientName}_${date}.pdf`;

      pdf.save(filename);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const renderField = (field: TemplateField) => {
    const value = formData[field.id] || '';

    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={`field-${field.id}`}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type={field.field_type === 'email' ? 'email' : field.field_type === 'phone' ? 'tel' : field.field_type === 'url' ? 'url' : 'text'}
              placeholder={field.placeholder || ''}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
            <Label htmlFor={`field-${field.id}`}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={`field-${field.id}`}
              placeholder={field.placeholder || ''}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
            <Label htmlFor={`field-${field.id}`}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="number"
              placeholder={field.placeholder || ''}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
            <Label htmlFor={`field-${field.id}`}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
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
            <Label htmlFor={`field-${field.id}`}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={`field-${field.id}`}
              type="datetime-local"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.is_required}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
          </div>
        );

      case 'checkbox':
        // If field has options, render as checkbox group
        if (field.options && field.options.length > 0) {
          return (
            <div key={field.id} className="space-y-2">
              <Label>
                {field.field_label}
                {field.is_required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {field.options
                  .filter(opt => opt.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((option) => {
                    const selectedValues = value || [];
                    const isChecked = selectedValues.includes(option.option_value);
                    return (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field.id}-${option.option_value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValues = checked
                              ? [...selectedValues, option.option_value]
                              : selectedValues.filter((v: string) => v !== option.option_value);
                            handleFieldChange(field.id, newValues);
                          }}
                        />
                        <Label htmlFor={`field-${field.id}-${option.option_value}`} className="cursor-pointer">
                          {option.option_label}
                        </Label>
                      </div>
                    );
                  })}
              </div>
              {field.help_text && (
                <p className="text-xs text-muted-foreground">{field.help_text}</p>
              )}
            </div>
          );
        }
        // Otherwise, render as single boolean checkbox
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={`field-${field.id}`}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={`field-${field.id}`} className="cursor-pointer">
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
            <Label htmlFor={`field-${field.id}`}>
              {field.field_label}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleFieldChange(field.id, val)}
            >
              <SelectTrigger id={`field-${field.id}`}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options && field.options.length > 0 ? (
                  field.options
                    .filter(opt => opt.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((option) => (
                      <SelectItem key={option.id} value={option.option_value}>
                        {option.option_label}
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
              onValueChange={(val) => handleFieldChange(field.id, val)}
            >
              {field.options && field.options.length > 0 ? (
                field.options
                  .filter(opt => opt.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.option_value} id={`field-${field.id}-${option.option_value}`} />
                      <Label htmlFor={`field-${field.id}-${option.option_value}`} className="cursor-pointer">
                        {option.option_label}
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
                    const isChecked = selectedValues.includes(option.option_value);
                    return (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field.id}-${option.option_value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValues = checked
                              ? [...selectedValues, option.option_value]
                              : selectedValues.filter((v: string) => v !== option.option_value);
                            handleFieldChange(field.id, newValues);
                          }}
                        />
                        <Label htmlFor={`field-${field.id}-${option.option_value}`} className="cursor-pointer">
                          {option.option_label}
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
        {/* Mode Toggle - Hidden in Print */}
        <div className="flex justify-between items-center print:hidden">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setMode('entry')}>
              <FileText className="h-4 w-4 mr-2" />
              Edit Mode
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* A4 Paper with Letterhead - This is what gets printed */}
        <div
          className="preview-container mx-auto bg-white shadow-lg print:shadow-none flex flex-col"
          style={{ width: '210mm', height: '297mm' }}
        >
          {/* Letterhead Header */}
          <div
            className="border-b-4 p-8"
            style={{
              borderColor: tenantSettings.header_bg_color || '#3b82f6',
              backgroundColor: tenantSettings.header_bg_color || '#3b82f6',
              color: tenantSettings.header_text_color || '#ffffff'
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                {/* Logo */}
                {tenantSettings.logo && (
                  <div className="flex-shrink-0">
                    <img
                      src={tenantSettings.logo}
                      alt="Logo"
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">
                    {tenantData?.name || 'Medical Center'}
                  </h1>
                  <p className="text-sm mt-1 opacity-90">
                    {tenantSettings.address?.split('\n')[0] || 'Excellence in Healthcare'}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold">Contact Information</p>
                {tenantSettings.contact_phone && (
                  <p className="opacity-90">Phone: {tenantSettings.contact_phone}</p>
                )}
                {tenantSettings.contact_email && (
                  <p className="opacity-90">Email: {tenantSettings.contact_email}</p>
                )}
                {tenantSettings.website_url && (
                  <p className="opacity-90">{tenantSettings.website_url}</p>
                )}
              </div>
            </div>
          </div>

          {/* Patient & Visit Information */}
          <div className="p-8 border-b flex-shrink-0">
            <h2 className="text-xl font-bold mb-4 text-center">CONSULTATION RECORD</h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex">
                <span className="font-semibold w-32">Patient Name:</span>
                <span className="flex-1 border-b border-dotted border-gray-400">{visit.patient_details?.full_name || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Patient ID:</span>
                <span className="flex-1 border-b border-dotted border-gray-400">{visit.patient_details?.patient_id || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Age/Gender:</span>
                <span className="flex-1 border-b border-dotted border-gray-400">
                  {visit.patient_details?.age || 'N/A'} years / {visit.patient_details?.gender || 'N/A'}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Visit Date:</span>
                <span className="flex-1 border-b border-dotted border-gray-400">{visit.visit_date || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Doctor:</span>
                <span className="flex-1 border-b border-dotted border-gray-400">{visit.doctor_details?.full_name || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-32">Visit Number:</span>
                <span className="flex-1 border-b border-dotted border-gray-400">{visit.visit_number || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Form Fields Content */}
          <div className="p-8 flex-1 overflow-auto">
            {selectedTemplate && fieldsData && fieldsData.length > 0 ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4">
                  {templatesData?.results.find(t => t.id.toString() === selectedTemplate)?.name}
                </h3>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {fieldsData
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((field) => {
                      const value = formData[field.id];
                      if (!value || (Array.isArray(value) && value.length === 0) || value === false) return null;

                      // Determine if field should span full width
                      const isFullWidth = field.field_type === 'textarea' ||
                                        (typeof value === 'string' && value.length > 50);

                      return (
                        <div
                          key={field.id}
                          className={`${isFullWidth ? 'col-span-2' : 'col-span-1'}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                              {field.field_label}
                            </span>
                            <div className={`${isFullWidth ? 'min-h-[60px]' : 'min-h-[30px]'} border-b border-gray-300 pb-1`}>
                              <span className="text-sm">
                                {Array.isArray(value)
                                  ? value.join(', ')
                                  : typeof value === 'boolean'
                                    ? (value ? '✓ Yes' : 'No')
                                    : value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Check if no fields have values */}
                {fieldsData.every(field => {
                  const value = formData[field.id];
                  return !value || (Array.isArray(value) && value.length === 0) || value === false;
                }) && (
                  <div className="text-center py-12 text-gray-400">
                    <p>No data recorded</p>
                    <p className="text-sm">Please fill out the form in Edit Mode</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No template selected</p>
                <p className="text-sm">Please select a template and fill out the form</p>
              </div>
            )}
          </div>

          {/* Letterhead Footer */}
          <div
            className="border-t-4 p-6 flex-shrink-0"
            style={{
              borderColor: tenantSettings.footer_bg_color || '#3b82f6',
              backgroundColor: tenantSettings.footer_bg_color || '#3b82f6',
              color: tenantSettings.footer_text_color || '#ffffff'
            }}
          >
            <div className="flex justify-between items-center text-xs">
              <div>
                <p className="font-semibold">{tenantData?.name || 'Medical Center'}</p>
                {tenantSettings.address && (
                  <>
                    {tenantSettings.address.split('\n').map((line: string, index: number) => (
                      <p key={index} className="opacity-90">{line}</p>
                    ))}
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="opacity-90">This is an official medical document</p>
                <p className="opacity-90">Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                <p className="font-semibold mt-1">Confidential Medical Record</p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            /* Force background colors and images to print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            /* Hide everything except the preview container */
            body * {
              visibility: hidden;
            }

            .preview-container,
            .preview-container * {
              visibility: visible;
            }

            /* Position preview container at top of page */
            .preview-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm !important;
              margin: 0 !important;
              box-shadow: none !important;
            }

            /* Hide print buttons and UI elements */
            .print\\:hidden {
              display: none !important;
            }

            .print\\:shadow-none {
              box-shadow: none !important;
            }
          }
        `}</style>
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
          ) : fieldsData && fieldsData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {templatesData?.results.find(t => t.id.toString() === selectedTemplate)?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {fieldsData
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
