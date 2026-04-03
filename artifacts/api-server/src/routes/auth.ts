import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { LoginBody, RegisterBody } from "@workspace/api-zod";
import * as crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "finaxis_salt").digest("hex");
}

function makeToken(userId: number, role: string): string {
  return Buffer.from(JSON.stringify({ userId, role, ts: Date.now() })).toString("base64");
}

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user || user.passwordHash !== hashPassword(password)) {
    res.status(401).json({ error: "invalid_credentials", message: "Invalid email or password" });
    return;
  }

  if (user.status !== "active") {
    res.status(401).json({ error: "account_suspended", message: "Your account has been suspended" });
    return;
  }

  const token = makeToken(user.id, user.role);
  const { passwordHash: _, ...userWithoutPassword } = user;

  res.json({ token, user: userWithoutPassword });
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error", message: parsed.error.message });
    return;
  }

  const { email, password, name, phone } = parsed.data;

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "email_exists", message: "Email already registered" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    email,
    name,
    phone: phone ?? null,
    role: "customer",
    status: "active",
    passwordHash: hashPassword(password),
  }).returning();

  const token = makeToken(user.id, user.role);
  const { passwordHash: _, ...userWithoutPassword } = user;

  res.status(201).json({ token, user: userWithoutPassword });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ message: "Logged out successfully" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "unauthorized", message: "No auth token" });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.userId));

    if (!user) {
      res.status(401).json({ error: "unauthorized", message: "User not found" });
      return;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch {
    res.status(401).json({ error: "unauthorized", message: "Invalid token" });
  }
});

export default router;
