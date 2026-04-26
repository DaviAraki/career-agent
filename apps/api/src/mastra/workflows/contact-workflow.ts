import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { sendContactEmail } from '../lib/send-email.js';

const contactInputSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  conversation: z
    .object({
      messages: z.array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        }),
      ),
    })
    .optional(),
});

const validatedDataSchema = z.object({
  name: z.string(),
  email: z.string(),
  company: z.string().optional(),
  role: z.string().optional(),
  message: z.string(),
  conversationSummary: z.string().optional(),
});

const resultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const validateContactInput = createStep({
  id: 'validate-contact-input',
  inputSchema: contactInputSchema,
  outputSchema: validatedDataSchema,
  execute: async ({ inputData }) => {
    const parsed = contactInputSchema.safeParse(inputData);
    if (!parsed.success) {
      throw new Error(
        `Validation failed: ${parsed.error.issues.map((i) => i.message).join(', ')}`,
      );
    }
    return {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      role: parsed.data.role,
      message: parsed.data.message,
    };
  },
});

const summarizeConversationForEmail = createStep({
  id: 'summarize-conversation-for-email',
  inputSchema: validatedDataSchema,
  outputSchema: validatedDataSchema,
  execute: async ({ inputData }) => {
    return inputData;
  },
});

const sendContactEmailStep = createStep({
  id: 'send-contact-email',
  inputSchema: validatedDataSchema,
  outputSchema: resultSchema,
  execute: async ({ inputData }) => {
    return sendContactEmail({
      name: inputData.name,
      email: inputData.email,
      company: inputData.company,
      role: inputData.role,
      message: inputData.message,
      conversationSummary: inputData.conversationSummary,
    });
  },
});

const returnContactResult = createStep({
  id: 'return-contact-result',
  inputSchema: resultSchema,
  outputSchema: resultSchema,
  execute: async ({ inputData }) => {
    return inputData;
  },
});

export const contactWorkflow = createWorkflow({
  id: 'contact-workflow',
  inputSchema: contactInputSchema,
  outputSchema: resultSchema,
})
  .then(validateContactInput)
  .then(summarizeConversationForEmail)
  .then(sendContactEmailStep)
  .then(returnContactResult)
  .commit();
