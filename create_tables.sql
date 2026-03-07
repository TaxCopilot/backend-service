-- Application tables for TaxCopilot backend service
-- Safe to run multiple times (all statements are idempotent).

DO $$ BEGIN
    CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "DraftCategory" AS ENUM ('SCN_REPLY', 'APPEAL_MEMORANDUM', 'LEGAL_OPINION', 'GENERAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "DraftStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'EXPORTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id              TEXT        PRIMARY KEY,
    email           TEXT        UNIQUE NOT NULL,
    name            TEXT        NOT NULL,
    password        TEXT,
    "googleId"      TEXT        UNIQUE,
    provider        "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "avatarUrl"     TEXT,
    "registrationId" TEXT,
    phone           TEXT,
    role            "Role"      NOT NULL DEFAULT 'USER',
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cases (
    id              TEXT        PRIMARY KEY,
    title           TEXT        NOT NULL,
    "clientName"    TEXT,
    "referenceNo"   TEXT,
    description     TEXT,
    status          "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "dueDate"       TIMESTAMPTZ,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "userId"        TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_cases_userid ON cases("userId");

CREATE TABLE IF NOT EXISTS drafts (
    id          TEXT         PRIMARY KEY,
    title       TEXT         NOT NULL,
    category    "DraftCategory" NOT NULL DEFAULT 'GENERAL',
    content     TEXT,
    status      "DraftStatus" NOT NULL DEFAULT 'DRAFT',
    score       DOUBLE PRECISION,
    "deletedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "userId"    TEXT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "caseId"    TEXT         REFERENCES cases(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_drafts_userid ON drafts("userId");
CREATE INDEX IF NOT EXISTS idx_drafts_caseid ON drafts("caseId");

CREATE TABLE IF NOT EXISTS documents (
    id              TEXT        PRIMARY KEY,
    filename        TEXT        NOT NULL,
    "mimeType"      TEXT        NOT NULL,
    "sizeBytes"     INTEGER     NOT NULL,
    "storagePath"   TEXT        NOT NULL,
    "s3Bucket"      TEXT,
    "s3Key"         TEXT,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "userId"        TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "caseId"        TEXT        REFERENCES cases(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_documents_userid ON documents("userId");
CREATE INDEX IF NOT EXISTS idx_documents_caseid ON documents("caseId");

CREATE TABLE IF NOT EXISTS law_entries (
    id          TEXT        PRIMARY KEY,
    category    TEXT        NOT NULL,
    section     TEXT,
    title       TEXT        NOT NULL,
    description TEXT        NOT NULL,
    tags        TEXT[]      NOT NULL DEFAULT '{}',
    "sourceUrl" TEXT,
    court       TEXT,
    year        INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_law_entries_category ON law_entries(category);
