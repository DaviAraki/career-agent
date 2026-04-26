export type LanguageItem = {
  name: string;
  proficiency: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
  technologies: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  highlights?: string[];
};

export type SkillEntry = {
  name: string;
  proficiency?: string;
};

export type SkillGroup = {
  category: string;
  skills: SkillEntry[];
};

export type ResumeData = {
  name: string;
  headline: string;
  location?: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillGroup[];
  languages?: LanguageItem[];
};

export type ProjectData = {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  highlights: string[];
  links?: {
    live?: string;
    github?: string;
    article?: string;
  };
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ContactMessageInput = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  conversationSummary?: string;
};

export type ContactResult = {
  success: boolean;
  message: string;
};

export type ChatRequest = {
  message: string;
  conversationId?: string;
};

export type ChatResponse = {
  answer: string;
  conversationId: string;
};

export type ContactRequest = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  conversationId?: string;
};
