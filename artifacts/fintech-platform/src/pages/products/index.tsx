import { useState } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Search, Calculator, ArrowRight, Star, Building2, CreditCard, Home, Briefcase, Heart, Car, Shield, TrendingUp } from "lucide-react";

const categories = [
  { value: "all", label: "All Products" },
  { value: "personal_loan", label: "Personal Loans" },
  { value: "business_loan", label: "Business Loans" },
  { value: "home_loan", label: "Home Loans" },
  { value: "credit_card", label: "Credit Cards" },
  { value: "health_insurance", label: "Health Insurance" },
  { value: "life_insurance", label: "Life Insurance" },
  { value: "motor_insurance", label: "Motor Insurance" },
  { value: "gold_loan", label: "Gold Loans" },
];

const categoryIcons: Record<string, any> = {
  personal_loan: TrendingUp,
  business_loan: Briefcase,
  home_loan: Home,
  credit_card: CreditCard,
  health_insurance: Heart,
  life_insurance: Shield,
  motor_insurance: Car,
  gold_loan: Star,
};

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

function formatCategoryLabel(category: string) {
  return category.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatAmount(amount: number | null | undefined) {
  if (!amount) return "N/A";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString()}`;
}

export default function ProductsMarket() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data } = useListProducts({ category: category === "all" ? undefined : category });

  const filtered = (data?.products ?? []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary flex-shrink-0">
            <ShieldCheck className="h-6 w-6" />
            FinAxis
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools/emi-calculator">
              <Button variant="outline" size="sm" className="gap-2">
                <Calculator className="h-4 w-4" />
                EMI Calculator
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Financial Products Marketplace</h1>
          <p className="text-blue-100 text-lg mb-8">Compare and apply for loans, credit cards, and insurance from top lenders</p>
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-white text-slate-900 border-0"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48 bg-white text-slate-900 border-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {categories.slice(1).map(c => {
            const Icon = categoryIcons[c.value] || Star;
            return (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                  category === c.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm">{filtered.length} products found</p>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => {
              const Icon = categoryIcons[product.category] || Star;
              const colorClass = categoryColors[product.category] || "bg-slate-50 text-slate-700 border-slate-200";
              const features = product.features ? JSON.parse(product.features) as string[] : [];
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow border border-slate-200 bg-white overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {formatCategoryLabel(product.category)}
                      </div>
                      {product.badge && (
                        <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-3">{product.name}</CardTitle>
                    <CardDescription className="text-sm text-slate-500 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {product.interestRate !== null && product.interestRate !== undefined && product.interestRate > 0 && (
                        <div className="bg-slate-50 rounded-lg p-2.5">
                          <p className="text-xs text-slate-500 mb-0.5">Interest Rate</p>
                          <p className="text-sm font-bold text-slate-900">{product.interestRate}% p.a.</p>
                        </div>
                      )}
                      {product.maxAmount && product.maxAmount > 0 && (
                        <div className="bg-slate-50 rounded-lg p-2.5">
                          <p className="text-xs text-slate-500 mb-0.5">Loan Amount</p>
                          <p className="text-sm font-bold text-slate-900">Up to {formatAmount(product.maxAmount)}</p>
                        </div>
                      )}
                      {product.maxTenure && product.maxTenure > 0 && (
                        <div className="bg-slate-50 rounded-lg p-2.5">
                          <p className="text-xs text-slate-500 mb-0.5">Max Tenure</p>
                          <p className="text-sm font-bold text-slate-900">
                            {product.maxTenure >= 12 ? `${product.maxTenure / 12} years` : `${product.maxTenure} months`}
                          </p>
                        </div>
                      )}
                      {product.processingFee !== null && product.processingFee !== undefined && (
                        <div className="bg-slate-50 rounded-lg p-2.5">
                          <p className="text-xs text-slate-500 mb-0.5">Processing Fee</p>
                          <p className="text-sm font-bold text-slate-900">
                            {product.processingFee === 0 ? "Zero" : `${product.processingFee}%`}
                          </p>
                        </div>
                      )}
                    </div>
                    {features.length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/apply/${product.category}`} className="flex-1">
                        <Button className="w-full gap-2" size="sm">
                          Apply Now <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
