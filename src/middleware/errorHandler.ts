import { Request, Response, NextFunction } from 'express';

// 404 - Route not found
export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404,
  });
}

// Global error handler
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[backend-service] Error:', err.message);

  const statusCode = (err as any).statusCode || 500;

  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    statusCode,
  });
}
