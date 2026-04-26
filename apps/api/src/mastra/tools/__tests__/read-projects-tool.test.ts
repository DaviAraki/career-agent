import { describe, it, expect } from 'vitest';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { readProjectsTool } from '../read-projects-tool.js';

const rt = new RuntimeContext();

describe('readProjectsTool', () => {
  it('should return projects with default limit', async () => {
    const result = await readProjectsTool.execute({
      context: { limit: 5 },
      runtimeContext: rt,
    });
    expect(result.projects.length).toBeLessThanOrEqual(5);
  });

  it('should filter projects by technology', async () => {
    const result = await readProjectsTool.execute({
      context: { technology: 'TypeScript', limit: 5 },
      runtimeContext: rt,
    });

    for (const project of result.projects) {
      const p = project as { technologies: string[] };
      expect(p.technologies.some((t) => t.toLowerCase().includes('typescript'))).toBe(true);
    }
  });

  it('should return a specific project by ID', async () => {
    const result = await readProjectsTool.execute({
      context: { projectId: 'career-agent-mastra', limit: 5 },
      runtimeContext: rt,
    });

    expect(result.projects.length).toBe(1);
    const project = result.projects[0] as { id: string };
    expect(project.id).toBe('career-agent-mastra');
  });

  it('should return empty array for non-existent project ID', async () => {
    const result = await readProjectsTool.execute({
      context: { projectId: 'non-existent', limit: 5 },
      runtimeContext: rt,
    });

    expect(result.projects.length).toBe(0);
  });

  it('should respect custom limit', async () => {
    const result = await readProjectsTool.execute({
      context: { limit: 1 },
      runtimeContext: rt,
    });

    expect(result.projects.length).toBeLessThanOrEqual(1);
  });

  it('should perform case-insensitive technology filter', async () => {
    const result = await readProjectsTool.execute({
      context: { technology: 'typescript', limit: 5 },
      runtimeContext: rt,
    });

    expect(result.projects.length).toBeGreaterThanOrEqual(1);
  });
});
