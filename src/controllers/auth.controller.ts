import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, password } = req.body;
      const result = await authService.register(email, name, password);
      result.user = await userService.processUser(result.user);
      res.status(201).json({ message: 'Registration successful', ...result });
    } catch (err: any) {
      console.error('[auth] Register error:', err);
      res.status(err.status || 500).json({ error: err.message || 'Registration failed' });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      result.user = await userService.processUser(result.user);
      res.json({ message: 'Login successful', ...result });
    } catch (err: any) {
      console.error('[auth] Login error:', err);
      res.status(err.status || 500).json({ error: err.message || 'Login failed' });
    }
  },

  googleAuth(_req: Request, res: Response): void {
    const authUrl = authService.getGoogleAuthUrl();
    res.redirect(authUrl);
  },

  async googleCallback(req: Request, res: Response): Promise<void> {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        res.status(400).json({ error: 'Missing authorization code' });
        return;
      }
      const token = await authService.handleGoogleCallback(code);
      res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (err: any) {
      console.error('[auth] Google callback error:', err);
      res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
    }
  },

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      // Logic from middleware attaches req.user
      let user = await authService.getMe(req.user!.userId);
      user = await userService.processUser(user);
      res.json({ user });
    } catch (err: any) {
      console.error('[auth] Me error:', err);
      res.status(err.status || 500).json({ error: err.message || 'Failed to fetch user' });
    }
  },
};
