import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../mastra/index.js', () => ({
  mastra: {
    getWorkflow: vi.fn().mockReturnValue({
      createRun: vi.fn().mockReturnValue({
        start: vi
          .fn()
          .mockResolvedValue({ status: 'success', result: { success: true, message: 'Message sent.' } }),
      }),
    }),
  },
}));

import { contactRoute } from '../contact.route.js';
import { Hono } from 'hono';

describe('POST /api/contact', () => {
  const app = new Hono();
  app.route('/', contactRoute);

  const validPayload = {
    name: 'Recruiter',
    email: 'recruiter@company.com',
    message: 'I would like to discuss a role.',
  };

  it('should return success for valid contact', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('should reject invalid email', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validPayload, email: 'not-email' }),
    });

    expect(res.status).toBe(400);
  });

  it('should reject short message', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validPayload, message: 'hi' }),
    });

    expect(res.status).toBe(400);
  });

  it('should reject long message', async () => {
    const res = await app.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validPayload, message: 'x'.repeat(2001) }),
    });

    expect(res.status).toBe(400);
  });
});
