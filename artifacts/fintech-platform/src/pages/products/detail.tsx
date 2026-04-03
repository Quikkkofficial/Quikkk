import { Link, useParams } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft, CheckCircle, AlertCircle, ArrowRight, Calculator } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function formatAmount(amount: number | null | undefined) {
  if (!amount) return "N/A";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString()}`;
}

function formatCategoryLabel(category: string) {
  return category.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProduct(parseInt(id ?? "0"));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Product not found</p>
          <Link href="/products"><Button variant="outline" className="mt-4">Browse All Products</Button></Link>
        </div>
      </div>
    );
  }

  const features = product.features ? JSON.parse(product.features) as string[] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
            FinAxis
          </Link>
          <Link href="/login"><Button size="sm">Sign In</Button></Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-3 capitalize">
                      {formatCategoryLabel(product.category)}
                    </Badge>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    {product.badge && (
                      <Badge className="mt-2 bg-amber-50 text-amber-700 border-amber-200">{product.badge}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{product.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {product.interestRate != null && product.interestRate > 0 && (
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-700">{product.interestRate}%</p>
                      <p className="text-xs text-slate-500 mt-1">Interest p.a.</p>
                    </div>
                  )}
                  {product.maxAmount && (
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-2xl font-bold text-green-700">{formatAmount(product.maxAmount)}</p>
                      <p className="text-xs text-slate-500 mt-1">Max Amount</p>
                    </div>
                  )}
                  {product.maxTenure && product.maxTenure > 0 && (
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <p className="text-2xl font-bold text-purple-700">
                        {product.maxTenure >= 12 ? `${product.maxTenure / 12}yr` : `${product.maxTenure}mo`}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Max Tenure</p>
                    </div>
                  )}
                  {product.minCibil && product.minCibil > 0 && (
                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                      <p className="text-2xl font-bold text-orange-700">{product.minCibil}+</p>
                      <p className="text-xs text-slate-500 mt-1">Min CIBIL</p>
                    </div>
                  )}
                </div>

                {features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Eligibility Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {product.ageMin && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <span className="text-xs font-medium">Age</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{product.ageMin}–{product.ageMax} years</p>
                        <p className="text-slate-500 text-xs">Age requirement</p>
                      </div>
                    </div>
                  )}
                  {product.minIncome && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <span className="text-xs font-medium">₹</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">₹{product.minIncome.toLocaleString()}/mo</p>
                        <p className="text-slate-500 text-xs">Minimum income</p>
                      </div>
                    </div>
                  )}
                  {product.minCibil && product.minCibil > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <span className="text-xs font-medium">CIBIL</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{product.minCibil}+</p>
                        <p className="text-slate-500 text-xs">Minimum credit score</p>
                      </div>
                    </div>
                  )}
                  {product.employmentTypes && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        <span className="text-xs font-medium">Emp</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 capitalize">{product.employmentTypes.replace(/,/g, ", ").replace(/_/g, " ")}</p>
                        <p className="text-slate-500 text-xs">Employment type</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Apply Card */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  {product.interestRate != null && product.interestRate > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-slate-500">Starting at</p>
                      <p className="text-4xl font-bold text-primary">{product.interestRate}%</p>
                      <p className="text-sm text-slate-500">per annum</p>
                    </div>
                  )}
                  {product.processingFee !== null && product.processingFee !== undefined && (
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      {product.processingFee === 0 ? "Zero Processing Fee" : `${product.processingFee}% Processing Fee`}
                    </Badge>
                  )}
                </div>
                <Link href={`/apply/${product.category}`}>
                  <Button className="w-full gap-2 mb-3">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tools/emi-calculator">
                  <Button variant="outline" className="w-full gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculate EMI
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-sm">Why choose FinAxis?</h3>
                {["100% digital process", "Compare multiple lenders", "Expert support team", "Fastest approval"].map(text => (
                  <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
