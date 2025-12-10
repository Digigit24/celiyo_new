// src/pages/CRMLeadDetail.tsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCRM } from '@/hooks/useCRM';
import { useMeeting } from '@/hooks/useMeeting';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  IndianRupee,
  Edit,
  Trash2,
  Activity,
  CheckCircle2,
  Users,
  Plus,
  FileText,
  Clock,
  User,
  Video,
  MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import type { Lead, LeadActivity, LeadStatus, PriorityEnum } from '@/types/crmTypes';
import type { Meeting } from '@/types/meeting.types';

type TabValue = 'details' | 'activities' | 'status' | 'meetings';

export const CRMLeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useLead, useLeadActivities, useLeadStatuses, deleteLead } = useCRM();
  const { useMeetings } = useMeeting();

  // State
  const [activeTab, setActiveTab] = useState<TabValue>('details');
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch lead data
  const leadId = id ? parseInt(id, 10) : null;
  const { data: lead, error, isLoading, mutate } = useLead(leadId || 0);

  // Fetch related data
  const { data: activitiesData, mutate: mutateActivities } = useLeadActivities(
    leadId ? { lead: leadId, ordering: '-happened_at', page_size: 100 } : undefined
  );

  const { data: statusesData } = useLeadStatuses({
    page_size: 100,
    ordering: 'order_index',
    is_active: true,
  });

  const { data: meetingsData, mutate: mutateMeetings } = useMeetings(
    leadId ? { lead: leadId, ordering: '-start_at', page_size: 100 } : undefined
  );

  // Handle back navigation
  const handleBack = () => {
    navigate('/crm/leads');
  };

  // Handle edit
  const handleEdit = () => {
    // TODO: Open edit drawer or navigate to edit page
    toast.info('Edit functionality coming soon');
  };

  // Handle delete
  const handleDelete = async () => {
    if (!lead) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete lead "${lead.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteLead(lead.id);
      toast.success(`Lead "${lead.name}" deleted successfully`);
      navigate('/crm/leads');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete lead');
      setIsDeleting(false);
    }
  };

  // Get status object from ID
  const getStatusById = (statusId?: number): LeadStatus | undefined => {
    if (!statusId || !statusesData?.results) return undefined;
    return statusesData.results.find((s) => s.id === statusId);
  };

  const currentStatus = getStatusById(lead?.status);

  // Priority badge helper
  const getPriorityBadge = (priority: PriorityEnum) => {
    const variants = {
      LOW: 'bg-gray-100 text-gray-800 border-gray-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[priority]}>
        {priority}
      </Badge>
    );
  };

  // Status badge helper
  const getStatusBadge = (status?: LeadStatus) => {
    if (!status) return <Badge variant="outline">No Status</Badge>;

    const bgColor = status.color_hex || '#6B7280';

    return (
      <Badge
        variant="outline"
        style={{
          backgroundColor: `${bgColor}20`,
          borderColor: bgColor,
          color: bgColor,
        }}
      >
        {status.name}
      </Badge>
    );
  };

  // Activity type icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return <Phone className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'MEETING':
        return <Users className="h-4 w-4" />;
      case 'NOTE':
        return <FileText className="h-4 w-4" />;
      case 'TASK':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // Format currency
  const formatCurrency = (amount?: string, currency?: string) => {
    if (!amount) return '-';
    const formatted = parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency || '$'}${formatted}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading lead details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lead) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Lead Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The lead you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          {/* Back Button & Actions */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>

          {/* Lead Header Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold tracking-tight truncate">{lead.name}</h1>
                {getPriorityBadge(lead.priority)}
                {getStatusBadge(currentStatus)}
              </div>
              {lead.title && <p className="text-sm text-muted-foreground">{lead.title}</p>}
              {lead.company && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.company}</span>
                </div>
              )}
            </div>
            {lead.value_amount && (
              <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                <IndianRupee className="h-6 w-6" />
                <span>{formatCurrency(lead.value_amount, lead.value_currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="h-full flex flex-col">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activities
                  {activitiesData?.results && (
                    <Badge variant="secondary" className="ml-1">
                      {activitiesData.count}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Status
                </TabsTrigger>
                <TabsTrigger value="meetings" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Meetings
                  {meetingsData?.results && (
                    <Badge variant="secondary" className="ml-1">
                      {meetingsData.count}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 sm:px-6 py-6">
              {/* Details Tab */}
              <TabsContent value="details" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {lead.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{lead.phone}</p>
                          </div>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                      )}
                      {lead.address && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">{lead.address}</p>
                          </div>
                        </div>
                      )}
                      {lead.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Website</p>
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {lead.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Lead Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lead Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Priority</p>
                        {getPriorityBadge(lead.priority)}
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Status</p>
                        {getStatusBadge(currentStatus)}
                      </div>
                      {lead.source && (
                        <div>
                          <p className="text-sm font-medium mb-1">Source</p>
                          <p className="text-sm text-muted-foreground">{lead.source}</p>
                        </div>
                      )}
                      {lead.value_amount && (
                        <div>
                          <p className="text-sm font-medium mb-1">Value</p>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(lead.value_amount, lead.value_currency)}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Additional Information */}
                  {lead.notes && (
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {lead.notes}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Timestamps */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(lead.created_at), 'PPpp')} (
                            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(lead.updated_at), 'PPpp')} (
                            {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })})
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activities Tab */}
              <TabsContent value="activities" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Activities</CardTitle>
                      <CardDescription>
                        All interactions and communications with this lead
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Activity
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {activitiesData && activitiesData.results.length > 0 ? (
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                          {activitiesData.results.map((activity: LeadActivity) => (
                            <div
                              key={activity.id}
                              className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {getActivityIcon(activity.type)}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline">{activity.type}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(activity.happened_at), 'PPp')}
                                  </span>
                                </div>
                                <p className="text-sm mb-2">{activity.content}</p>
                                {activity.meta && (
                                  <p className="text-xs text-muted-foreground">{activity.meta}</p>
                                )}
                                {activity.file_url && (
                                  <a
                                    href={activity.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    View attachment
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-12">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No activities yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start tracking interactions with this lead
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Activity
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Status Tab */}
              <TabsContent value="status" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Status History</CardTitle>
                    <CardDescription>Track the progression of this lead</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Current Status */}
                      <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Current Status</span>
                          {getStatusBadge(currentStatus)}
                        </div>
                        {currentStatus?.is_won && (
                          <Badge variant="default" className="bg-green-600">
                            Won
                          </Badge>
                        )}
                        {currentStatus?.is_lost && (
                          <Badge variant="destructive">Lost</Badge>
                        )}
                      </div>

                      {/* Available Statuses */}
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-3">Available Statuses</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {statusesData?.results.map((status) => (
                            <div
                              key={status.id}
                              className={`p-3 border rounded-lg ${
                                status.id === lead.status
                                  ? 'border-primary bg-primary/5'
                                  : 'hover:bg-accent/50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                {getStatusBadge(status)}
                                {status.id === lead.status && (
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              {(status.is_won || status.is_lost) && (
                                <div className="mt-2 flex gap-2">
                                  {status.is_won && (
                                    <Badge variant="outline" className="text-xs">
                                      Won
                                    </Badge>
                                  )}
                                  {status.is_lost && (
                                    <Badge variant="outline" className="text-xs">
                                      Lost
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Meetings Tab */}
              <TabsContent value="meetings" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Meetings</CardTitle>
                      <CardDescription>
                        Scheduled and past meetings with this lead
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {meetingsData && meetingsData.results.length > 0 ? (
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                          {meetingsData.results.map((meeting: Meeting) => {
                            const isPast = new Date(meeting.start_at) < new Date();
                            return (
                              <div
                                key={meeting.id}
                                className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex-shrink-0 mt-1">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                      isPast
                                        ? 'bg-gray-100 text-gray-600'
                                        : 'bg-blue-100 text-blue-600'
                                    }`}
                                  >
                                    <Video className="h-4 w-4" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium mb-1">{meeting.title}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {format(new Date(meeting.start_at), 'PPp')}
                                    </div>
                                    {meeting.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {meeting.location}
                                      </div>
                                    )}
                                  </div>
                                  {meeting.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {meeting.description}
                                    </p>
                                  )}
                                  {meeting.notes && (
                                    <div className="mt-2 p-2 bg-accent/50 rounded text-xs">
                                      <span className="font-medium">Notes: </span>
                                      {meeting.notes}
                                    </div>
                                  )}
                                  <Badge variant={isPast ? 'secondary' : 'default'} className="mt-2">
                                    {isPast ? 'Completed' : 'Upcoming'}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Schedule your first meeting with this lead
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
