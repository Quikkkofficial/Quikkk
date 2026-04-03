import { useState } from "react";
import { useListProducts, useDeleteProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Package, Search, Pencil, Trash2, Star, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const categoryColors: Record<string, string> = {
  personal_loan: "bg-blue-50 text-blue-700 border-blue-200",
  business_loan: "bg-purple-50 text-purple-700 border-purple-200",
  home_loan: "bg-green-50 text-green-700 border-green-200",
  credit_card: "bg-orange-50 text-orange-700 border-orange-200",
  health_insurance: "bg-red-50 text-red-700 border-red-200",
  life_insurance: "bg-teal-50 text-teal-700 border-teal-200",
  motor_insurance: "bg-yellow-50 text-yellow-700 border-yellow-200",
  gold_loan: "bg-amber-50 text-amber-700 border-amber-200",
};

function formatAmount(a?: number | null) {
  if (!a) return "N/A";
  if (a >= 10000000) return `₹${(a / 10000000).toFixed(1)} Cr`;
  if (a >= 100000) return `₹${(a / 100000).toFixed(1)} L`;
  return `₹${a.toLocaleString()}`;
}

function formatCategoryLabel(category: string) {
  return category.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, queryKey } = useListProducts({
    category: categoryFilter === "all" ? undefined : categoryFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const { mutate: deleteProduct } = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const products = (data?.products ?? []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete product "${name}"?`)) return;
    deleteProduct({ id }, {
      onSuccess: () => {
        toast({ title: "Product deleted" });
        queryClient.invalidateQueries({ queryKey });
      },
    });
  };

  const stats = {
    total: data?.total ?? 0,
    active: (data?.products ?? []).filter(p => p.status === "active").length,
    featured: (data?.products ?? []).filter(p => p.featured).length,
    categories: new Set((data?.products ?? []).map(p => p.category)).size,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your financial product catalogue</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.total, color: "text-blue-600 bg-blue-50" },
          { label: "Active", value: stats.active, color: "text-green-600 bg-green-50" },
          { label: "Featured", value: stats.featured, color: "text-amber-600 bg-amber-50" },
          { label: "Categories", value: stats.categories, color: "text-purple-600 bg-purple-50" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="personal_loan">Personal Loan</SelectItem>
                <SelectItem value="business_loan">Business Loan</SelectItem>
                <SelectItem value="home_loan">Home Loan</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="health_insurance">Health Insurance</SelectItem>
                <SelectItem value="life_insurance">Life Insurance</SelectItem>
                <SelectItem value="motor_insurance">Motor Insurance</SelectItem>
                <SelectItem value="gold_loan">Gold Loan</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Min CIBIL</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-slate-400">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No products found
                  </TableCell>
                </TableRow>
              ) : products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-slate-900 flex items-center gap-1">
                          {product.name}
                          {product.featured && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                        </p>
                        {product.badge && <span className="text-xs text-amber-600">{product.badge}</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${categoryColors[product.category] ?? ""}`}>
                      {formatCategoryLabel(product.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.interestRate ? `${product.interestRate}% p.a.` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.minAmount && product.maxAmount
                      ? `${formatAmount(product.minAmount)} – ${formatAmount(product.maxAmount)}`
                      : formatAmount(product.maxAmount)}
                  </TableCell>
                  <TableCell>{product.minCibil ?? "N/A"}</TableCell>
                  <TableCell>
                    {product.commissionRate ? (
                      <span className="text-green-700 font-medium">{product.commissionRate}%</span>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      product.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                      product.status === "featured" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-slate-50 text-slate-600"
                    }>
                      {product.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {product.status === "featured" && <Star className="h-3 w-3 mr-1" />}
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700" onClick={() => handleDelete(product.id, product.name)}>
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
