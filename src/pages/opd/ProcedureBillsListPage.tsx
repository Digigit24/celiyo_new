import { useState } from "react";
import { Plus, Search, Filter, Receipt, DollarSign, Download } from "lucide-react";
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

export default function ProcedureBillsListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - Replace with actual API call
  const procedureBills = [
    {
      id: 1,
      billNumber: "PB-001",
      patientName: "John Doe",
      patientId: "P001",
      visitId: "V001",
      procedureName: "Blood Test - CBC",
      amount: 500.00,
      paid: 500.00,
      status: "paid",
      date: "2024-11-18",
    },
    {
      id: 2,
      billNumber: "PB-002",
      patientName: "Jane Smith",
      patientId: "P002",
      visitId: "V002",
      procedureName: "X-Ray - Chest",
      amount: 800.00,
      paid: 0.00,
      status: "pending",
      date: "2024-11-18",
    },
    {
      id: 3,
      billNumber: "PB-003",
      patientName: "Bob Wilson",
      patientId: "P003",
      visitId: "V003",
      procedureName: "Basic Health Checkup Package",
      amount: 3500.00,
      paid: 2000.00,
      status: "partial",
      date: "2024-11-17",
    },
    {
      id: 4,
      billNumber: "PB-004",
      patientName: "Alice Brown",
      patientId: "P004",
      visitId: "V004",
      procedureName: "ECG - 12 Lead",
      amount: 600.00,
      paid: 600.00,
      status: "paid",
      date: "2024-11-17",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      paid: { label: "Paid", variant: "default" },
      partial: { label: "Partial", variant: "secondary" },
      pending: { label: "Pending", variant: "destructive" },
      cancelled: { label: "Cancelled", variant: "outline" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredBills = procedureBills.filter((bill) =>
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.procedureName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Procedure Bills</h2>
          <p className="text-muted-foreground">
            Manage billing for procedures and diagnostic tests
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Procedure Bill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.85L</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹28,500</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Procedure Bill Records</CardTitle>
          <CardDescription>
            View and manage all procedure billing records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by bill number, patient, or procedure..."
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
                  <TableHead>Bill Number</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Visit ID</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No procedure bills found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.billNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.patientName}</div>
                          <div className="text-sm text-muted-foreground">{bill.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{bill.visitId}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">{bill.procedureName}</div>
                      </TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell className="text-right">₹{bill.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">₹{bill.paid.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        ₹{(bill.amount - bill.paid).toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
