import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { connectDatabase } from './config/database.js';
import { root } from './config/env.js';
import { apiRoutes } from './routes/api.js';
export function createApp(config) {
  const app = express();
  app.disable('x-powered-by');
  if (process.env.VERCEL) app.set('trust proxy', 1);
  app.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set('X-Request-ID', req.requestId);
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'https:', 'data:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: config.production ? [] : null,
        },
      },
    }),
  );
  app.use(express.json({ limit: '256kb' }));
  app.use(cookieParser());
  app.use('/api', async (req, res, next) => {
    try {
      await connectDatabase(config.mongoUri);
      next();
    } catch {
      res.status(503).json({ error: 'Database is unavailable. Please try again shortly.' });
    }
  });
  app.use('/api', apiRoutes(config));
  if (!process.env.VERCEL) {
    app.use(express.static(path.join(root, 'client/dist')));
    app.get('/{*path}', (req, res) => res.sendFile(path.join(root, 'client/dist/index.html')));
  }
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    console.error(JSON.stringify({ requestId: req.requestId, error: err.name, code: err.code }));
    const status =
      err.code === 'LIMIT_FILE_SIZE' || err.type === 'entity.too.large'
        ? 413
        : err instanceof SyntaxError
          ? 400
          : err.name === 'MulterError'
            ? 400
            : 500;
    res.status(status).json({
      error:
        status === 413
          ? err.code === 'LIMIT_FILE_SIZE'
            ? 'Image must be under 3 MB.'
            : 'Request is too large.'
          : status === 400
            ? 'Invalid request.'
            : 'Something went wrong. Please try again.',
      requestId: req.requestId,
    });
  });
  return app;
}
