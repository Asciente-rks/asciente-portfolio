/* ============================================================
   PROJECT TYPES — you normally never need to touch this file.
   It defines the "shape" every project file must follow, so the
   site can catch typos in project files at build time.
   ============================================================ */

export type ProjectStatus = "live" | "in-dev" | "archived";

/** One row of the free-tier cost table. */
export type CostRow = {
  service: string;
  freeTier: string;
  weUse: string;
  headroom: string;
};

/** A group of technologies shown in the "Stack used" section. */
export type TechGroup = {
  label: string;
  items: string[];
};

/** One gallery entry — an image or an .mp4 video inside src/assets/. */
export type GalleryItem = {
  src: string;
  caption?: string;
  type?: "image" | "video";
};

export type Project = {
  /** URL name of the project page, e.g. "judgement-cut". Lowercase, dashes only. */
  slug: string;
  title: string;
  status: ProjectStatus;
  /** One-sentence description shown on the project card. */
  tagline: string;
  /** Longer paragraph shown in the "Overview" section of the project page. */
  summary: string;
  /** Short chips shown on the project card (first 5 are displayed). */
  tech: string[];
  /** Grouped stack shown on the project page. */
  techGroups: TechGroup[];
  /** Optional: link to the live app. Leave out if there is none. */
  liveUrl?: string;
  /** Optional: custom text for the live button, e.g. "Download APK". */
  liveLabel?: string;
  /** Optional: link to the GitHub repository. */
  sourceUrl?: string;
  /** Path (inside src/assets/) of the card thumbnail image. */
  thumbnail: string;
  gallery: GalleryItem[];
  /** Optional: a highlighted .mp4 demo video (path inside src/assets/). */
  featuredVideo?: { src: string; caption?: string };
  /** Optional: link to the cinematic walkthrough page, e.g. "/cinematics/judgement-cut". */
  cinematicUrl?: string;
  cinematicCaption?: string;
  /** The $0/month cost table. */
  cost: {
    monthlyTotal: string;
    rows: CostRow[];
  };
};
