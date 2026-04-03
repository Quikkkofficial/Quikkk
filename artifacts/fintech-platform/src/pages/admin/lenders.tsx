import { useState } from "react";
import { useListLenders, useCreateLender, useUpdateLender, useDeleteLender } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Building2, Search, Pencil, Trash2, TrendingUp, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function formatAmount(a?: number | null) {
  if (!a) return "N/A";
  if (a >= 10000000) return `₹${(a / 10000000).toFixed(1)} Cr`;
  if (a >= 100000) return `₹${(a / 100000).toFixed(1)} L`;
  return `₹${a.toLocaleString()}`;
}

const lenderTypeColors: Record<string, string> = {
  bank: "bg-blue-50 text-blue-700 border-blue-200",
  nbfc: "bg-purple-50 text-purple-700 border-purple-200",
  insurance_company: "bg-green-50 text-green-700 border-green-200",
};

export default function AdminLenders() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", type: "bank", contactEmail: "", contactPhone: "", website: "",
    description: "", minInterestRate: "", maxInterestRate: "", maxLoanAmount: "",
    minCibil: "", processingFee: "", turnaroundDays: "", status: "active",
  });

  const { data, queryKey } = useListLenders({ type: typeFilter === "all" ? undefined : typeFilter });
  const { mutate: create, isPending: creating } = useCreateLender();
  const { mutate: deleteLender } = useDeleteLender();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const lenders = (data?.lenders ?? []).filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.contactEmail ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    create({
      data: {
        name: form.name,
        type: form.type as "bank" | "nbfc" | "insurance_company",
        contactEmail: form.contactEmail || undefined,
        contactPhone: form.contactPhone || undefined,
        website: form.website || undefined,
        description: form.description || undefined,
        minInterestRate: form.minInterestRate ? parseFloat(form.minInterestRate) : undefined,
        maxInterestRate: form.maxInterestRate ? parseFloat(form.maxInterestRate) : undefined,
        maxLoanAmount: form.maxLoanAmount ? parseFloat(form.maxLoanAmount) : undefined,
        minCibil: form.minCibil ? parseFloat(form.minCibil) : undefined,
        processingFee: form.processingFee ? parseFloat(form.processingFee) : undefined,
        turnaroundDays: form.turnaroundDays ? parseFloat(form.turnaroundDays) : undefined,
        status: form.status as "active" | "inactive",
      },
    }, {
      onSuccess: () => {
        toast({ title: "Lender created successfully" });
        queryClient.invalidateQueries({ queryKey });
        setOpen(false);
      },
      onError: () => toast({ title: "Failed to create lender", variant: "destructive" }),
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete lender "${name}"?`)) return;
    deleteLender({ id }, {
      onSuccess: () => {
        toast({ title: "Lender deleted" });
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lenders</h1>
          <p className="text-slate-500 text-sm mt-1">Manage banks, NBFCs, and insurance partners</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Lender</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Lender</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2">
                <Label>Lender Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. HDFC Bank" className="mt-1" />
              </div>
              <div>
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="nbfc">NBFC</SelectItem>
                    <SelectItem value="insurance_company">Insurance Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contact Email</Label>
                <Input type="email" value={form.contactEmail} onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} placeholder="loans@bank.com" className="mt-1" />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input value={form.contactPhone} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} placeholder="1800-xxx-xxxx" className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Website</Label>
                <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" className="mt-1" />
              </div>
              <div>
                <Label>Min Interest Rate (%)</Label>
                <Input type="number" value={form.minInterestRate} onChange={e => setForm(p => ({ ...p, minInterestRate: e.target.value }))} placeholder="10.5" className="mt-1" />
              </div>
              <div>
                <Label>Max Interest Rate (%)</Label>
                <Input type="number" value={form.maxInterestRate} onChange={e => setForm(p => ({ ...p, maxInterestRate: e.target.value }))} placeholder="24.0" className="mt-1" />
              </div>
              <div>
                <Label>Max Loan Amount (₹)</Label>
                <Input type="number" value={form.maxLoanAmount} onChange={e => setForm(p => ({ ...p, maxLoanAmount: e.target.value }))} placeholder="4000000" className="mt-1" />
              </div>
              <div>
                <Label>Min CIBIL Score</Label>
                <Input type="number" value={form.minCibil} onChange={e => setForm(p => ({ ...p, minCibil: e.target.value }))} placeholder="700" className="mt-1" />
              </div>
              <div>
                <Label>Processing Fee (%)</Label>
                <Input type="number" value={form.processingFee} onChange={e => setForm(p => ({ ...p, processingFee: e.target.value }))} placeholder="1.5" className="mt-1" />
              </div>
              <div>
                <Label>Turnaround Days</Label>
                <Input type="number" value={form.turnaroundDays} onChange={e => setForm(p => ({ ...p, turnaroundDays: e.target.value }))} placeholder="3" className="mt-1" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCreate} disabled={!form.name || creating}>
                {creating ? "Creating..." : "Create Lender"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Lenders", value: data?.total ?? 0, icon: Building2, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: (data?.lenders ?? []).filter(l => l.status === "active").length, icon: CheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Banks", value: (data?.lenders ?? []).filter(l => l.type === "bank").length, icon: Building2, color: "text-purple-600 bg-purple-50" },
          { label: "NBFCs", value: (data?.lenders ?? []).filter(l => l.type === "nbfc").length, icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search lenders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="nbfc">NBFC</SelectItem>
                <SelectItem value="insurance_company">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lenders ({lenders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Max Amount</TableHead>
                <TableHead>Min CIBIL</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Approval %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lenders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-slate-400">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No lenders found
                  </TableCell>
                </TableRow>
              ) : lenders.map(lender => (
                <TableRow key={lender.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{lender.name}</p>
                      {lender.contactEmail && <p className="text-xs text-slate-400">{lender.contactEmail}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={lenderTypeColors[lender.type] ?? ""}>
                      {lender.type.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lender.minInterestRate && lender.maxInterestRate
                      ? `${lender.minInterestRate}–${lender.maxInterestRate}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{formatAmount(lender.maxLoanAmount)}</TableCell>
                  <TableCell>{lender.minCibil ?? "N/A"}</TableCell>
                  <TableCell>{lender.totalApplications?.toLocaleString() ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-16 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${lender.approvalRate ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{lender.approvalRate ?? 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lender.status === "active" ? "default" : "secondary"} className={lender.status === "active" ? "bg-green-50 text-green-700 border-green-200" : ""}>
                      {lender.status === "active" ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {lender.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700" onClick={() => handleDelete(lender.id, lender.name)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
