import { Router } from 'express';

const userRoutes = Router();

// GET /api/users/me - Get current user profile
userRoutes.get('/me', (_req, res) => {
  res.json({ message: 'Get current user profile', data: null });
});

// PUT /api/users/me - Update current user profile
userRoutes.put('/me', (req, res) => {
  res.json({ message: 'Profile updated', data: req.body });
});

// GET /api/users/:id - Get user by ID
userRoutes.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}`, data: null });
});

export { userRoutes };
