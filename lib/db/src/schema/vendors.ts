import { pgTable, text, serial, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vendorsTable = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, suspended
  commissionRate: real("commission_rate").notNull().default(1.5),
  totalApplications: integer("total_applications").notNull().default(0),
  totalApproved: integer("total_approved").notNull().default(0),
  totalEarnings: real("total_earnings").notNull().default(0),
  city: text("city"),
  state: text("state"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertVendorSchema = createInsertSchema(vendorsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendorsTable.$inferSelect;
