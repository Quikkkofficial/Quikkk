import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, CheckCircle, CreditCard, Star } from "lucide-react";

export default function CreditCards() {
  const { data } = useListProducts({ category: "credit_card" });
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
          </nav>
          <Link href="/login"><Button size="sm">Sign In</Button></Link>
        </div>
      </header>

      <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="h-8 w-8" />
            <Badge className="bg-white/20 text-white border-0">Credit Cards</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Credit Cards with Best Rewards</h1>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl">
            Find the best credit card for your lifestyle — cashback, travel rewards, fuel surcharge waiver, and more.
            Compare and apply in minutes.
          </p>
          <Link href="/tools/eligibility">
            <Button className="bg-white text-orange-700 hover:bg-orange-50 gap-2">
              <ShieldCheck className="h-4 w-4" /> Check Eligibility
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Credit Card Products ({products.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => {
            const features = product.features ? JSON.parse(product.features) as string[] : [];
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="pb-3">
                  {product.badge && (
                    <Badge className="mb-2 w-fit bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      <Star className="h-3 w-3 mr-1" />{product.badge}
                    </Badge>
                  )}
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-orange-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Interest Rate</p>
                      <p className="text-sm font-bold text-orange-700">{product.interestRate}% p.a.</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Joining Fee</p>
                      <p className="text-sm font-bold text-blue-700">{product.processingFee === 0 ? "Free" : `₹${product.processingFee}`}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Min Income</p>
                      <p className="text-sm font-bold text-green-700">₹{product.minIncome?.toLocaleString()}/mo</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-slate-500">Min CIBIL</p>
                      <p className="text-sm font-bold text-purple-700">{product.minCibil}</p>
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
                    <Link href="/apply/credit_card" className="flex-1">
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
