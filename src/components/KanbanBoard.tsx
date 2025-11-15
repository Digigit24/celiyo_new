// src/components/KanbanBoard.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { toast } from 'sonner';
import type { Lead, LeadStatus } from '@/types/crmTypes';

interface KanbanBoardProps {
  leads: Lead[];
  statuses: LeadStatus[];
  onViewLead: (lead: Lead) => void;
  onCreateLead: (statusId?: number) => void;
  onEditStatus: (status: LeadStatus) => void;
  onDeleteStatus: (status: LeadStatus) => void;
  onCreateStatus: () => void;
  onMoveStatus: (status: LeadStatus, direction: 'up' | 'down') => void;
  onUpdateLeadStatus: (leadId: number, newStatusId: number) => Promise<void>;
  isLoading?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  statuses,
  onViewLead,
  onCreateLead,
  onEditStatus,
  onDeleteStatus,
  onCreateStatus,
  onMoveStatus,
  onUpdateLeadStatus,
  isLoading = false
}) => {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  // Group leads by status
  const leadsByStatus = useMemo(() => {
    const grouped: Record<number, Lead[]> = {};
    
    // Initialize all statuses with empty arrays
    statuses.forEach(status => {
      grouped[status.id] = [];
    });
    
    // Group leads by their status
    leads.forEach(lead => {
      // Handle both object and number status formats
      const statusId = typeof lead.status === 'object' ? lead.status?.id : lead.status;
      if (statusId) {
        if (!grouped[statusId]) {
          grouped[statusId] = [];
        }
        grouped[statusId].push(lead);
      }
    });
    
    return grouped;
  }, [leads, statuses]);

  // Handle drag end - optimistic updates are now handled in parent component
  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside a droppable area
    if (!destination) {
      setDraggedLead(null);
      return;
    }
    
    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      setDraggedLead(null);
      return;
    }

    const leadId = parseInt(draggableId.replace('lead-', ''));
    const newStatusId = parseInt(destination.droppableId.replace('status-', ''));
    
    setDraggedLead(null);

    try {
      // The optimistic update is handled in the parent component via SWR mutate
      await onUpdateLeadStatus(leadId, newStatusId);
      toast.success('Lead status updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update lead status');
    }
  }, [onUpdateLeadStatus]);

  // Handle drag start
  const handleDragStart = useCallback((start: any) => {
    const leadId = parseInt(start.draggableId.replace('lead-', ''));
    const lead = leads.find(l => l.id === leadId);
    setDraggedLead(lead || null);
  }, [leads]);

  // Sort statuses by order_index
  const sortedStatuses = useMemo(() => {
    return [...statuses].sort((a, b) => a.order_index - b.order_index);
  }, [statuses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading kanban board...</p>
        </div>
      </div>
    );
  }

  if (sortedStatuses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Lead Statuses</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first lead status to start using the kanban board.
          </p>
          <Button onClick={onCreateStatus}>
            <Plus className="h-4 w-4 mr-2" />
            Create Status
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header - Minimalistic Design */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Pipeline Overview</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {leads.length} leads • {sortedStatuses.length} stages
            </p>
          </div>
          <Button variant="outline" onClick={onCreateStatus}>
            <Plus className="h-4 w-4 mr-2" />
            Add Status
          </Button>
        </div>
      </div>

      {/* Kanban Board - Minimalistic Design */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {sortedStatuses.map((status, index) => {
              const statusLeads = leadsByStatus[status.id] || [];

              return (
                <Droppable key={status.id} droppableId={`status-${status.id}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="h-full"
                    >
                      <div className="flex flex-col h-full min-w-[300px] max-w-[300px]">
                        {/* Column Header - Compact Minimalistic Design */}
                        <div className="flex-shrink-0 mb-3">
                          <div className={`
                            rounded-lg border bg-card
                            transition-all duration-200
                            ${snapshot.isDraggingOver
                              ? 'border-primary shadow-md'
                              : 'border-border'
                            }
                          `}>
                            <div className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: status.color_hex || '#3B82F6' }}
                                />
                                <h3 className="font-semibold text-sm text-foreground truncate flex-1">
                                  {status.name}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-muted-foreground font-medium">
                                    {statusLeads.length}
                                  </span>
                                  {status.is_won && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                                      Won
                                    </span>
                                  )}
                                  {status.is_lost && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-medium">
                                      Lost
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column Content - Minimalistic Scrollable Area */}
                        <div className={`
                          flex-1 overflow-y-auto space-y-2 pr-2
                          transition-colors duration-200
                          ${snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg' : ''}
                        `}>
                          {statusLeads.length === 0 ? (
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                              <p className="text-sm text-muted-foreground mb-2">No leads</p>
                              <button
                                className="text-sm font-medium text-primary hover:underline"
                                onClick={() => onCreateLead(status.id)}
                              >
                                Add lead
                              </button>
                            </div>
                          ) : (
                            statusLeads.map((lead, leadIndex) => (
                              <Draggable
                                key={lead.id}
                                draggableId={`lead-${lead.id}`}
                                index={leadIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...provided.draggableProps.style,
                                      cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                                    }}
                                    className={`
                                      transition-all duration-200
                                      ${snapshot.isDragging
                                        ? 'opacity-60 shadow-lg scale-[1.02] rotate-1'
                                        : 'opacity-100 shadow-none'
                                      }
                                    `}
                                  >
                                    <div
                                      className="bg-card border border-border rounded-lg p-3 hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
                                      onClick={() => !snapshot.isDragging && onViewLead(lead)}
                                    >
                                      <div className="space-y-2">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm text-foreground truncate">
                                              {lead.name}
                                            </h3>
                                            {lead.title && (
                                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                {lead.title}
                                              </p>
                                            )}
                                          </div>
                                          <span className={`
                                            text-xs px-2 py-0.5 rounded font-medium flex-shrink-0
                                            ${lead.priority === 'HIGH'
                                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                              : lead.priority === 'MEDIUM'
                                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                : 'bg-muted text-muted-foreground'
                                            }
                                          `}>
                                            {lead.priority}
                                          </span>
                                        </div>

                                        {/* Company */}
                                        {lead.company && (
                                          <div className="text-xs text-muted-foreground truncate">
                                            {lead.company}
                                          </div>
                                        )}

                                        {/* Contact */}
                                        <div className="text-xs space-y-0.5">
                                          <div className="text-foreground">{lead.phone}</div>
                                          {lead.email && (
                                            <div className="text-muted-foreground truncate">{lead.email}</div>
                                          )}
                                        </div>

                                        {/* Value */}
                                        {lead.value_amount && (
                                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            ${parseFloat(lead.value_amount).toLocaleString()}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                        </div>

                        {/* Add Lead Button - Minimalistic Design */}
                        <div className="flex-shrink-0 mt-3">
                          <button
                            className="w-full border border-dashed border-border rounded-lg py-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                            onClick={() => onCreateLead(status.id)}
                          >
                            + Add Lead
                          </button>
                        </div>
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};