import { useState } from "react";
import { Link } from "wouter";
import { useCheckEligibility } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, CheckCircle, XCircle, ArrowRight, IndianRupee, Building2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString()}`;
}

const cibilRanges = [
  { min: 750, label: "Excellent", color: "text-green-600" },
  { min: 700, label: "Good", color: "text-blue-600" },
  { min: 650, label: "Fair", color: "text-yellow-600" },
  { min: 0, label: "Poor", color: "text-red-600" },
];

function getCibilLabel(score: number) {
  return cibilRanges.find(r => score >= r.min) ?? cibilRanges[cibilRanges.length - 1];
}

export default function EligibilityChecker() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [cibilScore, setCibilScore] = useState(720);
  const [employmentType, setEmploymentType] = useState("salaried");
  const [age, setAge] = useState(30);
  const [loanAmount, setLoanAmount] = useState(500000);

  const { data: result, mutate: check, isPending } = useCheckEligibility();

  const handleCheck = () => {
    check({ data: { monthlyIncome, cibilScore, employmentType, age, loanAmount } });
  };

  const cibilInfo = getCibilLabel(cibilScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
            FinAxis
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/tools/emi-calculator">
              <Button variant="outline" size="sm">EMI Calculator</Button>
            </Link>
            <Link href="/login"><Button size="sm">Sign In</Button></Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Loan Eligibility Checker</h1>
          <p className="text-slate-500">Find out how much loan you can get in 30 seconds</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Your Profile</CardTitle>
              <CardDescription>Enter your details for instant eligibility check</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Monthly Income */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Monthly Income</Label>
                  <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                    <IndianRupee className="h-3.5 w-3.5 text-indigo-600" />
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={e => setMonthlyIncome(Number(e.target.value))}
                      className="border-0 bg-transparent p-0 w-24 text-right font-bold text-indigo-700 focus-visible:ring-0 text-sm"
                    />
                  </div>
                </div>
                <Slider
                  value={[monthlyIncome]}
                  onValueChange={([v]) => setMonthlyIncome(v)}
                  min={5000}
                  max={1000000}
                  step={5000}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹5K</span>
                  <span>₹10L</span>
                </div>
              </div>

              {/* CIBIL Score */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">CIBIL Score</Label>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${cibilInfo.color}`}>{cibilInfo.label}</span>
                    <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      <Input
                        type="number"
                        value={cibilScore}
                        onChange={e => setCibilScore(Number(e.target.value))}
                        className="border-0 bg-transparent p-0 w-14 text-right font-bold text-indigo-700 focus-visible:ring-0 text-sm"
                        min={300}
                        max={900}
                      />
                    </div>
                  </div>
                </div>
                <Slider
                  value={[cibilScore]}
                  onValueChange={([v]) => setCibilScore(v)}
                  min={300}
                  max={900}
                  step={5}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>300</span>
                  <span>900</span>
                </div>
              </div>

              {/* Age */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="font-medium">Age</Label>
                  <div className="flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                    <Input
                      type="number"
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      className="border-0 bg-transparent p-0 w-14 text-right font-bold text-indigo-700 focus-visible:ring-0 text-sm"
                    />
                    <span className="text-indigo-700 text-sm font-bold">yr</span>
                  </div>
                </div>
                <Slider
                  value={[age]}
                  onValueChange={([v]) => setAge(v)}
                  min={18}
                  max={70}
                  step={1}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>18 yrs</span>
                  <span>70 yrs</span>
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <Label className="font-medium mb-3 block">Employment Type</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCheck} disabled={isPending} className="w-full gap-2 h-11">
                <ShieldCheck className="h-4 w-4" />
                {isPending ? "Checking..." : "Check Eligibility"}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          {result ? (
            <div className="space-y-4">
              {/* Eligibility Result */}
              <Card className={`shadow-xl border-2 ${result.eligible ? "border-green-300 bg-gradient-to-br from-green-50 to-emerald-50" : "border-red-300 bg-gradient-to-br from-red-50 to-pink-50"}`}>
                <CardContent className="pt-8 pb-8 text-center">
                  {result.eligible ? (
                    <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircle className="h-14 w-14 text-red-400 mx-auto mb-4" />
                  )}
                  <h2 className={`text-2xl font-bold mb-2 ${result.eligible ? "text-green-800" : "text-red-800"}`}>
                    {result.eligible ? "You're Eligible!" : "Not Eligible Yet"}
                  </h2>
                  <p className="text-slate-600 text-sm mb-4">{result.message}</p>
                  {result.eligible && (
                    <div className="bg-white/70 rounded-xl p-4 inline-block">
                      <p className="text-sm text-slate-500 mb-1">Max Eligible Amount</p>
                      <p className="text-3xl font-bold text-green-700">{formatINR(result.maxEligibleAmount)}</p>
                      <p className="text-sm text-slate-500 mt-1">at {result.rateOfInterest}% p.a.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Eligibility Checks */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Eligibility Score: {result.score}/{result.maxScore}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(result.checks).map(([key, passed]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      {passed ? (
                        <Badge className="bg-green-50 text-green-700 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" /> Pass
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                          <XCircle className="h-3 w-3 mr-1" /> Fail
                        </Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Lender Matches */}
              {result.eligible && result.lenders.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Matching Lenders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.lenders.map((lender) => (
                      <div key={lender.name} className={`flex items-center justify-between p-3 rounded-lg border ${lender.approved ? "bg-white border-green-200" : "bg-slate-50 border-slate-200 opacity-60"}`}>
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{lender.name}</p>
                            <p className="text-xs text-slate-500">{lender.rate}% p.a. · Up to {formatINR(lender.maxAmount)}</p>
                          </div>
                        </div>
                        {lender.approved ? (
                          <Link href="/apply/personal_loan">
                            <Button size="sm" className="gap-1">
                              Apply <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        ) : (
                          <Badge variant="outline" className="text-slate-400">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Score Required
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="border-dashed border-2 flex items-center justify-center">
              <div className="text-center py-16 px-8 text-slate-400">
                <ShieldCheck className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="font-medium">Enter your profile details</p>
                <p className="text-sm mt-1">Check your loan eligibility instantly</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
