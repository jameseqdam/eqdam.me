import researchData from '@/data/research.json';
import experienceData from '@/data/experience.json';

export interface WorkItem {
  title: string;
  slug: string;
  category: string;
  role: string;
  timeline: string;
  overview: string;
  problemStatement: string;
  solution: string;
  methodology: string[];
  challenge: string;
  roiMetrics: { value: string; label: string }[];
}

export interface Article {
  title: string;
  slug: string;
  publishDate: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  bodyMarkdown: string;
  originalUrl: string;
}

export interface ResearchItem {
  title: string;
  year: number;
  venue: string;
  authors: string;
  doi: string;
  abstract: string;
  tags: string[];
  type: string;
}

export interface ExperienceEntry {
  /** Start year. Doubles as the sort key, so it stays unique per entry. */
  year: number;
  /** Shown instead of `year` for roles spanning a range, e.g. "2011 – 2018". */
  period?: string;
  role: string;
  company: string;
  /** Coupa performance-review rating; absent on roles that predate it. */
  rating?: string;
  summary: string;
  achievements?: string[];
  productImpact?: string[];
}

export interface ExperienceMilestone {
  milestone: string;
  detail: string;
  year: string;
}

export interface ExperienceContent {
  summary: string;
  keyMilestones: ExperienceMilestone[];
  timeline: ExperienceEntry[];
}

// Vite inlines every matching JSON file at build time, so adding a case study or
// article to src/data is enough to make it appear across the site.
const workModules = import.meta.glob<{ default: WorkItem }>('../data/work/*.json', { eager: true });
const articleModules = import.meta.glob<{ default: Article }>('../data/articles/*.json', { eager: true });

/** Reads the last year out of a timeline string such as "2020 - 2022". */
const latestYear = (timeline: string): number => {
  const years = timeline.match(/\d{4}/g);
  return years ? Math.max(...years.map(Number)) : 0;
};

export const workItems: WorkItem[] = Object.values(workModules)
  .map((mod) => mod.default)
  .sort((a, b) => latestYear(b.timeline) - latestYear(a.timeline) || a.title.localeCompare(b.title));

export const articles: Article[] = Object.values(articleModules)
  .map((mod) => mod.default)
  .sort((a, b) => Number(b.publishDate) - Number(a.publishDate) || a.title.localeCompare(b.title));

export const researchItems: ResearchItem[] = (researchData as ResearchItem[])
  .slice()
  .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

export const experience = experienceData as ExperienceContent;

export const getWorkItem = (slug?: string): WorkItem | undefined =>
  workItems.find((item) => item.slug === slug);

export const getArticle = (slug?: string): Article | undefined =>
  articles.find((item) => item.slug === slug);
