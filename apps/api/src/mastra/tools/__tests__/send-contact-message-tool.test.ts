import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  })),
}));

import { sendContactMessageTool } from '../send-contact-message-tool.js';

describe('sendContactMessageTool', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.EMAIL_FROM = 'test@example.com';
    process.env.CONTACT_EMAIL = 'davi@example.com';
  });

  it('should reject invalid email', () => {
    const input = {
      name: 'Test User',
      email: 'not-an-email',
      message: 'This is a test message that is long enough.',
    };

    const parsed = (sendContactMessageTool.inputSchema as any).safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it('should reject message under 10 characters', () => {
    const input = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'short',
    };

    const parsed = (sendContactMessageTool.inputSchema as any).safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it('should reject name under 2 characters', () => {
    const input = {
      name: 'A',
      email: 'test@example.com',
      message: 'This is a valid message.',
    };

    const parsed = (sendContactMessageTool.inputSchema as any).safeParse(input);
    expect(parsed.success).toBe(false);
  });

  it('should never allow custom recipient email in schema', () => {
    const input = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a valid message.',
      recipient: 'attacker@evil.com',
    };

    const parsed = (sendContactMessageTool.inputSchema as any).safeParse(input);
    expect(parsed.success).toBe(true);
    expect(parsed.data).not.toHaveProperty('recipient');
  });

  it('should accept valid contact input', () => {
    const input = {
      name: 'Test Recruiter',
      email: 'recruiter@company.com',
      company: 'Tech Corp',
      role: 'Engineering Manager',
      message: 'I would like to discuss a potential role at our company.',
    };

    const parsed = (sendContactMessageTool.inputSchema as any).safeParse(input);
    expect(parsed.success).toBe(true);
  });

  it('should return safe error when email service is not configured', async () => {
    delete process.env.RESEND_API_KEY;

    const result: any = await sendContactMessageTool.execute!(
      {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message that is long enough.',
      },
      {} as any,
    );

    expect(result.success).toBe(false);
    expect(result.message).not.toContain('undefined');
    expect(result.message).not.toContain('RESEND');
  });
});
