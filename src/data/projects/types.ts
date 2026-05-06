export type ProjectStatus = 'live' | 'in-dev' | 'archived';

export type CostRow = {
  service: string;
  freeTier: string;
  weUse: string;
  headroom: string;
};

export type DbColumn = {
  name: string;
  type: string;
  notes?: string;
};

export type DbTable = {
  name: string;
  description?: string;
  columns: DbColumn[];
};

export type TechGroup = {
  label: string;
  items: string[];
};

export type GalleryItem = {
  src: string;
  caption?: string;
  type?: 'image' | 'video';
};

export type RepoEntry = {
  name: string;
  url: string;
  stack: string;
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  status: ProjectStatus;
  tagline: string;
  summary: string;
  language: string;
  tech: string[]; // flat list, used on cards
  techGroups: TechGroup[]; // categorized full stack, used on detail page
  liveUrl?: string;
  liveLabel?: string; // override default "Live Demo" button label
  sourceUrl?: string;
  thumbnail: string;
  gallery: GalleryItem[];
  featuredVideo?: { src: string; caption?: string }; // rendered at top of detail page
  architecture: {
    mermaid: string;
    notes: string[];
  };
  database?: {
    blurb: string;
    mermaid: string;
    tables: DbTable[];
  };
  cost: {
    monthlyTotal: string;
    rows: CostRow[];
    rationale: string[];
  };
  apiEndpoints?: { method: string; path: string; auth?: string; purpose: string }[];
  repos?: RepoEntry[];
};
