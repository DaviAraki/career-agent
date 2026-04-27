import { Hono } from 'hono';
import { z } from 'zod';
import { mastra } from '../../mastra/index.js';

const contactRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  conversationId: z.string().optional(),
});

export const contactRoute = new Hono().post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: 'Validation failed', details: parsed.error.issues.map((i) => i.message) },
      400,
    );
  }

  try {
    const workflow = mastra.getWorkflow('contactWorkflow');
    const run = await workflow.createRun();
    const result = await run.start({ inputData: parsed.data });

    if (result.status === 'success') {
      return c.json(result.result);
    }

    return c.json({ success: false, message: 'Failed to process contact request.' }, 500);
  } catch (err) {
    console.error('Workflow error:', err);
    return c.json({ success: false, message: 'An unexpected error occurred.' }, 500);
  }
});
