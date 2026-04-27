import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { skillsData } from '@career-agent/career-data';

export const readSkillsTool = createTool({
  id: 'read-skills',
  description: "Return Davi Araki's grouped technical and professional skills.",
  inputSchema: z.object({
    category: z
      .enum(['frontend', 'backend', 'engineering', 'ai', 'leadership', 'all'])
      .optional()
      .describe('Which skill category to return. Defaults to "all".'),
  }),
  outputSchema: z.object({
    category: z.string(),
    skills: z.array(z.unknown()),
  }),
  execute: async ({ category }) => {
    const targetCategory = category ?? 'all';

    if (targetCategory === 'all') {
      return { category: 'all', skills: skillsData };
    }

    const filtered = skillsData.filter((g) => g.category === targetCategory);
    return { category: targetCategory, skills: filtered };
  },
});
