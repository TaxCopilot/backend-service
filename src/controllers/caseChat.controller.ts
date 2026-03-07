import { Request, Response } from 'express';
import { caseChatService } from '../services/caseChat.service';
import { MessageRole } from '@prisma/client';

export const caseChatController = {
  async getSession(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const caseId = req.params.id;
      const session = await caseChatService.getOrCreateSession(userId, caseId);
      res.json({
        data: {
          id: session.id,
          caseId: session.caseId,
          messages: session.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            isAnalysis: m.isAnalysis,
            createdAt: m.createdAt,
          })),
        },
      });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to fetch chat' });
    }
  },

  async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const caseId = req.params.id;
      const { role, content, isAnalysis } = req.body;
      if (!role || !content) {
        res.status(400).json({ error: 'role and content are required' });
        return;
      }
      const valid: MessageRole[] = ['user', 'assistant', 'system'];
      if (!valid.includes(role)) {
        res.status(400).json({ error: `role must be one of: ${valid.join(', ')}` });
        return;
      }
      const message = await caseChatService.addMessage(userId, caseId, {
        role,
        content,
        isAnalysis: !!isAnalysis,
      });
      res.status(201).json({
        data: {
          id: message.id,
          role: message.role,
          content: message.content,
          isAnalysis: message.isAnalysis,
          createdAt: message.createdAt,
        },
      });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to save message' });
    }
  },
};
