import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

// ── Site Config ───────────────────────────────────────────────────────────────

export type BilingualString = { en: string; tr: string };

export type SiteConfig = {
  owner: {
    name: { full: string; display: string };
    title: BilingualString;
    position: BilingualString;
  };
  institution: {
    name: BilingualString;
    department: BilingualString;
    faculty: BilingualString;
    address: BilingualString;
    office: BilingualString;
  };
  photo: {
    profile: string;
    alt: BilingualString;
  };
  bio: {
    short: BilingualString;
    full: { en: string[]; tr: string[] };
  };
  research_interests: { en: string[]; tr: string[] };
  education: {
    degree: BilingualString;
    institution: BilingualString;
    year: string;
    thesis: BilingualString;
  }[];
  links: {
    email: string;
    google_scholar: string;
    orcid: string;
    researchgate: string;
    linkedin: string;
    twitter: string;
    cv: string;
    cv_tr: string;
  };
  languages: {
    name: BilingualString;
    level: BilingualString;
  }[];
  contact: {
    note: BilingualString;
  };
};

let _siteConfig: SiteConfig | null = null;

function stripNoteKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNoteKeys);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([k]) => !k.startsWith('__'))
        .map(([k, v]) => [k, stripNoteKeys(v)])
    );
  }
  return value;
}

export function getSiteConfig(): SiteConfig {
  if (_siteConfig) return _siteConfig;
  const raw = fs.readFileSync(path.join(contentDir, 'site-config.json'), 'utf-8');
  _siteConfig = stripNoteKeys(JSON.parse(raw)) as SiteConfig;
  return _siteConfig;
}

function readJsonDir<T>(folder: string): T[] {
  const dir = path.join(contentDir, folder);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T);
}

// ── Publications ─────────────────────────────────────────────────────────────

export type Publication = {
  id: string;
  type: 'journal' | 'conference' | 'book' | 'book-chapter' | 'thesis' | 'preprint';
  title: { en: string; tr: string };
  authors: string[];
  year: number;
  journal?: string;
  conference?: string;
  publisher?: string;
  book_title?: string;
  editors?: string[];
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pdf?: string;
  abstract?: { en: string; tr: string };
  tags?: string[];
  featured?: boolean;
};

export function getPublications(): Publication[] {
  return readJsonDir<Publication>('publications').sort((a, b) => b.year - a.year);
}

// ── Scales ───────────────────────────────────────────────────────────────────

export type Subscale = {
  name: string;
  item_count?: number;
  description?: { en: string; tr: string };
};

export type Scale = {
  id: string;
  name: { en: string; tr: string };
  abbreviation?: string;
  role?: 'developed' | 'translated' | 'adapted';
  construct?: { en: string; tr: string };
  year?: number;
  original_authors?: string[];
  adaptation_year?: number | null;
  description: { en: string; tr: string };
  item_count: number;
  subscales?: Subscale[];
  response_format: string;
  target_population: string;
  languages_available: string[];
  reliability?: {
    cronbach_alpha_total?: number;
    cronbach_alpha_subscales?: Record<string, number>;
    test_retest?: string;
  };
  validity_notes?: { en: string; tr: string };
  downloads?: {
    scale_form?: string;
    scoring_guide?: string;
    manual?: string;
  };
  citation: { en: string; tr: string };
  reference_publication?: string;
  featured?: boolean;
};

export function getScales(): Scale[] {
  return readJsonDir<Scale>('scales');
}

// ── Projects ─────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  title: { en: string; tr: string };
  status: 'active' | 'completed' | 'planned' | 'submitted';
  description: { en: string; tr: string };
  role: string;
  funding?: { agency?: string; grant_number?: string; amount?: string };
  collaborators?: { name: string; affiliation: string }[];
  start_date: string;
  end_date?: string;
  outputs?: string[];
  image?: string;
  featured?: boolean;
  url?: string;
  osf_url?: string;
};

export function getProjects(): Project[] {
  return readJsonDir<Project>('projects');
}

// ── Collaborations ────────────────────────────────────────────────────────────

export type Collaboration = {
  id: string;
  organization: { en: string; tr: string };
  type: 'industry' | 'ngo' | 'public' | 'university' | 'healthcare' | 'other';
  active: boolean;
  period_start: string;
  period_end?: string;
  description: { en: string; tr: string };
  outputs?: { en: string; tr: string }[];
  website?: string;
  logo?: string;
};

export function getCollaborations(): Collaboration[] {
  return readJsonDir<Collaboration>('collaborations');
}

// ── Teaching ──────────────────────────────────────────────────────────────────

export type Course = {
  id: string;
  code: string;
  name: { en: string; tr: string };
  level: 'undergraduate' | 'graduate';
  term: string;
  term_label: { en: string; tr: string };
  credits: number;
  current: boolean;
  description: { en: string; tr: string };
  syllabus_url?: string;
};

export type Supervision = {
  name: string;
  type: 'phd' | 'masters' | 'undergrad';
  topic: { en: string; tr: string };
  year_start: string;
  status: 'current' | 'completed';
  year_end?: string;
  thesis_url?: string;
};

export type TeachingData = {
  courses: Course[];
  supervision: Supervision[];
  office_hours?: { en: string; tr: string };
};

export function getTeachingData(): TeachingData {
  try {
    const filePath = path.join(contentDir, 'teaching', 'index.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as TeachingData;
  } catch {
    return { courses: [], supervision: [] };
  }
}

// ── News ─────────────────────────────────────────────────────────────────────

export type NewsItem = {
  slug: string;
  title: string;
  title_tr: string;
  date: string;
  category: 'award' | 'publication' | 'conference' | 'grant' | 'media' | 'teaching' | 'other';
  summary: string;
  summary_tr: string;
  link?: string;
  featured?: boolean;
  content: string;
};

export function getNewsItems(): NewsItem[] {
  const dir = path.join(contentDir, 'news');
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8');
      const { data, content } = matter(raw);
      return { slug: f.replace(/\.md$/, ''), ...data, content } as NewsItem;
    })
    .filter((item) => !!item.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
