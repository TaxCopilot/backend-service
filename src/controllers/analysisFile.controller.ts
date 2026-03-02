import { Request, Response } from 'express';
import { analysisFileService } from '../services/analysisFile.service';

export const analysisFileController = {
  async upload(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const result = await analysisFileService.upload(req.user!.userId, req.file);
      res.status(201).json({ data: result });
    } catch (err: any) {
      console.error('[analysisFile] Upload error:', err);
      res.status(err.status || 500).json({ error: err.message || 'Upload failed' });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const docs = await analysisFileService.listByUser(req.user!.userId);
      res.json({ data: docs });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to fetch documents' });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const doc = await analysisFileService.getById(req.user!.userId, req.params.id);
      res.json({ data: doc });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Document not found' });
    }
  },

  async getDownloadUrl(req: Request, res: Response): Promise<void> {
    try {
      const result = await analysisFileService.getDownloadUrl(req.user!.userId, req.params.id);
      res.json({ data: result });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to generate download URL' });
    }
  },

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const result = await analysisFileService.remove(req.user!.userId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Failed to delete document' });
    }
  },
};
