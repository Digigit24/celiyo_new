// src/components/TemplateAnalyticsDrawer.tsx
import { useEffect, useState } from 'react';
import { X, RefreshCw, TrendingUp, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { templatesService } from '@/services/whatsapp/templatesService';
import { TemplateAnalytics } from '@/types/whatsappTypes';
import { toast } from 'sonner';
import { SideDrawer } from '@/components/SideDrawer';

interface TemplateAnalyticsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: number | null;
  templateName?: string;
}

export function TemplateAnalyticsDrawer({
  open,
  onOpenChange,
  templateId,
  templateName
}: TemplateAnalyticsDrawerProps) {
  const [analytics, setAnalytics] = useState<TemplateAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!templateId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await templatesService.getTemplateAnalytics(templateId);
      setAnalytics(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && templateId) {
      fetchAnalytics();
    }
  }, [open, templateId]);

  const handleRefresh = () => {
    fetchAnalytics();
    toast.success('Analytics refreshed');
  };

  const headerActions = (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRefresh}
      disabled={isLoading}
      title="Refresh analytics"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
    </Button>
  );

  const footerButtons = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
        Close
      </Button>
    </>
  );

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Template Analytics"
      description={templateName || 'View template performance metrics'}
      mode="view"
      size="lg"
      headerActions={headerActions}
      footerButtons={footerButtons}
    >
      <ScrollArea className="h-full">
        <div className="space-y-6 p-6">
          {/* Loading State */}
          {isLoading && !analytics && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading analytics...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !analytics && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-destructive mb-2">Error Loading Analytics</h3>
              <p className="text-sm text-destructive/80">{error}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Analytics Content */}
          {analytics && (
            <>
              {/* Template Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{analytics.template_name}</h3>
                  <Badge variant="secondary">
                    {analytics.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Template ID: {analytics.template_id}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total Sends */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Sends</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analytics.total_sends}
                  </div>
                </div>

                {/* Successful Sends */}
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">Successful</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analytics.successful_sends}
                  </div>
                </div>

                {/* Failed Sends */}
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-900 dark:text-red-100">Failed</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {analytics.failed_sends}
                  </div>
                </div>

                {/* Success Rate */}
                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analytics.success_rate.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Usage Count */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Usage Count</span>
                  </div>
                  <span className="text-lg font-semibold">{analytics.usage_count}</span>
                </div>
              </div>

              {/* Last Used */}
              {analytics.last_used_at && (
                <div className="text-sm text-muted-foreground">
                  Last used: {new Date(analytics.last_used_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}

              {/* Empty State */}
              {analytics.total_sends === 0 && (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Send className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-sm font-semibold mb-2">No sends yet</h3>
                  <p className="text-sm text-muted-foreground">
                    This template hasn't been used to send any messages yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </SideDrawer>
  );
}
