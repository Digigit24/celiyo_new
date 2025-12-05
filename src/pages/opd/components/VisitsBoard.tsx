import React, { useMemo, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OpdVisit, VisitStatus } from '@/types/opdVisit.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    MoreVertical,
    Clock,
    User,
    Stethoscope,
    DollarSign,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface VisitsBoardProps {
    visits: OpdVisit[];
    loading: boolean;
    onStatusChange: (visitId: number, newStatus: VisitStatus) => void;
    onView: (visit: OpdVisit) => void;
    onEdit: (visit: OpdVisit) => void;
    onDelete: (visit: OpdVisit) => void;
    onBilling: (visit: OpdVisit) => void;
    onConsultation: (visit: OpdVisit) => void;
}

const COLUMNS: { id: VisitStatus; title: string; color: string }[] = [
    { id: 'waiting', title: 'Waiting', color: 'bg-orange-100 text-orange-800' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100 text-green-800' },
    { id: 'cancelled', title: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

// Sortable Card Component
const SortableVisitCard = ({
    visit,
    onView,
    onEdit,
    onDelete,
    onBilling,
    onConsultation,
}: {
    visit: OpdVisit;
    onView: (v: OpdVisit) => void;
    onEdit: (v: OpdVisit) => void;
    onDelete: (v: OpdVisit) => void;
    onBilling: (v: OpdVisit) => void;
    onConsultation: (v: OpdVisit) => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: visit.id,
        data: {
            type: 'Visit',
            visit,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatTime = (time: string) => {
        try {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return format(date, 'hh:mm a');
        } catch {
            return time;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="mb-3 touch-none"
        >
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
                <CardContent className="p-3 space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="font-mono text-xs font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                {visit.visit_number}
                            </span>
                            {visit.queue_number && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                    Q#{visit.queue_number}
                                </span>
                            )}
                        </div>
                        <Badge
                            variant={visit.priority === 'urgent' || visit.priority === 'high' ? 'destructive' : 'outline'}
                            className="text-[10px] px-1.5 h-5"
                        >
                            {visit.priority}
                        </Badge>
                    </div>

                    {/* Patient Info */}
                    <div>
                        <h4 className="font-medium text-sm truncate" title={visit.patient_details?.full_name || visit.patient_name}>
                            {visit.patient_details?.full_name || visit.patient_name || 'Unknown Patient'}
                        </h4>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span className="truncate">
                                {visit.patient_details?.age ? `${visit.patient_details.age}Y` : ''}
                                {visit.patient_details?.gender ? ` / ${visit.patient_details.gender[0]?.toUpperCase()}` : ''}
                            </span>
                        </div>
                    </div>

                    {/* Doctor & Time */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center truncate max-w-[60%]">
                            <Stethoscope className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate" title={visit.doctor_details?.full_name || visit.doctor_name}>
                                {(visit.doctor_details?.full_name || visit.doctor_name || 'Doc').split(' ')[0]}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(visit.visit_time)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-1 pt-1 border-t mt-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onBilling(visit);
                            }}
                            title="Billing"
                        >
                            <DollarSign className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                onConsultation(visit);
                            }}
                            title="Consultation"
                        >
                            <Stethoscope className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onView(visit)}>
                                    <Eye className="h-4 w-4 mr-2" /> View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(visit)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDelete(visit)} className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Helper component to make the column droppable
const ColumnDroppable = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'Column',
            status: id,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-1 min-h-[150px] rounded-md transition-colors ${isOver ? 'bg-slate-100/50 ring-2 ring-primary/20' : ''}`}
        >
            {children}
        </div>
    );
};

export const VisitsBoard: React.FC<VisitsBoardProps> = ({
    visits,
    loading,
    onStatusChange,
    onView,
    onEdit,
    onDelete,
    onBilling,
    onConsultation,
}) => {
    const [activeId, setActiveId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Group visits by status
    const columns = useMemo(() => {
        const cols: Record<VisitStatus, OpdVisit[]> = {
            waiting: [],
            in_progress: [],
            completed: [],
            cancelled: [],
            no_show: [],
        };

        visits.forEach((visit) => {
            if (cols[visit.status]) {
                cols[visit.status].push(visit);
            } else {
                // Handle unknown statuses or map them to a default
                if (!cols['waiting']) cols['waiting'] = [];
                cols['waiting'].push(visit);
            }
        });

        return cols;
    }, [visits]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as number);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // We can implement real-time reordering preview here if needed
        // For now, we just rely on DragEnd to update status
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;

        // Find the visit
        const visit = visits.find((v) => v.id === activeId);
        if (!visit) return;

        // Determine new status
        let newStatus: VisitStatus | null = null;

        // If dropped on a column container (id is status string)
        if (Object.keys(columns).includes(overId as string)) {
            newStatus = overId as VisitStatus;
        } else {
            // Dropped on another card?
            // Find which column the overId belongs to
            // We need to find the visit that corresponds to overId
            // But overId might be a number (visit id)
            const overVisit = visits.find((v) => v.id === overId);
            if (overVisit) {
                newStatus = overVisit.status;
            }
        }

        if (newStatus && newStatus !== visit.status) {
            onStatusChange(activeId, newStatus);
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const activeVisit = useMemo(
        () => visits.find((v) => v.id === activeId),
        [activeId, visits]
    );

    if (loading && visits.length === 0) {
        return <div className="p-8 text-center">Loading board...</div>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-250px)] overflow-x-auto gap-4 pb-4">
                {COLUMNS.map((col) => (
                    <div
                        key={col.id}
                        className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-lg border"
                    >
                        {/* Column Header */}
                        <div className={`p-3 border-b flex items-center justify-between ${col.color} bg-opacity-20 rounded-t-lg`}>
                            <h3 className="font-semibold text-sm">{col.title}</h3>
                            <Badge variant="secondary" className="bg-white/50 text-inherit border-0">
                                {columns[col.id]?.length || 0}
                            </Badge>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 p-2 overflow-y-auto min-h-0">
                            {/* We need a droppable wrapper for the column if it's empty or to drop at the end */}
                            <ColumnDroppable id={col.id}>
                                <SortableContext
                                    id={col.id}
                                    items={columns[col.id]?.map((v) => v.id) || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex flex-col gap-3 min-h-[50px]">
                                        {columns[col.id]?.map((visit) => (
                                            <SortableVisitCard
                                                key={visit.id}
                                                visit={visit}
                                                onView={onView}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onBilling={onBilling}
                                                onConsultation={onConsultation}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </ColumnDroppable>
                        </div>
                    </div>
                ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeVisit ? (
                    <div className="w-80">
                        <Card className="shadow-xl cursor-grabbing">
                            <CardContent className="p-3 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-mono text-xs font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                                            {activeVisit.visit_number}
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] px-1.5 h-5">
                                        {activeVisit.priority}
                                    </Badge>
                                </div>
                                <div>
                                    <div>
                                        <h4 className="font-medium text-sm truncate">
                                            {activeVisit.patient_details?.full_name || activeVisit.patient_name || 'Unknown Patient'}
                                        </h4>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
