import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, CheckCircle, TrendingUp, Calculator, Star } from "lucide-react";

function formatAmount(a?: number | null) {
  if (!a) return "N/A";
  if (a >= 10000000) return `₹${(a / 10000000).toFixed(1)} Cr`;
  if (a >= 100000) return `₹${(a / 100000).toFixed(1)} L`;
  return `₹${a.toLocaleString()}`;
}

export default function PersonalLoans() {
  const { data } = useListProducts({ category: "personal_loan" });
  const products = data?.products ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-6 w-6" /> FinAxis
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/products" className="text-slate-600 hover:text-primary">All Products</Link>
            <Link href="/tools/emi-calculator" className="text-slate-600 hover:text-primary">EMI Calculator</Link>
            <Link href="/tools/eligibility" className="text-slate-600 hover:text-primary">Eligibility</Link>
          </nav>
          <Link href="/login"><Button size="sm">Sign In</Button></Link>
        </div>
      </header>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-8 w-8" />
            <Badge className="bg-white/20 text-white border-0">Personal Loans</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Personal Loans starting at 10.5%</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl">
            Get instant personal loans for any need — medical emergencies, weddings, travel, or home renovation.
            100% digital process with same-day disbursal.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/tools/eligibility">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 gap-2">
                <ShieldCheck className="h-4 w-4" /> Check Eligibility
              </Button>
            </Link>
            <Link href="/tools/emi-calculator">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                <Calculator className="h-4 w-4" /> Calculate EMI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "10.5%", label: "Starting Rate" },
            { value: "₹40 L", label: "Max Loan Amount" },
            { value: "84 months", label: "Max Tenure" },
            { value: "24 hours", label: "Disbursal Time" },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold text-primary">{item.value}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Available Personal Loan Products ({products.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const features = product.features ? JSON.parse(product.features) as string[] : [];
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      {product.badge && (
                        <Badge className="mb-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                          <Star className="h-3 w-3 mr-1" />{product.badge}
                        </Badge>
                      )}
                      <CardTitle className="text-base">{product.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Interest Rate</p>
                      <p className="text-sm font-bold text-blue-700">{product.interestRate}% p.a.</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Max Amount</p>
                      <p className="text-sm font-bold text-green-700">{formatAmount(product.maxAmount)}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Tenure</p>
                      <p className="text-sm font-bold text-purple-700">
                        {product.minTenure}–{product.maxTenure} mo
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Min CIBIL</p>
                      <p className="text-sm font-bold text-orange-700">{product.minCibil ?? "N/A"}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-4">
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Link href="/apply/personal_loan" className="flex-1">
                      <Button className="w-full gap-2" size="sm">Apply <ArrowRight className="h-3 w-3" /></Button>
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
      </div>
    </div>
  );
}
