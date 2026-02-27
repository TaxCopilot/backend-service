import { prisma } from '../lib/prisma';
import { TEMPLATES } from '../config/templates';

// ─── Types ───
interface CreateDraftInput {
  title?: string;
  category?: string;
  templateId?: string;
  content?: string;
  caseId?: string;
}

interface UpdateDraftInput {
  title?: string;
  content?: string;
  status?: string;
  category?: string;
}

const DRAFT_INCLUDE = {
  case: { select: { title: true, clientName: true } },
} as const;

// ─── Service ───
export const draftService = {
  /** List all available templates (metadata only) */
  getTemplates() {
    return Object.entries(TEMPLATES).map(([id, t]) => ({
      id,
      title: t.title,
      category: t.category,
    }));
  },

  /** Get full template with HTML by ID */
  getTemplate(id: string) {
    const t = TEMPLATES[id];
    if (!t) throw { status: 404, message: 'Template not found' };
    return { id, ...t };
  },

  /** List user's active (non-trashed) drafts */
  async listDrafts(userId: string) {
    return prisma.draft.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: DRAFT_INCLUDE,
    });
  },

  /** List user's trashed drafts */
  async listTrash(userId: string) {
    return prisma.draft.findMany({
      where: { userId, deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      include: DRAFT_INCLUDE,
    });
  },

  /** Get a single draft by ID (must belong to user, must not be trashed) */
  async getDraft(userId: string, draftId: string) {
    const draft = await prisma.draft.findFirst({
      where: { id: draftId, userId, deletedAt: null },
      include: DRAFT_INCLUDE,
    });
    if (!draft) throw { status: 404, message: 'Draft not found' };
    return draft;
  },

  /** Create a new draft, optionally from a template */
  async createDraft(userId: string, input: CreateDraftInput) {
    let htmlContent = input.content || '';

    // Apply template if provided
    if (input.templateId && TEMPLATES[input.templateId]) {
      const templateHtml = TEMPLATES[input.templateId].html;
      htmlContent = htmlContent ? `${templateHtml}\n<hr>\n${htmlContent}` : templateHtml;
    }

    const category = input.category
      || (input.templateId ? TEMPLATES[input.templateId]?.category : 'GENERAL')
      || 'GENERAL';

    return prisma.draft.create({
      data: {
        title: input.title || 'Untitled Draft',
        category,
        content: htmlContent,
        userId,
        caseId: input.caseId || null,
      },
    });
  },

  /** Update a draft's title, content, status, or category */
  async updateDraft(userId: string, draftId: string, input: UpdateDraftInput) {
    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.content !== undefined) data.content = input.content;
    if (input.status) data.status = input.status;
    if (input.category) data.category = input.category;

    const result = await prisma.draft.updateMany({
      where: { id: draftId, userId, deletedAt: null },
      data,
    });

    if (result.count === 0) throw { status: 404, message: 'Draft not found' };
    return prisma.draft.findUnique({ where: { id: draftId } });
  },

  /** Soft delete — move to trash */
  async trashDraft(userId: string, draftId: string) {
    const result = await prisma.draft.updateMany({
      where: { id: draftId, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) throw { status: 404, message: 'Draft not found' };
    return { message: 'Moved to trash' };
  },

  /** Restore from trash */
  async restoreDraft(userId: string, draftId: string) {
    const result = await prisma.draft.updateMany({
      where: { id: draftId, userId, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
    if (result.count === 0) throw { status: 404, message: 'Draft not found in trash' };
    return { message: 'Draft restored' };
  },

  /** Permanent delete */
  async permanentDeleteDraft(userId: string, draftId: string) {
    const result = await prisma.draft.deleteMany({
      where: { id: draftId, userId },
    });
    if (result.count === 0) throw { status: 404, message: 'Draft not found' };
    return { message: 'Draft permanently deleted' };
  },
};
