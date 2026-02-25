import { Request, Response, NextFunction } from 'express';

// Placeholder: Auth middleware - validate JWT or session token
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid token' });
    return;
  }

  // TODO: Verify token with your auth provider
  // const token = authHeader.split(' ')[1];
  // const decoded = verifyToken(token);
  // req.user = decoded;

  next();
}
