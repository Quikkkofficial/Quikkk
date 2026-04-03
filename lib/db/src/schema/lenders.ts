import { pgTable, text, serial, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lendersTable = pgTable("lenders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // bank, nbfc, insurance_company
  logoUrl: text("logo_url"),
  description: text("description"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  status: text("status").notNull().default("active"), // active, inactive
  minInterestRate: real("min_interest_rate"),
  maxInterestRate: real("max_interest_rate"),
  maxLoanAmount: real("max_loan_amount"),
  minCibil: real("min_cibil"),
  processingFee: real("processing_fee"),
  turnaroundDays: real("turnaround_days"),
  totalApplications: real("total_applications").default(0),
  approvalRate: real("approval_rate").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLenderSchema = createInsertSchema(lendersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLender = z.infer<typeof insertLenderSchema>;
export type Lender = typeof lendersTable.$inferSelect;
