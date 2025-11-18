import { useState } from "react";
import { Plus, Search, Filter, Activity, AlertCircle } from "lucide-react";
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

export default function VisitFindingsListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Replace with actual API call
  const findings = [
    {
      id: 1,
      visitId: "V001",
      patientName: "John Doe",
      patientId: "P001",
      doctor: "Dr. Smith",
      date: "2024-11-18",
      findingType: "Physical Examination",
      findings: "Throat inflammation observed, temperature elevated at 101°F",
      severity: "moderate",
    },
    {
      id: 2,
      visitId: "V002",
      patientName: "Jane Smith",
      patientId: "P002",
      doctor: "Dr. Johnson",
      date: "2024-11-18",
      findingType: "Neurological",
      findings: "Photophobia and phonophobia present, mild dehydration",
      severity: "mild",
    },
    {
      id: 3,
      visitId: "V003",
      patientName: "Bob Wilson",
      patientId: "P003",
      doctor: "Dr. Smith",
      date: "2024-11-17",
      findingType: "General",
      findings: "All vital signs normal, no abnormalities detected",
      severity: "normal",
    },
  ];

  const getSeverityBadge = (severity: string) => {
    const severityConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      normal: { label: "Normal", variant: "outline" },
      mild: { label: "Mild", variant: "secondary" },
      moderate: { label: "Moderate", variant: "default" },
      severe: { label: "Severe", variant: "destructive" },
    };

    const config = severityConfig[severity] || severityConfig.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredFindings = findings.filter((finding) =>
    finding.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    finding.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    finding.findings.toLowerCase().includes(searchTerm.toLowerCase()) ||
    finding.findingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visit Findings</h2>
          <p className="text-muted-foreground">
            Record and manage clinical findings and observations
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Finding
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Normal</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-muted-foreground">62.8%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abnormal</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58</div>
            <p className="text-xs text-muted-foreground">37.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Severe Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Findings Records</CardTitle>
          <CardDescription>
            View and manage all visit findings and clinical observations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, finding type, or details..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Findings</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFindings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No findings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFindings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell className="font-medium">{finding.visitId}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{finding.patientName}</div>
                          <div className="text-sm text-muted-foreground">{finding.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{finding.doctor}</TableCell>
                      <TableCell>{finding.date}</TableCell>
                      <TableCell>{finding.findingType}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate">{finding.findings}</div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(finding.severity)}</TableCell>
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
