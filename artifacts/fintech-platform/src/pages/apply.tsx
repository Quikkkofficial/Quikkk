import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Landmark, Banknote, Briefcase, GraduationCap, ShieldCheck } from "lucide-react";

export default function Apply() {
  const products = [
    {
      id: "personal_loan",
      title: "Personal Loan",
      description: "Quick personal loans up to ₹50 Lakhs with flexible repayment.",
      icon: Banknote,
    },
    {
      id: "business_loan",
      title: "Business Loan",
      description: "Scale your business with collateral-free loans up to ₹2 Crores.",
      icon: Briefcase,
    },
    {
      id: "credit_card",
      title: "Credit Card",
      description: "Premium credit cards with exclusive rewards and lounge access.",
      icon: CreditCard,
    },
    {
      id: "gold_loan",
      title: "Gold Loan",
      description: "Unlock the value of your gold with lowest interest rates.",
      icon: Landmark,
    },
    {
      id: "student_loan",
      title: "Student Loan",
      description: "Fund your higher education at top universities globally.",
      icon: GraduationCap,
    },
    {
      id: "unsecured_loan",
      title: "Unsecured Loan",
      description: "Fast-track unsecured loans with minimal documentation.",
      icon: ShieldCheck,
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Select a Product</h1>
        <p className="text-muted-foreground mt-2">Choose the right financial product for your needs to start the application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <product.icon className="h-6 w-6" />
              </div>
              <CardTitle>{product.title}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">• Instant approval in 5 mins</li>
                <li className="flex items-center gap-2">• Minimal documentation</li>
                <li className="flex items-center gap-2">• 100% digital process</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/apply/${product.id}`}>Apply Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
