import { Router, type IRouter } from "express";
import { eq, and, sql, desc, sum } from "drizzle-orm";
import { db, commissionsTable } from "@workspace/db";
import { ListCommissionsQueryParams, GetCommissionSummaryQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/commissions", async (req, res): Promise<void> => {
  const params = ListCommissionsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { vendorId, status, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (vendorId) conditions.push(eq(commissionsTable.vendorId, vendorId));
  if (status) conditions.push(eq(commissionsTable.status, status));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const commissions = await db.select()
    .from(commissionsTable)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(commissionsTable.createdAt));

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(commissionsTable)
    .where(whereClause);

  res.json({ commissions, total: count, page, limit });
});

router.get("/commissions/summary", async (req, res): Promise<void> => {
  const params = GetCommissionSummaryQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { vendorId } = params.data;
  const conditions = vendorId ? [eq(commissionsTable.vendorId, vendorId)] : [];
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const allCommissions = await db.select()
    .from(commissionsTable)
    .where(whereClause);

  const totalEarned = allCommissions.reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = allCommissions.filter(c => c.status === "pending").reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = allCommissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.amount, 0);
  const thisMonthEarned = allCommissions
    .filter(c => c.createdAt >= thisMonthStart)
    .reduce((sum, c) => sum + c.amount, 0);
  const lastMonthEarned = allCommissions
    .filter(c => c.createdAt >= lastMonthStart && c.createdAt <= lastMonthEnd)
    .reduce((sum, c) => sum + c.amount, 0);

  res.json({ totalEarned, pendingAmount, paidAmount, thisMonthEarned, lastMonthEarned });
});

export default router;
