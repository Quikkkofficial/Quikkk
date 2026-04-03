import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  ShieldCheck, 
  Briefcase, 
  PieChart, 
  Phone,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const [location] = useLocation();
  const { role } = useAuth();

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/applications", label: "Applications", icon: FileText },
    { href: "/admin/vendors", label: "Vendors", icon: Briefcase },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/leads", label: "Leads", icon: Users },
    { href: "/admin/kyc", label: "KYC Verification", icon: ShieldCheck },
    { href: "/admin/campaigns", label: "Campaigns", icon: Phone },
    { href: "/admin/analytics", label: "Analytics", icon: PieChart },
  ];

  const vendorLinks = [
    { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/applications", label: "Applications", icon: FileText },
    { href: "/vendor/leads", label: "Leads", icon: Users },
    { href: "/vendor/recovery", label: "Recovery", icon: Phone },
    { href: "/vendor/team", label: "Team", icon: Users },
    { href: "/vendor/commissions", label: "Commissions", icon: Wallet },
  ];

  const customerLinks = [
    { href: "/customer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/apply", label: "Apply Now", icon: FileText },
    { href: "/track", label: "Track Application", icon: ShieldCheck },
  ];

  let links = adminLinks;
  if (role === "vendor") links = vendorLinks;
  if (role === "customer") links = customerLinks;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-sidebar sm:flex">
      <div className="flex h-14 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-sidebar-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          FinAxis
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const isActive = location.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-sidebar-border p-4">
        <Link 
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
