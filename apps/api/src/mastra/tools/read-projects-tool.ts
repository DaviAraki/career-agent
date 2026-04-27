import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { projectsData } from '@career-agent/career-data';

export const readProjectsTool = createTool({
  id: 'read-projects',
  description: 'Return project information about Davi Araki, optionally filtered by technology or project ID.',
  inputSchema: z.object({
    technology: z.string().optional().describe('Filter projects by technology name.'),
    projectId: z.string().optional().describe('Return a specific project by ID.'),
    limit: z.number().min(1).max(10).optional().default(5).describe('Max number of projects to return. Default 5, max 10.'),
  }),
  outputSchema: z.object({
    projects: z.array(z.unknown()),
  }),
  execute: async ({ technology, projectId, limit }) => {
    let results = [...projectsData];

    if (projectId) {
      const project = results.find((p) => p.id === projectId);
      return { projects: project ? [project] : [] };
    }

    if (technology) {
      const techLower = technology.toLowerCase();
      results = results.filter((p) =>
        p.technologies.some((t) => t.toLowerCase().includes(techLower)),
      );
    }

    const finalLimit = limit ?? 5;
    return { projects: results.slice(0, finalLimit) };
  },
});
