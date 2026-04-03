import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Shell } from "@/components/layout/shell";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Apply from "@/pages/apply";
import ApplyForm from "@/pages/apply-form";
import Track from "@/pages/track";

import CustomerDashboard from "@/pages/customer/dashboard";

import VendorDashboard from "@/pages/vendor/dashboard";
import VendorApplications from "@/pages/vendor/applications";
import VendorApplicationsNew from "@/pages/vendor/applications-new";
import VendorLeads from "@/pages/vendor/leads";
import VendorRecovery from "@/pages/vendor/recovery";
import VendorTeam from "@/pages/vendor/team";
import VendorCommissions from "@/pages/vendor/commissions";
import VendorAffiliate from "@/pages/vendor/affiliate";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminApplications from "@/pages/admin/applications";
import AdminVendors from "@/pages/admin/vendors";
import AdminUsers from "@/pages/admin/users";
import AdminLeads from "@/pages/admin/leads";
import AdminKyc from "@/pages/admin/kyc";
import AdminCampaigns from "@/pages/admin/campaigns";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminLenders from "@/pages/admin/lenders";
import AdminProducts from "@/pages/admin/products";

import ProductsMarket from "@/pages/products/index";
import ProductDetail from "@/pages/products/detail";
import PersonalLoans from "@/pages/products/personal-loans";
import BusinessLoans from "@/pages/products/business-loans";
import CreditCards from "@/pages/products/credit-cards";
import HomeLoans from "@/pages/products/home-loans";
import Insurance from "@/pages/products/insurance";
import GoldLoans from "@/pages/products/gold-loans";

import EmiCalculator from "@/pages/tools/emi-calculator";
import EligibilityChecker from "@/pages/tools/eligibility";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRoles }: { component: any, allowedRoles?: string[] }) {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Redirect to="/" />;
  }
  
  return (
    <Shell>
      <Component />
    </Shell>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Public Product Pages */}
      <Route path="/products" component={ProductsMarket} />
      <Route path="/products/personal-loans" component={PersonalLoans} />
      <Route path="/products/business-loans" component={BusinessLoans} />
      <Route path="/products/credit-cards" component={CreditCards} />
      <Route path="/products/home-loans" component={HomeLoans} />
      <Route path="/products/insurance" component={Insurance} />
      <Route path="/products/gold-loans" component={GoldLoans} />
      <Route path="/products/:id" component={ProductDetail} />

      {/* Tools (Public) */}
      <Route path="/tools/emi-calculator" component={EmiCalculator} />
      <Route path="/tools/eligibility" component={EligibilityChecker} />

      {/* Customer Routes */}
      <Route path="/apply" component={Apply} />
      <Route path="/apply/:type" component={ApplyForm} />
      <Route path="/track" component={Track} />
      
      <Route path="/customer/dashboard">
        {() => <ProtectedRoute component={CustomerDashboard} allowedRoles={["customer", "admin"]} />}
      </Route>

      {/* Vendor Routes */}
      <Route path="/vendor/dashboard">
        {() => <ProtectedRoute component={VendorDashboard} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/applications">
        {() => <ProtectedRoute component={VendorApplications} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/applications/new">
        {() => <ProtectedRoute component={VendorApplicationsNew} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/leads">
        {() => <ProtectedRoute component={VendorLeads} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/recovery">
        {() => <ProtectedRoute component={VendorRecovery} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/team">
        {() => <ProtectedRoute component={VendorTeam} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/commissions">
        {() => <ProtectedRoute component={VendorCommissions} allowedRoles={["vendor", "admin"]} />}
      </Route>
      <Route path="/vendor/affiliate">
        {() => <ProtectedRoute component={VendorAffiliate} allowedRoles={["vendor", "admin"]} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        {() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/applications">
        {() => <ProtectedRoute component={AdminApplications} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/vendors">
        {() => <ProtectedRoute component={AdminVendors} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/lenders">
        {() => <ProtectedRoute component={AdminLenders} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/products">
        {() => <ProtectedRoute component={AdminProducts} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsers} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/leads">
        {() => <ProtectedRoute component={AdminLeads} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/kyc">
        {() => <ProtectedRoute component={AdminKyc} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/campaigns">
        {() => <ProtectedRoute component={AdminCampaigns} allowedRoles={["admin"]} />}
      </Route>
      <Route path="/admin/analytics">
        {() => <ProtectedRoute component={AdminAnalytics} allowedRoles={["admin"]} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
