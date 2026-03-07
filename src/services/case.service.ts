import { prisma } from '../lib/prisma';

// ─── Types ───
interface CreateCaseInput {
  title: string;
  clientName?: string;
  referenceNo?: string;
  description?: string;
  dueDate?: Date;
}

interface UpdateCaseInput {
  title?: string;
  clientName?: string;
  referenceNo?: string;
  description?: string;
  status?: string;
  dueDate?: Date;
}

// ─── Service ───
export const caseService = {
  async list(userId: string) {
    return prisma.case.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { documents: true, drafts: true } },
      },
    });
  },

  async listTrash(userId: string) {
    return prisma.case.findMany({
      where: { userId, deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      include: { _count: { select: { documents: true, drafts: true } } },
    });
  },

  async getById(userId: string, caseId: string) {
    const c = await prisma.case.findFirst({
      where: { id: caseId, userId, deletedAt: null },
      include: {
        documents: { orderBy: { createdAt: 'desc' } },
        drafts: { where: { deletedAt: null }, orderBy: { updatedAt: 'desc' } },
      },
    });
    if (!c) throw { status: 404, message: 'Case not found' };
    return c;
  },

  async create(userId: string, input: CreateCaseInput) {
    return prisma.case.create({
      data: {
        title: input.title,
        clientName: input.clientName || null,
        referenceNo: input.referenceNo || null,
        description: input.description || null,
        dueDate: input.dueDate || null,
        userId,
      },
    });
  },

  async update(userId: string, caseId: string, input: UpdateCaseInput) {
    const data: Record<string, unknown> = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.clientName !== undefined) data.clientName = input.clientName;
    if (input.referenceNo !== undefined) data.referenceNo = input.referenceNo;
    if (input.description !== undefined) data.description = input.description;
    if (input.status !== undefined) data.status = input.status;
    if (input.dueDate !== undefined) data.dueDate = input.dueDate;

    const result = await prisma.case.updateMany({
      where: { id: caseId, userId },
      data,
    });
    if (result.count === 0) throw { status: 404, message: 'Case not found' };
    return prisma.case.findUnique({ where: { id: caseId } });
  },

  async remove(userId: string, caseId: string) {
    const result = await prisma.case.updateMany({
      where: { id: caseId, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) throw { status: 404, message: 'Case not found' };
    return { message: 'Case moved to trash' };
  },

  async restore(userId: string, caseId: string) {
    const result = await prisma.case.updateMany({
      where: { id: caseId, userId, deletedAt: { not: null } },
      data: { deletedAt: null },
    });
    if (result.count === 0) throw { status: 404, message: 'Case not found in trash' };
    return { message: 'Case restored' };
  },

  async permanentDelete(userId: string, caseId: string) {
    const result = await prisma.case.deleteMany({ where: { id: caseId, userId } });
    if (result.count === 0) throw { status: 404, message: 'Case not found' };
    return { message: 'Case permanently deleted' };
  },
};
