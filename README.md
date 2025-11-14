# NsuMate – NSU Matrimony Platform

NsuMate is a university-only matrimony web application for NSU students. Accounts are restricted to a configured university email domain (default `@nsu.edu`) and academic data is used for matching.

Tech stack:
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- PostgreSQL + Prisma
- JWT cookie auth

## Features

- University email–restricted signup (`UNIVERSITY_EMAIL_DOMAIN`)
- Multi-step onboarding with academic fields:
  - CGPA, semester, semester number, university year
  - Student ID, credits completed, department, batch
  - Personal info, family info, interests, religion
  - Privacy settings for name, photo blur, CGPA
- Academic-aware matching:
  - Same department, semester, year
  - CGPA similarity and overlapping interests
  - Mutual academic preferences
- Profile browsing with filters (via `/api/browse`)
- Matches with mutual matching only
- Chat between matched users (polling)
- Reporting and blocking system
- Admin dashboard for approving profiles, handling reports, banning users

## Getting started (local)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and adjust values:

- `DATABASE_URL` – PostgreSQL connection string
- `NEXTAUTH_URL` – base URL of the app
- `NEXTAUTH_SECRET` / `JWT_SECRET` – strong random strings
- `UNIVERSITY_EMAIL_DOMAIN` – e.g. `nsu.edu`
- `ADMIN_EMAIL` – email you plan to make admin (change role manually in DB)

### 3. Run PostgreSQL

Using Docker:

```bash
docker compose up db -d
```

Or point `DATABASE_URL` to any managed Postgres.

### 4. Run Prisma migrations

```bash
npx prisma migrate dev --name init
```

This will create the tables defined in `prisma/schema.prisma`.

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Production (Docker)

Build and run with Docker Compose:

```bash
docker compose up --build
```

For production:
- Change the `command` in `docker-compose.yml` for the `app` service to `npm start`
- Ensure `NODE_ENV=production` and secrets are strong

Deploy options:
- Vercel for the Next.js app + managed Postgres (Neon, Supabase, etc.)
- Any VPS with Docker/Node 20

## Matching algorithm

Matching logic is implemented in `src/lib/matching.ts`:

- Points for same department, semester, and university year
- Extra points for CGPA within a similar range
- Extra points per overlapping interest tag
- Additional points when user preferences (same department, similar CGPA, same semester/year) are satisfied

The final integer score is stored in the `Match` table.

## Roles and admin

- `User.role` is `USER` or `ADMIN`
- Authenticated routes: `/dashboard`, `/onboarding`, `/browse`, `/matches`, `/messages/*`
- Admin-only routes: `/admin`, `/api/admin/*`
- Middleware in `src/middleware.ts` validates the JWT cookie

To create an admin user, set the `role` column for that user to `ADMIN` in the database.

## Important commands

- `npm run dev` – start dev server
- `npm run build` – build for production
- `npm start` – start production server
- `npm run prisma:generate` – generate Prisma client
- `npm run prisma:migrate` – apply migrations in production

## Notes

- Email verification is limited to domain validation; add a mail provider for full verification if needed.
- Chat uses simple polling via `/api/messages/[matchId]`; you can upgrade to websockets later.

