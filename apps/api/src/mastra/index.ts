import { Mastra } from '@mastra/core';
import { InMemoryStore } from '@mastra/core/storage';
import { careerAgent } from './agents/career-agent.js';
import { contactWorkflow } from './workflows/contact-workflow.js';

export const mastra = new Mastra({
  storage: new InMemoryStore(),
  agents: { careerAgent },
  workflows: { contactWorkflow },
});
