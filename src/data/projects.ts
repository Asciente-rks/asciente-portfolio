// Project metadata used by the homepage cards and the dynamic project detail pages.
// Architecture, database, and cost sections are sourced from the READMEs of each repo.

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

export type Project = {
  slug: string;
  title: string;
  role: string;
  status: ProjectStatus;
  tagline: string;
  summary: string;
  language: string;
  tech: string[];
  liveUrl?: string;
  sourceUrl?: string;
  thumbnail: string; // resolved by import.meta.glob in [slug].astro
  gallery: { src: string; caption?: string }[];
  architecture: {
    diagram: string; // ASCII or codeblock
    notes: string[];
  };
  database?: {
    blurb: string;
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

export const projects: Project[] = [
  // ------------------------------------------------------------------------------------
  // SYSTEM PULSE
  // ------------------------------------------------------------------------------------
  {
    slug: 'system-pulse',
    title: 'System Pulse',
    role: 'Cloud Native Backend',
    status: 'live',
    tagline:
      'A self-hosted uptime and health-check platform. Probes monitored URLs from AWS Lambda, fans out via SQS, and tracks 30 days of rolling history in DynamoDB.',
    summary:
      "Invite-based onboarding, per-user system access lists, three-tier role model, and a built-in Render wake-up mode for monitoring sleeping free-tier services. Two Lambdas sharing one codebase, single-table DynamoDB, three GSIs.",
    language: 'TypeScript',
    tech: ['AWS Lambda', 'DynamoDB', 'SQS', 'SNS', 'React', 'Vite', 'TailwindCSS', 'Vercel'],
    liveUrl: 'https://system-pulse-brown.vercel.app',
    sourceUrl: 'https://github.com/Asciente-rks/system-pulse',
    thumbnail: 'SystemPulse/LoginPage_SystemPulse.png',
    gallery: [
      { src: 'SystemPulse/LoginPage_SystemPulse.png', caption: 'Invite-only login' },
      { src: 'SystemPulse/SystemTrigger_SystemPulse.png', caption: 'On-demand health probe' },
    ],
    architecture: {
      diagram: `Browser (React + Vite SPA, Vercel)
   │ HTTPS / REST + JWT
   ▼
AWS Lambda Function URL
system-pulse-{stage}-api          ← single-Lambda router
   │           │             │
   ▼           ▼             ▼
SMTP /     DynamoDB        SQS queue
nodemailer single table     │
(invites)  + 3 GSIs         ▼
           + 30-day TTL    AWS Lambda
                          system-pulse-{stage}-health-worker
                           • probes monitored URLs
                           • persists status + log
                           • optional SNS publish`,
      notes: [
        'Two Lambdas, one shared codebase. The api Lambda handles all incoming HTTP; the health-worker Lambda runs probes async — invoked either directly or via SQS by setting HEALTH_TRIGGER_TRANSPORT.',
        'Custom HTTP router (~150 LOC). No Express, no serverless-express. Saves cold-start time and node_modules weight.',
        'Probing strategy: worker tries GET <url>/health first, falls back to GET <url>. 2xx = UP; otherwise DOWN.',
        'Single-table DynamoDB design. Entity discriminators on every row enable type-aware queries via EntityTypeIndex.',
        'TTL on expiresAt auto-purges health logs after 30 days. Zero ops cost, no cron needed.',
      ],
    },
    database: {
      blurb:
        'DynamoDB single-table design. One table holds users, systems, invites, password-reset tokens, and health logs, distinguished by an entityType attribute and PK/SK prefixes. Three GSIs cover the read patterns.',
      tables: [
        {
          name: 'USER',
          description: 'PK: USER, SK: USER#<id>',
          columns: [
            { name: 'id', type: 'String', notes: 'UUID' },
            { name: 'email', type: 'String', notes: 'unique-ish (enforced at app layer)' },
            { name: 'role', type: 'String', notes: "'superadmin' | 'admin' | 'tester'" },
            { name: 'status_', type: 'String', notes: "'Active' | 'Pending' | 'Suspended'" },
            { name: 'passwordHash', type: 'String', notes: 'scrypt: <salt>:<derived>' },
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
            { name: 'deploymentMode', type: 'String', notes: "'render' | 'standard'" },
            { name: 'status', type: 'String', notes: "'UP' | 'DOWN' | 'UNKNOWN'" },
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
  },

  // ------------------------------------------------------------------------------------
  // ASCIENTE HUB
  // ------------------------------------------------------------------------------------
  {
    slug: 'asciente-hub',
    title: 'AscienteHub',
    role: 'Full-Stack',
    status: 'live',
    tagline:
      'A Steam-style desktop game launcher and storefront. Players sign up, browse a catalog, pay with PayMongo, and install + launch titles from a real native Windows binary.',
    summary:
      'Tauri 2 desktop launcher backed by a TypeScript/Express API on AWS Lambda. TiDB Cloud for storage, Cloudflare R2 for game installers, PayMongo for card payments with 3-D Secure automatic.',
    language: 'TypeScript',
    tech: ['Tauri 2', 'React 18', 'Express 5', 'AWS Lambda', 'TiDB Cloud', 'Cloudflare R2', 'PayMongo'],
    liveUrl: 'https://github.com/Asciente-rks/ascientehub-frontend/releases',
    sourceUrl: 'https://github.com/Asciente-rks/ascientehub-backend',
    thumbnail: 'AscienteHub/LoginAscienteHub.png',
    gallery: [
      { src: 'AscienteHub/LoginAscienteHub.png', caption: 'Sign-in screen' },
    ],
    architecture: {
      diagram: `Windows Desktop (Tauri 2)
 │  • Rust shell (~5 MB binary)
 │  • React 18 SPA inside
 │  • Tailwind 3
 ▼ HTTPS (axios + JWT)

AWS Lambda Function URL
ascientehub-backend
Express 5 via @vendia/serverless-express
   │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼
Resend  PayMongo  R2 (S3 SDK)  Redis  TiDB Cloud
(OTP)   3DS card  • thumbnails  ioredis  MySQL-compat
                 • trailers           • 5 GB free
                 • installer ZIPs     • SSL`,
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
            { name: 'isBanned', type: 'BOOLEAN' },
            { name: 'status', type: 'ENUM', notes: "'active' | 'pending' | 'rejected' (developer-app gate)" },
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
            { name: 'status', type: 'ENUM', notes: "'pending' | 'approved' | 'rejected'" },
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
            { name: 'type', type: 'VARCHAR', notes: "'card', etc." },
            { name: 'brand', type: 'VARCHAR', notes: "'visa', 'mastercard', etc." },
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
  },

  // ------------------------------------------------------------------------------------
  // SERVICE TICKET SYSTEM
  // ------------------------------------------------------------------------------------
  {
    slug: 'service-ticket-system',
    title: 'Service Ticket System',
    role: 'Full-Stack',
    status: 'live',
    tagline:
      'Internal IT/QA ticketing platform with a built-in approval workflow — testers report defects, developers fix them, admins triage, approvers sign off before tickets close.',
    summary:
      'Four-role ticket workflow (SUPER_ADMIN, ADMIN, TESTER, DEVELOPER) with six lifecycle statuses, per-ticket approval/rejection, granular per-user notification settings, and node-cron-driven SLA housekeeping.',
    language: 'TypeScript',
    tech: ['Express 4', 'Sequelize', 'MySQL', 'node-cron', 'React 19', 'Vite 8', 'Tailwind 4', 'Vercel'],
    liveUrl: 'https://service-ticket-system-frontend.vercel.app',
    sourceUrl: 'https://github.com/Asciente-rks/service-ticket-system',
    thumbnail: 'ServiceTicket/LoginServiceTicket.png',
    gallery: [
      { src: 'ServiceTicket/LoginServiceTicket.png', caption: 'Login screen' },
    ],
    architecture: {
      diagram: `Browser (React 19 + Vite)
 │  • Vercel-hosted SPA
 │  • react-router 7
 │  • Tailwind 4
 │  • jwt-decode (client role parsing)
 ▼ REST + JWT (Bearer) via axios

Express 4 API
 │  • helmet + CORS
 │  • routes: /auth /users /tickets /notifications
 │  • /health liveness
 ▼

  ┌─────────────────┐    ┌──────────────────┐
  │ MySQL           │ ◄──│ node-cron        │
  │ (free-tier      │    │ • SLA reminders  │
  │  hosted)        │    │ • stale-ticket   │
  │                 │    │   scan           │
  └─────────────────┘    └──────────────────┘`,
      notes: [
        'Single Express process — no queue, no worker. helmet, cors, express.json, route mounts, /health probe. On startup: connectDB() → defineAssociations() → initCronJobs() → listen.',
        'Cron co-located with the API — saves an additional service. node-cron fires inside the same Node process; the trade-off is that scaling horizontally requires either a leader-election strategy or moving cron to a dedicated worker.',
        'Modular DDD-ish layout — each domain (tickets, users, notifications) has its own controllers/services/repositories/dtos/models/routes.',
        'Snake_case DB columns mapped to camelCase model attributes via Sequelize field — clean SQL audit trail, idiomatic JS code.',
      ],
    },
    database: {
      blurb:
        'Seven Sequelize models. All primary keys are UUID v4. DB columns are snake_case (reported_by, assigned_to, status_id); model attributes are camelCase, mapped via Sequelize field.',
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
            { name: 'priority', type: 'VARCHAR', notes: "free-form ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')" },
          ],
        },
        {
          name: 'ticket_statuses',
          description: 'Six statuses seeded with hardcoded UUIDs in src/config/statuses.ts',
          columns: [
            { name: 'id', type: 'UUID (PK)', notes: 'hardcoded' },
            { name: 'name', type: 'VARCHAR', notes: "OPEN | IN_PROGRESS | READY_FOR_QA | ERROR_PERSISTS | RESOLVED | CLOSED" },
          ],
        },
        {
          name: 'approvals',
          description: 'Per-decision audit row — multiple approvals over a ticket\'s lifetime are preserved.',
          columns: [
            { name: 'id', type: 'UUID (PK)' },
            { name: 'ticket_id', type: 'UUID (FK)' },
            { name: 'approver_id', type: 'UUID (FK)' },
            { name: 'status', type: 'ENUM', notes: "'Approved' | 'Rejected'" },
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
  },

  // ------------------------------------------------------------------------------------
  // TODO LIST
  // ------------------------------------------------------------------------------------
  {
    slug: 'todo-list-app',
    title: 'To-Do List App',
    role: 'Full-Stack Mobile',
    status: 'live',
    tagline:
      'A multi-user todo system with a native mobile app — sign up, sign in, and manage tasks from your phone with cloud sync.',
    summary:
      'Express + Sequelize + MySQL backend deployed on Render, Expo / React Native mobile client distributed as an Android APK via EAS Build. Cold-start resilient with 2-minute timeouts and a friendly wake-up notice.',
    language: 'TypeScript',
    tech: ['Express 5', 'Sequelize', 'MySQL', 'Expo SDK 54', 'React Native', 'EAS Build', 'Render'],
    liveUrl: 'https://todo-list-backend-4li8.onrender.com/api',
    sourceUrl: 'https://github.com/Asciente-rks/todo-list',
    thumbnail: 'Todo/TodoList.png',
    gallery: [{ src: 'Todo/TodoList.png', caption: 'Mobile preview' }],
    architecture: {
      diagram: `Mobile / Web (Expo)
 │  • React Native + TypeScript
 │  • Expo SDK 54 + RN 0.81
 │  • AsyncStorage (token, userId)
 │  • Custom fetch wrapper:
 │    - 2-min AbortController timeout
 │    - JWT auto-attach
 │    - retry wrapper for cold-start
 ▼ HTTPS + JWT (Bearer)

Express 5 backend (Render Web Service)
 │  • CORS: origin "*"
 │  • request logging middleware
 │  • /, /api, /health liveness
 │  • /api/users/* + /api/todos/*
 │  • 404 + global error handler
 ▼

MySQL (free-tier provider)
 │  • users + todos tables
 │  • indexed FK on todos.userId

EAS Build ──▶ Android APK + iOS + web
              (preview / production profiles)`,
      notes: [
        'Render free tier for the backend — sleeps after 15 min idle. The mobile app handles this gracefully: 2-minute request timeout (covers cold start) + WakeUpNotice banner + retry wrapper.',
        'JWT in AsyncStorage — works the same on Android, iOS, and web. No platform-specific secure storage needed at this scale.',
        'Single-flag auth state in App.tsx — isAuthenticated + isRegistering toggle which screen renders. No navigation library; keeps the bundle small.',
      ],
    },
    database: {
      blurb: 'Two tables. Both keyed by UUID v4. Simple 1-to-many: one user → many todos.',
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
        { service: 'MySQL (Aiven / FreeSQLDatabase / Filess.io)', freeTier: '5 GB / 1 GB depending on provider', weUse: '<50 MB', headroom: '95%+' },
        { service: 'EAS Build (Expo)', freeTier: '30 builds/mo on free', weUse: '<5 builds/mo', headroom: '80%+' },
        { service: 'GitHub Releases (APK distribution)', freeTier: 'unlimited public assets', weUse: '<50 MB total', headroom: 'unlimited' },
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
  },

  // ------------------------------------------------------------------------------------
  // SWIFTRACE
  // ------------------------------------------------------------------------------------
  {
    slug: 'swiftrace',
    title: 'SwiftRace',
    role: 'Cloud Native Backend',
    status: 'live',
    tagline:
      'A serverless logistics tracking platform — customers place sample orders, shippers progress them through a four-stage delivery lifecycle, admins verify status changes.',
    summary:
      '15 independent AWS Lambdas behind API Gateway, DynamoDB single-table design, React 19 + Vite frontend, immutable history timeline.',
    language: 'TypeScript',
    tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Serverless Framework', 'React 19', 'Vite', 'Vercel'],
    liveUrl: 'https://swiftrace.vercel.app',
    sourceUrl: 'https://github.com/Asciente-rks/swiftrace',
    thumbnail: 'SystemPulse/LoginPage_SystemPulse.png', // placeholder until SwiftRace screenshots exist
    gallery: [],
    architecture: {
      diagram: `Browser (React 19 + Vite)
 │  • Vercel-hosted SPA
 │  • react-router 7
 ▼ REST + JWT (Bearer)

AWS API Gateway (REST)
ap-southeast-1
 │ per-route HTTP integration
 ▼

15 Lambda functions
 │  Users:
 │   • createUser, loginUser, updateUser,
 │     deleteUser, getUserByRole
 │  Shipments:
 │   • createShipment, updateShipment,
 │     getShipmentByTracking,
 │     getShipmentByStatus,
 │     getShipmentHistory,
 │     placeSampleOrder, sendTrackingEmail
 │  Dev:
 │   • seedDatabase, clearDatabase
 ▼

DynamoDB single table
 + 4 GSIs (role / status /
   shipmentId / trackingNumber)`,
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
      tables: [
        {
          name: 'USER',
          description: 'PK: USER#<user_id>, SK: METADATA',
          columns: [
            { name: 'user_id', type: 'String', notes: 'UUID' },
            { name: 'email', type: 'String', notes: 'login key' },
            { name: 'role', type: 'String', notes: "'customer' | 'shipper' | 'admin'" },
            { name: 'verification_status', type: 'String', notes: "'pending' | 'verified' | 'rejected'" },
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
            { name: 'historyType', type: 'String', notes: "'created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered'" },
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
  },

  // ------------------------------------------------------------------------------------
  // JUDGEMENT CUT
  // ------------------------------------------------------------------------------------
  {
    slug: 'judgement-cut',
    title: 'Judgement Cut',
    role: 'Cloud Native Backend',
    status: 'in-dev',
    tagline:
      'A daily-refreshing dashboard of game deals across Steam, GOG, Humble, and Epic — with native Steam Philippine peso pricing so the numbers match what you actually pay.',
    summary:
      'Designed for $0/month forever. CheapShark feeds deals, Steam regional API gives native PHP prices, Zyte Scrapy Cloud runs the daily crawl, AWS Lambda + TiDB Cloud + Cloudflare R2 handle the rest.',
    language: 'Python',
    tech: ['Scrapy', 'Zyte Scrapy Cloud', 'AWS Lambda', 'FastAPI', 'TiDB Cloud', 'Cloudflare R2', 'React', 'Vite', 'Tailwind'],
    sourceUrl: 'https://github.com/Asciente-rks/judgement-cut',
    thumbnail: 'SystemPulse/LoginPage_SystemPulse.png', // placeholder until project screenshots exist
    gallery: [],
    architecture: {
      diagram: `GitHub Actions cron ──▶ Zyte Scrapy Cloud
daily 02:00 PHT          (1 spider scrapes 4 storefronts)
                            │ batched POST /internal/ingest
                            ▼
Cloudflare R2  ◄────  AWS Lambda (FastAPI + Mangum)
thumbnail mirror      ap-southeast-1, 256 MB, 30s
                       • 5-way parallel Steam regional API
                       • title-search fallback for missing
                         steamAppIDs
                       • 3-phase finalize: re-enrich, mark
                         stale, delete inactive
                       │ JWT-protected reads
                       ▼
                       TiDB Cloud Serverless
                       • MySQL-compatible
                       • 5 GB free tier`,
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
      tables: [
        {
          name: 'featured_deals',
          columns: [
            { name: 'deal_id', type: 'VARCHAR(100) UNIQUE', notes: 'CheapShark dealID, primary lookup key' },
            { name: 'title', type: 'VARCHAR(300)' },
            { name: 'store_id', type: 'VARCHAR(50)', notes: '"1"=Steam, "7"=GOG, "11"=Humble, "25"=Epic' },
            { name: 'price / normal_price', type: 'FLOAT', notes: 'USD prices from CheapShark' },
            { name: 'price_php / normal_price_php', type: 'DOUBLE', notes: 'native Steam PH prices (when available)' },
            { name: 'steam_app_id', type: 'VARCHAR(50)', notes: 'recovered via title-search if CheapShark didn\'t provide' },
            { name: 'is_active', type: 'TINYINT(1)', notes: 'flipped to 0 by finalize for stale rows, then deleted' },
          ],
        },
        {
          name: 'price_history',
          description: 'Every observed price for every deal. Survives featured_deals deletions so historical lookups keep working.',
          columns: [
            { name: 'deal_id', type: 'VARCHAR(100)', notes: 'foreign reference (no FK constraint)' },
            { name: 'price', type: 'FLOAT', notes: 'USD price at time of observation' },
            { name: 'recorded_at', type: 'DATETIME' },
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
  },

  // ------------------------------------------------------------------------------------
  // H100 ECOLODGE
  // ------------------------------------------------------------------------------------
  {
    slug: 'h100-ecolodge',
    title: 'H100 Ecolodge',
    role: 'Backend / Full-Stack',
    status: 'live',
    tagline:
      'A commercial booking engine for an ecolodge — built under zero-cost infrastructure constraints as the client requested.',
    summary:
      'Spring Boot + Spring Data JPA backend with MySQL on Aiven, vanilla HTML/CSS/JS on the customer-facing storefront, and a full admin panel for bookings, rooms, payments, and analytics.',
    language: 'Java',
    tech: ['Spring Boot', 'Spring Data JPA', 'MySQL', 'Aiven', 'HTML', 'CSS', 'JavaScript'],
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
      diagram: `Customer Browser            Admin Browser
 │ vanilla HTML/CSS/JS       │ admin panel UI
 │                           │
 ▼ HTTPS (REST + session)    ▼
 ──────────────────────────────────
 Spring Boot (Java)
  • Spring MVC controllers
  • Spring Data JPA repositories
  • Service layer + DTOs
  • Auth (session-based)
 ──────────────────────────────────
                │
                ▼
         MySQL (Aiven free tier)
          • bookings + rooms + halls
          • catering + branches
          • payments + payment_logs
          • reservation_logs + system_logs
          • users + employees`,
      notes: [
        'Zero-cost infrastructure constraint — chosen Aiven\'s free MySQL tier and a free-tier-friendly Java host instead of paid cloud DBs.',
        'Customer-facing storefront served as static HTML/CSS/JS — fast, no SPA build pipeline, easy to maintain for the client.',
        'Admin panel is a complete operations console: bookings, rooms, halls, catering, payments, payment logs, reservation logs, system logs, employee management, data analytics.',
        'Audit-trail tables (payment_logs, reservation_logs, system_logs) preserve every state change for forensic review.',
      ],
    },
    cost: {
      monthlyTotal: '$0/month',
      rows: [
        { service: 'Java host (Render / Railway / Aiven app)', freeTier: 'free-tier with sleep behavior', weUse: 'within free tier', headroom: 'within limits' },
        { service: 'MySQL (Aiven)', freeTier: 'Free DB tier', weUse: '<100 MB', headroom: '95%+' },
        { service: 'Static frontend hosting', freeTier: 'unlimited bandwidth on most providers', weUse: '<1 GB/mo', headroom: '99%' },
      ],
      rationale: [
        'Aiven free tier for MySQL — managed, zero ops, low risk for a commercial workload at this scale.',
        'Vanilla HTML/CSS/JS storefront — no SPA build, simple deploy, content updates by editing files.',
        'Spring Boot + Spring Data JPA — mature Java ecosystem, easy to hand off to another developer for client maintenance.',
      ],
    },
  },

  // ------------------------------------------------------------------------------------
  // NHC INTERNAL GYM
  // ------------------------------------------------------------------------------------
  {
    slug: 'nhc-internal-gym',
    title: 'NHC Internal Gym',
    role: 'Desktop',
    status: 'archived',
    tagline:
      'A custom desktop management solution for an internal gym — focused on high-performance local data handling, time tracking, and member search.',
    summary:
      '.NET Windows Forms application with SQL Server backend. Built for offline-first internal use where speed and reliability matter more than connectivity.',
    language: 'C#',
    tech: ['.NET Windows Forms', 'SQL Server', 'C#'],
    thumbnail: 'NHC/Login.png',
    gallery: [
      { src: 'NHC/Login.png', caption: 'Sign-in screen' },
      { src: 'NHC/SearchMember.png', caption: 'Member search' },
      { src: 'NHC/TimeTracking.png', caption: 'Time tracking' },
      { src: 'NHC/Inventory.png', caption: 'Inventory' },
      { src: 'NHC/Inventory2.png', caption: 'Inventory — detail view' },
    ],
    architecture: {
      diagram: `.NET Windows Forms (C#)
 │  • Sign-in / member search
 │  • Time tracking
 │  • Inventory management
 │  • Member CRUD
 ▼ ADO.NET / EF Core

SQL Server (local instance)
 • members + membership_plans
 • time_logs + sessions
 • inventory + categories
 • employees + audit_logs`,
      notes: [
        'Offline-first by design — internal gym workflow tolerates no network downtime, so the entire stack runs locally.',
        'Direct SQL access via ADO.NET / EF Core for sub-millisecond local queries.',
        'Modular form architecture — each operations area (members, time, inventory) is its own form module, easy to maintain.',
      ],
    },
    cost: {
      monthlyTotal: 'On-prem',
      rows: [
        { service: '.NET runtime (free)', freeTier: 'free, redistributable', weUse: 'embedded', headroom: 'n/a' },
        { service: 'SQL Server Express', freeTier: '10 GB DB size', weUse: '<500 MB', headroom: '95%' },
        { service: 'Windows host', freeTier: 'on-prem hardware', weUse: 'existing internal machine', headroom: 'n/a' },
      ],
      rationale: [
        'Internal gym workflow tolerates no internet downtime — chose offline-first .NET over a web stack.',
        'SQL Server Express over MySQL — first-class .NET tooling and the gym already had Windows infrastructure.',
      ],
    },
  },

  // ------------------------------------------------------------------------------------
  // THE LAST LIGHT
  // ------------------------------------------------------------------------------------
  {
    slug: 'the-last-light',
    title: 'The Last Light',
    role: 'Game Development',
    status: 'archived',
    tagline:
      "A tutorial-based 3D horror game from User1 Productions, extended with additional enemy AI, UI, accessibility features, and sound design for a more exciting gameplay loop.",
    summary:
      'Built on User1 Productions\' Unity 3D series. Extensions include a second enemy archetype, expanded HUD, options menu with rebindable controls, accessibility toggles, and a custom SFX/music pass.',
    language: 'C#',
    tech: ['Unity', 'Blender', 'VS Code'],
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
      diagram: `Unity 3D Project
 │  • C# scripts (player, AI, UI)
 │  • Prefabs (enemies, props)
 │  • ScriptableObjects (config)
 │  • Animator state machines
 ▼

Assets pipeline
 • Blender: zombie + props
 • Unity: textures, lighting, sound
 • Custom UI canvas + accessibility toggles

Build target: Windows standalone .exe`,
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
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
