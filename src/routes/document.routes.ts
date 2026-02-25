import { Router } from 'express';

const documentRoutes = Router();

// POST /api/documents/upload - Upload a document
documentRoutes.post('/upload', (req, res) => {
  res.status(201).json({ message: 'Document uploaded', data: { id: 'doc_123' } });
});

// GET /api/documents - List all documents
documentRoutes.get('/', (_req, res) => {
  res.json({ message: 'List documents', data: [] });
});

// GET /api/documents/:id - Get document by ID
documentRoutes.get('/:id', (req, res) => {
  res.json({ message: `Get document ${req.params.id}`, data: null });
});

// DELETE /api/documents/:id - Delete a document
documentRoutes.delete('/:id', (req, res) => {
  res.json({ message: `Document ${req.params.id} deleted` });
});

export { documentRoutes };
