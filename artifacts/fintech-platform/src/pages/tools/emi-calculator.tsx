import { useState } from "react";
import { Link } from "wouter";
import { useCalculateEmi } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ShieldCheck, Calculator, ArrowRight, IndianRupee, TrendingUp, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(11);
  const [tenureMonths, setTenureMonths] = useState(24);
  const [showSchedule, setShowSchedule] = useState(false);

  const { data: result, mutate: calculate, isPending } = useCalculateEmi();

  const handleCalculate = () => {
    calculate({ data: { principal, annualRate, tenureMonths } });
    setShowSchedule(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
            FinAxis
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/tools/eligibility">
              <Button variant="outline" size="sm">Eligibility Check</Button>
            </Link>
            <Link href="/login"><Button size="sm">Sign In</Button></Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">EMI Calculator</h1>
          <p className="text-slate-500">Calculate your monthly installment in seconds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Loan Details</CardTitle>
              <CardDescription>Adjust the sliders to calculate your EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Loan Amount */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Loan Amount</Label>
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <IndianRupee className="h-3.5 w-3.5 text-blue-600" />
                    <Input
                      type="number"
                      value={principal}
                      onChange={e => setPrincipal(Number(e.target.value))}
                      className="border-0 bg-transparent p-0 w-24 text-right font-bold text-blue-700 focus-visible:ring-0 text-sm"
                    />
                  </div>
                </div>
                <Slider
                  value={[principal]}
                  onValueChange={([v]) => setPrincipal(v)}
                  min={10000}
                  max={10000000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹10K</span>
                  <span>₹1 Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Interest Rate</Label>
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Input
                      type="number"
                      value={annualRate}
                      onChange={e => setAnnualRate(Number(e.target.value))}
                      step={0.1}
                      className="border-0 bg-transparent p-0 w-14 text-right font-bold text-blue-700 focus-visible:ring-0 text-sm"
                    />
                    <span className="text-blue-700 text-sm font-bold">%</span>
                  </div>
                </div>
                <Slider
                  value={[annualRate]}
                  onValueChange={([v]) => setAnnualRate(v)}
                  min={6}
                  max={30}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>6%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Loan Tenure</Label>
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Input
                      type="number"
                      value={tenureMonths}
                      onChange={e => setTenureMonths(Number(e.target.value))}
                      className="border-0 bg-transparent p-0 w-14 text-right font-bold text-blue-700 focus-visible:ring-0 text-sm"
                    />
                    <span className="text-blue-700 text-sm font-bold">mo</span>
                  </div>
                </div>
                <Slider
                  value={[tenureMonths]}
                  onValueChange={([v]) => setTenureMonths(v)}
                  min={3}
                  max={360}
                  step={3}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>3 months</span>
                  <span>30 years</span>
                </div>
              </div>

              <Button onClick={handleCalculate} disabled={isPending} className="w-full gap-2 h-11">
                <Calculator className="h-4 w-4" />
                {isPending ? "Calculating..." : "Calculate EMI"}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          {result ? (
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
                <CardContent className="pt-8 pb-8 text-center">
                  <p className="text-blue-200 text-sm mb-2">Your Monthly EMI</p>
                  <p className="text-5xl font-bold mb-1">{formatINR(result.emi)}</p>
                  <p className="text-blue-200 text-sm">per month</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <IndianRupee className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{formatINR(result.principal)}</p>
                    <p className="text-xs text-slate-500">Principal</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <TrendingUp className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{formatINR(result.totalInterest)}</p>
                    <p className="text-xs text-slate-500">Total Interest</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-4 text-center">
                    <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{formatINR(result.totalPayment)}</p>
                    <p className="text-xs text-slate-500">Total Payment</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-5 pb-5">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowSchedule(!showSchedule)}
                      className="flex-1"
                    >
                      {showSchedule ? "Hide" : "View"} Amortization Schedule
                    </Button>
                    <Link href="/apply/personal_loan" className="flex-1">
                      <Button className="w-full gap-2">
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed border-2 flex items-center justify-center">
              <div className="text-center py-16 px-8 text-slate-400">
                <Calculator className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="font-medium">Enter loan details and click Calculate</p>
                <p className="text-sm mt-1">Your EMI breakdown will appear here</p>
              </div>
            </Card>
          )}
        </div>

        {/* Amortization Schedule */}
        {result && showSchedule && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Amortization Schedule</CardTitle>
              <CardDescription>Month-by-month payment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white">
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">EMI</TableHead>
                      <TableHead className="text-right">Principal</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">Outstanding</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.schedule.map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell className="text-right">{formatINR(row.emi)}</TableCell>
                        <TableCell className="text-right text-green-600">{formatINR(row.principal)}</TableCell>
                        <TableCell className="text-right text-red-500">{formatINR(row.interest)}</TableCell>
                        <TableCell className="text-right">{formatINR(row.outstanding)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
