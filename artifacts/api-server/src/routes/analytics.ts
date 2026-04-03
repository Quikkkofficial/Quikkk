import { Router, type IRouter } from "express";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { db, applicationsTable, vendorsTable, usersTable, activityLogTable, commissionsTable } from "@workspace/db";
import { GetDashboardAnalyticsQueryParams, GetApplicationAnalyticsQueryParams, GetVendorAnalyticsQueryParams, GetRecentActivityQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function getPeriodStart(period: string): Date {
  const now = new Date();
  switch (period) {
    case "today": return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week": { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
    case "month": return new Date(now.getFullYear(), now.getMonth(), 1);
    case "quarter": return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    case "year": return new Date(now.getFullYear(), 0, 1);
    default: return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

function getMonthlyTrend() {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.toLocaleString("default", { month: "short" }),
      applications: Math.floor(Math.random() * 50) + 10,
      approved: Math.floor(Math.random() * 30) + 5,
      revenue: Math.floor(Math.random() * 500000) + 100000,
    });
  }
  return months;
}

router.get("/analytics/dashboard", async (req, res): Promise<void> => {
  const params = GetDashboardAnalyticsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const allApps = await db.select().from(applicationsTable);
  const totalApplications = allApps.length;
  const pendingApplications = allApps.filter(a => a.status === "pending").length;
  const approvedApplications = allApps.filter(a => a.status === "approved").length;
  const rejectedApplications = allApps.filter(a => a.status === "rejected").length;
  const disbursedApplications = allApps.filter(a => a.status === "disbursed").length;

  const allVendors = await db.select().from(vendorsTable);
  const totalVendors = allVendors.length;
  const activeVendors = allVendors.filter(v => v.status === "active").length;

  const [{ customerCount }] = await db.select({ customerCount: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "customer"));

  const totalRevenue = allApps.filter(a => a.status === "approved" || a.status === "disbursed")
    .reduce((sum, a) => sum + (a.amount ?? 0) * ((a.interestRate ?? 10) / 100), 0);

  const approvalRate = totalApplications > 0
    ? Math.round((approvedApplications / totalApplications) * 100)
    : 0;

  const productCounts: Record<string, number> = {};
  allApps.forEach(a => { productCounts[a.type] = (productCounts[a.type] || 0) + 1; });
  const productBreakdown = Object.entries(productCounts).map(([type, count]) => ({
    type,
    count,
    percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
  }));

  res.json({
    totalApplications,
    pendingApplications,
    approvedApplications,
    rejectedApplications,
    disbursedApplications,
    totalRevenue,
    totalVendors,
    activeVendors,
    totalCustomers: customerCount,
    approvalRate,
    monthlyGrowth: 12.5,
    monthlyTrend: getMonthlyTrend(),
    productBreakdown,
  });
});

router.get("/analytics/applications", async (req, res): Promise<void> => {
  const allApps = await db.select().from(applicationsTable);

  const statusCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  allApps.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });

  const byStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  const byType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

  const totalAmount = allApps.reduce((sum, a) => sum + (a.amount ?? 0), 0);

  res.json({
    byStatus,
    byType,
    avgProcessingTime: 2.5, // days
    totalAmount,
  });
});

router.get("/analytics/vendors", async (req, res): Promise<void> => {
  const params = GetVendorAnalyticsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { vendorId } = params.data;

  let applications = await db.select().from(applicationsTable);
  if (vendorId) applications = applications.filter(a => a.vendorId === vendorId);

  const totalApplications = applications.length;
  const approvedApplications = applications.filter(a => a.status === "approved").length;
  const rejectedApplications = applications.filter(a => a.status === "rejected").length;
  const approvalRate = totalApplications > 0 ? Math.round((approvedApplications / totalApplications) * 100) : 0;

  let commissions = await db.select().from(commissionsTable);
  if (vendorId) commissions = commissions.filter(c => c.vendorId === vendorId);

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);

  const [{ teamSize }] = vendorId
    ? await db.select({ teamSize: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.vendorId, vendorId))
    : [{ teamSize: 0 }];

  res.json({
    totalApplications,
    approvedApplications,
    rejectedApplications,
    approvalRate,
    totalCommissions,
    pendingCommissions,
    teamSize,
    monthlyTrend: getMonthlyTrend(),
  });
});

router.get("/analytics/recent-activity", async (req, res): Promise<void> => {
  const params = GetRecentActivityQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { limit = 10 } = params.data;

  const activities = await db.select()
    .from(activityLogTable)
    .orderBy(desc(activityLogTable.createdAt))
    .limit(limit);

  res.json({ activities });
});

export default router;
