import { Mastra } from '@mastra/core';
import { InMemoryStore } from '@mastra/core/storage';
import { PostgresStore } from '@mastra/pg';
import { careerAgent } from './agents/career-agent.js';
import { contactWorkflow } from './workflows/contact-workflow.js';

const storage = process.env.DATABASE_URL
  ? new PostgresStore({
      connectionString: process.env.DATABASE_URL,
    })
  : new InMemoryStore();

export const mastra = new Mastra({
  storage,
  agents: { careerAgent },
  workflows: { contactWorkflow },
});
