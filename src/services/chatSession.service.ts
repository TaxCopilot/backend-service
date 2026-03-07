import { PrismaClient, MessageRole } from '@prisma/client';

const prisma = new PrismaClient();

export interface MessageInput {
  role: MessageRole;
  content: string;
  isAnalysis?: boolean;
}

export const chatSessionService = {
  /**
   * Get or create a chat session for a (userId, documentId) pair.
   * Returns the session with its messages ordered by createdAt asc.
   */
  async getOrCreateSession(userId: string, documentId: string) {
    const session = await prisma.chatSession.upsert({
      where: {
        userId_documentId: { userId, documentId },
      },
      create: {
        userId,
        documentId,
      },
      update: {},
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return session;
  },

  /**
   * Add a message to an existing session (creates session if needed).
   */
  async addMessage(userId: string, documentId: string, input: MessageInput) {
    // Upsert session first
    const session = await prisma.chatSession.upsert({
      where: {
        userId_documentId: { userId, documentId },
      },
      create: { userId, documentId },
      update: {},
    });

    return prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: input.role,
        content: input.content,
        isAnalysis: input.isAnalysis ?? false,
      },
    });
  },
};
