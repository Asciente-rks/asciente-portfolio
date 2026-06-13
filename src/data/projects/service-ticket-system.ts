import type { Project } from "./types";

export const serviceTicketSystem: Project = {
  slug: 'service-ticket-system',
  title: 'Nexus Track',
  role: 'Full-Stack',
  status: 'live',
  tagline:
    'Multi-tenant QA/defect tracking SaaS — organizations split work into Collections (project spaces), each with its own board, approval workflow, and a built-in AI assistant that answers questions and flags duplicate tickets.',
  summary:
    'Nexus Track is a multi-tenant ticketing platform: every organization is an isolated workspace, and work is split into Collections (one per system/product) — each collection has its own dashboard, members pick from a per-collection platform/version catalog, and the AI assistant scopes itself to the active collection. Four roles (SUPER_ADMIN, ADMIN, TESTER, DEVELOPER) drive a six-status lifecycle (Open → In Progress → Ready for QA → Error Persists → Resolved → Closed) with status-driven auto-reassignment, multiple assignees per ticket, an immutable approval audit log, threaded comments + an activity timeline, teammate direct messaging, and an AI layer (conversational assistant, in-ticket Q&A, and deterministic duplicate detection) powered by Groq + Google Gemini with automatic rate-limit failover. The React 19 SPA runs on Vercel; the Express 4 API runs on AWS Lambda behind a Lambda Function URL (no API Gateway), deployed by GitHub Actions, backed by TiDB Cloud Serverless (MySQL).',
  language: 'TypeScript',
  tech: ['Express 4', 'AWS Lambda', 'Sequelize 6', 'TiDB Cloud (MySQL)', 'Groq', 'Gemini', 'React 19', 'Vite 8', 'Tailwind 4', 'GitHub Actions', 'Vercel'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js 20', 'TypeScript 5', 'Express 4', 'serverless-http', 'Sequelize 6', 'mysql2', 'JWT (jsonwebtoken)', 'bcryptjs', 'Yup', 'helmet', 'cors'],
    },
    {
      label: 'AI',
      items: ['Groq (primary)', 'Google Gemini (fallback)', 'OpenAI-compatible chat API', 'function-calling tools', 'duplicate detection', 'multi-provider rate-limit failover'],
    },
    {
      label: 'Database',
      items: ['TiDB Cloud Serverless', 'MySQL-compatible', 'UUID v4 PKs', 'runtime self-provisioning'],
    },
    {
      label: 'Frontend',
      items: ['React 19', 'TypeScript 5', 'Vite 8', 'Tailwind CSS 4', 'react-router-dom 7', 'axios', 'jwt-decode', 'lucide-react', 'ESLint 9'],
    },
    {
      label: 'Cloud · CI/CD',
      items: ['AWS Lambda + Function URL', 'EventBridge (SLA cron)', 'GitHub Actions (build → zip → deploy)', 'TiDB Cloud', 'Vercel (auto-deploy)'],
    },
  ],
  liveUrl: 'https://service-ticket-system-frontend.vercel.app/login',
  sourceUrl: 'https://github.com/Asciente-rks/service-ticket-system',
  cinematicUrl: '/cinematics/service-ticket-system',
  cinematicCaption:
    'A scene-by-scene walkthrough of Nexus Track — a multi-tenant QA tracker with per-collection workspaces, a six-status lifecycle, multiple assignees, platform/version tagging, and a built-in AI assistant. Click anywhere or press → / Space to advance.',
  thumbnail: 'ServiceTicket/Dashboard_NT.png',
  gallery: [
    { src: 'ServiceTicket/Login_NT.png', caption: 'Login · email-OTP onboarding' },
    { src: 'ServiceTicket/Collections_NT.png', caption: 'Collections · pick a project workspace (the high-level gate)' },
    { src: 'ServiceTicket/Dashboard_NT.png', caption: 'Dashboard · per-collection board, KPIs & AI duplicate banner' },
    { src: 'ServiceTicket/Create_Ticket_NT.png', caption: 'Create ticket · multiple assignees + platform/version' },
    { src: 'ServiceTicket/Edit_Ticket_NT.png', caption: 'Edit ticket · status, assignees, platform/version' },
    { src: 'ServiceTicket/Ticket_Details_NT.png', caption: 'Ticket detail · assignees, platform/version & approval' },
    { src: 'ServiceTicket/Thread_Discussion_NT.png', caption: 'Ticket detail · threaded comments + activity timeline' },
    { src: 'ServiceTicket/Ticket_Details_AI_NT.png', caption: 'In-ticket AI assistant · summarize & ask about one ticket' },
    { src: 'ServiceTicket/AI_Assist_NT.png', caption: 'In-ticket AI assistant · contextual answers' },
    { src: 'ServiceTicket/AI_Conversation_NT.png', caption: 'AI assistant · org/collection-scoped conversational queries' },
    { src: 'ServiceTicket/AI_Conversation_2_NT.png', caption: 'AI assistant · duplicate-ticket review with inline open/delete/keep' },
    { src: 'ServiceTicket/Approval_NT.png', caption: 'Approval · approve / reject with an audit comment' },
    { src: 'ServiceTicket/Chat_NT.png', caption: 'Conversations · teammate direct messaging' },
    { src: 'ServiceTicket/User_Management_NT.png', caption: 'Team · admin user management' },
    { src: 'ServiceTicket/Profile_NT.png', caption: 'Profile · self-service account settings' },
    { src: 'ServiceTicket/Settings_NT.png', caption: 'Settings · theme & preferences' },
  ],
  repos: [
    {
      name: 'service-ticket-system',
      url: 'https://github.com/Asciente-rks/service-ticket-system',
      stack: 'REST API · Express 4 + Sequelize 6 + TiDB (MySQL) on AWS Lambda',
    },
    {
      name: 'service-ticket-system-frontend',
      url: 'https://github.com/Asciente-rks/service-ticket-system-frontend',
      stack: 'Web SPA · React 19 + Vite 8 + Tailwind 4',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Browser["Browser SPA · Vercel<br/>React 19 + Vite 8 + Tailwind 4<br/>react-router 7 · jwt-decode · axios"]
    URL["Lambda Function URL<br/>auth-type NONE · public<br/>(no API Gateway)"]
    Lambda["AWS Lambda · Node 20<br/>Express 4 via serverless-http<br/>helmet · CORS · Sequelize 6"]
    AI["AI providers<br/>Groq (primary) → Gemini (fallback)<br/>OpenAI-compatible · tool calling"]
    TiDB[("TiDB Cloud Serverless · MySQL<br/>orgs · collections · users · tickets<br/>assignees · platform_versions · approvals<br/>comments · events · notifications · ai_*")]
    Actions["GitHub Actions<br/>build → zip → deploy"]
    Cron["EventBridge schedule<br/>daily SLA stale-ticket scan"]

    Browser -->|REST + JWT via axios| URL
    URL --> Lambda
    Lambda -->|TLS · lazy pooled conn| TiDB
    Lambda -->|chat completions| AI
    Actions -.deploys.-> Lambda
    Cron -.invokes.-> Lambda

    classDef edge fill:#0f1422,stroke:#6366f1,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#6366f1,color:#a5b4fc
    class Browser,URL,Lambda,AI,Actions,Cron edge
    class TiDB store`,
    notes: [
      'Express on Lambda, no always-on server — the same Express app is wrapped with serverless-http and exposed through a Lambda Function URL (auth NONE), so there is no API Gateway cost. Cold starts only wire model associations in-memory; Sequelize opens the DB connection lazily on first query and reuses it across warm invocations, so /health never touches the DB.',
      'Migrated from Render + hosted MySQL to AWS Lambda + TiDB Cloud Serverless — TiDB\'s HTTPS/TLS access suits Lambda\'s connection model (no VPC), and Function URLs add no per-request cost on top of the always-free Lambda tier.',
      'Runtime self-provisioning — feature tables (collections, ticket_assignees, platform_versions, ticket_platform_versions, ai_*) are created idempotently on first request via lightweight bootstrap guards, and mirrored in a hand-written idempotent migrate script run from a GitHub workflow. No destructive sync in production.',
      'Modular DDD-ish layout — each domain (tickets, users, collections, notifications, conversations, ai) keeps its own controllers / services / repositories / dtos / models / routes; cross-module wiring lives only in the associations file.',
      'GitHub Actions CI/CD — every push to main builds the TypeScript, packages dist + production node_modules into a zip, and creates/updates the function and its Function URL via the AWS CLI. The frontend auto-deploys to Vercel.',
      'Near-real-time without websockets — the dashboard refetches on an interval + window focus and reconciles the open ticket, and the ticket timeline/comments poll on a short cycle, so changes appear within seconds on Lambda\'s request/response model.',
    ],
    flows: [
      {
        title: 'Collections — the high-level workspace',
        blurb:
          'After login the user lands on the Collections picker. Choosing a collection scopes everything inside it — the dashboard, the per-collection platform/version catalog, and the AI assistant. Tickets never leak between collections.',
        mermaid: `flowchart LR
    login["Login / OTP onboarding"] --> pick["Collections picker<br/>(post-login gate)"]
    pick --> board["Collection dashboard<br/>scoped tickets + KPIs"]
    pick --> ai["AI assistant<br/>scoped to collection"]
    pick --> cat["Platform/version catalog<br/>per collection"]
    board --> ticket["Ticket<br/>assignees · platform/versions · comments"]
    cat -.feeds dropdown.-> ticket

    classDef tier fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef flow fill:#1f0f22,stroke:#a978ff,color:#e2c8ff
    class login,pick,board tier
    class ai,cat,ticket flow`,
        notes: [
          'Each Collection is a separate project space with its own dashboard and AI chat history — switching collections is a first-class action in the sidebar header.',
          'Admins curate a per-collection platform/version catalog (e.g. "Web · 1.1.0", "Mobile · 128.80.2"); members pick one or more when creating/updating a ticket via a searchable multi-select.',
        ],
      },
      {
        title: 'Role hierarchy & permissions',
        blurb:
          'Four roles with non-overlapping responsibilities. SUPER_ADMIN and ADMIN triage and approve; DEVELOPERs work tickets they are assigned; TESTERs own the tickets they reported. permissions.middleware.ts enforces this on every route, and assignment is gated by role on both create and update.',
        mermaid: `flowchart LR
    super["SUPER_ADMIN<br/>platform owner<br/>full access"]
    admin["ADMIN<br/>triage + manage users<br/>assign & update tickets"]
    dev["DEVELOPER<br/>work assigned tickets<br/>resolve defects"]
    tester["TESTER<br/>report defects<br/>track own tickets"]
    approval["Approval Flow<br/>SUPER_ADMIN or ADMIN<br/>approve / reject Ready-for-QA tickets"]

    super -->|create / delete / update users| admin
    super -->|approve / reject| approval
    admin -->|assign tickets to| dev
    admin -->|approve / reject| approval
    tester -.create tickets.-> super
    tester -.create tickets.-> admin
    dev -.update status to Ready for QA.-> approval

    classDef tier fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef flow fill:#1f0f22,stroke:#a978ff,color:#e2c8ff
    class super,admin,dev,tester tier
    class approval flow`,
        notes: [
          'SUPER_ADMIN: manage users (incl. ADMINs), create/update any ticket, approve/reject.',
          'ADMIN: same operational reach minus managing other ADMINs / SUPER_ADMINs.',
          'DEVELOPER & TESTER: scoped to their own work; assignment to SUPER_ADMINs is blocked, and each role can only assign within its permitted set.',
        ],
      },
      {
        title: 'Ticket lifecycle · multiple assignees',
        blurb:
          'A ticket flows from a tester report to an approver decision. A ticket can have several assignees; the single assigned_to column is kept as the primary/lifecycle owner, which status transitions auto-reassign (In Progress → the developer who picks it up, Ready for QA → back to the reporter).',
        mermaid: `sequenceDiagram
    autonumber
    actor Tester
    actor Admin
    actor Developer
    actor Approver
    participant API as Express on Lambda
    participant DB as TiDB (MySQL)

    Tester->>API: POST /tickets (title, desc, priority, assigneeIds[], platformVersionIds[])
    API->>DB: INSERT ticket (Open) + ticket_assignees + ticket_platform_versions
    API-->>Tester: 201 created

    Admin->>API: PATCH /tickets/:id (statusId=In Progress)
    API->>DB: primary owner → developer + notify assignees
    API-->>Admin: 200 updated

    Developer->>API: PATCH /tickets/:id (statusId=Ready for QA)
    API->>DB: primary owner → reporter + notify
    API-->>Developer: 200 ready for review

    Approver->>API: POST /tickets/:id/approval (status=Approved, comment)
    API->>DB: INSERT approval + ticket → Resolved + notify reporter
    API-->>Approver: 201 approval recorded

    Note over Approver,DB: On reject the ticket → Error Persists and the developer iterates.`,
        notes: [
          'Multiple assignees live in a ticket_assignees join table; assigned_to is the primary/lifecycle owner so status-driven reassignment, notifications and the timeline keep working.',
          'Every assignment, reassignment and status change is written to an immutable ticket_events timeline; approve/reject decisions are immutable approvals rows.',
        ],
      },
      {
        title: 'AI subsystem · assistant + duplicate detection',
        blurb:
          'A conversational assistant answers questions about the org/collection using read-only, tenant-scoped function-calling tools, and a deterministic duplicate detector flags tickets that describe the same issue. Both run on Groq first, failing over to Google Gemini on rate limits.',
        mermaid: `flowchart TB
    user["User · AI chat / dashboard banner"]
    agent["Agent loop<br/>tool calling (max 5 rounds)"]
    tools["Read-only tools<br/>query_tickets · get_ticket_details<br/>query_comments · query_activity<br/>find_duplicate_tickets · list_collections<br/>get_ticket_stats · list_team_members"]
    dup["Duplicate detector<br/>temperature 0 · cached per org+collection"]
    prov["Provider chain<br/>Groq → Gemini<br/>auto failover on 429"]
    DB[(TiDB · org-scoped reads)]

    user --> agent --> tools --> DB
    user --> dup --> prov
    agent --> prov

    classDef edge fill:#0f1422,stroke:#6366f1,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#6366f1,color:#a5b4fc
    class user,agent,tools,dup,prov edge
    class DB store`,
        notes: [
          'All AI tools are read-only and locked to the caller\'s organization — the assistant can never mutate data or cross tenants.',
          'Duplicate detection runs at temperature 0 so the dashboard banner and the "Verify with AI" chat always agree; results are cached per org+collection (positive hits longer, empty results briefly so the banner self-heals).',
          'The assistant references tickets as [ticket:id|title] tokens which the UI renders as clickable chips that open the ticket in an overlay — reviewers never leave the conversation.',
        ],
      },
    ],
  },
  database: {
    blurb:
      'TiDB Cloud Serverless (MySQL-compatible). UUID v4 primary keys throughout; DB columns are snake_case, model attributes camelCase via Sequelize field. Multi-assignee and per-ticket platform/version are modelled as join tables, with the single assigned_to / platform_version_id columns retained as the primary entries.',
    mermaid: `erDiagram
    ORGANIZATION ||--o{ USER : members
    ORGANIZATION ||--o{ COLLECTION : owns
    COLLECTION ||--o{ TICKET : groups
    COLLECTION ||--o{ PLATFORM_VERSION : catalog
    ROLE ||--o{ USER : assigned
    TICKET_STATUS ||--o{ TICKET : labels
    USER ||--o{ TICKET : reports
    USER ||--o{ TICKET : "primary assignee"
    TICKET ||--o{ TICKET_ASSIGNEE : assignees
    USER ||--o{ TICKET_ASSIGNEE : on
    TICKET ||--o{ TICKET_PLATFORM_VERSION : tagged
    PLATFORM_VERSION ||--o{ TICKET_PLATFORM_VERSION : used
    TICKET ||--o{ APPROVAL : audited
    TICKET ||--o{ TICKET_COMMENT : discussion
    TICKET ||--o{ TICKET_EVENT : timeline
    USER ||--|| NOTIFICATION_SETTINGS : has
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ AI_CONVERSATION : owns
    AI_CONVERSATION ||--o{ AI_MESSAGE : contains

    TICKET {
        uuid id PK
        uuid organization_id FK
        uuid collection_id FK
        string title
        text description
        uuid reported_by FK
        uuid assigned_to FK "primary owner"
        uuid platform_version_id FK "primary"
        uuid status_id FK
        string priority
    }
    TICKET_ASSIGNEE {
        uuid id PK
        uuid ticket_id FK
        uuid user_id FK
        uuid organization_id FK
    }
    PLATFORM_VERSION {
        uuid id PK
        uuid collection_id FK
        string platform
        string version
    }
    AI_CONVERSATION {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        uuid collection_id FK
        string title
    }`,
    tables: [
      {
        name: 'collections',
        description: 'Project spaces within an organization — each is a separate dashboard / AI scope.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'organization_id', type: 'UUID (FK)' },
          { name: 'name', type: 'VARCHAR(120)' },
          { name: 'description', type: 'TEXT', notes: 'nullable' },
          { name: 'created_by', type: 'UUID (FK)', notes: 'nullable' },
        ],
      },
      {
        name: 'tickets',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'organization_id', type: 'UUID (FK)' },
          { name: 'collection_id', type: 'UUID (FK → collections.id)' },
          { name: 'title', type: 'TEXT' },
          { name: 'description', type: 'TEXT' },
          { name: 'reported_by', type: 'UUID (FK → users.id)' },
          { name: 'assigned_to', type: 'UUID (FK → users.id)', notes: 'nullable · primary/lifecycle owner' },
          { name: 'platform_version_id', type: 'UUID (FK)', notes: 'nullable · primary platform/version' },
          { name: 'status_id', type: 'UUID (FK → ticket_statuses.id)' },
          { name: 'priority', type: 'VARCHAR', notes: 'Low / Medium / High' },
        ],
      },
      {
        name: 'ticket_assignees',
        description: 'Many-to-many: the full assignee set for a ticket (assigned_to remains the primary).',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'ticket_id', type: 'UUID (FK)' },
          { name: 'user_id', type: 'UUID (FK)' },
          { name: 'organization_id', type: 'UUID (FK)', notes: 'unique (ticket_id, user_id)' },
        ],
      },
      {
        name: 'platform_versions',
        description: 'Per-collection build catalog (e.g. "Web · 1.1.0"); tickets reference one or more.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'collection_id', type: 'UUID (FK)' },
          { name: 'platform', type: 'VARCHAR(60)' },
          { name: 'version', type: 'VARCHAR(60)', notes: 'unique (collection_id, platform, version)' },
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
          { name: 'comment', type: 'TEXT', notes: 'part of the audit trail' },
        ],
      },
      {
        name: 'ticket_events',
        description: 'Immutable activity timeline — reported, assigned, reassigned, status_changed, approved, rejected.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'ticket_id', type: 'UUID (FK)' },
          { name: 'actor_id', type: 'UUID (FK)', notes: 'nullable' },
          { name: 'type', type: 'VARCHAR' },
          { name: 'from_value / to_value', type: 'VARCHAR', notes: 'nullable' },
        ],
      },
      {
        name: 'ai_conversations / ai_messages',
        description: 'Per-user AI chat threads (scoped per collection) and their messages, incl. ticket refs + duplicate-group metadata.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'organization_id', type: 'UUID (FK)' },
          { name: 'user_id', type: 'UUID (FK)' },
          { name: 'collection_id', type: 'UUID (FK)', notes: 'nullable · org-wide when null' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda + Function URL', freeTier: '1M requests + 400k GB-s / mo (always-free)', weUse: 'portfolio traffic', headroom: '99%+' },
      { service: 'AWS EventBridge', freeTier: '14M scheduled invocations / mo', weUse: '~1 / day (SLA scan)', headroom: '~100%' },
      { service: 'TiDB Cloud Serverless (MySQL)', freeTier: '5 GB storage + generous RUs', weUse: '<50 MB', headroom: '99%+' },
      { service: 'Groq + Google Gemini', freeTier: 'free-tier RPM/RPD per model', weUse: 'cached, low volume', headroom: 'failover across providers' },
      { service: 'Vercel Hobby (frontend)', freeTier: '100 GB bandwidth, unlimited deploys', weUse: '<500 MB/mo', headroom: '99.5%' },
      { service: 'GitHub Actions (public repo)', freeTier: 'unlimited minutes', weUse: 'CI/CD deploys', headroom: 'unlimited' },
    ],
    rationale: [
      'Lambda Function URL over API Gateway — Function URLs add no cost on top of Lambda\'s always-free tier; API Gateway bills per request after its 12-month free window.',
      'TiDB Cloud Serverless — MySQL-compatible with HTTPS/TLS access that fits Lambda\'s connection model (no VPC) and a generous always-free tier.',
      'Two AI providers — Groq leads on speed and daily quota; Gemini is the cross-provider fallback, so a single provider\'s rate limit never takes the AI features down.',
      'bcryptjs / mysql2 / serverless-http — all pure JS, so the same zip runs on the Amazon Linux Lambda runtime with no native build step.',
    ],
  },
  apiEndpoints: [
    { method: 'POST', path: '/auth/register', auth: 'none', purpose: 'Start sign-up — sends a 6-digit email OTP' },
    { method: 'POST', path: '/auth/verify-otp', auth: 'none', purpose: 'Verify the OTP → short-lived registration token' },
    { method: 'POST', path: '/auth/set-password', auth: 'none', purpose: 'Finish sign-up → creates the account, returns JWT' },
    { method: 'POST', path: '/auth/login', auth: 'none', purpose: 'Email + password → JWT' },
    { method: 'POST', path: '/organizations', auth: 'session', purpose: 'Create an org (caller becomes SuperAdmin); re-issues JWT' },
    { method: 'POST', path: '/organizations/join', auth: 'session', purpose: 'Join an org via invite code; re-issues JWT' },
    { method: 'GET', path: '/collections', auth: 'session + org', purpose: 'List collections with ticket counts' },
    { method: 'POST', path: '/collections', auth: 'session + admin', purpose: 'Create a collection (project space)' },
    { method: 'GET', path: '/collections/:id/platform-versions', auth: 'session + org', purpose: "List a collection's platform/version catalog" },
    { method: 'POST', path: '/collections/:id/platform-versions', auth: 'session + admin', purpose: 'Add a platform/version to the catalog' },
    { method: 'GET', path: '/tickets', auth: 'session + org', purpose: 'List tickets (collection-scoped, no-store)' },
    { method: 'POST', path: '/tickets', auth: 'session + org', purpose: 'Create a ticket with assigneeIds[] + platformVersionIds[]' },
    { method: 'PATCH', path: '/tickets/:id', auth: 'session + org', purpose: 'Update status / assignees / platform-versions / details' },
    { method: 'POST', path: '/tickets/:id/approval', auth: 'session + SUPER_ADMIN / ADMIN', purpose: 'Approve (→ Resolved) or reject (→ Error Persists)' },
    { method: 'GET', path: '/tickets/:id/comments', auth: 'session + org', purpose: 'Threaded comments for a ticket' },
    { method: 'GET', path: '/tickets/:id/history', auth: 'session + org', purpose: 'Activity timeline (events) for a ticket' },
    { method: 'GET', path: '/notifications', auth: 'session + org', purpose: 'List notifications for the current user' },
    { method: 'GET', path: '/conversations', auth: 'session + org', purpose: 'Direct-message threads (polled for real-time)' },
    { method: 'GET', path: '/ai/duplicates', auth: 'session + org', purpose: 'Cached duplicate-ticket detection (dashboard banner)' },
    { method: 'POST', path: '/ai/conversations/:id/messages', auth: 'session + org', purpose: 'Send a message; runs the tool-calling agent loop' },
    { method: 'POST', path: '/ai/tickets/:ticketId/ask', auth: 'session + org', purpose: 'Stateless in-ticket assistant (summarize / Q&A)' },
    { method: 'GET', path: '/health', auth: 'none', purpose: '{ status: "UP", service, timestamp } — never touches the DB' },
  ],
  conversion: {
    summary:
      'Nexus Track started life as a Render-hosted Express service on a free hosted MySQL (Aiven / FreeSQLDatabase) with an in-process node-cron worker. It was migrated to AWS Lambda + TiDB Cloud Serverless: the same Express app now runs serverless behind a Lambda Function URL, the SLA cron became a scheduled EventBridge invocation, and the database moved to TiDB\'s HTTPS-accessible serverless MySQL — keeping the whole stack at $0/month while removing the always-on dyno and its cold-sleep.',
    mermaid: `flowchart LR
    subgraph Before["Before · Render"]
      R["Render Web Service<br/>always-on dyno (sleeps 15m)"]
      RC["node-cron in-process"]
      RM[("Hosted MySQL<br/>Aiven / FreeSQLDatabase")]
      R --> RM
      R -.-> RC
    end
    subgraph After["After · AWS"]
      L["AWS Lambda + Function URL<br/>Express via serverless-http"]
      E["EventBridge schedule<br/>daily SLA scan"]
      T[("TiDB Cloud Serverless<br/>MySQL · HTTPS/TLS")]
      L --> T
      E -.invokes.-> L
    end
    Before ==>|migrated| After

    classDef before fill:#1f0f12,stroke:#f87171,color:#fecaca
    classDef after fill:#0a0e1a,stroke:#5eead4,color:#a7f3d0
    class R,RC,RM before
    class L,E,T after`,
    changes: [
      { before: 'Render Web Service (always-on, sleeps after 15 min)', after: 'AWS Lambda behind a Lambda Function URL (no API Gateway)' },
      { before: 'Hosted MySQL (Aiven / FreeSQLDatabase)', after: 'TiDB Cloud Serverless (MySQL-compatible, HTTPS/TLS)' },
      { before: 'node-cron running inside the dyno', after: 'EventBridge scheduled invocation of the same function' },
      { before: 'Auto-seed on boot for fresh deploys', after: 'Runtime self-provisioning + idempotent migrate workflow (no boot seed in prod)' },
      { before: 'Single hosted process', after: 'Stateless, request-scoped invocations with a lazily-pooled DB connection reused across warm starts' },
    ],
    notes: [
      'serverless-http wraps the existing Express app unchanged — routes, middleware and validation are identical between local (npm run dev) and Lambda.',
      'No VPC required: TiDB Cloud is reached over TLS, so the function stays on the public path and avoids NAT/VPC cost and cold-start penalties.',
      'GitHub Actions builds, zips (dist + prod node_modules) and deploys on every push to main; a separate manual workflow runs the idempotent DB migration + seed.',
    ],
  },
};
