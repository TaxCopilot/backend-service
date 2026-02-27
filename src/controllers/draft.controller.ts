import { Request, Response } from 'express';
import { draftService } from '../services/draft.service';

export const draftController = {
  getTemplates(_req: Request, res: Response): void {
    const templates = draftService.getTemplates();
    res.json({ data: templates });
  },

  getTemplate(req: Request, res: Response): void {
    try {
      const template = draftService.getTemplate(req.params.id as string);
      res.json({ data: template });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error fetching template' });
    }
  },

  async listDrafts(req: Request, res: Response): Promise<void> {
    try {
      const drafts = await draftService.listDrafts(req.user!.userId);
      res.json({ data: drafts });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error fetching drafts' });
    }
  },

  async listTrash(req: Request, res: Response): Promise<void> {
    try {
      const drafts = await draftService.listTrash(req.user!.userId);
      res.json({ data: drafts });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error fetching trash' });
    }
  },

  async getDraft(req: Request, res: Response): Promise<void> {
    try {
      const draft = await draftService.getDraft(req.user!.userId, req.params.id as string);
      res.json({ data: draft });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Draft not found' });
    }
  },

  async createDraft(req: Request, res: Response): Promise<void> {
    try {
      const draft = await draftService.createDraft(req.user!.userId, req.body);
      res.status(201).json({ data: draft });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error creating draft' });
    }
  },

  async updateDraft(req: Request, res: Response): Promise<void> {
    try {
      const draft = await draftService.updateDraft(req.user!.userId, req.params.id as string, req.body);
      res.json({ data: draft });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error updating draft' });
    }
  },

  async trashDraft(req: Request, res: Response): Promise<void> {
    try {
      const result = await draftService.trashDraft(req.user!.userId, req.params.id as string);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error trashing draft' });
    }
  },

  async restoreDraft(req: Request, res: Response): Promise<void> {
    try {
      const result = await draftService.restoreDraft(req.user!.userId, req.params.id as string);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error restoring draft' });
    }
  },

  async permanentDeleteDraft(req: Request, res: Response): Promise<void> {
    try {
      const result = await draftService.permanentDeleteDraft(req.user!.userId, req.params.id as string);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error deleting draft' });
    }
  },
};
