import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { router as apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend-service', timestamp: new Date().toISOString() });
});

// --- API Routes ---
app.use('/api', apiRouter);

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`[backend-service] Running on port ${PORT}`);
});

export default app;
