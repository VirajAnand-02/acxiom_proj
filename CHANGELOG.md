# Changelog

## 2026-02-21

- Built Next.js Pages Router app for Event Management System.
- Added NextAuth credentials authentication with bcrypt password checks and 30-minute session TTL.
- Added Prisma schema (User, Membership, Item, Transaction, Cart) and SQLite datasource.
- Added seeded users (admin/user/vendor) and sample membership (`MEM-0001`).
- Implemented RBAC protections:
  - Middleware route guarding
  - SSR page guards
  - API-level role checks
- Implemented admin maintenance pages:
  - Add Membership
  - Update Membership by membership number load
  - Users management
  - Vendors management
- Implemented Reports and Transactions pages for Admin/User.
- Implemented Vendor and User dashboard pages.
- Added reusable UI components:
  - Header, Footer, ProtectedLayout
  - FormInput, RadioGroup, Checkbox
  - MembershipForm
- Added chart page with Mermaid rendering and Chart link in header on all pages.
- Added API routes for auth, memberships, items, and transactions with zod server validation.
- Added Vitest unit test for membership schemas.
- Added Cypress e2e skeleton for login, membership creation, and role gate checks.
- Copied `views/` assets to `public/views/`.
