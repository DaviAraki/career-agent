import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { mastra } from '../mastra/index.js';
import { chatRoute } from './routes/chat.route.js';
import { contactRoute } from './routes/contact.route.js';

const app = new Hono();

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(
  '/api/*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['POST', 'OPTIONS'],
    maxAge: 86400,
  }),
);

app.route('/api/chat', chatRoute);
app.route('/api/contact', contactRoute);

app.get('/api/health', (c) => c.json({ status: 'ok' }));

const port = Number(process.env.PORT ?? 4111);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Career Agent API running on http://localhost:${info.port}`);
});

export { app, mastra };
