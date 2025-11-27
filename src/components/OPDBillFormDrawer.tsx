// src/components/OPDBillFormDrawer.tsx
import React, { useState, useMemo } from 'react';
import { SideDrawer } from '@/components/SideDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DollarSign, Plus, X, Package, FileText, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { useProcedureMaster } from '@/hooks/useProcedureMaster';
import { useProcedurePackage } from '@/hooks/useProcedurePackage';
import { cn } from '@/lib/utils';

interface BillItem {
  id: string;
  type: 'procedure' | 'package';
  itemId: number;
  name: string;
  code: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface OPDBillFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  billId?: number | null;
  onSuccess?: () => void;
}

export const OPDBillFormDrawer: React.FC<OPDBillFormDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  billId,
  onSuccess,
}) => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [procedureOpen, setProcedureOpen] = useState(false);
  const [packageOpen, setPackageOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Fetch procedures and packages
  const { useActiveProcedureMasters } = useProcedureMaster();
  const { useActiveProcedurePackages } = useProcedurePackage();

  const { data: proceduresData, isLoading: proceduresLoading } = useActiveProcedureMasters();
  const { data: packagesData, isLoading: packagesLoading } = useActiveProcedurePackages();

  const procedures = proceduresData?.results || [];
  const packages = packagesData?.results || [];

  // Calculate totals
  const subtotal = useMemo(() => {
    return billItems.reduce((sum, item) => sum + item.amount, 0);
  }, [billItems]);

  const getTitle = () => {
    if (mode === 'create') return 'Create OPD Bill';
    if (mode === 'edit') return 'Edit OPD Bill';
    return 'OPD Bill Details';
  };

  // Add procedure to bill
  const handleAddProcedure = (procedureId: number) => {
    const procedure = procedures.find(p => p.id === procedureId);
    if (!procedure) return;

    const newItem: BillItem = {
      id: `proc-${Date.now()}`,
      type: 'procedure',
      itemId: procedure.id,
      name: procedure.name,
      code: procedure.code,
      quantity: 1,
      rate: parseFloat(procedure.default_charge),
      amount: parseFloat(procedure.default_charge),
    };

    setBillItems([...billItems, newItem]);
    setSelectedProcedure(null);
    setProcedureOpen(false);
    toast.success(`Added ${procedure.name} to bill`);
  };

  // Add package to bill
  const handleAddPackage = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    const newItem: BillItem = {
      id: `pkg-${Date.now()}`,
      type: 'package',
      itemId: pkg.id,
      name: pkg.name,
      code: pkg.code,
      quantity: 1,
      rate: parseFloat(pkg.discounted_charge),
      amount: parseFloat(pkg.discounted_charge),
    };

    setBillItems([...billItems, newItem]);
    setSelectedPackage(null);
    setPackageOpen(false);
    toast.success(`Added ${pkg.name} package to bill`);
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setBillItems(billItems.map(item => {
      if (item.id === itemId) {
        const newAmount = item.rate * quantity;
        return { ...item, quantity, amount: newAmount };
      }
      return item;
    }));
  };

  // Remove item from bill
  const handleRemoveItem = (itemId: string) => {
    setBillItems(billItems.filter(item => item.id !== itemId));
    toast.success('Item removed from bill');
  };

  return (
    <SideDrawer
      open={isOpen}
      onOpenChange={(open) => { if (!open) onClose(); }}
      title={getTitle()}
      description="Manage OPD billing and procedures"
    >
      <Tabs defaultValue="procedures" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bill Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <Input id="patient" placeholder="Select patient..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visit">Visit</Label>
                <Input id="visit" placeholder="Select visit..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bill-date">Bill Date</Label>
                <Input id="bill-date" type="date" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Procedures Tab */}
        <TabsContent value="procedures" className="space-y-4">
          {/* Add Procedure Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Items to Bill</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Procedure */}
              <div className="space-y-2">
                <Label>Add Procedure</Label>
                <Popover open={procedureOpen} onOpenChange={setProcedureOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={procedureOpen}
                      className="w-full justify-between"
                    >
                      {selectedProcedure
                        ? procedures.find((p) => p.id === selectedProcedure)?.name
                        : "Search and select procedure..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search procedures..." />
                      <CommandList>
                        <CommandEmpty>No procedure found.</CommandEmpty>
                        <CommandGroup>
                          {proceduresLoading ? (
                            <CommandItem disabled>Loading procedures...</CommandItem>
                          ) : (
                            procedures.map((procedure) => (
                              <CommandItem
                                key={procedure.id}
                                value={`${procedure.name} ${procedure.code}`}
                                onSelect={() => {
                                  setSelectedProcedure(procedure.id);
                                  handleAddProcedure(procedure.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedProcedure === procedure.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium">{procedure.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {procedure.code} • {procedure.category} • ₹{procedure.default_charge}
                                  </span>
                                </div>
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Add Package */}
              <div className="space-y-2">
                <Label>Add Package</Label>
                <Popover open={packageOpen} onOpenChange={setPackageOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={packageOpen}
                      className="w-full justify-between"
                    >
                      {selectedPackage
                        ? packages.find((p) => p.id === selectedPackage)?.name
                        : "Search and select package..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search packages..." />
                      <CommandList>
                        <CommandEmpty>No package found.</CommandEmpty>
                        <CommandGroup>
                          {packagesLoading ? (
                            <CommandItem disabled>Loading packages...</CommandItem>
                          ) : (
                            packages.map((pkg) => (
                              <CommandItem
                                key={pkg.id}
                                value={`${pkg.name} ${pkg.code}`}
                                onSelect={() => {
                                  setSelectedPackage(pkg.id);
                                  handleAddPackage(pkg.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedPackage === pkg.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium">{pkg.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {pkg.code} • ₹{pkg.discounted_charge}
                                    {pkg.discount_percent && (
                                      <Badge variant="secondary" className="ml-2 text-xs">
                                        {parseFloat(pkg.discount_percent).toFixed(0)}% off
                                      </Badge>
                                    )}
                                  </span>
                                </div>
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Bill Items List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bill Items ({billItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {billItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No items added yet</p>
                  <p className="text-xs">Add procedures or packages above to create a bill</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {billItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {item.type === 'package' ? (
                            <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          ) : (
                            <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.code}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-sm font-semibold">₹{item.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">@₹{item.rate}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                      <span className="font-semibold">Subtotal</span>
                      <span className="text-lg font-bold">₹{subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input id="discount" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax (%)</Label>
                <Input id="tax" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-mode">Payment Mode</Label>
                <Input id="payment-mode" placeholder="Cash, Card, UPI..." />
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-3 pt-4 mt-6 border-t">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1">
          <DollarSign className="h-4 w-4 mr-2" />
          {mode === 'create' ? 'Create Bill' : 'Update Bill'}
        </Button>
      </div>
    </SideDrawer>
  );
};
