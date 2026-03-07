import { Request, Response } from 'express';
import { caseService } from '../services/case.service';

export const caseController = {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const list = await caseService.list(req.user!.userId);
      res.json({ data: list });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to fetch cases' });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const c = await caseService.getById(req.user!.userId, req.params.id);
      res.json({ data: c });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Case not found' });
    }
  },

  async create(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body || {};
      const c = await caseService.create(req.user!.userId, {
        title: body.title,
        clientName: body.clientName,
        referenceNo: body.referenceNo,
        description: body.description,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      });
      res.status(201).json({ data: c });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to create case' });
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body || {};
      const c = await caseService.update(req.user!.userId, req.params.id, {
        title: body.title,
        clientName: body.clientName,
        referenceNo: body.referenceNo,
        description: body.description,
        status: body.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      });
      res.json({ data: c });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to update case' });
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const result = await caseService.remove(req.user!.userId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to delete case' });
    }
  },

  async listTrash(req: Request, res: Response): Promise<void> {
    try {
      const list = await caseService.listTrash(req.user!.userId);
      res.json({ data: list });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to fetch trash' });
    }
  },

  async restore(req: Request, res: Response): Promise<void> {
    try {
      const result = await caseService.restore(req.user!.userId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to restore case' });
    }
  },

  async permanentDelete(req: Request, res: Response): Promise<void> {
    try {
      const result = await caseService.permanentDelete(req.user!.userId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to delete case' });
    }
  },
};
