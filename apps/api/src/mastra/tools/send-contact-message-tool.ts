import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { sendContactEmail } from '../lib/send-email.js';

export const sendContactMessageTool = createTool({
  id: 'send-contact-message',
  description:
    'Allow a recruiter or visitor to send a message to Davi. Use this when the user explicitly wants to send their contact info or a message.',
  inputSchema: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    company: z.string().max(100).optional(),
    role: z.string().max(100).optional(),
    message: z.string().min(10).max(2000),
    conversationSummary: z.string().max(2000).optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async (input) => {
    return sendContactEmail(input);
  },
});
