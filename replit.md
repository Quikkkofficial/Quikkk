# FinAxis - Fintech Aggregator Platform

## Overview

A complete production-ready fintech aggregator platform for India's NBFC ecosystem, similar to Paisabazaar/PoliceBazaar. 
Enables loan distribution, credit cards, insurance, channel partner network, and recovery module. Three portals: Customer, Vendor/Channel Partner, Admin.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, recharts, framer-motion, wouter
- **Build**: esbuild (CJS bundle)

## Applications

- **Frontend** (`artifacts/fintech-platform`) — React + Vite app served at `/`
- **API Server** (`artifacts/api-server`) — Express 5 API server at `/api`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## User Roles & Demo Credentials

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@finaxis.com      | Admin@123    |
| Vendor   | vendor@finaxis.com     | Vendor@123   |
| Customer | customer@finaxis.com   | Customer@123 |

**Note**: On the login page, you can select any role from the dropdown for quick testing without needing real credentials.

## Pages / Routes

### Public (no auth required)
- `/` — Landing page with product showcase and CTAs
- `/login` — Login
- `/register` — Customer registration
- `/products` — Financial Products Marketplace (browse/search/filter all products)
- `/products/personal-loans` — Personal loan listing with comparison
- `/products/business-loans` — Business loan listing
- `/products/credit-cards` — Credit card comparison
- `/products/home-loans` — Home loan listing
- `/products/insurance` — Health/Life/Motor insurance
- `/products/gold-loans` — Gold loan products
- `/products/:id` — Product detail page (features, eligibility, apply)
- `/tools/emi-calculator` — EMI calculator with amortization schedule
- `/tools/eligibility` — Loan eligibility checker with lender matching
- `/apply` — Product selection
- `/apply/:type` — Application form
- `/track` — Track application by reference number

### Customer Portal (requires login as customer/admin)
- `/customer/dashboard` — Application tracking, documents, notifications

### Vendor Dashboard (requires login as vendor/admin)
- `/vendor/dashboard` — Overview stats with charts
- `/vendor/applications` — All applications
- `/vendor/applications/new` — Submit new application
- `/vendor/leads` — Lead management
- `/vendor/recovery` — SMS/Email/WhatsApp messaging, campaigns
- `/vendor/team` — Team management
- `/vendor/commissions` — Commission tracking
- `/vendor/affiliate` — Affiliate link generator with performance tracking

### Admin Dashboard (requires login as admin)
- `/admin/dashboard` — Full KPI overview with charts
- `/admin/applications` — All applications, status updates
- `/admin/vendors` — Vendor management, performance leaderboard
- `/admin/lenders` — Bank/NBFC/Insurance company management (CRUD)
- `/admin/products` — Financial product catalogue management (CRUD)
- `/admin/users` — User & role management (RBAC)
- `/admin/leads` — Lead distribution
- `/admin/kyc` — Document verification
- `/admin/campaigns` — Campaign management
- `/admin/analytics` — Advanced analytics with charts

## Database Schema

Tables:
- `users` — All user accounts (admin, vendor, customer, employee)
- `vendors` — Channel partners and their performance data
- `applications` — Loan/credit card applications (full lifecycle)
- `commissions` — Commission tracking for vendors
- `documents` — KYC documents (Aadhaar, PAN, bank statement)
- `leads` — Lead management and assignment
- `communications` — SMS/Email/WhatsApp recovery messages
- `campaigns` — Bulk communication campaigns
- `notifications` — User notifications
- `activity_log` — Audit trail for all actions
- `lenders` — Banks, NBFCs, Insurance companies
- `products` — Financial product catalogue with eligibility rules and commission rates

## API Routes (all under /api)

- `GET/POST /lenders` — Lender management
- `GET/PUT/DELETE /lenders/:id` — Lender CRUD
- `GET/POST /products` — Product catalogue
- `GET/PUT/DELETE /products/:id` — Product CRUD
- `POST /tools/emi-calculator` — EMI + amortization schedule calculator
- `POST /tools/eligibility-check` — Loan eligibility with lender matching
- `auth.*` — Login, register, logout, me
- `users.*` — CRUD + list
- `applications.*` — CRUD + status updates
- `vendors.*` — CRUD + team + leaderboard
- `commissions.*` — List + summary
- `documents.*` — Upload + verify
- `leads.*` — CRUD + assign
- `communications.*` — Send + campaigns
- `notifications.*` — List + mark read
- `analytics.*` — Dashboard, applications, vendors, recent activity

## Seeded Data

- 8 lenders: HDFC Bank, ICICI Bank, Bajaj Finance, Axis Bank, SBI Bank, Aditya Birla Finance, Star Health Insurance, LIC of India
- 10 products: Personal loans, Business loans, Home loans, Credit cards, Gold loans, Health/Life/Motor insurance
- Sample users, vendors, applications, leads, commissions
