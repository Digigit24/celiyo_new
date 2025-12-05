import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable, DataTableColumn } from '@/components/DataTable';
import {
    DollarSign,
    Stethoscope,
    Eye,
    Pencil,
    Trash2,
    MoreVertical,
} from 'lucide-react';
import { OpdVisit } from '@/types/opdVisit.types';
import { format } from 'date-fns';

interface VisitsListProps {
    visits: OpdVisit[];
    loading: boolean;
    totalCount: number;
    page: number;
    onPageChange: (page: number) => void;
    hasNext: boolean;
    hasPrevious: boolean;
    onView: (visit: OpdVisit) => void;
    onEdit: (visit: OpdVisit) => void;
    onDelete: (visit: OpdVisit) => void;
    onBilling: (visit: OpdVisit) => void;
    onConsultation: (visit: OpdVisit) => void;
}

export const VisitsList: React.FC<VisitsListProps> = ({
    visits,
    loading,
    totalCount,
    page,
    onPageChange,
    hasNext,
    hasPrevious,
    onView,
    onEdit,
    onDelete,
    onBilling,
    onConsultation,
}) => {
    // Format date and time for display
    const formatDateTime = (date: string, time: string) => {
        try {
            const dateTime = new Date(`${date}T${time}`);
            return format(dateTime, 'MMM dd, yyyy • hh:mm a');
        } catch {
            return `${date} • ${time}`;
        }
    };

    // DataTable columns configuration
    const columns: DataTableColumn<OpdVisit>[] = [
        {
            header: 'Visit',
            key: 'visit_number',
            className: 'w-[12%]',
            cell: (visit) => (
                <div className="flex flex-col">
                    <span className="font-medium font-mono text-sm">{visit.visit_number}</span>
                    {visit.queue_number && (
                        <Badge variant="outline" className="text-xs w-fit mt-1">Queue #{visit.queue_number}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(visit.visit_date, visit.visit_time)}
                    </span>
                </div>
            ),
        },
        {
            header: 'Patient',
            key: 'patient',
            className: 'w-[18%]',
            cell: (visit) => (
                <div className="flex flex-col">
                    <span className="font-medium">{visit.patient_details?.full_name || visit.patient_name || 'N/A'}</span>
                    <span className="text-xs text-muted-foreground">
                        {visit.patient_details?.patient_id || ''}
                        {visit.patient_details?.mobile_primary ? ` • ${visit.patient_details.mobile_primary}` : ''}
                    </span>
                </div>
            ),
        },
        {
            header: 'Doctor',
            key: 'doctor',
            className: 'w-[18%]',
            cell: (visit) => (
                <div className="flex flex-col">
                    <span className="font-medium">{visit.doctor_details?.full_name || visit.doctor_name || 'N/A'}</span>
                    <span className="text-xs text-muted-foreground">
                        {visit.doctor_details?.specialties?.slice(0, 1).map(s => s.name).join(', ')}
                    </span>
                </div>
            ),
        },
        {
            header: 'Type',
            key: 'type',
            className: 'w-[12%]',
            cell: (visit) => (
                <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="text-xs w-fit">
                        {visit.visit_type ? visit.visit_type.replace('_', ' ').toUpperCase() : 'N/A'}
                    </Badge>
                    <Badge
                        variant={visit.priority === 'urgent' || visit.priority === 'high' ? 'destructive' : 'outline'}
                        className={`text-xs w-fit ${visit.priority === 'high' ? 'bg-orange-600 text-white' : ''}`}
                    >
                        {visit.priority ? visit.priority.toUpperCase() : 'NORMAL'}
                    </Badge>
                </div>
            ),
        },
        {
            header: 'Status',
            key: 'status',
            className: 'w-[10%]',
            cell: (visit) => {
                const statusConfig = {
                    waiting: { label: 'Waiting', className: 'bg-orange-600' },
                    in_progress: { label: 'In Progress', className: 'bg-blue-600' },
                    completed: { label: 'Completed', className: 'bg-green-600' },
                    cancelled: { label: 'Cancelled', className: 'bg-red-600' },
                    no_show: { label: 'No Show', className: 'bg-gray-600' },
                };
                const config = visit.status ? statusConfig[visit.status] : { label: 'Unknown', className: 'bg-gray-600' };
                return (
                    <Badge variant="default" className={config.className}>
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            header: 'Payment',
            key: 'payment',
            className: 'w-[12%]',
            cell: (visit) => (
                <div className="flex flex-col text-sm">
                    <span className="font-medium">₹{visit.total_amount || '0'}</span>
                    <Badge
                        variant={visit.payment_status === 'paid' ? 'default' : 'secondary'}
                        className={`text-xs ${visit.payment_status === 'paid' ? 'bg-green-600' : ''}`}
                    >
                        {visit.payment_status ? visit.payment_status.replace('_', ' ').toUpperCase() : 'PENDING'}
                    </Badge>
                </div>
            ),
        },
        {
            header: 'Actions',
            key: 'actions',
            className: 'w-[18%]',
            cell: (visit) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBilling(visit);
                        }}
                        className="h-8"
                    >
                        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                        Billing
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onConsultation(visit);
                        }}
                        className="h-8"
                    >
                        <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                        Consult
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(visit);
                                }}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(visit);
                                }}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Visit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(visit);
                                }}
                                className="text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Visit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    // Mobile card renderer
    const renderMobileCard = (visit: OpdVisit, actions: any) => {
        return (
            <>
                {/* Header Row */}
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm font-mono">{visit.visit_number}</h3>
                        {visit.queue_number && (
                            <Badge variant="outline" className="text-xs mt-1">Queue #{visit.queue_number}</Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(visit.visit_date, visit.visit_time)}
                        </p>
                    </div>
                    <Badge
                        variant="default"
                        className={
                            visit.status === 'completed'
                                ? 'bg-green-600'
                                : visit.status === 'in_progress'
                                    ? 'bg-blue-600'
                                    : visit.status === 'waiting'
                                        ? 'bg-orange-600'
                                        : visit.status === 'cancelled' || visit.status === 'no_show'
                                            ? 'bg-red-600'
                                            : 'bg-gray-600'
                        }
                    >
                        {visit.status ? visit.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                    </Badge>
                </div>

                {/* Patient & Doctor */}
                <div className="space-y-1">
                    <div className="text-sm">
                        <span className="text-muted-foreground">Patient: </span>
                        <span className="font-medium">{visit.patient_details?.full_name || visit.patient_name || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-muted-foreground">Doctor: </span>
                        <span className="font-medium">{visit.doctor_details?.full_name || visit.doctor_name || 'N/A'}</span>
                    </div>
                </div>

                {/* Details Row */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {visit.visit_type ? visit.visit_type.replace('_', ' ').toUpperCase() : 'N/A'}
                    </Badge>
                    <Badge
                        variant={visit.priority === 'urgent' || visit.priority === 'high' ? 'destructive' : 'outline'}
                        className={`text-xs ${visit.priority === 'high' ? 'bg-orange-600 text-white' : ''}`}
                    >
                        {visit.priority ? visit.priority.toUpperCase() : 'NORMAL'}
                    </Badge>
                    <Badge
                        variant={visit.payment_status === 'paid' ? 'default' : 'secondary'}
                        className={`text-xs ${visit.payment_status === 'paid' ? 'bg-green-600' : ''}`}
                    >
                        ₹{visit.total_amount || '0'} • {visit.payment_status ? visit.payment_status.replace('_', ' ').toUpperCase() : 'PENDING'}
                    </Badge>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBilling(visit);
                        }}
                        className="flex-1"
                    >
                        <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                        Billing
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onConsultation(visit);
                        }}
                        className="flex-1"
                    >
                        <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                        Consult
                    </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    {actions.view && (
                        <Button size="sm" variant="outline" onClick={actions.view} className="flex-1">
                            View
                        </Button>
                    )}
                    {actions.edit && (
                        <Button size="sm" variant="outline" onClick={actions.edit} className="flex-1">
                            Edit
                        </Button>
                    )}
                    {actions.askDelete && (
                        <Button size="sm" variant="destructive" onClick={actions.askDelete}>
                            Delete
                        </Button>
                    )}
                </div>
            </>
        );
    };

    return (
        <>
            <DataTable
                rows={visits}
                isLoading={loading}
                columns={columns}
                renderMobileCard={renderMobileCard}
                getRowId={(visit) => visit.id}
                getRowLabel={(visit) => visit.visit_number}
                onView={onView}
                emptyTitle="No visits found"
                emptySubtitle="Try adjusting your search or filters, or create a new visit"
            />

            {/* Pagination */}
            {!loading && visits.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Showing {visits.length} of {totalCount} visit(s)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasPrevious}
                            onClick={() => onPageChange(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!hasNext}
                            onClick={() => onPageChange(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
