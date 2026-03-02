import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { draftRoutes } from './draft.routes';
import { userRoutes } from './user.routes';
import { documentRoutes } from './document.routes';
import { analysisFileRoutes } from './analysisFile.routes';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);

router.use('/drafts', authMiddleware, draftRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/documents', authMiddleware, documentRoutes);
router.use('/analysis-files', authMiddleware, analysisFileRoutes);

export { router };
