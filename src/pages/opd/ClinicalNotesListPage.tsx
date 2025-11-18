import { useState } from "react";
import { Plus, Search, Filter, FileText, Calendar } from "lucide-react";
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

interface ClinicalNotesListPageProps {
  initialFilters?: Record<string, any>;
  onApply?: () => void;
}

export default function ClinicalNotesListPage({ initialFilters, onApply }: ClinicalNotesListPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Replace with actual API call
  const notes = [
    {
      id: 1,
      visitId: "V001",
      patientName: "John Doe",
      patientId: "P001",
      doctor: "Dr. Smith",
      date: "2024-11-18",
      diagnosis: "Upper Respiratory Tract Infection",
      prescription: "Amoxicillin 500mg TID",
      status: "finalized",
    },
    {
      id: 2,
      visitId: "V002",
      patientName: "Jane Smith",
      patientId: "P002",
      doctor: "Dr. Johnson",
      date: "2024-11-18",
      diagnosis: "Migraine",
      prescription: "Sumatriptan 50mg PRN",
      status: "draft",
    },
    {
      id: 3,
      visitId: "V003",
      patientName: "Bob Wilson",
      patientId: "P003",
      doctor: "Dr. Smith",
      date: "2024-11-17",
      diagnosis: "Routine checkup - Healthy",
      prescription: "No medications prescribed",
      status: "finalized",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Draft", variant: "secondary" },
      finalized: { label: "Finalized", variant: "default" },
      archived: { label: "Archived", variant: "outline" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredNotes = notes.filter((note) =>
    note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clinical Notes</h2>
          <p className="text-muted-foreground">
            Manage clinical documentation and patient notes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalized</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">236</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Created today</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes Records</CardTitle>
          <CardDescription>
            View and manage all clinical notes and documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, diagnosis, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Prescription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No clinical notes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.visitId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{note.patientName}</div>
                          <div className="text-sm text-muted-foreground">{note.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{note.doctor}</TableCell>
                      <TableCell>{note.date}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">{note.diagnosis}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">{note.prescription}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(note.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
