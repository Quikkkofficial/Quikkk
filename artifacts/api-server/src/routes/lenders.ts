import { Router, type IRouter } from "express";
import { db, lendersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/lenders", async (req, res): Promise<void> => {
  const { type, status } = req.query as Record<string, string>;
  let rows = await db.select().from(lendersTable).orderBy(desc(lendersTable.createdAt));
  if (type) rows = rows.filter(l => l.type === type);
  if (status) rows = rows.filter(l => l.status === status);
  res.json({ lenders: rows, total: rows.length });
});

router.post("/lenders", async (req, res): Promise<void> => {
  const { insertLenderSchema } = await import("@workspace/db");
  const parsed = insertLenderSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "validation_error", message: parsed.error.message }); return; }
  const [lender] = await db.insert(lendersTable).values(parsed.data).returning();
  res.status(201).json(lender);
});

router.get("/lenders/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [lender] = await db.select().from(lendersTable).where(eq(lendersTable.id, id));
  if (!lender) { res.status(404).json({ error: "not_found", message: "Lender not found" }); return; }
  res.json(lender);
});

router.put("/lenders/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [lender] = await db.update(lendersTable).set({ ...req.body, updatedAt: new Date() })
    .where(eq(lendersTable.id, id)).returning();
  if (!lender) { res.status(404).json({ error: "not_found", message: "Lender not found" }); return; }
  res.json(lender);
});

router.delete("/lenders/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(lendersTable).where(eq(lendersTable.id, id));
  res.json({ success: true });
});

export default router;
