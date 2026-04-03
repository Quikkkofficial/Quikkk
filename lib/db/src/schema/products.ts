import { pgTable, text, serial, timestamp, real, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // personal_loan, business_loan, credit_card, health_insurance, life_insurance, motor_insurance, home_loan, gold_loan
  lenderId: integer("lender_id"),
  description: text("description"),
  minAmount: real("min_amount"),
  maxAmount: real("max_amount"),
  minTenure: integer("min_tenure"), // months
  maxTenure: integer("max_tenure"),
  interestRate: real("interest_rate"),
  processingFee: real("processing_fee"), // percentage
  minCibil: integer("min_cibil"),
  minIncome: real("min_income"),
  employmentTypes: text("employment_types"), // comma-separated: salaried,self_employed
  ageMin: integer("age_min"),
  ageMax: integer("age_max"),
  features: text("features"), // JSON string array
  status: text("status").notNull().default("active"), // active, inactive, featured
  commissionRate: real("commission_rate"), // % payout to vendors
  featured: boolean("featured").default(false),
  imageUrl: text("image_url"),
  badge: text("badge"), // "Best Seller", "Low Interest", etc.
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
