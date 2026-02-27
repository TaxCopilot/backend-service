import { Router } from 'express';
import { draftController } from '../controllers/draft.controller';

const draftRoutes = Router();

// ─── Templates ───
draftRoutes.get('/templates', draftController.getTemplates);
draftRoutes.get('/templates/:id', draftController.getTemplate);

// ─── Drafts (CRUD) ───
draftRoutes.get('/', draftController.listDrafts);
draftRoutes.post('/', draftController.createDraft);
draftRoutes.get('/trash', draftController.listTrash);
draftRoutes.get('/:id', draftController.getDraft);
draftRoutes.put('/:id', draftController.updateDraft);

// ─── Soft Delete / Trash ───
draftRoutes.patch('/:id/trash', draftController.trashDraft);
draftRoutes.patch('/:id/restore', draftController.restoreDraft);
draftRoutes.delete('/:id/permanent', draftController.permanentDeleteDraft);

// Legacy fallback (soft delete by default)
draftRoutes.delete('/:id', draftController.trashDraft);

export { draftRoutes };
