import { Router, type IRouter } from "express";
import { eq, and, sql, desc } from "drizzle-orm";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody, AssignLeadParams, AssignLeadBody, ListLeadsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leads", async (req, res): Promise<void> => {
  const params = ListLeadsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { assignedTo, status, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (assignedTo) conditions.push(eq(leadsTable.assignedTo, assignedTo));
  if (status) conditions.push(eq(leadsTable.status, status));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const leads = await db.select()
    .from(leadsTable)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(leadsTable.createdAt));

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(leadsTable)
    .where(whereClause);

  res.json({ leads, total: count, page, limit });
});

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const [lead] = await db.insert(leadsTable).values({
    ...parsed.data,
    email: parsed.data.email ?? null,
    status: "new",
  }).returning();

  res.status(201).json(lead);
});

router.put("/leads/:leadId/assign", async (req, res): Promise<void> => {
  const params = AssignLeadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const body = AssignLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "validation_error", message: body.error.message });
    return;
  }

  const [lead] = await db.update(leadsTable)
    .set({ assignedTo: body.data.assignedTo })
    .where(eq(leadsTable.id, params.data.leadId))
    .returning();

  if (!lead) {
    res.status(404).json({ error: "not_found", message: "Lead not found" });
    return;
  }

  res.json(lead);
});

export default router;
