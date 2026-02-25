import { Router } from 'express';

const draftRoutes = Router();

// GET /api/drafts - List all drafts
draftRoutes.get('/', (_req, res) => {
  res.json({ message: 'List all drafts', data: [] });
});

// GET /api/drafts/:id - Get draft by ID
draftRoutes.get('/:id', (req, res) => {
  res.json({ message: `Get draft ${req.params.id}`, data: null });
});

// POST /api/drafts - Create a new draft
draftRoutes.post('/', (req, res) => {
  res.status(201).json({ message: 'Draft created', data: req.body });
});

// PUT /api/drafts/:id - Update a draft
draftRoutes.put('/:id', (req, res) => {
  res.json({ message: `Draft ${req.params.id} updated`, data: req.body });
});

// DELETE /api/drafts/:id - Delete a draft
draftRoutes.delete('/:id', (req, res) => {
  res.json({ message: `Draft ${req.params.id} deleted` });
});

export { draftRoutes };
