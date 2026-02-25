import { Router } from 'express';

const caseRoutes = Router();

// GET /api/cases - List all cases
caseRoutes.get('/', (_req, res) => {
  res.json({ message: 'List all cases', data: [] });
});

// GET /api/cases/:id - Get case by ID
caseRoutes.get('/:id', (req, res) => {
  res.json({ message: `Get case ${req.params.id}`, data: null });
});

// POST /api/cases - Create a new case
caseRoutes.post('/', (req, res) => {
  res.status(201).json({ message: 'Case created', data: req.body });
});

// PUT /api/cases/:id - Update a case
caseRoutes.put('/:id', (req, res) => {
  res.json({ message: `Case ${req.params.id} updated`, data: req.body });
});

// DELETE /api/cases/:id - Delete a case
caseRoutes.delete('/:id', (req, res) => {
  res.json({ message: `Case ${req.params.id} deleted` });
});

export { caseRoutes };
