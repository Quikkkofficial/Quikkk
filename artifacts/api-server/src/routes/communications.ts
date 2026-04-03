import { Router, type IRouter } from "express";
import { eq, and, sql, desc } from "drizzle-orm";
import { db, communicationsTable, campaignsTable } from "@workspace/db";
import {
  SendCommunicationBody,
  CreateCampaignBody,
  ListCommunicationsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/communications", async (req, res): Promise<void> => {
  const params = ListCommunicationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { customerId, type, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (customerId) conditions.push(eq(communicationsTable.customerId, customerId));
  if (type) conditions.push(eq(communicationsTable.type, type));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const communications = await db.select()
    .from(communicationsTable)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(communicationsTable.createdAt));

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(communicationsTable)
    .where(whereClause);

  res.json({ communications, total: count, page, limit });
});

router.post("/communications", async (req, res): Promise<void> => {
  const parsed = SendCommunicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const [comm] = await db.insert(communicationsTable).values({
    customerId: parsed.data.customerId,
    type: parsed.data.type,
    content: parsed.data.content,
    status: "sent",
    sentBy: 1, // default to first admin user for demo
  }).returning();

  res.status(201).json(comm);
});

router.get("/communications/campaigns", async (_req, res): Promise<void> => {
  const campaigns = await db.select()
    .from(campaignsTable)
    .orderBy(desc(campaignsTable.createdAt));

  const total = campaigns.length;
  res.json({ campaigns, total });
});

router.post("/communications/campaigns", async (req, res): Promise<void> => {
  const parsed = CreateCampaignBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const [campaign] = await db.insert(campaignsTable).values({
    name: parsed.data.name,
    type: parsed.data.type,
    content: parsed.data.content,
    status: "draft",
    targetCount: 0,
    sentCount: 0,
    deliveredCount: 0,
    targetFilter: parsed.data.targetFilter ? JSON.stringify(parsed.data.targetFilter) : null,
  }).returning();

  res.status(201).json(campaign);
});

export default router;
