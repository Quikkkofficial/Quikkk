import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight, CheckCircle, Heart, Shield, Car, Star } from "lucide-react";

const insuranceCategories = [
  { value: "health_insurance", label: "Health", icon: Heart, color: "text-red-600 bg-red-50" },
  { value: "life_insurance", label: "Life", icon: Shield, color: "text-teal-600 bg-teal-50" },
  { value: "motor_insurance", label: "Motor", icon: Car, color: "text-yellow-600 bg-yellow-50" },
];

export default function Insurance() {
  const { data: healthData } = useListProducts({ category: "health_insurance" });
  const { data: lifeData } = useListProducts({ category: "life_insurance" });
  const { data: motorData } = useListProducts({ category: "motor_insurance" });

  const allProducts = [
    ...(healthData?.products ?? []),
    ...(lifeData?.products ?? []),
    ...(motorData?.products ?? []),
  ];

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

      <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="h-8 w-8" />
            <Badge className="bg-white/20 text-white border-0">Insurance</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Protect What Matters Most</h1>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl">
            Compare and buy health, life, and motor insurance from India's top insurers.
            Fast claims, paperless process, and expert support.
          </p>
          <Link href="/apply/health_insurance">
            <Button className="bg-white text-teal-700 hover:bg-teal-50 gap-2">
              Get a Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {insuranceCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <Card key={cat.value} className="hover:shadow-md transition-shadow cursor-pointer border bg-white text-center">
                <CardContent className="pt-6 pb-6">
                  <div className={`h-12 w-12 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-slate-900">{cat.label} Insurance</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-6">Available Plans ({allProducts.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map(product => {
            const features = product.features ? JSON.parse(product.features) as string[] : [];
            const cat = insuranceCategories.find(c => c.value === product.category);
            const Icon = cat?.icon ?? Shield;
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    {product.badge && <Badge className="mb-2 w-fit bg-amber-50 text-amber-700 border-amber-200 text-xs"><Star className="h-3 w-3 mr-1" />{product.badge}</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-7 w-7 rounded-lg ${cat?.color ?? "bg-teal-50 text-teal-600"} flex items-center justify-center`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-slate-500 capitalize">{product.category.replace(/_/g, " ")}</span>
                  </div>
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 mb-4">
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Link href={`/apply/${product.category}`} className="flex-1">
                      <Button className="w-full gap-2" size="sm">Get Quote <ArrowRight className="h-3 w-3" /></Button>
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
