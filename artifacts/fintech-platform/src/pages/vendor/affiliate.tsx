import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, Copy, CheckCircle, QrCode, BarChart3, TrendingUp, Package, Star, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function generateAffiliateLink(productId: number, vendorId: number, productCategory: string) {
  const origin = window.location.origin;
  const code = btoa(`v${vendorId}-p${productId}`);
  return `${origin}/apply/${productCategory}?ref=${code}`;
}

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

function formatCategoryLabel(c: string) {
  return c.replace(/_/g, " ").replace(/\b\w/g, x => x.toUpperCase());
}

export default function VendorAffiliate() {
  const { user } = useAuth();
  const { data } = useListProducts({ status: "active" });
  const products = data?.products ?? [];
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const vendorId = user?.id ?? 1;
  const baseRef = btoa(`vendor-${vendorId}`);

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Link copied to clipboard!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    formatCategoryLabel(p.category).toLowerCase().includes(search.toLowerCase())
  );

  const myLink = `${window.location.origin}/register?ref=${baseRef}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Affiliate Links</h1>
        <p className="text-slate-500 text-sm mt-1">Share product links and earn commissions on every successful application</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Products Available", value: products.length, icon: Package, color: "text-blue-600 bg-blue-50" },
          { label: "Your Ref Code", value: `v${vendorId}`, icon: Link2, color: "text-purple-600 bg-purple-50" },
          { label: "Avg Commission", value: "1.5%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Max Commission", value: "8%", icon: Star, color: "text-amber-600 bg-amber-50" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Product Links</TabsTrigger>
          <TabsTrigger value="referral">My Referral Link</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredProducts.map(product => {
              const link = generateAffiliateLink(product.id, vendorId, product.category);
              const isCopied = copiedId === product.id;
              return (
                <Card key={product.id} className="border bg-white">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-slate-900">{product.name}</p>
                          {product.badge && (
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                              {product.badge}
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-xs ${categoryColors[product.category] ?? ""}`}>
                            {formatCategoryLabel(product.category)}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-2 line-clamp-1">{product.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          {product.interestRate && <span className="font-medium text-blue-600">{product.interestRate}% p.a.</span>}
                          {product.commissionRate && (
                            <span className="font-medium text-green-600 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {product.commissionRate}% commission
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                          <Link2 className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-xs text-slate-600 truncate flex-1 font-mono">{link}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => copyToClipboard(link, product.id)}
                        >
                          {isCopied ? (
                            <><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Copied</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" /> Copy</>
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2" asChild>
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="referral" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>Share this link to earn commissions when new customers register and apply through your link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center">
                    <Link2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Your Unique Referral Link</p>
                    <p className="text-sm text-slate-500">Ref Code: {baseRef.slice(0, 12)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 border">
                  <span className="text-sm text-slate-700 truncate flex-1 font-mono">{myLink}</span>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(myLink, -1)}
                    className="gap-2 flex-shrink-0"
                  >
                    {copiedId === -1 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Share Link", desc: "Share your referral link via WhatsApp, Email, or Social Media" },
                  { step: "2", title: "Customer Applies", desc: "Customer clicks link, registers, and submits a loan application" },
                  { step: "3", title: "Earn Commission", desc: "You earn commission once the application is approved and disbursed" },
                ].map(s => (
                  <div key={s.step} className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-3 font-bold">
                      {s.step}
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
              <CardDescription>Track clicks, conversions, and earnings from your affiliate links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Clicks", value: "248", trend: "+12% this month", color: "text-blue-600 bg-blue-50" },
                  { label: "Conversions", value: "31", trend: "12.5% conversion rate", color: "text-green-600 bg-green-50" },
                  { label: "Earnings", value: "₹18,450", trend: "This month", color: "text-purple-600 bg-purple-50" },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl p-4 ${s.color.split(" ")[1]}`}>
                    <p className={`text-2xl font-bold mb-1 ${s.color.split(" ")[0]}`}>{s.value}</p>
                    <p className="text-sm font-medium text-slate-700">{s.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.trend}</p>
                  </div>
                ))}
              </div>
              <div className="text-center text-slate-400 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Detailed analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
