import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const authRoutes = Router();

// Public routes
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/google', authController.googleAuth);
authRoutes.get('/google/callback', authController.googleCallback);

// Protected routes
authRoutes.get('/me', authMiddleware, authController.getMe);

export { authRoutes };
