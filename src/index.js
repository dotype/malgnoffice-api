import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';
import openApiSpec from './openapi.js';

// Import routes
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

const app = new Hono();

// Paths that don't require authentication
const PUBLIC_PATHS = ['/health', '/docs', '/openapi.json', '/auth'];

// Global middleware
app.use('*', logger());
app.use('*', cors());

// Authentication middleware (except for public paths)
app.use('*', async (c, next) => {
  const path = c.req.path;

  // Skip auth for public paths
  if (PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))) {
    return await next();
  }

  // Apply auth middleware for all other routes
  return await authMiddleware(c, next);
});

// Routes
app.route('/auth', authRoutes);
app.route('/users', usersRoutes);

// API Documentation
app.get('/docs', swaggerUI({ url: '/openapi.json' }));
app.get('/openapi.json', (c) => c.json(openApiSpec));

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Cloudflare Workers Template with Hono',
    environment: c.env.ENVIRONMENT || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.onError(errorHandler);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

export default app;
