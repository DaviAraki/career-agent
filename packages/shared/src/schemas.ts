import { z } from 'zod';

export const resumeSectionSchema = z.enum(['summary', 'experience', 'education', 'skills', 'all']);

export const projectQuerySchema = z.object({
  technology: z.string().optional(),
  projectId: z.string().optional(),
  limit: z.number().min(1).max(10).optional().default(5),
});

export const skillsCategorySchema = z.enum(['frontend', 'backend', 'engineering', 'ai', 'leadership', 'all']);

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  conversationSummary: z.string().max(2000).optional(),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
});

export const chatResponseSchema = z.object({
  answer: z.string(),
  conversationId: z.string(),
});

export const contactRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  conversationId: z.string().optional(),
});

export const contactResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const conversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export const contactWorkflowInputSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  message: z.string().min(10).max(2000),
  conversation: z
    .object({
      messages: z.array(conversationMessageSchema),
    })
    .optional(),
});
