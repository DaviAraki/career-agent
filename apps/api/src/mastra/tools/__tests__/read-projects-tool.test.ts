import { describe, it, expect } from 'vitest';
import { readProjectsTool } from '../read-projects-tool.js';

describe('readProjectsTool', () => {
  it('should return projects with default limit', async () => {
    const result: any = await readProjectsTool.execute!({ limit: 5 }, {} as any);
    expect(result.projects.length).toBeLessThanOrEqual(5);
  });

  it('should filter projects by technology', async () => {
    const result: any = await readProjectsTool.execute!(
      { technology: 'TypeScript', limit: 5 },
      {} as any,
    );

    for (const project of result.projects) {
      const p = project as { technologies: string[] };
      expect(p.technologies.some((t) => t.toLowerCase().includes('typescript'))).toBe(true);
    }
  });

  it('should return a specific project by ID', async () => {
    const result: any = await readProjectsTool.execute!(
      { projectId: 'career-agent-mastra', limit: 5 },
      {} as any,
    );

    expect(result.projects.length).toBe(1);
    const project = result.projects[0] as { id: string };
    expect(project.id).toBe('career-agent-mastra');
  });

  it('should return empty array for non-existent project ID', async () => {
    const result: any = await readProjectsTool.execute!(
      { projectId: 'non-existent', limit: 5 },
      {} as any,
    );

    expect(result.projects.length).toBe(0);
  });

  it('should respect custom limit', async () => {
    const result: any = await readProjectsTool.execute!({ limit: 1 }, {} as any);

    expect(result.projects.length).toBeLessThanOrEqual(1);
  });

  it('should perform case-insensitive technology filter', async () => {
    const result: any = await readProjectsTool.execute!(
      { technology: 'typescript', limit: 5 },
      {} as any,
    );

    expect(result.projects.length).toBeGreaterThanOrEqual(1);
  });
});
