-- DropIndex
DROP INDEX "law_entries_category_idx";

-- CreateTable
CREATE TABLE "case_chat_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "isAnalysis" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "langchain_pg_embedding" (
    "uuid" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "embedding" TEXT,
    "document" TEXT,
    "cmetadata" JSONB,
    "custom_id" TEXT,

    CONSTRAINT "langchain_pg_embedding_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "langchain_pg_collection" (
    "name" TEXT NOT NULL,
    "cmetadata" JSONB,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "langchain_pg_collection_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "document_cache" (
    "id" BIGSERIAL NOT NULL,
    "document_id" TEXT NOT NULL,
    "extracted_text" TEXT NOT NULL,
    "analysis_summary" TEXT,
    "sections_applied" TEXT,
    "demands" TEXT,
    "deadlines" TEXT,
    "immediate_actions" TEXT,
    "citations" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "case_chat_sessions_userId_idx" ON "case_chat_sessions"("userId");

-- CreateIndex
CREATE INDEX "case_chat_sessions_caseId_idx" ON "case_chat_sessions"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "case_chat_sessions_userId_caseId_key" ON "case_chat_sessions"("userId", "caseId");

-- CreateIndex
CREATE INDEX "case_chat_messages_sessionId_idx" ON "case_chat_messages"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "document_cache_document_id_key" ON "document_cache"("document_id");

-- AddForeignKey
ALTER TABLE "case_chat_sessions" ADD CONSTRAINT "case_chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_chat_sessions" ADD CONSTRAINT "case_chat_sessions_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_chat_messages" ADD CONSTRAINT "case_chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "case_chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain_pg_embedding" ADD CONSTRAINT "langchain_pg_embedding_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "langchain_pg_collection"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
