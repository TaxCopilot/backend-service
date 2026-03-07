import { Router } from 'express';
import { chatSessionController } from '../controllers/chatSession.controller';

const router = Router();

/**
 * GET  /api/chat-sessions/:documentId         — get or create session + messages
 * POST /api/chat-sessions/:documentId/messages — add a message
 */
router.get('/:documentId', chatSessionController.getSession);
router.post('/:documentId/messages', chatSessionController.addMessage);

export { router as chatSessionRoutes };
