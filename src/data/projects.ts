// Project metadata used by the homepage cards and the dynamic project detail pages.
// Architecture and database design are rendered as Mermaid diagrams in the detail page.

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
  sourceUrl?: string;
  thumbnail: string;
  gallery: { src: string; caption?: string }[];
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
  repos?: { name: string; url: string; stack: string }[];
};

// =============================================================================
// SYSTEM PULSE
// =============================================================================
const systemPulse: Project = {
  slug: 'system-pulse',
  title: 'System Pulse',
  role: 'Cloud Native Backend',
  status: 'live',
  tagline:
    'A self-hosted uptime and health-check platform. Probes monitored URLs from AWS Lambda, fans out via SQS, and tracks 30 days of rolling history in DynamoDB.',
  summary:
    'Invite-based onboarding, per-user system access lists, three-tier role model, and a built-in Render wake-up mode for monitoring sleeping free-tier services. Two Lambdas sharing one codebase, single-table DynamoDB, three GSIs.',
  language: 'TypeScript',
  tech: [
    'TypeScript', 'Node.js 20', 'AWS Lambda', 'DynamoDB', 'SQS', 'SNS', 'React 18', 'Vite 5', 'Tailwind CSS 4', 'Vercel',
  ],
  techGroups: [
    {
      label: 'Backend',
      items: ['TypeScript', 'Node.js 20 (ESM)', 'Custom HTTP router (~150 LOC)', '@aws-sdk/lib-dynamodb v3', 'JWT (jsonwebtoken)', 'scrypt', 'Yup', 'nodemailer', 'SMTP'],
    },
    {
      label: 'Cloud · AWS',
      items: ['AWS Lambda (api + worker)', 'Lambda Function URL', 'DynamoDB (single-table + 3 GSIs + TTL)', 'SQS + Dead-Letter Queue', 'SNS', 'CloudWatch Logs', 'IAM (inline scoped policy)', 'KMS (optional)'],
    },
    {
      label: 'Frontend',
      items: ['React 18', 'TypeScript 5', 'Vite 5', 'Tailwind CSS 4', 'react-router-dom 6', 'fetch'],
    },
    {
      label: 'Hosting · CI/CD',
      items: ['Vercel (frontend)', 'AWS ap-southeast-1', 'GitHub Actions (idempotent deploy workflow)'],
    },
  ],
  liveUrl: 'https://system-pulse-brown.vercel.app',
  sourceUrl: 'https://github.com/Asciente-rks/system-pulse',
  thumbnail: 'SystemPulse/LoginPage_SystemPulse.png',
  gallery: [
    { src: 'SystemPulse/LoginPage_SystemPulse.png', caption: 'Invite-only login' },
    { src: 'SystemPulse/SystemTrigger_SystemPulse.png', caption: 'On-demand health probe' },
  ],
  architecture: {
    mermaid: `graph TB
    Browser["Browser<br/>React + Vite + Tailwind"]
    LambdaAPI["AWS Lambda<br/>system-pulse-api<br/>custom HTTP router"]
    LambdaWorker["AWS Lambda<br/>health-worker<br/>async probes"]
    SQS[("SQS Queue<br/>+ Dead-Letter Queue")]
    SNS["SNS Topic<br/>opt-in alerts"]
    DDB[("DynamoDB single table<br/>USER · SYSTEM · HEALTH_LOG<br/>3 GSIs · 30-day TTL")]
    SMTP["SMTP / nodemailer<br/>invites + reset"]
    Target["Monitored URL<br/>any service"]

    Browser -->|REST + JWT| LambdaAPI
    LambdaAPI --> SMTP
    LambdaAPI --> DDB
    LambdaAPI -->|sqs or direct invoke| SQS
    LambdaAPI -.direct invoke.-> LambdaWorker
    SQS --> LambdaWorker
    LambdaWorker -->|GET /health then GET /| Target
    LambdaWorker --> DDB
    LambdaWorker -.optional.-> SNS

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Browser,LambdaAPI,LambdaWorker,SMTP,SNS,Target edge
    class SQS,DDB store`,
    notes: [
      'Two Lambdas, one shared codebase. The api Lambda handles all incoming HTTP; the health-worker Lambda runs probes async — invoked either directly or via SQS by setting HEALTH_TRIGGER_TRANSPORT.',
      'Custom HTTP router (~150 LOC). No Express, no serverless-express. Saves cold-start time and node_modules weight.',
      'Probing strategy: worker tries GET /health first, falls back to GET /. 2xx = UP; otherwise DOWN.',
      'Single-table DynamoDB design. Entity discriminators on every row enable type-aware queries via EntityTypeIndex.',
      'TTL on expiresAt auto-purges health logs after 30 days. Zero ops cost, no cron needed.',
    ],
  },
  database: {
    blurb:
      'DynamoDB single-table design. One table holds users, systems, invites, password-reset tokens, and health logs, distinguished by an entityType attribute and PK/SK prefixes. Three GSIs cover the read patterns.',
    mermaid: `erDiagram
    USER ||--o{ SYSTEM : "allowed access"
    SYSTEM ||--o{ HEALTH_LOG : "probe results"

    USER {
        string id PK
        string email UK
        string role
        string status
        string passwordHash
        list allowedSystemIds
        string inviteToken
        string resetToken
    }
    SYSTEM {
        string id PK
        string name
        string url
        string deploymentMode
        string status
        string lastChecked
        number responseTimeMs
    }
    HEALTH_LOG {
        string systemId FK
        string status
        string checkedAt
        number responseCode
        number responseTimeMs
        number attempt
        string triggerSource
        number expiresAt
    }`,
    tables: [
      {
        name: 'USER',
        description: 'PK: USER, SK: USER#<id>',
        columns: [
          { name: 'id', type: 'String', notes: 'UUID' },
          { name: 'email', type: 'String', notes: 'unique-ish (enforced at app layer)' },
          { name: 'role', type: 'String', notes: 'superadmin / admin / tester' },
          { name: 'status_', type: 'String', notes: 'Active / Pending / Suspended' },
          { name: 'passwordHash', type: 'String', notes: 'scrypt salt:derived' },
          { name: 'allowedSystemIds', type: 'List<String>', notes: 'per-user system access list' },
          { name: 'inviteToken', type: 'String', notes: 'indexed, only set for pending invites' },
          { name: 'resetToken', type: 'String', notes: 'indexed, only set for password resets' },
        ],
      },
      {
        name: 'SYSTEM',
        description: 'PK: SYSTEM, SK: SYS#<uuid>',
        columns: [
          { name: 'id', type: 'String' },
          { name: 'name', type: 'String' },
          { name: 'url', type: 'String', notes: 'monitored URL' },
          { name: 'deploymentMode', type: 'String', notes: 'render / standard' },
          { name: 'status', type: 'String', notes: 'UP / DOWN / UNKNOWN' },
          { name: 'lastChecked', type: 'String', notes: 'ISO of last probe' },
          { name: 'responseTimeMs', type: 'Number' },
        ],
      },
      {
        name: 'HEALTH_LOG',
        description: 'PK: SYSTEM#<id>, SK: LOG#<iso-time>#<attempt>',
        columns: [
          { name: 'systemId', type: 'String', notes: 'parent system UUID' },
          { name: 'status', type: 'String' },
          { name: 'checkedAt', type: 'String' },
          { name: 'responseCode', type: 'Number' },
          { name: 'responseTimeMs', type: 'Number' },
          { name: 'attempt', type: 'Number' },
          { name: 'expiresAt', type: 'Number', notes: 'unix epoch — DynamoDB TTL prunes at 30 days' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda', freeTier: '1M invocations/mo + 400K GB-s', weUse: '~3K invocations/mo', headroom: '99.7%' },
      { service: 'DynamoDB (PAY_PER_REQUEST)', freeTier: '25 GB storage + 25 R/W units (perpetual)', weUse: '<50 MB', headroom: '99%+' },
      { service: 'SQS', freeTier: '1M requests/mo', weUse: '<500 req/mo', headroom: '99.95%' },
      { service: 'SNS', freeTier: '1M publishes/mo', weUse: '<100/mo', headroom: '99.99%' },
      { service: 'CloudWatch Logs', freeTier: '5 GB ingestion/mo', weUse: '<50 MB', headroom: '99%' },
      { service: 'Vercel Hobby', freeTier: '100 GB bandwidth, unlimited deploys', weUse: '<1 GB/mo', headroom: '99%' },
      { service: 'SMTP (Gmail)', freeTier: '500/day', weUse: '<10/day', headroom: '97%+' },
    ],
    rationale: [
      'DynamoDB over RDS — RDS free tier expires after 12 months; DynamoDB free tier is perpetual and scales to single-digit-ms latency.',
      'SQS + DLQ over a self-hosted queue — built-in retry/DLQ semantics mean a flaky monitored service can\'t crash the worker fleet.',
      'Two Lambdas, no API Gateway — Function URLs are free; API Gateway has its own per-million pricing tier.',
      'Vercel over self-hosting — global CDN, automatic deploys, free SSL, custom domains.',
      'Idempotent CI/CD — re-running the deploy workflow on a fresh AWS account stands up the entire system from scratch in ~3 minutes.',
    ],
  },
  apiEndpoints: [
    { method: 'POST', path: '/auth/login', auth: 'none', purpose: 'Email + password → access token' },
    { method: 'POST', path: '/auth/forgot-password', auth: 'none', purpose: 'Email a password-reset link' },
    { method: 'POST', path: '/users/invite', auth: 'superadmin', purpose: 'Email an invite link to a teammate' },
    { method: 'POST', path: '/users/invite/accept', auth: 'invite token', purpose: 'Set password + activate account' },
    { method: 'GET', path: '/systems', auth: 'any', purpose: 'List systems (filtered for testers)' },
    { method: 'POST', path: '/systems', auth: 'admin+', purpose: 'Register a system + initial probe' },
    { method: 'POST', path: '/systems/:id/trigger', auth: 'any', purpose: 'On-demand probe' },
    { method: 'GET', path: '/systems/:id/logs', auth: 'any', purpose: 'Recent probe history' },
  ],
};

// =============================================================================
// ASCIENTE HUB
// =============================================================================
const ascienteHub: Project = {
  slug: 'asciente-hub',
  title: 'AscienteHub',
  role: 'Full-Stack',
  status: 'live',
  tagline:
    'A Steam-style desktop game launcher and storefront. Players sign up, browse a catalog, pay with PayMongo, and install + launch titles from a real native Windows binary.',
  summary:
    'Tauri 2 desktop launcher backed by a TypeScript/Express API on AWS Lambda. TiDB Cloud for storage, Cloudflare R2 for game installers, PayMongo for card payments with 3-D Secure automatic.',
  language: 'TypeScript',
  tech: ['Tauri 2', 'Rust', 'React 18', 'Express 5', 'AWS Lambda', 'TiDB Cloud', 'Cloudflare R2', 'PayMongo', 'Sequelize', 'Redis'],
  techGroups: [
    {
      label: 'Desktop Shell',
      items: ['Tauri 2', 'Rust 2021', 'reqwest', 'tokio', 'walkdir', 'webbrowser', 'zip'],
    },
    {
      label: 'Desktop UI',
      items: ['React 18', 'TypeScript 4.9', 'react-scripts (CRA)', 'react-router-dom 6', 'Tailwind CSS 3', 'axios'],
    },
    {
      label: 'Backend',
      items: ['Node.js 18', 'TypeScript 6', 'Express 5', '@vendia/serverless-express', 'Sequelize 6', 'mysql2', 'JWT (jsonwebtoken)', 'bcrypt', 'Yup', 'Multer', 'Resend', 'nodemailer'],
    },
    {
      label: 'Cloud · Data · Payments',
      items: ['AWS Lambda (Function URL)', 'TiDB Cloud Serverless', 'Cloudflare R2', '@aws-sdk/client-s3', 'Redis (Upstash)', 'ioredis', 'node-cache', 'PayMongo (3-D Secure)'],
    },
    {
      label: 'Testing · Tooling',
      items: ['Jest', 'Supertest', 'sequelize-cli', 'GitHub Actions', 'GitHub Releases'],
    },
  ],
  liveUrl: 'https://github.com/Asciente-rks/ascientehub-frontend/releases',
  sourceUrl: 'https://github.com/Asciente-rks/ascientehub-backend',
  thumbnail: 'AscienteHub/LoginAscienteHub.png',
  gallery: [{ src: 'AscienteHub/LoginAscienteHub.png', caption: 'Sign-in screen' }],
  architecture: {
    mermaid: `graph TB
    Tauri["Tauri 2 Desktop<br/>Windows native<br/>Rust shell + React 18"]
    Lambda["AWS Lambda<br/>ascientehub-backend<br/>Express 5 + Sequelize"]
    R2["Cloudflare R2<br/>installers · trailers · media"]
    TiDB[("TiDB Cloud Serverless<br/>MySQL-compatible")]
    Redis[("Redis · Upstash<br/>1h cache + rate limit")]
    Resend["Resend / nodemailer<br/>OTP email"]
    PayMongo["PayMongo API<br/>3DS card payments"]
    AppData["%APPDATA% / games / per-slug<br/>extract + spawn .exe"]

    Tauri -->|HTTPS + JWT via axios| Lambda
    Lambda --> Resend
    Lambda --> PayMongo
    Lambda --> Redis
    Lambda --> TiDB
    Lambda --> R2
    Tauri -.download zip directly.-> R2
    Tauri --> AppData

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Tauri,Lambda,Resend,PayMongo,AppData edge
    class R2,TiDB,Redis store`,
    notes: [
      'Lambda cold-start hardened in src/lambda.ts: OPTIONS preflights short-circuit before DB init, the Sequelize connection is cached at module scope, and ensureGameSchema() adds optional columns idempotently on cold starts.',
      'Public-GET cache (Redis, 1h TTL) on /api/public/*, /api/games, and /api/games/:id — only when no auth headers are present, so authenticated users always see fresh data.',
      'CORS headers force-injected on every response (including 5xx), so the desktop client never sees a missing-CORS error.',
      'Direct R2 uploads capped at 50 MB — larger installers should be uploaded out-of-band to R2.',
    ],
  },
  database: {
    blurb:
      'All primary keys are UUID v4. Relationships wired in src/models/associations.ts. Schema managed by Sequelize sync() plus a defensive ensureGameSchema() step on cold start.',
    mermaid: `erDiagram
    ROLE ||--o{ USER : assigned
    USER ||--o{ GAME : develops
    USER ||--o{ LIBRARY : owns
    USER ||--o{ CART : has
    USER ||--o{ TRANSACTION : made
    USER ||--o{ REVIEW : wrote
    USER ||--o{ PAYMENT_METHOD : saves
    USER ||--o| SUBSCRIPTION : "pay to publish"
    USER ||--o{ OTP : verifies
    CATEGORY ||--o{ GAME : categorizes
    GAME ||--o{ GAME_MEDIA : has
    GAME ||--o{ LIBRARY : "owned in"
    GAME ||--o{ CART : "in cart"
    GAME ||--o{ TRANSACTION : purchased
    GAME ||--o{ REVIEW : has

    ROLE {
        uuid id PK
        string name UK
    }
    USER {
        uuid id PK
        string email UK
        string passwordHash
        uuid roleId FK
        bool isVerified
        string status
    }
    CATEGORY {
        uuid id PK
        string name UK
        string slug UK
    }
    GAME {
        uuid id PK
        string slug UK
        decimal basePrice
        decimal salePrice
        uuid developerId FK
        uuid categoryId FK
        string status
        string thumbnailUrl
        text installerUrl
    }
    GAME_MEDIA {
        uuid id PK
        uuid gameId FK
        string url
        string type
        bool isFeatured
    }
    LIBRARY {
        uuid id PK
        uuid userId FK
        uuid gameId FK
        datetime purchaseDate
    }
    CART {
        uuid id PK
        uuid userId FK
        uuid gameId FK
    }
    TRANSACTION {
        uuid id PK
        uuid userId FK
        uuid gameId FK
        decimal amount
        string status
    }
    REVIEW {
        uuid id PK
        uuid userId FK
        uuid gameId FK
        int rating
        text comment
    }
    PAYMENT_METHOD {
        uuid id PK
        uuid userId FK
        string paymongoId UK
        string brand
        string last4
    }
    SUBSCRIPTION {
        uuid id PK
        uuid developerId FK
        string status
        datetime nextBillingDate
    }
    OTP {
        uuid id PK
        string email
        string code
        string type
        datetime expiresAt
    }`,
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'UUID (PK)', notes: 'UUIDv4' },
          { name: 'username', type: 'VARCHAR', notes: 'unique' },
          { name: 'email', type: 'VARCHAR', notes: 'unique, validated' },
          { name: 'password', type: 'VARCHAR', notes: 'bcrypt, nullable for OAuth' },
          { name: 'roleId', type: 'UUID (FK → roles.id)' },
          { name: 'isVerified', type: 'BOOLEAN' },
          { name: 'status', type: 'ENUM', notes: 'active / pending / rejected (developer-app gate)' },
        ],
      },
      {
        name: 'games',
        description: 'Slug auto-generated from title in a beforeValidate Sequelize hook.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'title', type: 'VARCHAR' },
          { name: 'slug', type: 'VARCHAR', notes: 'unique, lowercase + dashed' },
          { name: 'basePrice', type: 'DECIMAL(10,2)', notes: 'PHP' },
          { name: 'salePrice', type: 'DECIMAL(10,2)' },
          { name: 'developerId', type: 'UUID (FK → users.id)' },
          { name: 'categoryId', type: 'UUID (FK → categories.id)' },
          { name: 'status', type: 'ENUM', notes: 'pending / approved / rejected' },
          { name: 'thumbnailUrl', type: 'VARCHAR', notes: 'R2 URL' },
          { name: 'installerUrl', type: 'TEXT', notes: 'R2 URL of .zip' },
        ],
      },
      {
        name: 'payment_methods',
        description: 'Tokenized cards. No PAN ever stored — only the PayMongo handle.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'userId', type: 'UUID (FK)' },
          { name: 'paymongoId', type: 'VARCHAR', notes: 'unique, PayMongo payment-method ID' },
          { name: 'brand', type: 'VARCHAR', notes: 'visa / mastercard / etc.' },
          { name: 'last4', type: 'VARCHAR' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda', freeTier: '1M invocations/mo + 400K GB-s', weUse: '~5K invocations/mo', headroom: '99.5%' },
      { service: 'TiDB Cloud Serverless', freeTier: '5 GB storage, 250M RU/mo', weUse: '<100 MB', headroom: '98%+' },
      { service: 'Cloudflare R2', freeTier: '10 GB storage, 1M Class A ops, zero egress', weUse: '<1 GB', headroom: '90%+' },
      { service: 'Redis (Upstash)', freeTier: '10K commands/day', weUse: '~1K cmds/day', headroom: '90%' },
      { service: 'Resend', freeTier: '3K emails/mo, 100/day', weUse: '~20/day during testing', headroom: '80%+' },
      { service: 'PayMongo', freeTier: 'Free signup, no monthly fee', weUse: 'only transaction %', headroom: 'n/a' },
    ],
    rationale: [
      'AWS Lambda over a long-running server — pay only for actual invocations; idle launcher users cost zero.',
      'TiDB over RDS / Aurora — RDS free tier expires after 12 months; TiDB Cloud\'s free tier is perpetual.',
      'R2 over S3 — S3 charges per-GB egress; R2 is zero egress, which matters when shipping installer ZIPs to end users.',
      'PayMongo over Stripe — local PH provider, lower cards-not-present fees, native PHP currency, no FX conversion.',
    ],
  },
  repos: [
    {
      name: 'ascientehub-frontend',
      url: 'https://github.com/Asciente-rks/ascientehub-frontend',
      stack: 'Tauri 2 desktop launcher (Rust shell + React 18 + TypeScript + Tailwind)',
    },
    {
      name: 'ascientehub-backend',
      url: 'https://github.com/Asciente-rks/ascientehub-backend',
      stack: 'Serverless REST API (Node.js 18 + TypeScript + Express 5 + Sequelize)',
    },
  ],
};

// =============================================================================
// SERVICE TICKET SYSTEM
// =============================================================================
const serviceTicketSystem: Project = {
  slug: 'service-ticket-system',
  title: 'Service Ticket System',
  role: 'Full-Stack',
  status: 'live',
  tagline:
    'Internal IT/QA ticketing platform with a built-in approval workflow — testers report defects, developers fix them, admins triage, approvers sign off before tickets close.',
  summary:
    'Four-role ticket workflow (SUPER_ADMIN, ADMIN, TESTER, DEVELOPER) with six lifecycle statuses, per-ticket approval/rejection, granular per-user notification settings, and node-cron-driven SLA housekeeping.',
  language: 'TypeScript',
  tech: ['Express 4', 'Sequelize', 'MySQL', 'node-cron', 'React 19', 'Vite 8', 'Tailwind 4', 'Render', 'Vercel'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js', 'TypeScript 5', 'Express 4', 'helmet', 'cors', 'Sequelize 6', 'mysql2', 'JWT (jsonwebtoken)', 'bcryptjs', 'Yup', 'node-cron', 'nodemon', 'ts-node'],
    },
    {
      label: 'Database',
      items: ['MySQL', 'Aiven', 'FreeSQLDatabase', 'Filess.io'],
    },
    {
      label: 'Frontend',
      items: ['React 19', 'TypeScript 5', 'Vite 8', 'Tailwind CSS 4', 'react-router-dom 7', 'axios', 'jwt-decode', 'lucide-react', 'ESLint 9', 'typescript-eslint'],
    },
    {
      label: 'Hosting · CI/CD',
      items: ['Render Web Service', 'Vercel (auto-deploy)'],
    },
  ],
  liveUrl: 'https://service-ticket-system-frontend.vercel.app',
  sourceUrl: 'https://github.com/Asciente-rks/service-ticket-system',
  thumbnail: 'ServiceTicket/LoginServiceTicket.png',
  gallery: [{ src: 'ServiceTicket/LoginServiceTicket.png', caption: 'Login screen' }],
  architecture: {
    mermaid: `graph TB
    Browser["Browser SPA<br/>React 19 + Vite 8 + Tailwind 4<br/>react-router 7 · jwt-decode"]
    Express["Express 4 API<br/>helmet · CORS · Sequelize 6<br/>routes: auth users tickets notifications"]
    Cron["node-cron in-process<br/>SLA reminders · stale-ticket scan"]
    MySQL[("MySQL · free-tier hosted<br/>users · roles · tickets<br/>statuses · approvals · notifications")]

    Browser -->|REST + JWT via axios| Express
    Express --> MySQL
    Express -.spawn on boot.-> Cron
    Cron --> MySQL

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Browser,Express,Cron edge
    class MySQL store`,
    notes: [
      'Single Express process — no queue, no worker. helmet, cors, express.json, route mounts, /health probe. On startup: connectDB() → defineAssociations() → initCronJobs() → listen.',
      'Cron co-located with the API — saves an additional service. node-cron fires inside the same Node process; the trade-off is that scaling horizontally requires either a leader-election strategy or moving cron to a dedicated worker.',
      'Modular DDD-ish layout — each domain (tickets, users, notifications) has its own controllers/services/repositories/dtos/models/routes.',
      'Snake_case DB columns mapped to camelCase model attributes via Sequelize field — clean SQL audit trail, idiomatic JS code.',
    ],
  },
  database: {
    blurb:
      'Seven Sequelize models. All primary keys are UUID v4. DB columns are snake_case; model attributes are camelCase, mapped via Sequelize field.',
    mermaid: `erDiagram
    ROLE ||--o{ USER : assigned
    TICKET_STATUS ||--o{ TICKET : labels
    USER ||--o{ TICKET : reports
    USER ||--o{ TICKET : assigned
    USER ||--o{ APPROVAL : approves
    TICKET ||--o{ APPROVAL : audited
    USER ||--|| NOTIFICATION_SETTINGS : has
    USER ||--o{ NOTIFICATION : receives
    TICKET ||--o{ NOTIFICATION : about

    ROLE {
        uuid id PK
        string name UK
    }
    USER {
        uuid id PK
        string email UK
        uuid roleId FK
        string password
    }
    TICKET_STATUS {
        uuid id PK
        string name UK
    }
    TICKET {
        uuid id PK
        string title
        text description
        uuid reportedBy FK
        uuid assignedTo FK
        uuid statusId FK
        string priority
    }
    APPROVAL {
        uuid id PK
        uuid ticketId FK
        uuid approverId FK
        string status
        text comment
        datetime approvedAt
    }
    NOTIFICATION {
        uuid id PK
        uuid userId FK
        string message
        bool read
        uuid ticketId FK
    }
    NOTIFICATION_SETTINGS {
        uuid id PK
        uuid userId FK
        bool notifyAssignedTicket
        bool notifyTicketApproved
        bool notifyTicketRejected
    }`,
    tables: [
      {
        name: 'tickets',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'title', type: 'VARCHAR' },
          { name: 'description', type: 'TEXT' },
          { name: 'reported_by', type: 'UUID (FK → users.id)' },
          { name: 'assigned_to', type: 'UUID (FK → users.id)', notes: 'nullable' },
          { name: 'status_id', type: 'UUID (FK → ticket_statuses.id)' },
          { name: 'priority', type: 'VARCHAR', notes: 'free-form: LOW / MEDIUM / HIGH / CRITICAL' },
        ],
      },
      {
        name: 'approvals',
        description: 'Per-decision audit row — multiple approvals over a ticket\'s lifetime are preserved.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'ticket_id', type: 'UUID (FK)' },
          { name: 'approver_id', type: 'UUID (FK)' },
          { name: 'status', type: 'ENUM', notes: 'Approved / Rejected' },
          { name: 'comment', type: 'TEXT', notes: 'becomes part of audit trail' },
        ],
      },
      {
        name: 'notification_settings',
        description: '1:1 with users. Defaults all true — auto-created for new users.',
        columns: [
          { name: 'user_id', type: 'UUID (FK)' },
          { name: 'notify_assigned_ticket', type: 'BOOLEAN' },
          { name: 'notify_reported_ticket_updated', type: 'BOOLEAN' },
          { name: 'notify_ticket_approved', type: 'BOOLEAN' },
          { name: 'notify_ticket_rejected', type: 'BOOLEAN' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'Render Web Service', freeTier: '750 hours/mo, sleeps after 15 min', weUse: 'always-on under monitoring', headroom: 'within limits' },
      { service: 'MySQL (Aiven / FreeSQLDatabase)', freeTier: '5 GB / 1 GB depending on provider', weUse: '<50 MB', headroom: '95%+' },
      { service: 'Vercel Hobby (frontend)', freeTier: '100 GB bandwidth, unlimited deploys', weUse: '<500 MB/mo', headroom: '99.5%' },
      { service: 'GitHub Actions (public repo)', freeTier: 'unlimited minutes', weUse: 'n/a (Vercel auto-deploys)', headroom: 'unlimited' },
    ],
    rationale: [
      'MySQL over PostgreSQL — broader free-tier availability (Aiven, FreeSQLDatabase, Filess.io, etc.).',
      'bcryptjs over bcrypt — pure JS, no native build step, deploys cleanly to Render free tier and serverless platforms.',
      'Vercel for the SPA — global CDN + free SSL + automatic deploys + zero-config Vite detection.',
      'node-cron in-process — saves an entire worker service; trade-off is that scaling horizontally requires leader election.',
    ],
  },
};

// =============================================================================
// TODO LIST
// =============================================================================
const todoList: Project = {
  slug: 'todo-list-app',
  title: 'To-Do List App',
  role: 'Full-Stack Mobile',
  status: 'live',
  tagline:
    'A multi-user todo system with a native mobile app — sign up, sign in, and manage tasks from your phone with cloud sync.',
  summary:
    'Express + Sequelize + MySQL backend deployed on Render, Expo / React Native mobile client distributed as an Android APK via EAS Build. Cold-start resilient with 2-minute timeouts and a friendly wake-up notice.',
  language: 'TypeScript',
  tech: ['Express 5', 'Sequelize', 'MySQL', 'Expo SDK 54', 'React Native', 'EAS Build', 'Render', 'Android', 'iOS'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js', 'TypeScript 5', 'Express 5', 'Sequelize 6', 'mysql2', 'JWT', 'bcrypt', 'Yup', 'ts-node-dev'],
    },
    {
      label: 'Database',
      items: ['MySQL', 'Aiven', 'FreeSQLDatabase', 'Filess.io'],
    },
    {
      label: 'Mobile App',
      items: ['Expo SDK 54', 'React Native 0.81', 'React 19', 'TypeScript 5', '@react-native-async-storage/async-storage', '@react-native-community/datetimepicker', 'lucide-react-native', 'fetch + AbortController'],
    },
    {
      label: 'Build · Distribution',
      items: ['EAS Build', 'GitHub Releases', 'Android APK', 'iOS', 'Web'],
    },
    {
      label: 'Hosting',
      items: ['Render Web Service'],
    },
  ],
  liveUrl: 'https://todo-list-backend-4li8.onrender.com/api',
  sourceUrl: 'https://github.com/Asciente-rks/todo-list',
  thumbnail: 'Todo/TodoList.png',
  gallery: [{ src: 'Todo/TodoList.png', caption: 'Mobile preview' }],
  architecture: {
    mermaid: `graph TB
    Mobile["Mobile / Web<br/>Expo SDK 54 + RN 0.81<br/>AsyncStorage JWT<br/>2-min AbortController"]
    Express["Express 5 backend<br/>Render Web Service<br/>Sequelize 6 + mysql2"]
    MySQL[("MySQL · free-tier provider<br/>users · todos<br/>indexed FK on userId")]
    EAS["EAS Build · Expo"]
    Outputs["Android APK · iOS · Web"]

    Mobile -->|HTTPS + JWT with retry| Express
    Express --> MySQL
    EAS --> Outputs
    Mobile -.- EAS

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Mobile,Express,EAS,Outputs edge
    class MySQL store`,
    notes: [
      'Render free tier for the backend — sleeps after 15 min idle. The mobile app handles this gracefully: 2-minute request timeout (covers cold start) + WakeUpNotice banner + retry wrapper.',
      'JWT in AsyncStorage — works the same on Android, iOS, and web. No platform-specific secure storage needed at this scale.',
      'Single-flag auth state in App.tsx — isAuthenticated + isRegistering toggle which screen renders. No navigation library; keeps the bundle small.',
    ],
  },
  database: {
    blurb: 'Two tables. Both keyed by UUID v4. Simple 1-to-many: one user → many todos.',
    mermaid: `erDiagram
    USER ||--o{ TODO : owns

    USER {
        uuid id PK
        string username UK
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    TODO {
        uuid id PK
        string title
        string description
        bool completed
        datetime dueDate
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }`,
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'username', type: 'VARCHAR', notes: 'unique' },
          { name: 'email', type: 'VARCHAR', notes: 'unique' },
          { name: 'password', type: 'VARCHAR', notes: 'bcrypt hash' },
        ],
      },
      {
        name: 'todos',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'title', type: 'VARCHAR' },
          { name: 'description', type: 'VARCHAR', notes: 'optional' },
          { name: 'completed', type: 'BOOLEAN' },
          { name: 'dueDate', type: 'DATETIME', notes: 'nullable' },
          { name: 'userId', type: 'UUID (FK)', notes: 'indexed' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'Render Web Service', freeTier: '750 hours/mo, sleeps after 15 min', weUse: 'always-on under monitoring', headroom: 'within limits' },
      { service: 'MySQL (Aiven / Filess.io)', freeTier: '5 GB / 1 GB depending on provider', weUse: '<50 MB', headroom: '95%+' },
      { service: 'EAS Build (Expo)', freeTier: '30 builds/mo on free', weUse: '<5 builds/mo', headroom: '80%+' },
      { service: 'GitHub Releases (APK)', freeTier: 'unlimited public assets', weUse: '<50 MB total', headroom: 'unlimited' },
    ],
    rationale: [
      'Render over a long-running VPS — auto-deploys on push, free SSL, free tier includes managed Postgres or external MySQL.',
      'Expo over bare React Native — managed builds, OTA updates, single codebase for Android + iOS + web.',
      'APK sideload over Play Store — Play Store costs $25 once + ongoing review overhead. Sideload is free.',
      '2-min client timeout — Render\'s free-tier cold start can take 30–60s; padding to 2 min covers worst-case wake-up cleanly.',
    ],
  },
  repos: [
    { name: 'todo-list', url: 'https://github.com/Asciente-rks/todo-list', stack: 'Express 5 + Sequelize + MySQL + JWT' },
    { name: 'todo-list-frontend', url: 'https://github.com/Asciente-rks/todo-list-frontend', stack: 'Expo / React Native (Android, iOS, web)' },
  ],
};

// =============================================================================
// SWIFTRACE
// =============================================================================
const swiftRace: Project = {
  slug: 'swiftrace',
  title: 'SwiftRace',
  role: 'Cloud Native Backend',
  status: 'live',
  tagline:
    'A serverless logistics tracking platform — customers place sample orders, shippers progress them through a four-stage delivery lifecycle, admins verify status changes.',
  summary:
    '15 independent AWS Lambdas behind API Gateway, DynamoDB single-table design, React 19 + Vite frontend, immutable history timeline.',
  language: 'TypeScript',
  tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Serverless Framework', 'React 19', 'Vite', 'Vercel', 'Nodemailer'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js 20', 'TypeScript 5', 'Serverless Framework v3', 'AWS Lambda (15 functions)', 'aws-sdk v2 DocumentClient', 'JWT (jsonwebtoken)', 'scrypt', 'Yup', 'nodemailer + SMTP', 'serverless-dotenv-plugin'],
    },
    {
      label: 'Cloud · AWS',
      items: ['AWS API Gateway REST', 'AWS Lambda', 'DynamoDB (single-table + 4 GSIs)', 'CloudWatch Logs', 'IAM (per-function scope)', 'ap-southeast-1'],
    },
    {
      label: 'Frontend',
      items: ['React 19', 'TypeScript 5', 'Vite 8', 'react-router-dom 7', 'fetch', 'localStorage', 'CSS modules'],
    },
    {
      label: 'Hosting',
      items: ['AWS Lambda + API Gateway (ap-southeast-1)', 'Vercel (frontend)'],
    },
  ],
  liveUrl: 'https://swiftrace.vercel.app',
  sourceUrl: 'https://github.com/Asciente-rks/swiftrace',
  thumbnail: 'SystemPulse/LoginPage_SystemPulse.png',
  gallery: [],
  architecture: {
    mermaid: `graph TB
    Browser["Browser<br/>React 19 + Vite + react-router 7"]
    APIGW["AWS API Gateway · REST<br/>ap-southeast-1"]
    UserFns["5 User Lambdas<br/>create / login / update<br/>delete / getByRole"]
    ShipFns["7 Shipment Lambdas<br/>create / update / track<br/>history / sample / email"]
    DevFns["2 Dev Lambdas<br/>seed / clear DB"]
    DDB[("DynamoDB single table<br/>USER · SHIPMENT · HISTORY<br/>4 GSIs")]
    SMTP["nodemailer + SMTP<br/>tracking emails"]

    Browser -->|REST + JWT| APIGW
    APIGW --> UserFns
    APIGW --> ShipFns
    APIGW --> DevFns
    UserFns --> DDB
    ShipFns --> DDB
    DevFns --> DDB
    ShipFns --> SMTP

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Browser,APIGW,UserFns,ShipFns,DevFns,SMTP edge
    class DDB store`,
    notes: [
      '15 independent Lambdas rather than one router-Lambda — each function does one thing. serverless.yml declares route, IAM, and timeout per function. Rollbacks are per-function.',
      'Single-table DynamoDB with PK/SK prefixes. Four GSIs cover the read patterns the API needs.',
      'Tracking number as the partition key — every customer-facing read is "look up shipment X by tracking" — public reads need zero GSI hops.',
      'History events sit under the same partition as the parent shipment — a single Query returns the full timeline.',
    ],
  },
  database: {
    blurb:
      'DynamoDB single-table design. One table stores users, shipments, and shipment history events; four GSIs cover the read patterns.',
    mermaid: `erDiagram
    USER ||--o{ SHIPMENT : places
    SHIPMENT ||--o{ HISTORY : tracked

    USER {
        string user_id PK
        string email UK
        string role
        string verification_status
        string password_hash
    }
    SHIPMENT {
        string tracking_number PK
        string shipment_id
        string customer_id FK
        string origin
        string destination
        string status
    }
    HISTORY {
        string tracking_number FK
        string history_id
        string history_type
        string history_at
        bool admin_verified
        string verified_at
    }`,
    tables: [
      {
        name: 'USER',
        description: 'PK: USER#<user_id>, SK: METADATA',
        columns: [
          { name: 'user_id', type: 'String', notes: 'UUID' },
          { name: 'email', type: 'String', notes: 'login key' },
          { name: 'role', type: 'String', notes: 'customer / shipper / admin' },
          { name: 'verification_status', type: 'String', notes: 'pending / verified / rejected' },
          { name: 'password_hash', type: 'String', notes: 'scrypt; never returned via API' },
        ],
      },
      {
        name: 'SHIPMENT',
        description: 'PK: SHIPMENT#<tracking_number>, SK: METADATA',
        columns: [
          { name: 'shipment_id', type: 'String', notes: 'UUID' },
          { name: 'tracking_number', type: 'String', notes: 'unique, primary lookup key' },
          { name: 'origin', type: 'String' },
          { name: 'destination', type: 'String' },
          { name: 'status_', type: 'String', notes: 'STATUS#<status> in storage; plain status in API responses' },
        ],
      },
      {
        name: 'HISTORY',
        description: 'PK: SHIPMENT#<tracking_number>, SK: EVENT#<historyId>',
        columns: [
          { name: 'historyType', type: 'String', notes: 'created / picked_up / in_transit / out_for_delivery / delivered' },
          { name: 'admin_verified', type: 'Boolean', notes: 'internal — stripped from public history responses' },
          { name: 'verifiedAt', type: 'String', notes: 'also stripped' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda', freeTier: '1M invocations/mo + 400K GB-s', weUse: '~5K invocations/mo', headroom: '99.5%' },
      { service: 'API Gateway REST', freeTier: '1M requests/mo (12 months)', weUse: '~5K requests/mo', headroom: '99.5%' },
      { service: 'DynamoDB (PAY_PER_REQUEST)', freeTier: '25 GB storage + 25 R/W units (perpetual)', weUse: '<100 MB', headroom: '99%+' },
      { service: 'Vercel Hobby', freeTier: '100 GB bandwidth, unlimited deploys', weUse: '<500 MB/mo', headroom: '99.5%' },
    ],
    rationale: [
      'DynamoDB over RDS — 25 GB free perpetually, single-digit ms latency, no cold start.',
      'Per-function Lambdas over a router-Lambda — granular cold starts, isolated failures, IAM scoped per route.',
      'Serverless Framework over CDK / SAM — simpler YAML, mature ecosystem, faster onboarding.',
      'Public history responses use a stripped variant (ShipmentHistoryResponse) that hides admin_verified — customers never see internal moderation metadata.',
    ],
  },
};

// =============================================================================
// JUDGEMENT CUT
// =============================================================================
const judgementCut: Project = {
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
  sourceUrl: 'https://github.com/Asciente-rks/judgement-cut',
  thumbnail: 'SystemPulse/LoginPage_SystemPulse.png',
  gallery: [],
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

// =============================================================================
// H100 ECOLODGE
// =============================================================================
const h100Ecolodge: Project = {
  slug: 'h100-ecolodge',
  title: 'H100 Ecolodge',
  role: 'Backend / Full-Stack',
  status: 'live',
  tagline:
    'A commercial booking engine for an ecolodge — built under zero-cost infrastructure constraints as the client requested.',
  summary:
    'Spring Boot + Spring Data JPA backend with MySQL on Aiven, vanilla HTML/CSS/JS on the customer-facing storefront, and a full admin panel for bookings, rooms, halls, catering, payments, and analytics.',
  language: 'Java',
  tech: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'MySQL', 'Aiven', 'HTML', 'CSS', 'JavaScript', 'Maven'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Java 17', 'Spring Boot 3', 'Spring MVC', 'Spring Data JPA', 'Hibernate', 'Spring Security (session-based)', 'Maven'],
    },
    {
      label: 'Database',
      items: ['MySQL', 'Aiven (free tier)'],
    },
    {
      label: 'Frontend (storefront)',
      items: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Bootstrap-style layouts'],
    },
    {
      label: 'Frontend (admin)',
      items: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Charting library for analytics'],
    },
    {
      label: 'Hosting',
      items: ['Java host (Render / Railway)', 'Aiven (DB)'],
    },
  ],
  sourceUrl: 'https://github.com/Ecolodge-STI/EcoWeb',
  thumbnail: 'H100/CXUI_Homepage.png',
  gallery: [
    { src: 'H100/CXUI_Homepage.png', caption: 'Customer homepage' },
    { src: 'H100/CXUI_Hompage2.png', caption: 'Customer homepage — secondary view' },
    { src: 'H100/CXUI_Halls.png', caption: 'Function halls catalog' },
    { src: 'H100/CXUI_Rooms.png', caption: 'Rooms catalog' },
    { src: 'H100/CXUI_Catering.png', caption: 'Catering catalog' },
    { src: 'H100/CXUI_BranchSelection.png', caption: 'Branch selection' },
    { src: 'H100/CXUI_Bookings.png', caption: 'Customer bookings' },
    { src: 'H100/CXUI_Bookings2.png', caption: 'Customer bookings — detail view' },
    { src: 'H100/ADMIN_Login.png', caption: 'Admin login' },
    { src: 'H100/ADMIN_Dashboard.png', caption: 'Admin dashboard' },
    { src: 'H100/ADMIN_Dashboard2.png', caption: 'Admin dashboard — analytics' },
    { src: 'H100/ADMIN_Booking.png', caption: 'Admin bookings' },
    { src: 'H100/ADMIN_Booking2.png', caption: 'Admin bookings — detail' },
    { src: 'H100/ADMIN_ManageRooms.png', caption: 'Manage rooms' },
    { src: 'H100/ADMIN_ManageRooms2.png', caption: 'Manage rooms — detail' },
    { src: 'H100/ADMIN_Payments.png', caption: 'Payments' },
    { src: 'H100/ADMIN_Payments2.png', caption: 'Payments — ledger' },
    { src: 'H100/ADMIN_PaymentLogs.png', caption: 'Payment logs' },
    { src: 'H100/ADMIN_ReservationLogs.png', caption: 'Reservation logs' },
    { src: 'H100/ADMIN_SystemLogs.png', caption: 'System logs' },
    { src: 'H100/ADMIN_DataAnalytics.png', caption: 'Data analytics' },
    { src: 'H100/ADMIN_ManageUsers.png', caption: 'Manage users' },
    { src: 'H100/ADMIN_ManageUsers2.png', caption: 'Manage users — detail' },
    { src: 'H100/ADMIN_EmployeeManagement.png', caption: 'Employee management' },
    { src: 'H100/ADMIN_Content.png', caption: 'Content management' },
  ],
  architecture: {
    mermaid: `graph TB
    Customer["Customer Browser<br/>Vanilla HTML/CSS/JS<br/>storefront + bookings"]
    Admin["Admin Browser<br/>Admin Panel<br/>operations console"]
    Spring["Spring Boot · Java 17<br/>Spring MVC + Spring Data JPA<br/>Spring Security session auth"]
    MySQL[("MySQL · Aiven free tier<br/>bookings · rooms · halls<br/>catering · payments<br/>+ audit logs")]

    Customer -->|REST + Session| Spring
    Admin -->|REST + Session| Spring
    Spring --> MySQL

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Customer,Admin,Spring edge
    class MySQL store`,
    notes: [
      'Zero-cost infrastructure constraint — chose Aiven\'s free MySQL tier and a free-tier-friendly Java host instead of paid cloud DBs.',
      'Customer-facing storefront served as static HTML/CSS/JS — fast, no SPA build pipeline, easy to maintain for the client.',
      'Admin panel is a complete operations console: bookings, rooms, halls, catering, payments, payment logs, reservation logs, system logs, employee management, data analytics.',
      'Audit-trail tables (payment_logs, reservation_logs, system_logs) preserve every state change for forensic review.',
    ],
  },
  database: {
    blurb:
      'Relational schema across bookings, branches, rooms, halls, catering, users, employees, payments, and three audit-trail tables.',
    mermaid: `erDiagram
    BRANCH ||--o{ ROOM : has
    BRANCH ||--o{ HALL : has
    BRANCH ||--o{ CATERING : has
    USER ||--o{ BOOKING : makes
    ROOM ||--o{ BOOKING : booked
    HALL ||--o{ BOOKING : booked
    CATERING ||--o{ BOOKING : ordered
    BOOKING ||--o{ PAYMENT : has
    PAYMENT ||--o{ PAYMENT_LOG : audits
    BOOKING ||--o{ RESERVATION_LOG : audits
    USER ||--o| EMPLOYEE : isStaff
    EMPLOYEE ||--o{ SYSTEM_LOG : creates

    USER {
        uuid id PK
        string email UK
        string role
        string passwordHash
    }
    BRANCH {
        uuid id PK
        string name
        string address
    }
    ROOM {
        uuid id PK
        uuid branchId FK
        string type
        decimal price
    }
    HALL {
        uuid id PK
        uuid branchId FK
        int capacity
        decimal price
    }
    CATERING {
        uuid id PK
        uuid branchId FK
        string menu
        decimal pricePerHead
    }
    BOOKING {
        uuid id PK
        uuid userId FK
        date checkIn
        date checkOut
        string status
    }
    PAYMENT {
        uuid id PK
        uuid bookingId FK
        decimal amount
        string method
    }
    PAYMENT_LOG {
        uuid id PK
        uuid paymentId FK
        string action
        datetime at
    }
    RESERVATION_LOG {
        uuid id PK
        uuid bookingId FK
        string action
        datetime at
    }
    SYSTEM_LOG {
        uuid id PK
        uuid actorId FK
        string event
        datetime at
    }
    EMPLOYEE {
        uuid id PK
        uuid userId FK
        string position
        date hiredAt
    }`,
    tables: [],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'Java host (Render / Railway)', freeTier: 'free-tier with sleep behavior', weUse: 'within free tier', headroom: 'within limits' },
      { service: 'MySQL (Aiven)', freeTier: 'Free DB tier', weUse: '<100 MB', headroom: '95%+' },
      { service: 'Static frontend hosting', freeTier: 'unlimited bandwidth on most providers', weUse: '<1 GB/mo', headroom: '99%' },
    ],
    rationale: [
      'Aiven free tier for MySQL — managed, zero ops, low risk for a commercial workload at this scale.',
      'Vanilla HTML/CSS/JS storefront — no SPA build, simple deploy, content updates by editing files.',
      'Spring Boot + Spring Data JPA — mature Java ecosystem, easy to hand off to another developer for client maintenance.',
    ],
  },
};

// =============================================================================
// NHC INTERNAL GYM
// =============================================================================
const nhcInternalGym: Project = {
  slug: 'nhc-internal-gym',
  title: 'NHC Internal Gym',
  role: 'Desktop',
  status: 'archived',
  tagline:
    'A custom desktop management solution for an internal gym — focused on high-performance local data handling, time tracking, and member search.',
  summary:
    '.NET Windows Forms application with SQL Server backend. Built for offline-first internal use where speed and reliability matter more than connectivity.',
  language: 'C#',
  tech: ['.NET', 'Windows Forms', 'C#', 'SQL Server Express', 'ADO.NET', 'Visual Studio'],
  techGroups: [
    {
      label: 'Desktop App',
      items: ['C#', '.NET Framework / .NET', 'Windows Forms', 'Modular form architecture'],
    },
    {
      label: 'Database',
      items: ['SQL Server Express', 'Local instance (sub-ms queries)'],
    },
    {
      label: 'Data Access',
      items: ['ADO.NET', 'SQL stored procedures'],
    },
    {
      label: 'Tooling',
      items: ['Visual Studio', 'SQL Server Management Studio'],
    },
  ],
  thumbnail: 'NHC/Login.png',
  gallery: [
    { src: 'NHC/Login.png', caption: 'Sign-in screen' },
    { src: 'NHC/SearchMember.png', caption: 'Member search' },
    { src: 'NHC/TimeTracking.png', caption: 'Time tracking' },
    { src: 'NHC/Inventory.png', caption: 'Inventory' },
    { src: 'NHC/Inventory2.png', caption: 'Inventory — detail view' },
  ],
  architecture: {
    mermaid: `graph TB
    Forms["Windows Forms · .NET / C#<br/>Sign-in · Search · Time<br/>Inventory · Member CRUD"]
    SQL[("SQL Server Express<br/>local instance · sub-ms queries<br/>members · time_logs · inventory")]

    Forms -->|ADO.NET| SQL

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Forms edge
    class SQL store`,
    notes: [
      'Offline-first by design — internal gym workflow tolerates no network downtime, so the entire stack runs locally.',
      'Direct SQL access via ADO.NET for sub-millisecond local queries.',
      'Modular form architecture — each operations area (members, time, inventory) is its own form module, easy to maintain.',
    ],
  },
  database: {
    blurb: 'Local SQL Server schema covering members, plans, time logs, sessions, inventory, employees, and an audit log.',
    mermaid: `erDiagram
    MEMBERSHIP_PLAN ||--o{ MEMBER : subscribes
    MEMBER ||--o{ TIME_LOG : logs
    MEMBER ||--o{ SESSION : attends
    EMPLOYEE ||--o{ TIME_LOG : verifies
    EMPLOYEE ||--o{ AUDIT_LOG : creates
    INVENTORY_CATEGORY ||--o{ INVENTORY : categorizes

    MEMBER {
        int id PK
        string firstName
        string lastName
        date joinDate
        int planId FK
    }
    MEMBERSHIP_PLAN {
        int id PK
        string name UK
        decimal price
        int durationDays
    }
    TIME_LOG {
        int id PK
        int memberId FK
        datetime checkIn
        datetime checkOut
        int verifiedBy FK
    }
    SESSION {
        int id PK
        int memberId FK
        datetime startTime
        string activity
    }
    INVENTORY {
        int id PK
        string name
        int quantity
        int categoryId FK
    }
    INVENTORY_CATEGORY {
        int id PK
        string name UK
    }
    EMPLOYEE {
        int id PK
        string name
        string role
        string passwordHash
    }
    AUDIT_LOG {
        int id PK
        int employeeId FK
        string action
        datetime timestamp
    }`,
    tables: [],
  },
  cost: {
    monthlyTotal: 'On-prem',
    rows: [
      { service: '.NET runtime', freeTier: 'free, redistributable', weUse: 'embedded', headroom: 'n/a' },
      { service: 'SQL Server Express', freeTier: '10 GB DB size', weUse: '<500 MB', headroom: '95%' },
      { service: 'Windows host', freeTier: 'on-prem hardware', weUse: 'existing internal machine', headroom: 'n/a' },
    ],
    rationale: [
      'Internal gym workflow tolerates no internet downtime — chose offline-first .NET over a web stack.',
      'SQL Server Express over MySQL — first-class .NET tooling and the gym already had Windows infrastructure.',
    ],
  },
};

// =============================================================================
// THE LAST LIGHT
// =============================================================================
const theLastLight: Project = {
  slug: 'the-last-light',
  title: 'The Last Light',
  role: 'Game Development',
  status: 'archived',
  tagline:
    "A tutorial-based 3D horror game from User1 Productions, extended with additional enemy AI, UI, accessibility features, and sound design for a more exciting gameplay loop.",
  summary:
    'Built on User1 Productions\' Unity 3D series. Extensions include a second enemy archetype, expanded HUD, options menu with rebindable controls, accessibility toggles, and a custom SFX/music pass.',
  language: 'C#',
  tech: ['Unity', 'C#', 'Blender', 'VS Code', 'ScriptableObjects', 'Animator FSM'],
  techGroups: [
    {
      label: 'Engine',
      items: ['Unity 2022 LTS', 'C# scripting', 'ScriptableObjects', 'Animator state machines', 'NavMesh AI'],
    },
    {
      label: 'Asset Pipeline',
      items: ['Blender (3D models)', 'Unity Asset Pipeline', 'Custom SFX + music pass'],
    },
    {
      label: 'Tooling',
      items: ['VS Code', 'Unity Editor', 'Git LFS'],
    },
    {
      label: 'Distribution',
      items: ['Windows Standalone build (.exe)'],
    },
  ],
  sourceUrl: 'https://github.com/Asciente-rks/the-last-light',
  thumbnail: 'TheLastLight/MainMenu.png',
  gallery: [
    { src: 'TheLastLight/MainMenu.png', caption: 'Main menu' },
    { src: 'TheLastLight/InGame.png', caption: 'In-game — exterior' },
    { src: 'TheLastLight/InGame2.png', caption: 'In-game — interior' },
    { src: 'TheLastLight/Maynard.png', caption: 'Protagonist (Maynard)' },
    { src: 'TheLastLight/Zombie.png', caption: 'Enemy archetype — zombie' },
    { src: 'TheLastLight/EditorSample.png', caption: 'Unity editor — scene view' },
    { src: 'TheLastLight/EditorSample2.png', caption: 'Unity editor — second scene' },
    { src: 'TheLastLight/Settings.png', caption: 'Settings + accessibility' },
  ],
  architecture: {
    mermaid: `graph TB
    Unity["Unity 3D Project<br/>C# scripts + ScriptableObjects<br/>Animator FSMs"]
    Player["Player Controller<br/>movement + interaction"]
    AI["Enemy AI<br/>2 archetypes incl. zombie"]
    UI["HUD + Options<br/>accessibility toggles"]
    Assets["Asset Pipeline<br/>Blender models · SFX · music"]
    Build["Windows Standalone .exe"]

    Unity --> Player
    Unity --> AI
    Unity --> UI
    Unity --> Assets
    Assets -.imports.-> Unity
    Unity --> Build

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    class Unity,Player,AI,UI,Assets,Build edge`,
    notes: [
      'Originally a tutorial project from User1 Productions — extended with second enemy archetype, expanded HUD, accessibility toggles, and a custom audio pass.',
      'C# component scripts for player, AI, and UI; ScriptableObjects for game config; Animator state machines for character animation.',
      'Blender for modelling secondary characters (zombie variant) and props.',
    ],
  },
  cost: {
    monthlyTotal: 'Free',
    rows: [
      { service: 'Unity (Personal)', freeTier: 'free under revenue threshold', weUse: 'personal project', headroom: 'within limits' },
      { service: 'Blender', freeTier: 'free open-source', weUse: 'asset modelling', headroom: 'unlimited' },
      { service: 'VS Code', freeTier: 'free editor', weUse: 'C# scripting', headroom: 'unlimited' },
    ],
    rationale: [
      'Unity Personal — free under the revenue threshold; perfect for portfolio / educational projects.',
      'Blender for modelling — zero-cost professional 3D toolchain.',
    ],
  },
};

export const projects: Project[] = [
  systemPulse,
  ascienteHub,
  serviceTicketSystem,
  todoList,
  swiftRace,
  judgementCut,
  h100Ecolodge,
  nhcInternalGym,
  theLastLight,
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
