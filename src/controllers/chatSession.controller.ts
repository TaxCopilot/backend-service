import { Request, Response, NextFunction } from 'express';
import { chatSessionService } from '../services/chatSession.service';
import { MessageRole } from '@prisma/client';

export const chatSessionController = {
  /**
   * GET /api/chat-sessions/:documentId
   * Returns the chat session (with messages) for the authenticated user + document.
   */
  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { documentId } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const session = await chatSessionService.getOrCreateSession(userId, documentId as string);

      return res.json({
        success: true,
        data: {
          id: session.id,
          documentId: session.documentId,
          messages: session.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            isAnalysis: m.isAnalysis,
            createdAt: m.createdAt,
          })),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/chat-sessions/:documentId/messages
   * Saves a single message to the chat session.
   */
  async addMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      const { documentId } = req.params;
      const { role, content, isAnalysis } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!role || !content) {
        return res.status(400).json({ error: 'role and content are required' });
      }

      const validRoles: MessageRole[] = ['user', 'assistant', 'system'];
      if (!validRoles.includes(role as MessageRole)) {
        return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
      }

      const message = await chatSessionService.addMessage(userId, documentId as string, {
        role: role as MessageRole,
        content,
        isAnalysis: isAnalysis ?? false,
      });

      return res.status(201).json({
        success: true,
        data: {
          id: message.id,
          role: message.role,
          content: message.content,
          isAnalysis: message.isAnalysis,
          createdAt: message.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
