import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, BarChart3, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
            <span>FinAxis</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-foreground transition-colors">Solutions</Link>
            <Link href="#partners" className="hover:text-foreground transition-colors">Partners</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-40 bg-slate-50 border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl font-sans text-slate-900">
                    The backbone of <br/>
                    <span className="text-primary">financial distribution.</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-slate-600 md:text-xl leading-relaxed">
                    FinAxis is the premium command center for applying, tracking, and managing loans and credit cards across India's NBFC ecosystem.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
                    <Link href="/register">Open an Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold" asChild>
                    <Link href="/apply">Browse Products</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[600px]">
                <div className="relative rounded-xl border bg-white shadow-2xl overflow-hidden aspect-[4/3]">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border-b">
                    {/* Placeholder for platform screenshot or generated image */}
                    <div className="text-center space-y-4 p-8">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BarChart3 className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold">Intelligent Dashboard</h3>
                      <p className="text-sm text-slate-500">Real-time tracking of applications and commissions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-24 bg-white" id="features">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for speed and scale</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-[800px] mx-auto">
                Every pixel earns its place. FinAxis provides a data-forward interface designed for professionals who live in the tool 8+ hours a day.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 p-6 rounded-xl border bg-slate-50">
                <Zap className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">Fast Processing</h3>
                <p className="text-slate-600">Dynamic application forms and automated KYC verification reduce processing time by 40%.</p>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl border bg-slate-50">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">Channel Partner Portal</h3>
                <p className="text-slate-600">Dedicated portals for vendors to track leads, manage teams, and view commission payouts in real-time.</p>
              </div>
              <div className="flex flex-col gap-2 p-6 rounded-xl border bg-slate-50">
                <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold">Bank-grade Security</h3>
                <p className="text-slate-600">Enterprise-grade encryption for all document uploads and customer data handling.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-slate-950 py-12 text-slate-400">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-white">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span>FinAxis</span>
            </div>
            <p className="text-sm">The backbone of India's NBFC distribution ecosystem.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>Personal Loans</li>
              <li>Business Loans</li>
              <li>Credit Cards</li>
              <li>Gold Loans</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Partners</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Compliance</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
