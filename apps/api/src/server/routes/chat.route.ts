import { Hono } from 'hono';
import { z } from 'zod';
import { mastra } from '../../mastra/index.js';

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
});

export const chatRoute = new Hono().post('/', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: 'Validation failed', details: parsed.error.issues.map((i) => i.message) },
      400,
    );
  }

  const { message } = parsed.data;

  try {
    const agent = mastra.getAgent('careerAgent');
    const threadId = parsed.data.conversationId ?? crypto.randomUUID();
    
    const result = await agent.generate(message, {
      memory: {
        thread: threadId,
        resource: 'career-agent',
      },
    });

    return c.json({
      answer: result.text,
      conversationId: threadId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Failed to generate response', details: error instanceof Error ? error.message : String(error) }, 500);
  }
});
