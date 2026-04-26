import { Mastra } from '@mastra/core';
import { careerAgent } from './agents/career-agent.js';
import { contactWorkflow } from './workflows/contact-workflow.js';

export const mastra = new Mastra({
  agents: { careerAgent },
  workflows: { contactWorkflow },
});
