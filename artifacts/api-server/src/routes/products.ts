import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const { category, status, featured } = req.query as Record<string, string>;
  let rows = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
  if (category) rows = rows.filter(p => p.category === category);
  if (status) rows = rows.filter(p => p.status === status);
  if (featured === "true") rows = rows.filter(p => p.featured === true);
  res.json({ products: rows, total: rows.length });
});

router.post("/products", async (req, res): Promise<void> => {
  const { insertProductSchema } = await import("@workspace/db");
  const parsed = insertProductSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "validation_error", message: parsed.error.message }); return; }
  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(product);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) { res.status(404).json({ error: "not_found", message: "Product not found" }); return; }
  res.json(product);
});

router.put("/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [product] = await db.update(productsTable).set({ ...req.body, updatedAt: new Date() })
    .where(eq(productsTable.id, id)).returning();
  if (!product) { res.status(404).json({ error: "not_found", message: "Product not found" }); return; }
  res.json(product);
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.json({ success: true });
});

export default router;
