import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getProfile(req.user!.userId);
      res.json({ data: user });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error fetching user profile' });
    }
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      res.json({ data: user });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error updating user profile' });
    }
  },

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const user = await userService.uploadAvatar(req.user!.userId, req.file);
      res.json({ data: user });
    } catch (err: any) {
      res.status(err.status || 500).json({ error: err.message || 'Error uploading avatar' });
    }
  },
};
