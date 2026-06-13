import type { Project } from "./types";

export const systemPulse: Project = {
  slug: 'system-pulse',
  title: 'System Pulse',
  role: 'Cloud Native Backend',
  status: 'live',
  tagline:
    'A multi-tenant uptime + health-check SaaS. Self-serve registration with email-OTP, organization tenancy, granular per-user permissions, and a demo mode with editable permission templates — all running on AWS free-tier forever.',
  summary:
    'Real SaaS shape: superadmin → owner → admin → user role hierarchy with granular permission toggles, suspend/delete flows with reason+notes+email, account lockout, profile self-service, SSRF-safe URL probes, and Render cold-start handling via SQS re-enqueue. Two Lambdas sharing one codebase, single-table DynamoDB with 3 GSIs.',
  language: 'TypeScript',
  tech: ['TypeScript', 'Node.js 20', 'AWS Lambda', 'DynamoDB', 'SQS', 'SNS', 'React 18', 'Vite 5', 'Tailwind CSS 4', 'Vercel'],
  techGroups: [
    {
      label: 'Backend',
      items: ['TypeScript', 'Node.js 20 (ESM)', 'Custom HTTP router (~150 LOC)', '@aws-sdk/lib-dynamodb v3', 'Yup + validator (shared FE+BE)', 'scrypt password hashing', 'nodemailer', 'SMTP', 'SSRF guard (loopback, RFC1918, link-local, CGNAT, IPv6)'],
    },
    {
      label: 'Cloud · AWS',
      items: ['AWS Lambda (api + worker)', 'Lambda Function URL', 'DynamoDB (single-table + 3 GSIs + TTL on 4 entity types)', 'SQS + Dead-Letter Queue + delayed re-enqueue', 'SNS', 'CloudWatch Logs', 'IAM (inline scoped policy)', 'KMS (optional)'],
    },
    {
      label: 'Frontend',
      items: ['React 18', 'TypeScript 5', 'Vite 5', 'Tailwind CSS 4', 'react-router-dom 6', 'Live PasswordChecklist (validator-backed)', 'Real-time polling (4s/10s)', 'Mermaid diagrams (in repo README)'],
    },
    {
      label: 'Hosting · CI/CD',
      items: ['Vercel (frontend)', 'AWS ap-southeast-1', 'GitHub Actions (idempotent deploy workflow)', 'Env-gated seed (no creds in source)'],
    },
  ],
  liveUrl: 'https://system-pulse-sn3w.vercel.app/login',
  sourceUrl: 'https://github.com/Asciente-rks/system-pulse',
  cinematicUrl: '/cinematics/system-pulse',
  cinematicCaption:
    'An 8-scene walkthrough of System Pulse — the multi-tenant uptime + health-check platform running on AWS free tier forever. Click anywhere or press → / Space to advance.',
  thumbnail: 'SystemPulse/LoginPage_SystemPulse.png',
  gallery: [
    { src: 'SystemPulse/LoginPage_SystemPulse.png', caption: 'Tabbed login · sign in / forgot / sign up' },
    { src: 'SystemPulse/SystemTrigger_SystemPulse.png', caption: 'On-demand health probe with real-time polling' },
    { src: 'SystemPulse/Logs_SP.png', caption: 'Rolling 30-day probe history (auto-refreshing)' },
    { src: 'SystemPulse/ManageUsers_SP.png', caption: 'User management — invites + role filter + suspend/unlock' },
    { src: 'SystemPulse/EditUser_SP.png', caption: 'Edit user · system access + permission toggles' },
  ],
  repos: [
    {
      name: 'system-pulse',
      url: 'https://github.com/Asciente-rks/system-pulse',
      stack: 'Monorepo · TypeScript backend (AWS Lambda + DynamoDB) + React + Vite frontend',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
    Browser["Browser<br/>React + Vite + Tailwind"]
    LambdaAPI["AWS Lambda<br/>system-pulse-api<br/>custom HTTP router"]
    LambdaWorker["AWS Lambda<br/>health-worker<br/>async probes + recheck"]
    SQS[("SQS Queue<br/>+ Dead-Letter Queue")]
    SNS["SNS Topic<br/>opt-in alerts"]
    DDB[("DynamoDB single table<br/>USER · ORG · SYSTEM · HEALTH_LOG<br/>+ OTP records · 3 GSIs · TTL")]
    SMTP["SMTP / nodemailer<br/>OTP · invites · welcome · reset ·<br/>suspend · delete"]
    Target["Monitored URL<br/>any service"]

    Browser -->|REST + headers| LambdaAPI
    LambdaAPI --> SMTP
    LambdaAPI --> DDB
    LambdaAPI -->|sqs or direct invoke| SQS
    LambdaAPI -.direct invoke.-> LambdaWorker
    SQS --> LambdaWorker
    LambdaWorker -->|GET /health then GET /| Target
    LambdaWorker --> DDB
    LambdaWorker -.optional.-> SNS
    LambdaWorker -.re-enqueue + delay.-> SQS

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Browser,LambdaAPI,LambdaWorker,SMTP,SNS,Target edge
    class SQS,DDB store`,
    notes: [
      'Real SaaS hierarchy: superadmin → owner → admin → user, with eight per-user permission toggles (canCreateUser / canDeleteSystem / canUpdateUser / etc.). Owners flip them per user; only owners can grant the dangerous three.',
      'Self-serve registration → email OTP → owner account + free org. Validation runs through validator.isStrongPassword and validator.isEmail; the live PasswordChecklist on the frontend reflects exactly what the API will accept.',
      'Render wake-up via SQS re-enqueue, not in-Lambda sleep. The worker exits cleanly after attempt 1; a second invocation runs after DelaySeconds=90. Lambda compute dropped from ~95s to ~10s per Render probe.',
      'Render-aware HTTP timeout (15s for render mode, 5s for standard) eliminates false-positive DOWNs caused by cold-start latency.',
      'SSRF-safe probes: validator.isURL + IP-range deny-list (loopback, RFC1918, link-local 169.254/16 → AWS metadata, CGNAT, IPv6 unique-local). Enforced at create time and every probe.',
      'Demo templates — two no-login USER records (demo-template-admin / demo-template-user) live in the demo org. Their permissions field is the source of truth for fresh demo sessions; superadmin edits them via the standard user-edit modal.',
      'Suspend / delete flows: dropdown reason + free-text notes + automatic email to the affected owner / user. Org delete is a hard cascade (users + systems + logs + org); org suspend is a soft state honoured at login.',
      'Account lockout: 3 consecutive failed logins → status 423; admin/owner with canUpdateUser can unlock after a password-confirm. The Suspend flow itself is rate-limited and click-spam-guarded with a useRef Set so React batching cannot fire two emails on a double click.',
    ],
    flows: [
      {
        title: 'Role hierarchy & permissions',
        blurb:
          'Four roles, eight per-user permission toggles, plus the demo-template wiring. Superadmin edits the templates; admins flip the safe permissions; only owners can grant the three dangerous ones (delete user, delete system, update user).',
        mermaid: `flowchart LR
    super["Superadmin<br/>platform owner<br/>cross-org reach"]
    owner["Owner<br/>org creator<br/>all permissions on"]
    admin["Admin<br/>permissions toggleable<br/>by owner"]
    user["User<br/>trigger + view logs<br/>on assigned systems"]
    template["Demo Templates<br/>editable permission<br/>presets for demo mode"]
    demo[("Ephemeral<br/>Demo Sessions")]

    super -->|suspend / delete /<br/>cross-org admin| owner
    owner -->|create / promote /<br/>demote / delete| admin
    owner -->|create / suspend /<br/>delete + permission grant| user
    admin -.permission gated.-> user
    super -.edits.-> template
    template -.applied to.-> demo

    classDef tier fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef demoStyle fill:#1f0f22,stroke:#a978ff,color:#e2c8ff
    class super,owner,admin,user tier
    class template,demo demoStyle`,
        notes: [
          'Owners always carry every permission regardless of what is stored — owner role is unambiguous.',
          'Admins can flip safe permissions (canCreateUser, canCreateSystem, canUpdateSystem, canTriggerHealthChecks, canViewLogs) on users they invite. Owners exclusively grant the dangerous three (canDeleteUser, canDeleteSystem, canUpdateUser).',
          'Demo templates carry the same UserPermissions shape — editing them tunes future demo sessions without touching code.',
        ],
      },
      {
        title: 'Self-serve registration · multi-tenant entry point',
        blurb:
          'New owners self-register with an OTP-verified email. Verifying the OTP creates the org + the active owner row in one transaction and emails a welcome — but does not auto-login. The user signs in with their new password fresh.',
        mermaid: `sequenceDiagram
    autonumber
    actor User
    participant SPA as React SPA
    participant API as Lambda /auth/register/*
    participant DDB as DynamoDB
    participant SMTP as Email

    User->>SPA: Submit email + password + org name
    SPA->>API: POST /auth/register/start
    API->>DDB: PutCommand REGISTER_OTP (TTL 10 min)
    API->>SMTP: 6-digit OTP email
    SMTP-->>User: OTP code
    User->>SPA: Enter OTP
    SPA->>API: POST /auth/register/verify
    API->>DDB: Create ORG + active owner USER
    API->>SMTP: Welcome email
    API-->>SPA: 201 + org + user payload
    SPA-->>User: "Account created — sign in to continue"
    Note right of SPA: NO auto-login. User must authenticate with their new password.`,
        notes: [
          'OTP brute-force capped at 6 attempts, hashed at rest, 30s resend cooldown, 5 resends max.',
          'Email enumeration on register is intentionally surfaced — 409 "already registered" with inline Sign in / Forgot password CTAs (per product brief).',
        ],
      },
      {
        title: 'Account lockout & unlock',
        blurb:
          'Three consecutive failed logins flips the user to a locked state — every subsequent attempt returns HTTP 423 until an admin or owner with canUpdateUser unlocks the account. Unlock requires the actor\'s password as a confirmation step.',
        mermaid: `stateDiagram-v2
    [*] --> Active
    Active --> Active: successful login<br/>resets failedLoginAttempts
    Active --> FailedOnce: wrong password
    FailedOnce --> FailedTwice: wrong password
    FailedTwice --> Locked: 3rd wrong password<br/>sets lockedAt
    Locked --> Locked: any login returns 423
    Locked --> Active: admin unlock endpoint<br/>actor password confirm`,
      },
      {
        title: 'Demo mode · ephemeral sessions from editable templates',
        blurb:
          'Demo sessions are real ephemeral USER rows seeded from two no-password template records (demo-template-admin / demo-template-user). The superadmin edits the template via the standard user-edit modal; the next demo click reads the new permissions. Sessions auto-clean via DynamoDB TTL.',
        mermaid: `flowchart LR
    Click["Click 'Try demo mode'<br/>pick admin or user"]
    DS["POST /auth/demo<br/>{ role }"]
    Tpl["Look up demo-template-{role}<br/>(auto-create on first call)"]
    Demo[("Ephemeral USER row<br/>orgId=demo · demoMode=true<br/>TTL 1h · expiresAt set")]
    SPA["SPA signs in with<br/>demoMode=true"]
    Edit["Superadmin edits<br/>demo-template-admin or<br/>demo-template-user"]

    Click --> DS
    DS --> Tpl
    Tpl --> Demo
    Demo --> SPA
    Edit -.controls.-> Tpl

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    classDef demoStyle fill:#1f0f22,stroke:#a978ff,color:#e2c8ff
    class Click,DS,SPA,Edit edge
    class Demo store
    class Tpl demoStyle`,
        notes: [
          'rejectIfDemo() blocks every destructive endpoint at the actor-auth layer — demo sessions cannot delete or mutate other users.',
          'Templates have isDemoTemplate: true and no passwordHash, so they cannot log in directly and cannot be deleted (server-enforced).',
          'Edit-and-go cycle: superadmin opens Platform → Demo org → Settings on the template → tweak → Save. Next demo click reflects the change. No redeploy.',
        ],
      },
    ],
  },
  database: {
    blurb:
      'DynamoDB single-table design. One table holds organizations, users, systems, invites, password-reset tokens, registration OTPs, email-change OTPs, demo templates, and health logs — all distinguished by an entityType attribute and PK/SK prefixes. Three GSIs cover the read patterns; TTL auto-purges OTPs (10 min), demo sessions (1 h), and health logs (30 days).',
    mermaid: `erDiagram
    ORG ||--|{ USER : "members"
    ORG ||--o{ SYSTEM : "monitors"
    USER ||--o{ HEALTH_LOG : "triggers"
    SYSTEM ||--o{ HEALTH_LOG : "probe results"

    ORG {
        string id PK
        string name
        string ownerId
        string status_
        boolean isDemo
        boolean isInternal
        string suspendedReason
        string suspendedNotes
    }
    USER {
        string id PK
        string email UK
        string role
        string orgId FK
        string status_
        string passwordHash
        list allowedSystemIds
        object permissions
        boolean isDemoTemplate
        boolean demoMode
        number failedLoginAttempts
        string lockedAt
        string suspendedReason
    }
    SYSTEM {
        string id PK
        string name
        string url
        string deploymentMode
        string orgId FK
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
    }
    REGISTER_OTP {
        string email PK
        string passwordHash
        string fullName
        string orgName
        string otpHash
        number expiresAt
        number attempts
    }
    EMAIL_CHANGE_OTP {
        string userId PK
        string newEmail
        string otpHash
        number expiresAt
    }`,
    tables: [
      {
        name: 'ORG',
        description: 'PK: ORG, SK: ORG#<id> · Tenant boundary for every system + user',
        columns: [
          { name: 'id', type: 'String', notes: 'UUID (or "demo" / "platform" sentinels)' },
          { name: 'name', type: 'String' },
          { name: 'ownerId', type: 'String', notes: 'Pointer to the owning USER' },
          { name: 'status_', type: 'String', notes: 'Active / Suspended (login.ts honors)' },
          { name: 'isDemo', type: 'Boolean', notes: 'true for the platform-owned demo org' },
          { name: 'isInternal', type: 'Boolean', notes: 'true for the superadmin platform org (filtered out of customer lists)' },
          { name: 'suspendedReason', type: 'String', notes: 'Dropdown selection from the suspend modal' },
          { name: 'suspendedNotes', type: 'String', notes: 'Free-text moderator notes; included in owner email' },
        ],
      },
      {
        name: 'USER',
        description: 'PK: USER, SK: USER#<id> · Includes demo templates (no passwordHash, isDemoTemplate=true)',
        columns: [
          { name: 'id', type: 'String', notes: 'UUID' },
          { name: 'email', type: 'String', notes: 'unique-ish (enforced at app layer)' },
          { name: 'role', type: 'String', notes: 'superadmin / owner / admin / user / tester' },
          { name: 'orgId', type: 'String', notes: 'Tenant key — every list endpoint filters by this' },
          { name: 'status_', type: 'String', notes: 'Active / Pending / Suspended' },
          { name: 'permissions', type: 'Object', notes: '8 granular flags · owners always carry every one' },
          { name: 'allowedSystemIds', type: 'List<String>', notes: 'per-user system access list' },
          { name: 'isDemoTemplate', type: 'Boolean', notes: 'true for demo-template-admin / demo-template-user · cannot be deleted' },
          { name: 'demoMode', type: 'Boolean', notes: 'true for ephemeral demo sessions' },
          { name: 'failedLoginAttempts', type: 'Number', notes: 'increments on bad password; reset on success' },
          { name: 'lockedAt', type: 'String', notes: 'ISO timestamp · 3 strikes → set; admin unlock removes' },
          { name: 'suspendedReason', type: 'String', notes: 'Set on suspend; surfaces in audit + email' },
        ],
      },
      {
        name: 'SYSTEM',
        description: 'PK: SYSTEM, SK: SYS#<uuid> · Org-scoped via orgId',
        columns: [
          { name: 'id', type: 'String' },
          { name: 'name', type: 'String' },
          { name: 'url', type: 'String', notes: 'monitored URL · validated against SSRF deny-list' },
          { name: 'deploymentMode', type: 'String', notes: 'render (15s timeout, 90s recheck) / standard (5s)' },
          { name: 'orgId', type: 'String', notes: 'Tenant key' },
          { name: 'status', type: 'String', notes: 'UP / DOWN / UNKNOWN' },
          { name: 'lastChecked', type: 'String', notes: 'ISO of last probe' },
          { name: 'responseTimeMs', type: 'Number' },
        ],
      },
      {
        name: 'HEALTH_LOG',
        description: 'PK: SYSTEM#<id>, SK: LOG#<iso-time>#<attempt> · TTL 30 days',
        columns: [
          { name: 'systemId', type: 'String', notes: 'parent system UUID' },
          { name: 'status', type: 'String' },
          { name: 'checkedAt', type: 'String' },
          { name: 'responseCode', type: 'Number' },
          { name: 'responseTimeMs', type: 'Number' },
          { name: 'attempt', type: 'Number', notes: '1 or 2 for Render wake-up rechecks' },
          { name: 'triggerSource', type: 'String', notes: 'manual / system-create / queue / delayed-recheck' },
          { name: 'expiresAt', type: 'Number', notes: 'unix epoch — DynamoDB TTL prunes at 30 days' },
        ],
      },
      {
        name: 'REGISTER_OTP / EMAIL_CHANGE_OTP',
        description: 'OTP records · TTL 10 minutes · brute-force capped at 6 attempts',
        columns: [
          { name: 'email / userId', type: 'String', notes: 'primary lookup key' },
          { name: 'otpHash', type: 'String', notes: 'sha256 of the 6-digit code' },
          { name: 'expiresAt', type: 'Number', notes: 'epoch seconds · DDB TTL field' },
          { name: 'attempts', type: 'Number', notes: 'bumped on bad code; verify endpoint deletes the record at 6' },
          { name: 'resendCount', type: 'Number', notes: 'capped at 5 per registration; 30s cooldown between sends' },
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
      'SQS + DLQ over a self-hosted queue — built-in retry/DLQ semantics and delayed re-enqueue let the Render wake-up workflow ditch in-Lambda sleeps. Compute drops from ~95s to ~10s per Render probe.',
      'Two Lambdas, no API Gateway — Function URLs are free; API Gateway has its own per-million pricing tier.',
      'Vercel over self-hosting — global CDN, automatic deploys, free SSL, custom domains.',
      'TTL on every short-lived entity — registration OTPs (10 min), email-change OTPs (10 min), demo session users (1 h), health logs (30 days). Zero ops cost, no cron.',
      'Idempotent CI/CD — re-running the deploy workflow on a fresh AWS account stands up the entire system from scratch in ~3 minutes.',
    ],
  },
  apiEndpoints: [
    { method: 'POST', path: '/auth/register/start', auth: 'none', purpose: 'Validate + send 6-digit OTP to a new email' },
    { method: 'POST', path: '/auth/register/verify', auth: 'OTP', purpose: 'Provision an org + active owner account' },
    { method: 'POST', path: '/auth/login', auth: 'none', purpose: 'Email + password → session payload (with permissions)' },
    { method: 'POST', path: '/auth/demo', auth: 'none', purpose: 'Spawn ephemeral demo admin / user from live template permissions' },
    { method: 'POST', path: '/me/password', auth: 'session + current pwd', purpose: 'Rotate password (also clears any failed-login lockout)' },
    { method: 'POST', path: '/me/email/start', auth: 'session + password', purpose: 'Send OTP to a new email' },
    { method: 'POST', path: '/me/email/verify', auth: 'session + OTP', purpose: 'Commit the email change' },
    { method: 'POST', path: '/users/invite', auth: 'canCreateUser', purpose: 'Email an invite link to a teammate' },
    { method: 'POST', path: '/users/:id/systems', auth: 'canUpdateUser', purpose: "Replace a user's allowedSystemIds access list" },
    { method: 'POST', path: '/users/:id/permissions', auth: 'canUpdateUser', purpose: 'System access + status + permission toggles in one call' },
    { method: 'POST', path: '/users/:id/role', auth: 'owner', purpose: 'Promote / demote within the org' },
    { method: 'POST', path: '/users/:id/unlock', auth: 'canUpdateUser + pwd', purpose: 'Clear failed-login lockout' },
    { method: 'DELETE', path: '/users/:id', auth: 'canDeleteUser + pwd', purpose: 'Permanent delete + email user (reason / notes)' },
    { method: 'GET', path: '/orgs', auth: 'superadmin', purpose: 'Cross-org platform view (member + system counts)' },
    { method: 'POST', path: '/orgs/:id/suspend', auth: 'superadmin', purpose: 'Suspend org + email owner (reason + notes)' },
    { method: 'DELETE', path: '/orgs/:id', auth: 'superadmin + pwd', purpose: 'Hard cascade wipe (users + systems + logs)' },
    { method: 'POST', path: '/systems', auth: 'canCreateSystem', purpose: 'Register a system + initial probe (SSRF-validated)' },
    { method: 'PATCH', path: '/systems/:id', auth: 'canUpdateSystem', purpose: 'Edit name / URL / deployment mode' },
    { method: 'POST', path: '/systems/:id/trigger', auth: 'canTriggerHealthChecks', purpose: 'Queued on-demand probe' },
    { method: 'GET', path: '/systems/:id/logs', auth: 'canViewLogs', purpose: 'Recent probe history (auto-refreshing in UI)' },
  ],
};

