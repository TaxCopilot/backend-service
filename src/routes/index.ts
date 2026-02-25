import { Router } from 'express';
import { caseRoutes } from './case.routes';
import { draftRoutes } from './draft.routes';
import { userRoutes } from './user.routes';
import { libraryRoutes } from './library.routes';
import { documentRoutes } from './document.routes';

const router = Router();

// Mount route modules
router.use('/cases', caseRoutes);
router.use('/drafts', draftRoutes);
router.use('/users', userRoutes);
router.use('/library', libraryRoutes);
router.use('/documents', documentRoutes);

export { router };
