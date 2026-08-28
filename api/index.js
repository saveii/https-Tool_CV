import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/src/routes/auth.js';
import cvRoutes from '../server/src/routes/cvs.js';
import exportRoutes from '../server/src/routes/export.js';
import aiRoutes from '../server/src/routes/ai.js';
import mediaRoutes from '../server/src/routes/media.js';
import { authenticateToken } from '../server/src/middleware/auth.js';

dotenv.config();

const app = express();

// Shield process from unhandled worker errors
process.on('uncaughtException', (err) => {
  console.warn('⚠️ Server Shielded Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ Server Shielded Unhandled Rejection:', reason);
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(authenticateToken);

app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/export-pdf', exportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/media', mediaRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Tool System API (Vercel Serverless & Node Backend)',
    version: '2.0.0',
    time: new Date().toISOString()
  });
});

export default app;
