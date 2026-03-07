import { Router } from 'express';
import { caseController } from '../controllers/case.controller';
import { caseChatController } from '../controllers/caseChat.controller';

const router = Router();

router.get('/', caseController.list);
router.post('/', caseController.create);
router.get('/trash', caseController.listTrash);
router.patch('/:id/restore', caseController.restore);
router.delete('/:id/permanent', caseController.permanentDelete);
router.get('/:id/chat', caseChatController.getSession);
router.post('/:id/chat/messages', caseChatController.addMessage);
router.get('/:id', caseController.getById);
router.put('/:id', caseController.update);
router.delete('/:id', caseController.remove);

export { router as caseRoutes };
