// src/components/TemplatesFormDrawer.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SideDrawer, type DrawerActionButton, type DrawerHeaderAction } from '@/components/SideDrawer';
import { toast } from 'sonner';
import { 
  Template, 
  TemplateCategory, 
  TemplateLanguage, 
  TemplateStatus, 
  CreateTemplatePayload, 
  UpdateTemplatePayload 
} from '@/types/whatsappTypes';
import { useTemplate } from '@/hooks/whatsapp/useTemplates';
import { templatesService } from '@/services/whatsapp/templatesService';
import { Eye, Pencil, Trash2, Smartphone, Plus, MinusCircle } from 'lucide-react';

type Mode = 'view' | 'edit' | 'create';

interface TemplatesFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: number | null;
  mode: Mode;
  onSuccess?: () => void;
  onDelete?: (id: number) => void;
  onModeChange?: (mode: Mode) => void;
}

type ButtonRow = {
  type: string;
  text: string;
  url?: string;
  phone_number?: string;
};

export default function TemplatesFormDrawer({
  open,
  onOpenChange,
  templateId,
  mode,
  onSuccess,
  onDelete,
  onModeChange,
}: TemplatesFormDrawerProps) {
  const [activeTab, setActiveTab] = useState('builder');
  const [currentMode, setCurrentMode] = useState<Mode>(mode);
  const [isSaving, setIsSaving] = useState(false);

  // Load when viewing/editing
  const { template, isLoading, error, refetch } = useTemplate(templateId);

  // ===== Form state (for CREATE) =====
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<TemplateLanguage>(TemplateLanguage.ENGLISH_US);
  const [category, setCategory] = useState<TemplateCategory>(TemplateCategory.UTILITY);

  const [headerEnabled, setHeaderEnabled] = useState(false);
  const [headerText, setHeaderText] = useState('');

  const [bodyText, setBodyText] = useState('');
  const [footerEnabled, setFooterEnabled] = useState(false);
  const [footerText, setFooterText] = useState('');

  const [buttonsEnabled, setButtonsEnabled] = useState(false);
  const [buttons, setButtons] = useState<ButtonRow[]>([]);

  // ===== Edit-only fields (backend supports only status, usage_count) =====
  const [editStatus, setEditStatus] = useState<TemplateStatus | undefined>(undefined);

  // ===== Preview variables for body {{1}}, {{2}}, ... =====
  const variableNumbers = useMemo(() => {
    if (!bodyText) return [] as string[];
    return templatesService.extractVariables(bodyText); // returns ["1","2",...]
  }, [bodyText]);

  const [previewVars, setPreviewVars] = useState<Record<string, string>>({});

  const handleVarChange = (indexNumber: string, value: string) => {
    setPreviewVars((prev) => ({ ...prev, [indexNumber]: value }));
  };

  const resolvedPreviewBody = useMemo(() => {
    if (!bodyText) return '';
    return templatesService.replaceVariables(bodyText, previewVars);
  }, [bodyText, previewVars]);

  // ===== Sync mode and data =====
  useEffect(() => setCurrentMode(mode), [mode]);

  useEffect(() => {
    if (currentMode === 'create') {
      // reset form
      setName('');
      setLanguage(TemplateLanguage.ENGLISH_US);
      setCategory(TemplateCategory.UTILITY);
      setHeaderEnabled(false);
      setHeaderText('');
      setBodyText('');
      setFooterEnabled(false);
      setFooterText('');
      setButtonsEnabled(false);
      setButtons([]);
      setPreviewVars({});
      setEditStatus(undefined);
      setActiveTab('builder');
    } else if (template) {
      // for view/edit: prime editStatus from existing template
      setEditStatus(template.status);
    }
  }, [currentMode, template]);

  // ===== Build components array compatible with backend schema =====
  const buildComponents = () => {
    const comps: any[] = [];

    if (headerEnabled && headerText.trim()) {
      comps.push({
        type: 'HEADER',
        format: 'TEXT',
        text: headerText.trim(),
      });
    }

    if (bodyText.trim()) {
      comps.push({
        type: 'BODY',
        text: bodyText.trim(),
      });
    }

    if (footerEnabled && footerText.trim()) {
      comps.push({
        type: 'FOOTER',
        text: footerText.trim(),
      });
    }

    if (buttonsEnabled && buttons.length > 0) {
      comps.push({
        type: 'BUTTONS',
        buttons: buttons.map((b) => ({
          type: b.type,
          text: b.text,
          url: b.url,
          phone_number: b.phone_number,
        })),
      });
    }

    return comps;
  };

  const validateBeforeSave = () => {
    if (currentMode === 'create') {
      if (!name.trim()) return 'Template name is required';
      if (!/^[a-z0-9_]+$/.test(name.trim())) {
        return 'Name must be lowercase letters, numbers, and underscores only';
      }
      if (!bodyText.trim()) return 'Body text is required';
      const comps = buildComponents();
      const validation = templatesService.validateTemplate(comps);
      if (!validation.valid) {
        return validation.errors.join(', ');
      }
    }
    if (currentMode === 'edit') {
      if (!templateId) return 'Missing template id';
      if (!editStatus) return 'Please select a template status';
    }
    return null;
  };

  const handleClose = useCallback(() => {
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
    if (!templateId) return;
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSaving(true);
      await templatesService.deleteTemplate(templateId);
      toast.success('Template deleted successfully');
      onDelete?.(templateId);
      handleClose();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete template');
    } finally {
      setIsSaving(false);
    }
  }, [templateId, onDelete, handleClose]);

  const handleSave = useCallback(async () => {
    const errorMessage = validateBeforeSave();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setIsSaving(true);
      if (currentMode === 'create') {
        const payload: CreateTemplatePayload = {
          name: name.trim(),
          language,
          category,
          components: buildComponents(),
        };

        const created = await templatesService.createTemplate(payload);
        toast.success(`Template "${created.name}" created`);
        onSuccess?.();
        handleClose();
      } else if (currentMode === 'edit') {
        if (!templateId) throw new Error('Missing template id');
        const payload: UpdateTemplatePayload = {
          status: editStatus,
        };
        const updated = await templatesService.updateTemplate(templateId, payload);
        toast.success(`Template "${updated.name}" updated`);
        onSuccess?.();
        setCurrentMode('view');
        onModeChange?.('view');
        refetch();
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  }, [
    currentMode,
    name,
    language,
    category,
    headerEnabled,
    headerText,
    bodyText,
    footerEnabled,
    footerText,
    buttonsEnabled,
    buttons,
    editStatus,
    templateId,
    onSuccess,
    onModeChange,
    handleClose,
    refetch,
  ]);

  // ===== Header + Footer config =====
  const drawerTitle =
    currentMode === 'create'
      ? 'Create New WhatsApp Template'
      : template?.name || 'Template Details';

  const drawerDescription =
    currentMode === 'create'
      ? 'Design a WhatsApp template using Header, Body, Footer and Buttons'
      : template
      ? `Language: ${template.language} • Category: ${template.category} • Status: ${template.status}`
      : undefined;

  const headerActions: DrawerHeaderAction[] =
    currentMode === 'view' && template
      ? [
          {
            icon: Eye,
            onClick: () => setActiveTab('preview'),
            label: 'Preview',
            variant: 'ghost',
          },
          {
            icon: Pencil,
            onClick: handleSwitchToEdit,
            label: 'Edit template',
            variant: 'ghost',
          },
          {
            icon: Trash2,
            onClick: handleDelete,
            label: 'Delete template',
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
            label: 'Create Template',
            onClick: handleSave,
            variant: 'default',
            loading: isSaving,
          },
        ];

  // ===== Buttons handlers =====
  const addButton = () => {
    if (buttons.length >= 3) {
      toast.error('Maximum 3 buttons allowed');
      return;
    }
    setButtons((prev) => [
      ...prev,
      { type: 'QUICK_REPLY', text: '' },
    ]);
  };

  const updateButton = (index: number, patch: Partial<ButtonRow>) => {
    setButtons((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const removeButton = (index: number) => {
    setButtons((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Mobile-like preview card =====
  const MobilePreview = ({ header, body, footer, buttonRows }: { header?: string; body?: string; footer?: string; buttonRows?: ButtonRow[] }) => {
    return (
      <div className="border rounded-[28px] p-4 w-[320px] bg-neutral-900 text-white shadow-xl">
        <div className="flex items-center justify-center mb-3">
          <Smartphone className="h-5 w-5 text-neutral-400" />
          <span className="ml-2 text-sm text-neutral-300">WhatsApp Preview</span>
        </div>
        <div className="bg-neutral-800 rounded-2xl p-3 space-y-2">
          {header && (
            <div className="text-xs font-semibold text-neutral-200">{header}</div>
          )}
          {body && (
            <div className="bg-emerald-600 rounded-2xl p-3 self-end w-fit max-w-[85%] ml-auto">
              <div className="text-sm whitespace-pre-wrap">{body}</div>
            </div>
          )}
          {footer && (
            <div className="text-[11px] text-neutral-400">{footer}</div>
          )}
          {buttonRows && buttonRows.length > 0 && (
            <div className="pt-1">
              {buttonRows.map((b, i) => (
                <div
                  key={i}
                  className="w-full text-center text-emerald-400 border-t border-neutral-700 py-2 text-sm"
                >
                  {b.text || 'Button'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== Drawer content =====
  const renderCreateEditor = () => (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            placeholder="order_confirmation"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Only lowercase letters, numbers, and underscores
          </p>
        </div>

        <div>
          <Label>Language</Label>
          <Select value={language} onValueChange={(v) => setLanguage(v as TemplateLanguage)}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TemplateLanguage.ENGLISH}>English</SelectItem>
              <SelectItem value={TemplateLanguage.ENGLISH_US}>English (US)</SelectItem>
              <SelectItem value={TemplateLanguage.ENGLISH_UK}>English (UK)</SelectItem>
              <SelectItem value={TemplateLanguage.HINDI}>Hindi</SelectItem>
              <SelectItem value={TemplateLanguage.SPANISH}>Spanish</SelectItem>
              <SelectItem value={TemplateLanguage.FRENCH}>French</SelectItem>
              <SelectItem value={TemplateLanguage.GERMAN}>German</SelectItem>
              <SelectItem value={TemplateLanguage.PORTUGUESE}>Portuguese (BR)</SelectItem>
              <SelectItem value={TemplateLanguage.ARABIC}>Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TemplateCategory.UTILITY}>Utility</SelectItem>
              <SelectItem value={TemplateCategory.MARKETING}>Marketing</SelectItem>
              <SelectItem value={TemplateCategory.AUTHENTICATION}>Authentication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Builder */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Label className="text-base">Header</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Text header</span>
              <Switch checked={headerEnabled} onCheckedChange={setHeaderEnabled} />
            </div>
          </div>
          {headerEnabled && (
            <Input
              placeholder="Header text (e.g., Order Confirmation)"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              maxLength={60}
            />
          )}

          {/* Body */}
          <div className="space-y-2">
            <Label className="text-base">Body</Label>
            <Textarea
              rows={6}
              placeholder="Hi {{1}}, your order {{2}} has been confirmed."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use {'{{1}}'}, {'{{2}}'}, etc. for variables. Max 1024 characters.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Label className="text-base">Footer</Label>
            <Switch checked={footerEnabled} onCheckedChange={setFooterEnabled} />
          </div>
          {footerEnabled && (
            <Input
              placeholder="Footer text (e.g., Thank you!)"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              maxLength={60}
            />
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <Label className="text-base">Buttons</Label>
            <Switch checked={buttonsEnabled} onCheckedChange={setButtonsEnabled} />
          </div>
          {buttonsEnabled && (
            <div className="space-y-3">
              {buttons.map((btn, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Button {idx + 1}</Label>
                    <Button variant="ghost" size="icon" onClick={() => removeButton(idx)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={btn.type}
                        onValueChange={(v) => updateButton(idx, { type: v as ButtonRow['type'], url: undefined, phone_number: undefined })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Button type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QUICK_REPLY">Quick Reply</SelectItem>
                          <SelectItem value="URL">URL</SelectItem>
                          <SelectItem value="PHONE_NUMBER">Phone Number</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Text</Label>
                      <Input
                        placeholder="Button text (max 25 chars)"
                        value={btn.text}
                        maxLength={25}
                        onChange={(e) => updateButton(idx, { text: e.target.value })}
                      />
                    </div>
                  </div>

                  {btn.type === 'URL' && (
                    <div>
                      <Label>URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={btn.url || ''}
                        onChange={(e) => updateButton(idx, { url: e.target.value })}
                      />
                    </div>
                  )}

                  {btn.type === 'PHONE_NUMBER' && (
                    <div>
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="+91XXXXXXXXXX"
                        value={btn.phone_number || ''}
                        onChange={(e) => updateButton(idx, { phone_number: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              ))}

              <Button variant="outline" onClick={addButton} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Button
              </Button>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Label className="text-base">Preview</Label>
          {/* Variable inputs */}
          {variableNumbers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {variableNumbers.map((num) => (
                <div key={num}>
                  <Label>Variable {num}</Label>
                  <Input
                    placeholder={`Value for {{${num}}}`}
                    value={previewVars[num] || ''}
                    onChange={(e) => handleVarChange(num, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-6">
            <MobilePreview
              header={headerEnabled ? headerText : undefined}
              body={resolvedPreviewBody}
              footer={footerEnabled ? footerText : undefined}
              buttonRows={buttonsEnabled ? buttons : []}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderViewer = () => {
    if (!template) return null;
    const bodyComp = template.components.find((c: any) => c.type === 'BODY');
    const headerComp = template.components.find((c: any) => c.type === 'HEADER');
    const footerComp = template.components.find((c: any) => c.type === 'FOOTER');
    const buttonsComp = template.components.find((c: any) => c.type === 'BUTTONS');

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <div className="mt-1 font-medium">{template.name}</div>
            </div>
            <div>
              <Label>Language</Label>
              <div className="mt-1">{template.language}</div>
            </div>
            <div>
              <Label>Category</Label>
              <div className="mt-1">{template.category}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base">Content</Label>
            {headerComp?.text && (
              <div>
                <Label className="text-sm">Header</Label>
                <div className="mt-1 p-3 border rounded-md bg-muted/30">{headerComp.text}</div>
              </div>
            )}
            {bodyComp?.text && (
              <div>
                <Label className="text-sm">Body</Label>
                <div className="mt-1 p-3 border rounded-md bg-muted/30 whitespace-pre-wrap">{bodyComp.text}</div>
              </div>
            )}
            {footerComp?.text && (
              <div>
                <Label className="text-sm">Footer</Label>
                <div className="mt-1 p-3 border rounded-md bg-muted/30">{footerComp.text}</div>
              </div>
            )}
            {Array.isArray(buttonsComp?.buttons) && buttonsComp.buttons.length > 0 && (
              <div>
                <Label className="text-sm">Buttons</Label>
                <div className="mt-2 grid gap-2">
                  {buttonsComp.buttons.map((b: any, i: number) => (
                    <div key={i} className="p-2 rounded-md border bg-background flex items-center justify-between">
                      <div>
                        <div className="font-medium">{b.text}</div>
                        <div className="text-xs text-muted-foreground">{b.type}</div>
                      </div>
                      {b.url && <div className="text-xs text-blue-600">{b.url}</div>}
                      {b.phone_number && <div className="text-xs text-green-600">{b.phone_number}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Label className="text-base">Mobile Preview</Label>
          <MobilePreview
            header={headerComp?.text}
            body={bodyComp?.text}
            footer={footerComp?.text}
            buttonRows={buttonsComp?.buttons}
          />
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    if (!template) return null;
    // Only status is editable per backend
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Template Name</Label>
            <Input value={template.name} disabled />
            <p className="text-xs text-muted-foreground mt-1">Name cannot be changed after creation</p>
          </div>
          <div>
            <Label>Language</Label>
            <Input value={template.language} disabled />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={template.category} disabled />
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={editStatus || template.status}
            onValueChange={(v) => setEditStatus(v as TemplateStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TemplateStatus.APPROVED}>Approved</SelectItem>
              <SelectItem value={TemplateStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={TemplateStatus.REJECTED}>Rejected</SelectItem>
              <SelectItem value={TemplateStatus.PAUSED}>Paused</SelectItem>
              <SelectItem value={TemplateStatus.DISABLED}>Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {renderViewer()}
      </div>
    );
  };

  const drawerContent = (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">
            {currentMode === 'create' ? 'Create Template' : currentMode === 'edit' ? 'Edit' : 'Details'}
          </TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6 space-y-6">
          {currentMode === 'create' ? renderCreateEditor() : currentMode === 'edit' ? renderEditor() : renderViewer()}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {currentMode === 'create' ? (
            <div className="flex gap-6">
              <MobilePreview
                header={headerEnabled ? headerText : undefined}
                body={resolvedPreviewBody}
                footer={footerEnabled ? footerText : undefined}
                buttonRows={buttonsEnabled ? buttons : []}
              />
            </div>
          ) : (
            renderViewer()
          )}
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
      loadingText="Loading template data..."
      size="xl"
      footerButtons={footerButtons}
      footerAlignment="right"
      showBackButton={true}
      resizable={true}
      storageKey="template-drawer-width"
      onClose={handleClose}
    >
      {drawerContent}
    </SideDrawer>
  );
}