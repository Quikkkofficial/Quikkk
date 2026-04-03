import { Router, type IRouter } from "express";
import { eq, and, sql, desc } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import { ListNotificationsQueryParams, MarkNotificationReadParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/notifications", async (req, res): Promise<void> => {
  const params = ListNotificationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { read, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [eq(notificationsTable.userId, 1)]; // default to user 1 for demo
  if (read !== undefined) conditions.push(eq(notificationsTable.read, read));
  const whereClause = and(...conditions);

  const notifications = await db.select()
    .from(notificationsTable)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(desc(notificationsTable.createdAt));

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
    .from(notificationsTable)
    .where(whereClause);

  const [{ unreadCount }] = await db.select({ unreadCount: sql<number>`count(*)::int` })
    .from(notificationsTable)
    .where(and(eq(notificationsTable.userId, 1), eq(notificationsTable.read, false)));

  res.json({ notifications, total: count, unreadCount, page, limit });
});

router.put("/notifications/:notificationId/read", async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const [notification] = await db.update(notificationsTable)
    .set({ read: true })
    .where(eq(notificationsTable.id, params.data.notificationId))
    .returning();

  if (!notification) {
    res.status(404).json({ error: "not_found", message: "Notification not found" });
    return;
  }

  res.json(notification);
});

export default router;
