import { Router, type IRouter } from "express";
import { eq, like, or, and, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { CreateUserBody, UpdateUserBody, GetUserParams, UpdateUserParams, DeleteUserParams, ListUsersQueryParams } from "@workspace/api-zod";
import * as crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "finaxis_salt").digest("hex");
}

router.get("/users", async (req, res): Promise<void> => {
  const params = ListUsersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const { role, page = 1, limit = 20, search } = params.data;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (role) conditions.push(eq(usersTable.role, role));
  if (search) conditions.push(or(
    like(usersTable.name, `%${search}%`),
    like(usersTable.email, `%${search}%`)
  ));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const users = await db.select({
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
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(usersTable.createdAt);

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(whereClause);

  res.json({ users, total: count, page, limit });
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { password, ...rest } = parsed.data;
  const [user] = await db.insert(usersTable).values({
    ...rest,
    status: "active",
    passwordHash: hashPassword(password),
  }).returning();

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
});

router.get("/users/:userId", async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const [user] = await db.select({
    id: usersTable.id,
    email: usersTable.email,
    name: usersTable.name,
    phone: usersTable.phone,
    role: usersTable.role,
    status: usersTable.status,
    vendorId: usersTable.vendorId,
    avatar: usersTable.avatar,
    createdAt: usersTable.createdAt,
  }).from(usersTable).where(eq(usersTable.id, params.data.userId));

  if (!user) {
    res.status(404).json({ error: "not_found", message: "User not found" });
    return;
  }

  res.json(user);
});

router.put("/users/:userId", async (req, res): Promise<void> => {
  const params = UpdateUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const body = UpdateUserBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "validation_error", message: body.error.message });
    return;
  }

  const [user] = await db.update(usersTable)
    .set(body.data)
    .where(eq(usersTable.id, params.data.userId))
    .returning();

  if (!user) {
    res.status(404).json({ error: "not_found", message: "User not found" });
    return;
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.delete("/users/:userId", async (req, res): Promise<void> => {
  const params = DeleteUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "validation_error", message: params.error.message });
    return;
  }

  const [user] = await db.delete(usersTable).where(eq(usersTable.id, params.data.userId)).returning();

  if (!user) {
    res.status(404).json({ error: "not_found", message: "User not found" });
    return;
  }

  res.json({ message: "User deleted successfully" });
});

export default router;
