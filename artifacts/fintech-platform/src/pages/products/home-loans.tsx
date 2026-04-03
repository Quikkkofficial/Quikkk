import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, CheckCircle, Home, Calculator, Star } from "lucide-react";

function formatAmount(a?: number | null) {
  if (!a) return "N/A";
  if (a >= 10000000) return `₹${(a / 10000000).toFixed(1)} Cr`;
  if (a >= 100000) return `₹${(a / 100000).toFixed(1)} L`;
  return `₹${a.toLocaleString()}`;
}

export default function HomeLoans() {
  const { data } = useListProducts({ category: "home_loan" });
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
          </nav>
          <Link href="/login"><Button size="sm">Sign In</Button></Link>
        </div>
      </header>

      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <Home className="h-8 w-8" />
            <Badge className="bg-white/20 text-white border-0">Home Loans</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Home Loans starting at 8.5%</h1>
          <p className="text-green-100 text-lg mb-8 max-w-2xl">
            Make your dream home a reality with the lowest interest rates, up to 30-year tenure,
            and zero prepayment charges. Trusted by lakhs of families across India.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/tools/eligibility">
              <Button className="bg-white text-green-700 hover:bg-green-50 gap-2">
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

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "8.5%", label: "Starting Rate" },
            { value: "₹50 Cr", label: "Max Loan Amount" },
            { value: "30 years", label: "Max Tenure" },
            { value: "7 days", label: "Approval Time" },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold text-green-600">{item.value}</p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Home Loan Products ({products.length})</h2>
        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Home className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No home loan products available currently</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => {
              const features = product.features ? JSON.parse(product.features) as string[] : [];
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    {product.badge && <Badge className="mb-2 w-fit bg-amber-50 text-amber-700 border-amber-200 text-xs"><Star className="h-3 w-3 mr-1" />{product.badge}</Badge>}
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-green-50 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-slate-500">Interest Rate</p>
                        <p className="text-sm font-bold text-green-700">{product.interestRate}% p.a.</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-slate-500">Max Amount</p>
                        <p className="text-sm font-bold text-blue-700">{formatAmount(product.maxAmount)}</p>
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
                      <Link href="/apply/home_loan" className="flex-1">
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
        )}
      </div>
    </div>
  );
}
