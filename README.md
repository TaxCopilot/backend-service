# TaxCopilot Backend Service

Node.js/Express backend for TaxCopilot — handles auth, cases, documents, drafts, and law library.

## Overview

The backend provides REST APIs for:
- **Auth**: Register, login, Google OAuth, JWT (7-day expiry)
- **Users**: Profile, avatar, CA registration ID
- **Cases**: Workspace/case management
- **Documents**: Upload, storage (S3), soft delete
- **Drafts**: AI-assisted drafting pipeline
- **Law Library**: Legal document search

See [requirements.md](../requirements.md) and [design.md](../design.md) for full specs.

## Prerequisites

- Node.js 20+
- PostgreSQL
- (Optional) AWS S3 for file storage
- (Optional) Google OAuth credentials

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env: DATABASE_URL, JWT_SECRET, CORS_ORIGIN, etc.
   ```

3. **Database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Backend runs on http://localhost:8002.

## Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start dev server             |
| `npm run build`      | TypeScript build             |
| `npm run start`      | Run production build         |
| `prisma:generate`    | Generate Prisma client       |
| `prisma:migrate`     | Run migrations (dev)         |
| `prisma:migrate:prod`| Run migrations (prod)        |
| `prisma:studio`      | Open Prisma Studio           |

## Environment Variables

| Variable             | Description                    | Default              |
| -------------------- | ------------------------------ | -------------------- |
| `PORT`               | Server port                    | `8002`               |
| `NODE_ENV`           | Environment                    | `development`        |
| `DATABASE_URL`       | PostgreSQL connection string   | —                    |
| `CORS_ORIGIN`        | Allowed origins                | `http://localhost:3000` |
| `JWT_SECRET`         | JWT signing secret             | —                    |
| `JWT_EXPIRES_IN`     | Token expiry                   | `7d`                 |
| `FRONTEND_URL`       | Frontend URL (for OAuth)       | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID`   | Google OAuth client ID         | —                    |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret    | —                    |
| `GOOGLE_REDIRECT_URI`| OAuth callback URL             | —                    |
| `AWS_*`              | S3 credentials (if used)       | —                    |

## Docker

Run via Docker Compose from the project root. The backend uses a PostgreSQL service and runs migrations on startup:

```bash
docker-compose up --build
```
