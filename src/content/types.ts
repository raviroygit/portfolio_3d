/** free-form badge label, e.g. "AI Platform", "Voice AI", "Enterprise / HR" */
export type ProjectCategory = string;

export type ProjectGroup = "AI Platforms" | "SaaS Products" | "Enterprise Systems";

export type ProjectTier = "flagship" | "product";

export type Metric = { label: string; value: string };

export type ProjectLinks = {
  live?: string;
  repo?: string;
  demo?: string;
  playStore?: string;
  appStore?: string;
};

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  group: ProjectGroup;
  url?: string;
  tier: ProjectTier;
  /** one-line outcome, used on cards */
  tagline: string;
  /** the role you played */
  role: string;
  timeframe: string;
  /** short problem statement (1 para) */
  problem: string;
  /** key decisions / how you approached it */
  approach: string[];
  /** systems-level details that prove depth */
  architecture: string[];
  /** grouped stack chips */
  stack: string[];
  /** real numbers — optional until supplied */
  metrics?: Metric[];
  links: ProjectLinks;
  /** featured order on landing (lower = earlier); omit to hide from landing */
  featured?: number;
  accent?: "signal" | "cyan";
};

export type Capability = {
  title: string;
  description: string;
  items: string[];
};

export type SkillGroup = {
  group: string;
  skills: string[];
};

export type Experience = {
  role: string;
  company: string;
  url?: string;
  date: string;
  points: string[];
};
