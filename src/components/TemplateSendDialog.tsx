// src/components/TemplateSendDialog.tsx
import { useState, useEffect } from 'react';
import { Send, Users, UserPlus, X, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { templatesService } from '@/services/whatsapp/templatesService';
import { Template, TemplateSendRequest, TemplateBulkSendRequest, TemplateLanguage } from '@/types/whatsappTypes';
import { toast } from 'sonner';

interface TemplateSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSuccess?: () => void;
}

export function TemplateSendDialog({
  open,
  onOpenChange,
  template,
  onSuccess
}: TemplateSendDialogProps) {
  const [sendMode, setSendMode] = useState<'single' | 'bulk'>('single');
  const [isLoading, setIsLoading] = useState(false);

  // Single send state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parameters, setParameters] = useState<Record<string, string>>({});

  // Bulk send state
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [bulkParameters, setBulkParameters] = useState<Record<string, string>>({});

  // Extract variables from template
  const extractedVariables = template
    ? templatesService.extractVariables(
        template.components.find(c => c.type === 'BODY')?.text || ''
      )
    : [];

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setPhoneNumber('');
      setPhoneNumbers(['']);
      setParameters({});
      setBulkParameters({});
      setSendMode('single');
    }
  }, [open]);

  const handleSendSingle = async () => {
    if (!template) return;

    // Validation
    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    // Check if all required parameters are filled
    const missingParams = extractedVariables.filter(v => !parameters[v]);
    if (missingParams.length > 0) {
      toast.error(`Please fill in all required parameters: ${missingParams.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);

      const payload: TemplateSendRequest = {
        to: phoneNumber.trim(),
        template_name: template.name,
        language: template.language as TemplateLanguage,
        parameters
      };

      await templatesService.sendTemplate(payload);

      toast.success(`Template sent to ${phoneNumber}`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBulk = async () => {
    if (!template) return;

    // Validation
    const validPhones = phoneNumbers.filter(p => p.trim());
    if (validPhones.length === 0) {
      toast.error('Please enter at least one phone number');
      return;
    }

    // Check if all required parameters are filled
    const missingParams = extractedVariables.filter(v => !bulkParameters[v]);
    if (missingParams.length > 0) {
      toast.error(`Please fill in all required parameters: ${missingParams.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);

      const payload: TemplateBulkSendRequest = {
        template_name: template.name,
        language: template.language as TemplateLanguage,
        recipients: validPhones,
        default_parameters: bulkParameters
      };

      const result = await templatesService.sendTemplateBulk(payload);

      toast.success(`Sent to ${result.sent} recipients (${result.failed} failed)`);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send template bulk');
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoneNumberField = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const removePhoneNumberField = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const getBodyPreview = () => {
    if (!template) return '';

    const bodyComponent = template.components.find(c => c.type === 'BODY');
    if (!bodyComponent?.text) return '';

    const params = sendMode === 'single' ? parameters : bulkParameters;
    return templatesService.replaceVariables(bodyComponent.text, params);
  };

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Template Message</DialogTitle>
          <DialogDescription>
            Send "{template.name}" template to recipients
          </DialogDescription>
        </DialogHeader>

        <Tabs value={sendMode} onValueChange={(v) => setSendMode(v as 'single' | 'bulk')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">
              <UserPlus className="h-4 w-4 mr-2" />
              Single Recipient
            </TabsTrigger>
            <TabsTrigger value="bulk">
              <Users className="h-4 w-4 mr-2" />
              Bulk Send
            </TabsTrigger>
          </TabsList>

          {/* Single Send Tab */}
          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="e.g., 919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Enter phone number with country code (e.g., 919876543210 for India)
              </p>
            </div>

            {/* Template Parameters */}
            {extractedVariables.length > 0 && (
              <div className="space-y-3">
                <Label>Template Variables</Label>
                {extractedVariables.map((variable) => (
                  <div key={variable} className="space-y-1">
                    <Label htmlFor={`param-${variable}`} className="text-sm">
                      Variable {variable} *
                    </Label>
                    <Input
                      id={`param-${variable}`}
                      placeholder={`Value for {{${variable}}}`}
                      value={parameters[variable] || ''}
                      onChange={(e) => setParameters({ ...parameters, [variable]: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Preview */}
            {extractedVariables.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {getBodyPreview() || 'Fill in the variables to see preview'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Bulk Send Tab */}
          <TabsContent value="bulk" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Phone Numbers *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhoneNumberField}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Number
                </Button>
              </div>

              {phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Phone ${index + 1} (e.g., 919876543210)`}
                    value={phone}
                    onChange={(e) => updatePhoneNumber(index, e.target.value)}
                    disabled={isLoading}
                  />
                  {phoneNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhoneNumberField(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <p className="text-xs text-muted-foreground">
                You can send to up to 1000 recipients at once. All recipients will receive the same message.
              </p>
            </div>

            {/* Template Parameters (same for all recipients) */}
            {extractedVariables.length > 0 && (
              <div className="space-y-3">
                <Label>Template Variables (same for all recipients)</Label>
                {extractedVariables.map((variable) => (
                  <div key={variable} className="space-y-1">
                    <Label htmlFor={`bulk-param-${variable}`} className="text-sm">
                      Variable {variable} *
                    </Label>
                    <Input
                      id={`bulk-param-${variable}`}
                      placeholder={`Value for {{${variable}}}`}
                      value={bulkParameters[variable] || ''}
                      onChange={(e) => setBulkParameters({ ...bulkParameters, [variable]: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Preview */}
            {extractedVariables.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <Label className="text-sm font-medium">Preview</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {getBodyPreview() || 'Fill in the variables to see preview'}
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Recipients:</strong> {phoneNumbers.filter(p => p.trim()).length}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Template Info */}
        <div className="bg-muted/30 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Template:</span>
            <Badge variant="outline">{template.name}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Language:</span>
            <Badge variant="secondary">{template.language}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Category:</span>
            <Badge variant="secondary">{template.category}</Badge>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={sendMode === 'single' ? handleSendSingle : handleSendBulk}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {sendMode === 'single' ? 'Send Message' : `Send to ${phoneNumbers.filter(p => p.trim()).length} Recipients`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
