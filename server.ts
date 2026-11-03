import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './server/config/db.js';
import { seedAtlasIfEmpty } from './server/models/store.js';

// Route imports
import authRoutes from './server/routes/authRoutes.js';
import propertyRoutes from './server/routes/propertyRoutes.js';
import tenantRoutes from './server/routes/tenantRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';
import maintenanceRoutes from './server/routes/maintenanceRoutes.js';
import agreementRoutes from './server/routes/agreementRoutes.js';
import aiRoutes from './server/routes/aiRoutes.js';
import dashboardRoutes from './server/routes/dashboardRoutes.js';
import uploadRoutes from './server/routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  // Dev server must strictly run on port 3000 in AI Studio environment
  const PORT = isProduction ? parseInt(process.env.PORT || '3000', 10) : 3000;

  // Ensure uploads directory exists
  const uploadsPath = path.resolve(__dirname, 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Middleware
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Static uploads serving
  app.use('/uploads', express.static(uploadsPath));

  // Initialize DB
  const isAtlas = await connectDB();
  if (isAtlas) {
    await seedAtlasIfEmpty();
  }

  // System status endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'RentEase – AI Rental Property Management',
      time: new Date().toISOString(),
      database: getDBStatus(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/properties', propertyRoutes);
  app.use('/api/tenants', tenantRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/maintenance', maintenanceRoutes);
  app.use('/api/agreements', agreementRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/upload', uploadRoutes);

  // Vite Integration
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ [RentEase] Vite middlewares connected in development mode.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('📦 [RentEase] Serving static production build from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [RentEase] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting RentEase server:', err);
  process.exit(1);
});
