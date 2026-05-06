import type { Project } from "./types";

// =============================================================================
// Judgement Cut
// Edit the fields below to update what shows on the home card and the
// /projects/<slug> detail page. Architecture / database mermaid diagrams
// live in the same object below for editor-friendly co-location.
// =============================================================================

export const judgementCut: Project = {
  slug: 'judgement-cut',
  title: 'Judgement Cut',
  role: 'Cloud Native Backend',
  status: 'in-dev',
  tagline:
    'A daily-refreshing dashboard of game deals across Steam, GOG, Humble, and Epic — with native Steam Philippine peso pricing so the numbers match what you actually pay.',
  summary:
    'Designed for $0/month forever. CheapShark feeds deals, Steam regional API gives native PHP prices, Zyte Scrapy Cloud runs the daily crawl, AWS Lambda + TiDB Cloud + Cloudflare R2 handle the rest.',
  language: 'Python',
  tech: ['Python', 'Scrapy', 'FastAPI', 'AWS Lambda', 'TiDB Cloud', 'Cloudflare R2', 'React', 'Vite', 'Tailwind'],
  techGroups: [
    {
      label: 'Spider',
      items: ['Python 3', 'Scrapy', 'Zyte Scrapy Cloud', 'requests'],
    },
    {
      label: 'Backend',
      items: ['Python 3.11', 'FastAPI', 'Mangum (ASGI for Lambda)', 'aiomysql', 'pymysql', 'AWS Lambda Function URL', 'JWT', 'bcrypt'],
    },
    {
      label: 'Data Sources',
      items: ['CheapShark API', 'Steam Storefront API (cc=PH, storesearch)', 'open.er-api.com (FX rates)'],
    },
    {
      label: 'Storage',
      items: ['TiDB Cloud Serverless (5 GB free)', 'Cloudflare R2', '@aws-sdk/client-s3'],
    },
    {
      label: 'Frontend',
      items: ['React 18', 'TypeScript', 'Vite 5', 'Tailwind 3', 'react-router-dom 6', 'fetch'],
    },
    {
      label: 'CI/CD · Hosting',
      items: ['GitHub Actions cron (daily 02:00 PHT)', 'Zyte Scrapy Cloud', 'AWS ap-southeast-1', 'Cloudflare R2', 'Vercel (frontend)'],
    },
  ],
  liveUrl: 'https://judgement-cut.vercel.app/',
  sourceUrl: 'https://github.com/Asciente-rks/judgement-cut',
  thumbnail: 'JudgementCut/Login_JC.png',
  gallery: [
    { src: 'JudgementCut/Login_JC.png', caption: 'Login' },
    { src: 'JudgementCut/Dashboard_JC.png', caption: 'Dashboard · daily-refreshed deals' },
    { src: 'JudgementCut/Search_JC.png', caption: 'Live CheapShark search' },
    { src: 'JudgementCut/AdminControl_JC.png', caption: 'Admin · platform toggles + heartbeat' },
  ],
  repos: [
    {
      name: 'judgement-cut',
      url: 'https://github.com/Asciente-rks/judgement-cut',
      stack: 'Monorepo · Python Scrapy spider + FastAPI/Lambda + React/Vite frontend',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Cron["GitHub Actions cron<br/>02:00 PHT daily"]
    Zyte["Zyte Scrapy Cloud<br/>1 spider · 4 storefronts<br/>Steam · GOG · Humble · Epic"]
    Lambda["AWS Lambda<br/>FastAPI + Mangum<br/>ap-southeast-1 · 256 MB"]
    SteamAPI["Steam Regional API<br/>cc=PH · 5-way semaphore"]
    R2["Cloudflare R2<br/>thumbnail mirror"]
    TiDB[("TiDB Cloud Serverless<br/>5 GB free")]
    Frontend["React + Vite SPA<br/>Tailwind"]

    Cron -->|run.json| Zyte
    Zyte -->|POST /internal/ingest in batches of 25| Lambda
    Lambda -->|enrich PHP price| SteamAPI
    Lambda --> TiDB
    Lambda --> R2
    Frontend -->|JWT GET| Lambda
    Frontend -.thumbnails.-> R2

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Cron,Zyte,Lambda,SteamAPI,Frontend edge
    class R2,TiDB store`,
    notes: [
      'No API Gateway — the Lambda exposes a Function URL directly. Saves ~$3.50/M after the API Gateway free tier expires.',
      '5-way parallel Steam enrichment with a semaphore — keeps regional API calls within Steam\'s rate limits while finishing a 480-item crawl in seconds, not minutes.',
      '3-phase finalize at the end of every crawl: re-enrich any deals still missing price_php, mark deals not seen this run as is_active = 0, then delete the inactive rows so the table = latest crawl.',
      'Title-search fallback — for the few percent of CheapShark deals missing steamAppID, we search Steam\'s storesearch API and persist the recovered ID so subsequent runs skip the lookup.',
    ],
  },
  database: {
    blurb:
      'Five tables on TiDB. featured_deals is wiped down to the latest crawl on every spider run via the finalize step.',
    mermaid: `erDiagram
    FEATURED_DEAL ||--o{ PRICE_HISTORY : tracked
    PLATFORM ||--o{ FEATURED_DEAL : filters

    USER {
        int id PK
        string username UK
        string passwordHash
        bool isAdmin
    }
    FEATURED_DEAL {
        string deal_id PK
        string title
        string store_id
        float price
        float normal_price
        float price_php
        string steam_app_id
        bool is_active
        datetime synced_at
    }
    PRICE_HISTORY {
        int id PK
        string deal_id FK
        float price
        datetime recorded_at
    }
    PLATFORM {
        int id PK
        string name UK
        bool is_enabled
    }
    CRAWLER_SETTINGS {
        string key PK
        string value
    }`,
    tables: [
      {
        name: 'featured_deals',
        columns: [
          { name: 'deal_id', type: 'VARCHAR(100) UNIQUE', notes: 'CheapShark dealID, primary lookup key' },
          { name: 'title', type: 'VARCHAR(300)' },
          { name: 'store_id', type: 'VARCHAR(50)', notes: '1=Steam, 7=GOG, 11=Humble, 25=Epic' },
          { name: 'price / normal_price', type: 'FLOAT', notes: 'USD prices from CheapShark' },
          { name: 'price_php / normal_price_php', type: 'DOUBLE', notes: 'native Steam PH prices when available' },
          { name: 'steam_app_id', type: 'VARCHAR(50)', notes: 'recovered via title-search if CheapShark didn\'t provide' },
          { name: 'is_active', type: 'TINYINT(1)', notes: 'flipped to 0 by finalize for stale rows, then deleted' },
        ],
      },
      {
        name: 'price_history',
        description: 'Every observed price for every deal. Survives featured_deals deletions.',
        columns: [
          { name: 'deal_id', type: 'VARCHAR(100)', notes: 'foreign reference (no FK constraint)' },
          { name: 'price', type: 'FLOAT', notes: 'USD price at time of observation' },
          { name: 'recorded_at', type: 'DATETIME', notes: 'observation time' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda', freeTier: '1M invocations/mo', weUse: '~900', headroom: '99.9%' },
      { service: 'TiDB Cloud Serverless', freeTier: '5 GB storage', weUse: '<100 MB', headroom: '98%' },
      { service: 'Cloudflare R2', freeTier: '10 GB / 10M ops/mo', weUse: '<1 GB', headroom: '90%+' },
      { service: 'GitHub Actions (cron)', freeTier: '2000 min/mo / unlimited (public)', weUse: '~1 min', headroom: '99.9%' },
      { service: 'Zyte Scrapy Cloud', freeTier: '1 free spider, daily run', weUse: '1 spider', headroom: 'within limits' },
    ],
    rationale: [
      'Zyte Scrapy Cloud over self-hosted scrapers — rotating IPs included, no Cloudflare bot-protection battles, free tier covers a daily crawl.',
      'TiDB Cloud over RDS / Aurora — RDS free tier expires after 12 months; TiDB Cloud\'s free tier is perpetual.',
      'R2 over S3 — S3 charges per-GB egress; R2 is zero egress, which matters when serving thumbnail URLs to a frontend.',
      'GitHub Actions cron over Zyte Periodic Jobs — Periodic Jobs is paid; Actions cron is free and just hits Zyte\'s run.json API.',
      'Lambda Function URL over API Gateway — Function URLs are free; API Gateway has its own pricing tier after the 12-month new-account window.',
    ],
  },
};
