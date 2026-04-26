import { describe, it, expect } from 'vitest';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { readResumeTool } from '../read-resume-tool.js';

const rt = new RuntimeContext();

describe('readResumeTool', () => {
  it('should return all resume data by default', async () => {
    const result = await readResumeTool.execute({ context: {}, runtimeContext: rt });

    expect(result.section).toBe('all');
    const data = result.data as Record<string, unknown>;
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('headline');
    expect(data).toHaveProperty('summary');
    expect(data).toHaveProperty('experience');
    expect(data).toHaveProperty('education');
    expect(data).toHaveProperty('skills');
  });

  it('should return only the summary section', async () => {
    const result = await readResumeTool.execute({
      context: { section: 'summary' as const },
      runtimeContext: rt,
    });

    expect(result.section).toBe('summary');
    const data = result.data as Record<string, unknown>;
    expect(data).toHaveProperty('summary');
    expect(data).not.toHaveProperty('experience');
  });

  it('should return only the experience section', async () => {
    const result = await readResumeTool.execute({
      context: { section: 'experience' as const },
      runtimeContext: rt,
    });

    expect(result.section).toBe('experience');
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('should return only the education section', async () => {
    const result = await readResumeTool.execute({
      context: { section: 'education' as const },
      runtimeContext: rt,
    });

    expect(result.section).toBe('education');
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('should return only the skills section', async () => {
    const result = await readResumeTool.execute({
      context: { section: 'skills' as const },
      runtimeContext: rt,
    });

    expect(result.section).toBe('skills');
    expect(Array.isArray(result.data)).toBe(true);
  });
});
