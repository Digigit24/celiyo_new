// src/pages/Campaigns.tsx
import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, ArrowLeft, Phone, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

  // Create form state
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [recipientsText, setRecipientsText] = useState('');

  const total = campaigns.length;

  const handleRefresh = async () => {
    await refetch();
    toast.success('Campaigns refreshed');
  };

  const openCreate = () => {
    setName('');
    setMessageText('');
    setRecipientsText('');
    setCreateOpen(true);
  };

  const onView = async (row: WACampaign) => {
    // Ensure latest detail (if BE enriches later). Otherwise just show row.
    const fresh = await getCampaign(row.campaign_id);
    setViewItem(fresh || row);
    setViewOpen(true);
  };

  const parseRecipients = (input: string): string[] => {
    // Accept comma/newline/space separated; keep digits and '+'; trim empties
    const parts = input
      .split(/[\n,;\s]+/g)
      .map((x) => x.trim())
      .filter(Boolean);

    // Dedup
    const unique = Array.from(new Set(parts));
    return unique;
  };

  const handleCreate = async () => {
    const recipients = parseRecipients(recipientsText);

    if (!messageText.trim()) {
      toast.error('Message is required');
      return;
    }
    if (recipients.length === 0) {
      toast.error('At least one recipient is required');
      return;
    }

    const payload: CreateCampaignPayload = {
      campaign_name: name.trim() || 'Untitled Campaign',
      message_text: messageText.trim(),
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

  // Derived
  const viewStats = useMemo(() => (viewItem ? stats(viewItem) : null), [viewItem, stats]);

  // Page content
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
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
              {!isMobile && 'New Campaign'}
            </Button>
          </div>
        </div>

        {/* Error banner if any */}
        {error && (
          <div className="px-4 md:px-6 pb-3">
            <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 text-destructive px-3 py-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <CampaignsTable campaigns={campaigns} isLoading={isLoading} onView={onView} />
      </div>

      {/* Create Drawer */}
      <SideDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Campaign"
        mode="create"
        isLoading={false}
        footerButtons={[
          {
            label: 'Cancel',
            variant: 'outline',
            onClick: () => setCreateOpen(false),
          },
          {
            label: creating ? 'Creating...' : 'Create & Send',
            onClick: handleCreate,
            loading: creating,
            icon: Send,
          },
        ]}
        size="xl"
        resizable
      >
        <div className="space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Campaign Name</label>
            <Input
              placeholder="Optional name (e.g., Diwali Greetings)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave blank to auto-generate a name.</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Type your WhatsApp message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">Plain text message to be sent to all recipients.</p>
          </div>

          <Separator />

          <div className="grid gap-2">
            <label className="text-sm font-medium">Recipients</label>
            <Textarea
              placeholder="+911234567890, +919876543210 or one per line"
              value={recipientsText}
              onChange={(e) => setRecipientsText(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Separate numbers by commas, spaces, or new lines. Duplicates will be removed.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>
                Parsed recipients: {parseRecipients(recipientsText).length}
              </span>
            </div>
          </div>
        </div>
      </SideDrawer>

      {/* View Drawer */}
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
              <div className="text-sm font-mono">{viewItem.campaign_id}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Created</div>
                <div className="text-sm font-medium">{formatDate(viewItem.created_at)}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Recipients</div>
                <div className="text-sm font-medium">{viewItem.total_recipients}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Sent</div>
                <div className="text-sm font-medium">{viewItem.sent_count}</div>
              </div>
              <div className="rounded border p-3">
                <div className="text-[10px] uppercase text-muted-foreground">Failed</div>
                <div className={`text-sm font-medium ${viewItem.failed_count ? 'text-red-600' : ''}`}>
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
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-3 py-2">Phone</th>
                        <th className="text-left px-3 py-2">Status</th>
                        <th className="text-left px-3 py-2">Message ID</th>
                        <th className="text-left px-3 py-2">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.results.slice(0, 50).map((r: any, idx: number) => (
                        <tr key={`${r.phone}-${idx}`} className="border-t">
                          <td className="px-3 py-2 font-mono">{r.phone}</td>
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
                          <td className="px-3 py-2 font-mono text-xs">{r.message_id || '-'}</td>
                          <td className="px-3 py-2 text-xs text-red-700">{r.error || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {viewItem.results.length > 50 && (
                  <div className="text-xs text-muted-foreground">
                    Showing first 50 results.
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