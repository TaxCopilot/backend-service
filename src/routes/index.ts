import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { caseRoutes } from './case.routes';
import { draftRoutes } from './draft.routes';
import { userRoutes } from './user.routes';
import { libraryRoutes } from './library.routes';
import { documentRoutes } from './document.routes';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes (require JWT)
router.use('/cases', authMiddleware, caseRoutes);
router.use('/drafts', authMiddleware, draftRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/library', authMiddleware, libraryRoutes);
router.use('/documents', authMiddleware, documentRoutes);

export { router };
