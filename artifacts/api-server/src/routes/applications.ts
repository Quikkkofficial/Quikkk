import { Router, type IRouter } from "express";
import { eq, and, like, or, sql, desc } from "drizzle-orm";
import { db, applicationsTable, activityLogTable } from "@workspace/db";
import {
  CreateApplicationBody,
  UpdateApplicationBody,
  GetApplicationParams,
  UpdateApplicationParams,
  UpdateApplicationStatusParams,
  UpdateApplicationStatusBody,
  ListApplicationsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateAppNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FA-${ts}-${rand}`;
}

router.get("/applications", async (req, res): Promise<void> => {
  const params = ListApplicationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { status, type, vendorId, customerId, page = 1, limit = 20, search } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (status) conditions.push(eq(applicationsTable.status, status));
  if (type) conditions.push(eq(applicationsTable.type, type));
  if (vendorId) conditions.push(eq(applicationsTable.vendorId, vendorId));
  if (customerId) conditions.push(eq(applicationsTable.customerId, customerId));
  if (search) conditions.push(or(
    like(applicationsTable.customerName, `%${search}%`),
    like(applicationsTable.applicationNumber, `%${search}%`),
    like(applicationsTable.customerEmail, `%${search}%`)
  ));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const applications = await db.select()
    .from(applicationsTable)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(applicationsTable.createdAt));

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(applicationsTable)
    .where(whereClause);

  res.json({ applications, total: count, page, limit });
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { vendorId, ...rest } = parsed.data;
  const [app] = await db.insert(applicationsTable).values({
    ...rest,
    customerId: 1, // default customer ID for demo
    vendorId: vendorId ?? null,
    applicationNumber: generateAppNumber(),
    status: "pending",
  }).returning();

  // Log activity
  await db.insert(activityLogTable).values({
    type: "application_submitted",
    message: `New ${app.type.replace(/_/g, " ")} application submitted by ${app.customerName}`,
    entityId: app.id,
    userId: null,
  });

  res.status(201).json(app);
});

router.get("/applications/:applicationId", async (req, res): Promise<void> => {
  const params = GetApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const [app] = await db.select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, params.data.applicationId));

  if (!app) {
    res.status(404).json({ error: "not_found", message: "Application not found" });
    return;
  }

  res.json(app);
});

router.put("/applications/:applicationId", async (req, res): Promise<void> => {
  const params = UpdateApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const body = UpdateApplicationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "validation_error", message: body.error.message });
    return;
  }

  const [app] = await db.update(applicationsTable)
    .set(body.data)
    .where(eq(applicationsTable.id, params.data.applicationId))
    .returning();

  if (!app) {
    res.status(404).json({ error: "not_found", message: "Application not found" });
    return;
  }

  res.json(app);
});

router.put("/applications/:applicationId/status", async (req, res): Promise<void> => {
  const params = UpdateApplicationStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const body = UpdateApplicationStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "validation_error", message: body.error.message });
    return;
  }

  const [app] = await db.update(applicationsTable)
    .set({ status: body.data.status, remarks: body.data.remarks ?? null })
    .where(eq(applicationsTable.id, params.data.applicationId))
    .returning();

  if (!app) {
    res.status(404).json({ error: "not_found", message: "Application not found" });
    return;
  }

  // Log activity
  const activityType = body.data.status === "approved"
    ? "application_approved"
    : body.data.status === "rejected"
    ? "application_rejected"
    : "application_submitted";

  await db.insert(activityLogTable).values({
    type: activityType,
    message: `Application ${app.applicationNumber} status updated to ${body.data.status}`,
    entityId: app.id,
    userId: null,
  });

  res.json(app);
});

export default router;
