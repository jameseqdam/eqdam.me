import researchData from '@/data/research.json';
import experienceData from '@/data/experience.json';
import reportsData from '@/data/reports.json';
import skillsData from '@/data/skills.json';
import educationData from '@/data/education.json';

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

export interface Degree {
  /** Year awarded. Doubles as the sort key. */
  year: number;
  degree: string;
  institution: string;
  location: string;
  /** One line. The publication record carries the detail. */
  note: string;
}

export interface EducationContent {
  degrees: Degree[];
  certifications: string[];
  /**
   * Venue names to print on the homepage. A curated subset of the venues in
   * research.json, whose own strings carry volume and page numbers.
   */
  venueHighlights: string[];
}

export interface SkillCategory {
  name: string;
  /**
   * Skills from this category's own list that carry the discipline. They are
   * drawn larger in the mosaic, so the eye has somewhere to land in a cloud of
   * a hundred chips.
   */
  emphasis: string[];
  skills: string[];
}

/**
 * Older project write-up hosted outside the site. These predate the case-study
 * format, so they are listed rather than given pages of their own.
 */
export interface ExternalReport {
  title: string;
  description: string;
  url: string;
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
  /** Company logo under /images/companies. */
  logo: string;
  /** Coupa performance-review rating; absent on roles that predate it. */
  rating?: string;
  summary: string;
  achievements?: string[];
  productImpact?: string[];
}

/**
 * One company-length chapter of the career, condensed for the homepage rail.
 *
 * Deliberately not derived from `timeline`: the rail needs a single short line
 * per organisation, whereas the timeline carries a year-by-year record whose
 * roles and summaries are far too long to skim.
 */
export interface ExperienceChapter {
  /** Start year. Sort key and rail label. */
  startYear: number;
  /** Full span, e.g. "2010 – 2018". */
  period: string;
  company: string;
  /** Company logo under /images/companies. */
  logo: string;
  /** Most senior title held during the chapter. */
  role: string;
  /** One or two sentences. Anything longer belongs on /experience. */
  glimpse: string;
  tags: string[];
}

export interface ExperienceMilestone {
  milestone: string;
  detail: string;
  year: string;
}

export interface ExperienceContent {
  summary: string;
  chapters: ExperienceChapter[];
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

export const externalReports = reportsData as ExternalReport[];

export const skillCategories = skillsData as SkillCategory[];

export const education = educationData as EducationContent;

export const getWorkItem = (slug?: string): WorkItem | undefined =>
  workItems.find((item) => item.slug === slug);

export const getArticle = (slug?: string): Article | undefined =>
  articles.find((item) => item.slug === slug);
