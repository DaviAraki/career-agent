import { describe, it, expect } from 'vitest';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { readSkillsTool } from '../read-skills-tool.js';

const rt = new RuntimeContext();

describe('readSkillsTool', () => {
  it('should return all skills by default', async () => {
    const result = await readSkillsTool.execute({ context: {}, runtimeContext: rt });
    expect(result.category).toBe('all');
    expect(result.skills.length).toBeGreaterThan(0);
  });

  it('should filter by frontend category', async () => {
    const result = await readSkillsTool.execute({
      context: { category: 'frontend' as const },
      runtimeContext: rt,
    });

    expect(result.category).toBe('frontend');
    for (const group of result.skills) {
      const g = group as { category: string };
      expect(g.category).toBe('frontend');
    }
  });

  it('should filter by ai category', async () => {
    const result = await readSkillsTool.execute({
      context: { category: 'ai' as const },
      runtimeContext: rt,
    });

    expect(result.category).toBe('ai');
    for (const group of result.skills) {
      const g = group as { category: string };
      expect(g.category).toBe('ai');
    }
  });

  it('should return data for research category', async () => {
    const result = await readSkillsTool.execute({
      context: { category: 'research' as const },
      runtimeContext: rt,
    });

    expect(result.category).toBe('research');
  });
});
