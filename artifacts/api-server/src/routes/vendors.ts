import { Router, type IRouter } from "express";
import { eq, and, sql, desc } from "drizzle-orm";
import { db, vendorsTable, usersTable, applicationsTable, commissionsTable, activityLogTable } from "@workspace/db";
import {
  CreateVendorBody,
  UpdateVendorBody,
  GetVendorParams,
  UpdateVendorParams,
  ListVendorsQueryParams,
  GetVendorTeamParams,
  GetVendorLeaderboardQueryParams,
} from "@workspace/api-zod";
import * as crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "finaxis_salt").digest("hex");
}

function generateVendorCode(): string {
  return "VND" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

router.get("/vendors", async (req, res): Promise<void> => {
  const params = ListVendorsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { status, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (status) conditions.push(eq(vendorsTable.status, status));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const vendors = await db.select()
    .from(vendorsTable)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(vendorsTable.createdAt));

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(vendorsTable)
    .where(whereClause);

  res.json({ vendors, total: count, page, limit });
});

router.post("/vendors", async (req, res): Promise<void> => {
  const parsed = CreateVendorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { password, ...vendorData } = parsed.data;

  const [vendor] = await db.insert(vendorsTable).values({
    ...vendorData,
    code: generateVendorCode(),
    status: "active",
    totalApplications: 0,
    totalApproved: 0,
    totalEarnings: 0,
  }).returning();

  // Create the vendor user account
  await db.insert(usersTable).values({
    email: vendorData.email,
    name: vendorData.name,
    phone: vendorData.phone,
    role: "vendor",
    status: "active",
    passwordHash: hashPassword(password),
    vendorId: vendor.id,
  });

  // Log activity
  await db.insert(activityLogTable).values({
    type: "vendor_registered",
    message: `New vendor ${vendor.name} registered with code ${vendor.code}`,
    entityId: vendor.id,
    userId: null,
  });

  res.status(201).json(vendor);
});

router.get("/vendors/leaderboard", async (req, res): Promise<void> => {
  const params = GetVendorLeaderboardQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { limit = 10, period = "month" } = params.data;

  const vendors = await db.select()
    .from(vendorsTable)
    .where(eq(vendorsTable.status, "active"))
    .orderBy(desc(vendorsTable.totalApproved))
    .limit(limit);

  const leaderboard = vendors.map((v, idx) => ({
    vendorId: v.id,
    vendorName: v.name,
    vendorCode: v.code,
    totalApplications: v.totalApplications,
    approvedApplications: v.totalApproved,
    approvalRate: v.totalApplications > 0 ? Math.round((v.totalApproved / v.totalApplications) * 100) : 0,
    totalEarnings: v.totalEarnings,
    rank: idx + 1,
  }));

  res.json({ leaderboard, period });
});

router.get("/vendors/:vendorId", async (req, res): Promise<void> => {
  const params = GetVendorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const [vendor] = await db.select()
    .from(vendorsTable)
    .where(eq(vendorsTable.id, params.data.vendorId));

  if (!vendor) {
    res.status(404).json({ error: "not_found", message: "Vendor not found" });
    return;
  }

  res.json(vendor);
});

router.put("/vendors/:vendorId", async (req, res): Promise<void> => {
  const params = UpdateVendorParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const body = UpdateVendorBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "validation_error", message: body.error.message });
    return;
  }

  const [vendor] = await db.update(vendorsTable)
    .set(body.data)
    .where(eq(vendorsTable.id, params.data.vendorId))
    .returning();

  if (!vendor) {
    res.status(404).json({ error: "not_found", message: "Vendor not found" });
    return;
  }

  res.json(vendor);
});

router.get("/vendors/:vendorId/team", async (req, res): Promise<void> => {
  const params = GetVendorTeamParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const members = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
    phone: usersTable.phone,
    role: usersTable.role,
    status: usersTable.status,
    vendorId: usersTable.vendorId,
    avatar: usersTable.avatar,
    createdAt: usersTable.createdAt,
  }).from(usersTable)
    .where(eq(usersTable.vendorId, params.data.vendorId));

  res.json({ members });
});

export default router;
