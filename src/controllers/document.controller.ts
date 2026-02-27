import { Request, Response } from 'express';
import { documentService } from '../services/document.service';

export const documentController = {
  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const result = await documentService.upload(req.user!.userId, req.file, req.body.caseId);
      res.status(201).json({ data: result });
    } catch (err: any) {
      console.error('[documents] Upload error:', err);
      res.status(err.status || 500).json({ error: err.message || 'File upload failed' });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const docs = await documentService.list(req.user!.userId);
      res.json({ data: docs });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error fetching documents' });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const doc = await documentService.getById(req.user!.userId, req.params.id as string);
      res.json({ data: doc });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Document not found' });
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const result = await documentService.remove(req.user!.userId, req.params.id as string);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error deleting document' });
    }
  },
};
