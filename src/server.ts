import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { router as apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// ─── CORS Configuration ───
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  })
);

// ─── Middleware ───
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'backend-service',
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── Static Files (avatars, uploads) ───
app.use('/uploads', express.static('uploads'));

// ─── API Routes ───
app.use('/api', apiRouter);

// ─── Error Handling ───
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`\n  🚀 backend-service running on http://localhost:${PORT}`);
  console.log(`  📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🔗 CORS origins: ${allowedOrigins.join(', ')}\n`);
});

export default app;
