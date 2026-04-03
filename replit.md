# FinAxis - Fintech Platform

## Overview

A complete production-ready fintech platform for selling loans and credit cards. Supports three user roles: **Admin**, **Vendor/Channel Partner**, and **Customer**.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, recharts, framer-motion
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

## Pages

### Public
- `/` — Landing page
- `/login` — Login
- `/register` — Customer registration
- `/apply` — Product selection
- `/apply/:type` — Application form
- `/track` — Track application status

### Customer Portal
- `/customer/dashboard` — Application tracking, documents, notifications

### Vendor Dashboard
- `/vendor/dashboard` — Overview stats
- `/vendor/applications` — All applications
- `/vendor/applications/new` — Submit new application
- `/vendor/leads` — Lead management
- `/vendor/recovery` — SMS/Email/WhatsApp messaging, campaigns
- `/vendor/team` — Team management
- `/vendor/commissions` — Commission tracking

### Admin Dashboard
- `/admin/dashboard` — Full KPI overview with charts
- `/admin/applications` — All applications, status updates
- `/admin/vendors` — Vendor management, leaderboard
- `/admin/users` — User & role management
- `/admin/leads` — Lead distribution
- `/admin/kyc` — Document verification
- `/admin/campaigns` — Campaign management
- `/admin/analytics` — Advanced analytics

## Database Schema

Tables: `users`, `vendors`, `applications`, `commissions`, `documents`, `leads`, `communications`, `campaigns`, `notifications`, `activity_log`

## API Structure

All endpoints are under `/api`. See `lib/api-spec/openapi.yaml` for the full spec.

Routes:
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
