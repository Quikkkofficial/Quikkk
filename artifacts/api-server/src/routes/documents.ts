import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, documentsTable } from "@workspace/db";
import { UploadDocumentBody, VerifyDocumentParams, VerifyDocumentBody, ListDocumentsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/documents", async (req, res): Promise<void> => {
  const params = ListDocumentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { applicationId, userId } = params.data;

  const conditions = [];
  if (applicationId) conditions.push(eq(documentsTable.applicationId, applicationId));
  if (userId) conditions.push(eq(documentsTable.userId, userId));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const documents = await db.select().from(documentsTable).where(whereClause);

  res.json({ documents });
});

router.post("/documents", async (req, res): Promise<void> => {
  const parsed = UploadDocumentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const [doc] = await db.insert(documentsTable).values({
    ...parsed.data,
    applicationId: parsed.data.applicationId ?? null,
    verificationStatus: "pending",
  }).returning();

  res.status(201).json(doc);
});

router.put("/documents/:documentId/verify", async (req, res): Promise<void> => {
  const params = VerifyDocumentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const body = VerifyDocumentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "validation_error", message: body.error.message });
    return;
  }

  const [doc] = await db.update(documentsTable)
    .set({ verificationStatus: body.data.verificationStatus, remarks: body.data.remarks ?? null })
    .where(eq(documentsTable.id, params.data.documentId))
    .returning();

  if (!doc) {
    res.status(404).json({ error: "not_found", message: "Document not found" });
    return;
  }

  res.json(doc);
});

export default router;
