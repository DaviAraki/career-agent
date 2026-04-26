import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { resumeData } from '@career-agent/career-data';

export const readResumeTool = createTool({
  id: 'read-resume',
  description: 'Return structured resume information about Davi Araki.',
  inputSchema: z.object({
    section: z
      .enum(['summary', 'experience', 'education', 'skills', 'all'])
      .optional()
      .describe('Which resume section to return. Defaults to "all".'),
  }),
  outputSchema: z.object({
    section: z.string(),
    data: z.unknown(),
  }),
  execute: async ({ context }) => {
    const section = context.section ?? 'all';

    switch (section) {
      case 'summary':
        return { section, data: { name: resumeData.name, headline: resumeData.headline, summary: resumeData.summary, location: resumeData.location } };
      case 'experience':
        return { section, data: resumeData.experience };
      case 'education':
        return { section, data: resumeData.education };
      case 'skills':
        return { section, data: resumeData.skills };
      case 'all':
      default:
        return { section: 'all', data: resumeData };
    }
  },
});
