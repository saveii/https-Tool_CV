import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Shield process from unhandled worker errors
process.on('uncaughtException', (err) => {
  console.warn('⚠️ Server Shielded Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ Server Shielded Unhandled Rejection:', reason);
});

import authRoutes from './routes/auth.js';
import cvRoutes from './routes/cvs.js';
import exportRoutes from './routes/export.js';
import aiRoutes from './routes/ai.js';
import mediaRoutes from './routes/media.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Mobile App (Flutter/Android/iOS) and Web App (React)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with 50mb limit for embedded base64 photos/assets
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global optional auth token extraction
app.use(authenticateToken);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/export-pdf', exportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/media', mediaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Tool System API (Web & Mobile Backend)',
    version: '2.0.0',
    endpoints: [
      '/api/auth (Login, Register, Social OAuth)',
      '/api/cvs (CV CRUD)',
      '/api/export-pdf (Puppeteer PDF Engine)',
      '/api/ai (OCR, Smart Resume Parser, Image Scanner)',
      '/api/media (Video Download, Subtitles, Translation)'
    ],
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tool System Backend (Web & Mobile API) running on http://localhost:${PORT}`);
});
