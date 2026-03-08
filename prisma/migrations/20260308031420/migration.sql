/*
  Warnings:

  - The primary key for the `document_cache` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `analysis_summary` on the `document_cache` table. All the data in the column will be lost.
  - You are about to drop the column `deadlines` on the `document_cache` table. All the data in the column will be lost.
  - You are about to drop the column `demands` on the `document_cache` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `document_cache` table. All the data in the column will be lost.
  - You are about to drop the column `immediate_actions` on the `document_cache` table. All the data in the column will be lost.
  - You are about to drop the column `sections_applied` on the `document_cache` table. All the data in the column will be lost.
  - The primary key for the `langchain_pg_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `langchain_pg_embedding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `custom_id` on the `langchain_pg_embedding` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `langchain_pg_embedding` table. All the data in the column will be lost.
  - The `collection_id` column on the `langchain_pg_embedding` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `embedding` on the `langchain_pg_embedding` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Unsupported("vector")`.
  - A unique constraint covering the columns `[name]` on the table `langchain_pg_collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `langchain_pg_embedding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `draft_reply` to the `document_cache` table without a default value. This is not possible if the table is not empty.
  - Made the column `citations` on table `document_cache` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `uuid` on the `langchain_pg_collection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `id` to the `langchain_pg_embedding` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension 
CREATE EXTENSION IF NOT EXISTS vector;

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_userId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_caseId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "drafts" DROP CONSTRAINT "drafts_caseId_fkey";

-- DropForeignKey
ALTER TABLE "drafts" DROP CONSTRAINT "drafts_userId_fkey";

-- DropForeignKey
ALTER TABLE "langchain_pg_embedding" DROP CONSTRAINT "langchain_pg_embedding_collection_id_fkey";

-- DropIndex
DROP INDEX "document_cache_document_id_key";

-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "dueDate" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "document_cache" DROP CONSTRAINT "document_cache_pkey",
DROP COLUMN "analysis_summary",
DROP COLUMN "deadlines",
DROP COLUMN "demands",
DROP COLUMN "id",
DROP COLUMN "immediate_actions",
DROP COLUMN "sections_applied",
ADD COLUMN     "analysis_result" JSONB,
ADD COLUMN     "draft_reply" TEXT NOT NULL,
ADD COLUMN     "is_grounded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "s3_key" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "citations" SET NOT NULL,
ALTER COLUMN "citations" SET DEFAULT '[]',
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ADD CONSTRAINT "document_cache_pkey" PRIMARY KEY ("document_id");

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "drafts" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "deletedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "langchain_pg_collection" DROP CONSTRAINT "langchain_pg_collection_pkey",
ALTER COLUMN "name" SET DATA TYPE VARCHAR,
ALTER COLUMN "cmetadata" SET DATA TYPE JSON,
DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL,
ADD CONSTRAINT "langchain_pg_collection_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "langchain_pg_embedding" DROP CONSTRAINT "langchain_pg_embedding_pkey",
DROP COLUMN "custom_id",
DROP COLUMN "uuid",
ADD COLUMN     "id" VARCHAR NOT NULL,
DROP COLUMN "collection_id",
ADD COLUMN     "collection_id" UUID,
ALTER COLUMN "embedding" SET DATA TYPE vector USING (embedding::vector),
ALTER COLUMN "document" SET DATA TYPE VARCHAR,
ADD CONSTRAINT "langchain_pg_embedding_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "law_entries" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(6);

-- CreateIndex
CREATE UNIQUE INDEX "langchain_pg_collection_name_key" ON "langchain_pg_collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ix_langchain_pg_embedding_id" ON "langchain_pg_embedding"("id");

-- CreateIndex
CREATE INDEX "ix_cmetadata_gin" ON "langchain_pg_embedding" USING GIN ("cmetadata" jsonb_path_ops);

-- CreateIndex
CREATE INDEX "idx_law_entries_category" ON "law_entries"("category");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "langchain_pg_embedding" ADD CONSTRAINT "langchain_pg_embedding_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "langchain_pg_collection"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
ALTER INDEX "cases_userId_idx" RENAME TO "idx_cases_userid";

-- RenameIndex
ALTER INDEX "documents_caseId_idx" RENAME TO "idx_documents_caseid";

-- RenameIndex
ALTER INDEX "documents_userId_idx" RENAME TO "idx_documents_userid";

-- RenameIndex
ALTER INDEX "drafts_caseId_idx" RENAME TO "idx_drafts_caseid";

-- RenameIndex
ALTER INDEX "drafts_userId_idx" RENAME TO "idx_drafts_userid";
