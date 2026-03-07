import { prisma } from '../lib/prisma';
import { MessageRole } from '@prisma/client';

export interface CaseChatMessageInput {
  role: MessageRole;
  content: string;
  isAnalysis?: boolean;
}

export const caseChatService = {
  async getOrCreateSession(userId: string, caseId: string) {
    const session = await prisma.caseChatSession.upsert({
      where: { userId_caseId: { userId, caseId } },
      create: { userId, caseId },
      update: {},
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    return session;
  },

  async addMessage(userId: string, caseId: string, input: CaseChatMessageInput) {
    const session = await prisma.caseChatSession.upsert({
      where: { userId_caseId: { userId, caseId } },
      create: { userId, caseId },
      update: {},
    });
    return prisma.caseChatMessage.create({
      data: {
        sessionId: session.id,
        role: input.role,
        content: input.content,
        isAnalysis: input.isAnalysis ?? false,
      },
    });
  },
};
