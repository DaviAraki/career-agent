import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../mastra/index.js', () => ({
  mastra: {
    getAgent: vi.fn().mockReturnValue({
      generate: vi.fn().mockResolvedValue({ text: 'Davi is a frontend engineer.' }),
    }),
  },
}));

import { chatRoute } from '../chat.route.js';
import { Hono } from 'hono';

describe('POST /api/chat', () => {
  const app = new Hono();
  app.route('/', chatRoute);

  it('should return answer for valid message', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Tell me about Davi' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('answer');
    expect(body).toHaveProperty('conversationId');
  });

  it('should reject empty message', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    });

    expect(res.status).toBe(400);
  });

  it('should reject missing body', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json{',
    });

    expect(res.status).toBe(400);
  });
});
