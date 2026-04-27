import { describe, it, expect } from 'vitest';
import { readSkillsTool } from '../read-skills-tool.js';

describe('readSkillsTool', () => {
  it('should return all skills by default', async () => {
    const result: any = await readSkillsTool.execute!({}, {} as any);
    expect(result.category).toBe('all');
    expect(result.skills.length).toBeGreaterThan(0);
  });

  it('should filter by frontend category', async () => {
    const result: any = await readSkillsTool.execute!(
      { category: 'frontend' as const },
      {} as any,
    );

    expect(result.category).toBe('frontend');
    for (const group of result.skills) {
      const g = group as { category: string };
      expect(g.category).toBe('frontend');
    }
  });

  it('should filter by ai category', async () => {
    const result: any = await readSkillsTool.execute!(
      { category: 'ai' as const },
      {} as any,
    );

    expect(result.category).toBe('ai');
    for (const group of result.skills) {
      const g = group as { category: string };
      expect(g.category).toBe('ai');
    }
  });

  it('should return data for engineering category', async () => {
    const result: any = await readSkillsTool.execute!(
      { category: 'engineering' as const },
      {} as any,
    );

    expect(result.category).toBe('engineering');
  });
});
