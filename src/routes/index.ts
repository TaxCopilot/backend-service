import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { caseRoutes } from './case.routes';
import { draftRoutes } from './draft.routes';
import { userRoutes } from './user.routes';
import { documentRoutes } from './document.routes';
import { analysisFileRoutes } from './analysisFile.routes';
import { chatSessionRoutes } from './chatSession.routes';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);

router.use('/cases', authMiddleware, caseRoutes);
router.use('/drafts', authMiddleware, draftRoutes);
router.use('/users', authMiddleware, userRoutes);
router.use('/documents', authMiddleware, documentRoutes);
router.use('/analysis-files', authMiddleware, analysisFileRoutes);
router.use('/chat-sessions', authMiddleware, chatSessionRoutes);

export { router };
