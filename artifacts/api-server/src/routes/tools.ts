import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/tools/emi-calculator", async (req, res): Promise<void> => {
  const { principal, annualRate, tenureMonths } = req.body as {
    principal: number;
    annualRate: number;
    tenureMonths: number;
  };

  if (!principal || !annualRate || !tenureMonths) {
    res.status(400).json({ error: "validation_error", message: "principal, annualRate, tenureMonths are required" });
    return;
  }

  const r = annualRate / 100 / 12;
  const n = tenureMonths;
  const P = principal;

  let emi: number;
  if (r === 0) {
    emi = P / n;
  } else {
    emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  const schedule = [];
  let outstanding = P;
  for (let i = 1; i <= n; i++) {
    const interestComponent = outstanding * r;
    const principalComponent = emi - interestComponent;
    outstanding -= principalComponent;
    schedule.push({
      month: i,
      emi: Math.round(emi),
      principal: Math.round(principalComponent),
      interest: Math.round(interestComponent),
      outstanding: Math.max(0, Math.round(outstanding)),
    });
  }

  res.json({
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    principal,
    annualRate,
    tenureMonths,
    schedule,
  });
});

router.post("/tools/eligibility-check", async (req, res): Promise<void> => {
  const { monthlyIncome, cibilScore, employmentType, age, loanAmount, loanType } = req.body as {
    monthlyIncome: number;
    cibilScore: number;
    employmentType: string;
    age: number;
    loanAmount: number;
    loanType: string;
  };

  if (!monthlyIncome || !cibilScore || !employmentType || !age) {
    res.status(400).json({ error: "validation_error", message: "monthlyIncome, cibilScore, employmentType, age required" });
    return;
  }

  const checks = {
    cibil: cibilScore >= 650,
    age: age >= 21 && age <= 65,
    income: monthlyIncome >= 15000,
    employment: ["salaried", "self_employed", "business"].includes(employmentType),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const eligible = score >= 3;

  let maxEligibleAmount = 0;
  let rateOfInterest = 0;

  if (eligible) {
    const multiplier = employmentType === "salaried" ? 60 : 48;
    maxEligibleAmount = Math.min(monthlyIncome * multiplier, 5000000);
    if (cibilScore >= 750) rateOfInterest = 10.5;
    else if (cibilScore >= 700) rateOfInterest = 12.5;
    else if (cibilScore >= 650) rateOfInterest = 14.5;
    else rateOfInterest = 16.5;
  }

  const lenders = [];
  if (eligible) {
    lenders.push(
      { name: "HDFC Bank", rate: rateOfInterest, maxAmount: maxEligibleAmount * 0.9, approved: true },
      { name: "ICICI Bank", rate: rateOfInterest + 0.5, maxAmount: maxEligibleAmount * 0.85, approved: true },
      { name: "Bajaj Finance", rate: rateOfInterest + 1, maxAmount: maxEligibleAmount * 0.8, approved: cibilScore >= 700 },
      { name: "Axis Bank", rate: rateOfInterest + 0.75, maxAmount: maxEligibleAmount * 0.75, approved: cibilScore >= 720 },
    );
  }

  res.json({
    eligible,
    score,
    maxScore: 4,
    checks,
    maxEligibleAmount: Math.round(maxEligibleAmount),
    rateOfInterest,
    lenders,
    message: eligible
      ? `You are eligible for up to ₹${(maxEligibleAmount / 100000).toFixed(1)}L at ${rateOfInterest}% p.a.`
      : "Based on current criteria, we recommend improving your CIBIL score and income before applying.",
  });
});

export default router;
