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

export type ConversionDetails = {
  summary: string;
  mermaid: string;
  changes: { before: string; after: string }[];
  notes: string[];
};

export type ArchitectureFlow = {
  title: string;
  blurb?: string;
  mermaid: string;
  notes?: string[];
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  status: ProjectStatus;
  tagline: string;
  summary: string;
  language: string;
  tech: string[];
  techGroups: TechGroup[];
  liveUrl?: string;
  liveLabel?: string;
  sourceUrl?: string;
  thumbnail: string;
  gallery: GalleryItem[];
  featuredVideo?: { src: string; caption?: string };
  architecture: {
    mermaid: string;
    notes: string[];
    flows?: ArchitectureFlow[];
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
  conversion?: ConversionDetails;
};
