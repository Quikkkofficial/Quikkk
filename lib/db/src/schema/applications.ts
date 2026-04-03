import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  type: text("type").notNull(), // personal_loan, student_loan, gold_loan, unsecured_loan, business_loan, credit_card
  status: text("status").notNull().default("pending"), // pending, under_review, approved, rejected, disbursed, cancelled
  customerId: integer("customer_id").notNull(),
  vendorId: integer("vendor_id"),
  amount: real("amount"),
  tenure: integer("tenure"),
  interestRate: real("interest_rate"),
  purpose: text("purpose"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  panNumber: text("pan_number"),
  aadhaarNumber: text("aadhaar_number"),
  monthlyIncome: real("monthly_income"),
  employmentType: text("employment_type"),
  bankName: text("bank_name"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
