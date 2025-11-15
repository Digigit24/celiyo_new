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

  // Generate a unique gradient for each column based on status color
  const getColumnGradient = (color: string, index: number) => {
    const gradients = [
      'from-blue-50/80 via-indigo-50/60 to-purple-50/80',
      'from-emerald-50/80 via-teal-50/60 to-cyan-50/80',
      'from-amber-50/80 via-orange-50/60 to-red-50/80',
      'from-pink-50/80 via-rose-50/60 to-fuchsia-50/80',
      'from-violet-50/80 via-purple-50/60 to-indigo-50/80',
      'from-lime-50/80 via-green-50/60 to-emerald-50/80',
    ];
    return gradients[index % gradients.length];
  };

  const getBorderGradient = (color: string) => {
    return `linear-gradient(135deg, ${color}40, ${color}20)`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board Header - Modern Design */}
      <div className="flex-shrink-0 mb-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Pipeline Overview
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="font-semibold text-indigo-600">{leads.length}</span> leads
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="font-semibold text-purple-600">{sortedStatuses.length}</span> stages
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onCreateStatus}
                className="bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-sm border-indigo-200/50 hover:border-indigo-300/50 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board - Enhanced Design */}
      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="flex gap-5 h-full overflow-x-auto pb-4 px-1">
            {sortedStatuses.map((status, index) => {
              const statusLeads = leadsByStatus[status.id] || [];
              const columnGradient = getColumnGradient(status.color_hex || '#6B7280', index);

              return (
                <Droppable key={status.id} droppableId={`status-${status.id}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="h-full"
                    >
                      <div className={`
                        flex flex-col h-full min-w-[300px] max-w-[300px] md:min-w-[340px] md:max-w-[340px]
                        transition-all duration-300
                        ${snapshot.isDraggingOver ? 'scale-[1.02]' : 'scale-100'}
                      `}>
                        {/* Column Header - Modern Gradient Design */}
                        <div className="flex-shrink-0 mb-4">
                          <div className={`
                            relative overflow-hidden rounded-xl
                            bg-gradient-to-br ${columnGradient}
                            border-2 backdrop-blur-sm
                            transition-all duration-300
                            ${snapshot.isDraggingOver
                              ? 'border-indigo-400 shadow-lg shadow-indigo-200/50 scale-[1.02]'
                              : 'border-transparent shadow-sm hover:shadow-md'
                            }
                          `}
                          style={{
                            borderImage: snapshot.isDraggingOver ? 'none' : getBorderGradient(status.color_hex || '#6B7280'),
                            borderImageSlice: 1,
                          }}
                          >
                            {/* Animated gradient overlay on drag */}
                            {snapshot.isDraggingOver && (
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
                            )}

                            <div className="relative p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div
                                    className="w-3 h-3 rounded-full shadow-lg ring-2 ring-white/50 flex-shrink-0"
                                    style={{
                                      backgroundColor: status.color_hex || '#6B7280',
                                      boxShadow: `0 0 12px ${status.color_hex}60`
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base text-gray-900 truncate">
                                      {status.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 text-gray-700 shadow-sm">
                                        {statusLeads.length} {statusLeads.length === 1 ? 'lead' : 'leads'}
                                      </span>
                                      {status.is_won && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                                          Won
                                        </span>
                                      )}
                                      {status.is_lost && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm">
                                          Lost
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column Content - Enhanced Scrollable Area */}
                        <div className={`
                          flex-1 overflow-y-auto space-y-3 pr-1
                          transition-all duration-300 rounded-lg p-2
                          ${snapshot.isDraggingOver ? 'bg-indigo-50/30' : ''}
                        `}>
                          {statusLeads.length === 0 ? (
                            <div className="relative overflow-hidden border-2 border-dashed border-gray-300/60 rounded-xl p-8 text-center bg-white/40 backdrop-blur-sm hover:border-gray-400/60 transition-all duration-200">
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent"></div>
                              <div className="relative">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <Plus className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium mb-2">No leads yet</p>
                                <button
                                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                  onClick={() => onCreateLead(status.id)}
                                >
                                  Add your first lead
                                </button>
                              </div>
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
                                    className={`
                                      transition-all duration-200
                                      ${snapshot.isDragging
                                        ? 'opacity-70 rotate-3 scale-105 shadow-2xl shadow-indigo-300/50'
                                        : 'opacity-100 rotate-0 scale-100'
                                      }
                                    `}
                                  >
                                    <div
                                      className="relative group bg-white border border-gray-200/80 rounded-xl p-4 cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 hover:border-indigo-300/50 transition-all duration-200 hover:-translate-y-1 backdrop-blur-sm"
                                      onClick={() => onViewLead(lead)}
                                    >
                                      {/* Hover gradient overlay */}
                                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-200"></div>

                                      <div className="relative space-y-3">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                              {lead.name}
                                            </h3>
                                            {lead.title && (
                                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {lead.title}
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <span className={`
                                              text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm
                                              ${lead.priority === 'HIGH'
                                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                                : lead.priority === 'MEDIUM'
                                                  ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white'
                                                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                              }
                                            `}>
                                              {lead.priority}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Company */}
                                        {lead.company && (
                                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-2.5 py-1.5">
                                            <span className="truncate font-medium">{lead.company}</span>
                                          </div>
                                        )}

                                        {/* Contact */}
                                        <div className="text-xs space-y-1">
                                          <div className="text-gray-700 font-medium">{lead.phone}</div>
                                          {lead.email && (
                                            <div className="text-gray-500 truncate">{lead.email}</div>
                                          )}
                                        </div>

                                        {/* Value */}
                                        {lead.value_amount && (
                                          <div className="inline-flex items-center gap-1.5 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                                            <span className="text-green-500">$</span>
                                            {parseFloat(lead.value_amount).toLocaleString()}
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

                        {/* Add Lead Button - Modern Design */}
                        <div className="flex-shrink-0 mt-4">
                          <button
                            className="w-full group relative overflow-hidden border-2 border-dashed border-gray-300/60 rounded-xl p-3.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-400/60 hover:bg-indigo-50/50 transition-all duration-200"
                            onClick={() => onCreateLead(status.id)}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                              <span>Add Lead</span>
                            </div>
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