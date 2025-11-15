// src/pages/Campaigns.tsx
import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, ArrowLeft, Phone, Send, AlertTriangle, Calendar, Clock, Users, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { toast } from 'sonner';

import { useCampaigns } from '@/hooks/whatsapp/useCampaigns';
import type { WACampaign, CreateCampaignPayload } from '@/types/whatsappTypes';
import CampaignsTable from '@/components/CampaignsTable';
import { SideDrawer } from '@/components/SideDrawer';

function rate(c?: WACampaign | null) {
  if (!c || !c.total_recipients) return 0;
  const sent = c.sent_count ?? 0;
  return Math.round((sent / c.total_recipients) * 100);
}

function formatDate(iso?: string) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return iso;
  }
}

// Mock template type (you should import from your types)
type Template = {
  id: string;
  name: string;
  language: string;
  category: string;
  body: string;
  header?: string;
  footer?: string;
};

// Mock templates (replace with actual API call)
const MOCK_TEMPLATES: Template[] = [
  {
    id: 'hello_world',
    name: 'hello_world',
    language: 'en_US',
    category: 'UTILITY',
    header: 'Hello World',
    body: 'Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.\n\nWhatsApp Business Platform sample message',
    footer: undefined,
  },
  // Add more templates as needed
];

type CampaignStep = 'template' | 'contacts' | 'review';

export default function Campaigns() {
  const isMobile = useIsMobile();

  // Data hook (backend-aligned)
  const {
    campaigns,
    isLoading,
    error,
    refetch,
    createCampaign,
    getCampaign,
    stats,
  } = useCampaigns({ autoFetch: true });

  // Header actions
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<WACampaign | null>(null);

  // Multi-step campaign creation
  const [currentStep, setCurrentStep] = useState<CampaignStep>('template');
  const [creating, setCreating] = useState(false);

  // Step 1: Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [campaignTitle, setCampaignTitle] = useState('');

  // Step 2: Contacts and Schedule
  const [contactsGroup, setContactsGroup] = useState('');
  const [restrictByLanguage, setRestrictByLanguage] = useState(false);
  const [scheduleNow, setScheduleNow] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [noExpiry, setNoExpiry] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [sendingPhoneNumber, setSendingPhoneNumber] = useState('');

  // Legacy fields for backwards compatibility
  const [messageText, setMessageText] = useState('');
  const [recipientsText, setRecipientsText] = useState('');

  const total = campaigns.length;

  const handleRefresh = async () => {
    await refetch();
    toast.success('Campaigns refreshed');
  };

  const openCreate = () => {
    // Reset form
    setCurrentStep('template');
    setSelectedTemplate(null);
    setCampaignTitle('');
    setContactsGroup('');
    setRestrictByLanguage(false);
    setScheduleNow(true);
    setScheduleDate('');
    setScheduleTime('');
    setNoExpiry(true);
    setExpiryDate('');
    setExpiryTime('');
    setSendingPhoneNumber('');
    setMessageText('');
    setRecipientsText('');
    setCreateOpen(true);
  };

  const onView = async (row: WACampaign) => {
    const fresh = await getCampaign(row.campaign_id);
    setViewItem(fresh || row);
    setViewOpen(true);
  };

  const parseRecipients = (input: string): string[] => {
    const parts = input
      .split(/[\n,;\s]+/g)
      .map((x) => x.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(parts));
    return unique;
  };

  const handleNextStep = () => {
    if (currentStep === 'template') {
      if (!selectedTemplate) {
        toast.error('Please select a template');
        return;
      }
      setCurrentStep('contacts');
    } else if (currentStep === 'contacts') {
      if (!contactsGroup && !recipientsText) {
        toast.error('Please select a contact group or enter recipients');
        return;
      }
      if (!sendingPhoneNumber) {
        toast.error('Please select a sending phone number');
        return;
      }
      setCurrentStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'contacts') {
      setCurrentStep('template');
    } else if (currentStep === 'review') {
      setCurrentStep('contacts');
    }
  };

  const handleCreate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    const recipients = parseRecipients(recipientsText);
    if (recipients.length === 0) {
      toast.error('At least one recipient is required');
      return;
    }

    const payload: CreateCampaignPayload = {
      campaign_name: campaignTitle.trim() || selectedTemplate.name,
      message_text: selectedTemplate.body,
      recipients,
    };

    try {
      setCreating(true);
      const created = await createCampaign(payload);
      if (created) {
        toast.success('Campaign created and sending in background');
        setCreateOpen(false);
      }
    } finally {
      setCreating(false);
    }
  };

  const viewStats = useMemo(() => (viewItem ? stats(viewItem) : null), [viewItem, stats]);

  // Step indicator
  const steps = [
    { key: 'template', label: 'Template', icon: FileText },
    { key: 'contacts', label: 'Contacts & Schedule', icon: Users },
    { key: 'review', label: 'Review', icon: Send },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  // Message preview with template variables replaced
  const getPreviewMessage = () => {
    if (!selectedTemplate) return '';
    // For demo purposes, showing the template as-is
    // In production, you'd replace {{1}}, {{2}} etc. with actual values
    return selectedTemplate.body;
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'template':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base font-semibold">Template</Label>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>

                {selectedTemplate ? (
                  <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-lg">{selectedTemplate.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Language Code: <span className="font-medium">{selectedTemplate.language}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Category: <span className="font-medium">{selectedTemplate.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-8 text-center bg-muted/20">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">No template selected</p>
                    <Button onClick={() => setSelectedTemplate(MOCK_TEMPLATES[0])}>
                      Select Template
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-title">Campaign Title</Label>
                <Input
                  id="campaign-title"
                  placeholder="Enter campaign title"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-semibold">Target Contacts</Label>
                
                <div>
                  <Label htmlFor="contacts-group" className="text-sm">Groups/Contact</Label>
                  <Select value={contactsGroup} onValueChange={setContactsGroup}>
                    <SelectTrigger id="contacts-group" className="mt-2">
                      <SelectValue placeholder="Select Contacts Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="leads">Leads</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="restrict-language"
                    checked={restrictByLanguage}
                    onCheckedChange={(checked) => setRestrictByLanguage(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="restrict-language"
                      className="text-sm font-medium leading-relaxed cursor-pointer"
                    >
                      Restrict by Language Code - Send only to the contacts whose language code matches with template language code.
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">Schedule</Label>
                
                <div className="flex items-center space-x-3">
                  <Switch
                    id="schedule-now"
                    checked={scheduleNow}
                    onCheckedChange={setScheduleNow}
                  />
                  <Label htmlFor="schedule-now" className="cursor-pointer">Now</Label>
                </div>

                {!scheduleNow && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-10">
                    <div>
                      <Label htmlFor="schedule-date" className="text-sm">Date</Label>
                      <Input
                        id="schedule-date"
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="schedule-time" className="text-sm">Time</Label>
                      <Input
                        id="schedule-time"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">Expiry</Label>
                
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-3">
                  <p className="text-sm text-destructive">
                    Messages will be set as expired if delayed in sending and won't be sent for the further processing.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="no-expiry"
                    checked={noExpiry}
                    onCheckedChange={setNoExpiry}
                  />
                  <Label htmlFor="no-expiry" className="cursor-pointer">No Expiry for Processing</Label>
                </div>

                {!noExpiry && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-10">
                    <div>
                      <Label htmlFor="expiry-date" className="text-sm">Expiry Date</Label>
                      <Input
                        id="expiry-date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry-time" className="text-sm">Expiry Time</Label>
                      <Input
                        id="expiry-time"
                        type="time"
                        value={expiryTime}
                        onChange={(e) => setExpiryTime(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label htmlFor="phone-number">Send using Phone Number</Label>
                <Select value={sendingPhoneNumber} onValueChange={setSendingPhoneNumber}>
                  <SelectTrigger id="phone-number" className="mt-2">
                    <SelectValue placeholder="Select phone number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91 63727 44534">+91 63727 44534</SelectItem>
                    <SelectItem value="+91 98765 43210">+91 98765 43210</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Campaign Summary</Label>
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="col-span-2 font-medium">{selectedTemplate?.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Campaign Title:</span>
                    <span className="col-span-2 font-medium">{campaignTitle || 'Untitled'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Contact Group:</span>
                    <span className="col-span-2 font-medium">{contactsGroup || 'None selected'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="col-span-2 font-medium">
                      {scheduleNow ? 'Now' : `${scheduleDate} at ${scheduleTime}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-muted-foreground">Phone Number:</span>
                    <span className="col-span-2 font-medium">{sendingPhoneNumber}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-semibold mb-3">Message Preview</Label>
                <div className="mt-3 border rounded-lg p-4 bg-muted/20">
                  {selectedTemplate?.header && (
                    <div className="font-semibold mb-2">{selectedTemplate.header}</div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{getPreviewMessage()}</div>
                  {selectedTemplate?.footer && (
                    <div className="text-xs text-muted-foreground mt-2">{selectedTemplate.footer}</div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Please note:</strong> Words like {'{'}1{'}'}, {'{'}label{'}'} etc are dynamic variables and will be replaced based on your selections.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 md:px-6 md:py-4 gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon" className="md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">WhatsApp Campaigns</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {total} total campaign{total === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              disabled={isLoading}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} ${!isMobile ? 'mr-2' : ''}`} />
              {!isMobile && 'Refresh'}
            </Button>
            <Button onClick={openCreate} size={isMobile ? 'sm' : 'default'}>
              <Plus className="h-4 w-4 mr-2" />
              {isMobile ? 'New' : 'New Campaign'}
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-4 md:px-6 pb-3">
            <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 text-destructive px-3 py-2 text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <CampaignsTable campaigns={campaigns} isLoading={isLoading} onView={onView} />
      </div>

      {/* Create Campaign Drawer with Steps */}
      <SideDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Campaign"
        mode="create"
        isLoading={false}
        size="xl"
        resizable
      >
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStepIndex === index;
                const isCompleted = currentStepIndex > index;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center mb-2
                          ${isActive ? 'bg-primary text-primary-foreground' : ''}
                          ${isCompleted ? 'bg-green-500 text-white' : ''}
                          ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                        `}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground mx-2 hidden sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Title */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="text-lg font-semibold text-primary">
              Step {currentStepIndex + 1}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {currentStep === 'template' && 'Select a template for your campaign'}
              {currentStep === 'contacts' && 'Configure contacts and schedule'}
              {currentStep === 'review' && 'Review and send your campaign'}
            </p>
          </div>

          <Separator />

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 'template'}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>

              {currentStep !== 'review' ? (
                <Button onClick={handleNextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={creating}>
                  <Send className="h-4 w-4 mr-2" />
                  {creating ? 'Scheduling...' : 'Schedule Campaign'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SideDrawer>

      {/* View Campaign Drawer */}
      <SideDrawer
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={viewItem?.campaign_name || 'Campaign Details'}
        mode="view"
        isLoading={false}
        size="xl"
        resizable
      >
        {!viewItem ? (
          <div className="text-sm text-muted-foreground">No campaign selected.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-2">
              <div className="text-xs text-muted-foreground">Campaign ID</div>
              <div className="text-sm font-mono break-all">{viewItem.campaign_id}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Created</div>
                <div className="text-xs sm:text-sm font-medium mt-1 break-words">{formatDate(viewItem.created_at)}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Recipients</div>
                <div className="text-sm font-medium mt-1">{viewItem.total_recipients}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Sent</div>
                <div className="text-sm font-medium mt-1">{viewItem.sent_count}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Failed</div>
                <div className={`text-sm font-medium mt-1 ${viewItem.failed_count ? 'text-red-600' : ''}`}>
                  {viewItem.failed_count}
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Success Rate</div>
                <Badge variant="secondary">{rate(viewItem)}%</Badge>
              </div>
              <Progress value={rate(viewItem)} className="h-2" />
            </div>

            {/* Results */}
            {Array.isArray(viewItem.results) && viewItem.results.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Delivery Results</div>
                <div className="rounded border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-3 py-2 whitespace-nowrap">Phone</th>
                          <th className="text-left px-3 py-2 whitespace-nowrap">Status</th>
                          <th className="text-left px-3 py-2 whitespace-nowrap">Message ID</th>
                          <th className="text-left px-3 py-2 whitespace-nowrap">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewItem.results.slice(0, 50).map((r: any, idx: number) => (
                          <tr key={`${r.phone}-${idx}`} className="border-t">
                            <td className="px-3 py-2 font-mono text-xs">{r.phone}</td>
                            <td className="px-3 py-2">
                              <Badge
                                variant="secondary"
                                className={
                                  r.status === 'sent'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {r.status}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs break-all">{r.message_id || '-'}</td>
                            <td className="px-3 py-2 text-xs text-red-700 break-words max-w-xs">{r.error || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {viewItem.results.length > 50 && (
                  <div className="text-xs text-muted-foreground">
                    Showing first 50 of {viewItem.results.length} results.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </SideDrawer>
    </div>
  );
}