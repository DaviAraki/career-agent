import type { ResumeData, ProjectData, SkillGroup, FaqItem } from './types.js';
import resumeJson from './resume.json' with { type: 'json' };
import projectsJson from './projects.json' with { type: 'json' };
import skillsJson from './skills.json' with { type: 'json' };
import careerFaqJson from './career-faq.json' with { type: 'json' };

export const resumeData: ResumeData = resumeJson as ResumeData;
export const projectsData: ProjectData[] = projectsJson as ProjectData[];
export const skillsData: SkillGroup[] = skillsJson as SkillGroup[];
export const careerFaqData: FaqItem[] = careerFaqJson as FaqItem[];
