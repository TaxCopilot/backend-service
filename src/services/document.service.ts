import path from 'path';
import fs from 'fs';
import { prisma } from '../lib/prisma';
import { extractPdfToHtml } from '../utils/pdf';

// ─── Service ───
export const documentService = {
  /** Upload a document, extract PDF text if applicable */
  async upload(userId: string, file: Express.Multer.File, caseId?: string) {
    const storagePath = path.join(process.cwd(), 'uploads', file.filename);

    // Save document record
    const document = await prisma.document.create({
      data: {
        filename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storagePath,
        userId,
        caseId: caseId || null,
      },
    });

    // Extract PDF text (file is auto-deleted after extraction by utils/pdf.ts)
    let extractedHtml: string | null = null;
    if (file.mimetype === 'application/pdf') {
      extractedHtml = await extractPdfToHtml(storagePath);
    }

    return {
      id: document.id,
      filename: document.filename,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      extractedHtml,
    };
  },

  /** List user's documents */
  async list(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  /** Get a single document */
  async getById(userId: string, docId: string) {
    const doc = await prisma.document.findFirst({
      where: { id: docId, userId },
    });
    if (!doc) throw { status: 404, message: 'Document not found' };
    return doc;
  },

  /** Delete a document (and its file from disk) */
  async remove(userId: string, docId: string) {
    const doc = await prisma.document.findFirst({
      where: { id: docId, userId },
    });
    if (!doc) throw { status: 404, message: 'Document not found' };

    // Delete file from disk
    if (fs.existsSync(doc.storagePath)) {
      fs.unlinkSync(doc.storagePath);
    }

    await prisma.document.delete({ where: { id: doc.id } });
    return { message: 'Document deleted' };
  },
};
