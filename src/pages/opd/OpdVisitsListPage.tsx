import { useState } from "react";
import { Plus, Search, Calendar, User, Stethoscope, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useVisits, useVisitStatistics, useDeleteVisit } from "@/hooks/opd/useVisit.hooks";
import type { VisitStatus, PaymentStatus, VisitType } from "@/types/opd";

export default function OpdVisitsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch visits with filters
  const { visits, count, isLoading, mutate } = useVisits({
    search: searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    payment_status: paymentFilter !== "all" ? paymentFilter : undefined,
    page: currentPage,
    page_size: 20,
  });

  // Fetch statistics
  const { statistics } = useVisitStatistics();

  // Delete visit hook
  const { deleteVisit, isDeleting } = useDeleteVisit();

  const getStatusBadge = (status: VisitStatus) => {
    const config: Record<VisitStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      waiting: { label: "Waiting", variant: "secondary" },
      called: { label: "Called", variant: "default" },
      in_consultation: { label: "In Consultation", variant: "default" },
      completed: { label: "Completed", variant: "outline" },
      cancelled: { label: "Cancelled", variant: "destructive" },
      no_show: { label: "No Show", variant: "destructive" },
    };
    const cfg = config[status];
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    const config: Record<PaymentStatus, { variant: "default" | "secondary" | "destructive" }> = {
      paid: { variant: "default" },
      partial: { variant: "secondary" },
      unpaid: { variant: "destructive" },
    };
    return <Badge variant={config[status].variant}>{status.toUpperCase()}</Badge>;
  };

  const handleDelete = async (id: number, visitNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete visit ${visitNumber}?`)) return;

    try {
      await deleteVisit(id);
      toast.success("Visit deleted successfully");
      mutate(); // Refresh the list
    } catch (error: any) {
      toast.error("Failed to delete visit", {
        description: error?.message || "Please try again",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">OPD Visits</h2>
          <p className="text-muted-foreground">
            Manage outpatient department visits and appointments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Visit
        </Button>
      </div>

      {/* Stats Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total_visits}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.waiting}</div>
              <p className="text-xs text-muted-foreground">In queue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.in_consultation}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.completed}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Records</CardTitle>
          <CardDescription>View and manage all OPD visit records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, visit number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as VisitStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="called">Called</SelectItem>
                <SelectItem value="in_consultation">In Consultation</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v as PaymentStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit #</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : visits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No visits found
                    </TableCell>
                  </TableRow>
                ) : (
                  visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.visit_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{visit.patient_name}</div>
                          {visit.patient_id && (
                            <div className="text-sm text-muted-foreground">{visit.patient_id}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{visit.doctor_name || "Not assigned"}</TableCell>
                      <TableCell>
                        <div>
                          <div>{new Date(visit.visit_date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(visit.entry_time).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{visit.visit_type.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(visit.status)}</TableCell>
                      <TableCell>{getPaymentBadge(visit.payment_status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(visit.id, visit.visit_number)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Info */}
          {count > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Showing {visits.length} of {count} visits
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
