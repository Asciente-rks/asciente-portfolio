import type { Project } from "./types";

export const systemPulse: Project = {
  slug: 'system-pulse',
  title: 'System Pulse',
  role: 'Cloud Native Backend',
  status: 'live',
  tagline:
    'A self-hosted uptime and health-check platform. Probes monitored URLs from AWS Lambda, fans out via SQS, and tracks 30 days of rolling history in DynamoDB.',
  summary:
    'Invite-based onboarding, per-user system access lists, three-tier role model, and a built-in Render wake-up mode for monitoring sleeping free-tier services. Two Lambdas sharing one codebase, single-table DynamoDB, three GSIs.',
  language: 'TypeScript',
  tech: ['TypeScript', 'Node.js 20', 'AWS Lambda', 'DynamoDB', 'SQS', 'SNS', 'React 18', 'Vite 5', 'Tailwind CSS 4', 'Vercel'],
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
  liveUrl: 'https://system-pulse-sn3w.vercel.app/login',
  sourceUrl: 'https://github.com/Asciente-rks/system-pulse',
  thumbnail: 'SystemPulse/LoginPage_SystemPulse.png',
  gallery: [
    { src: 'SystemPulse/LoginPage_SystemPulse.png', caption: 'Invite-only login' },
    { src: 'SystemPulse/SystemTrigger_SystemPulse.png', caption: 'On-demand health probe' },
    { src: 'SystemPulse/Logs_SP.png', caption: 'Rolling 30-day probe history' },
    { src: 'SystemPulse/ManageUsers_SP.png', caption: 'User management — invites + access lists' },
    { src: 'SystemPulse/EditUser_SP.png', caption: 'Edit user · scope per-system access' },
  ],
  repos: [
    {
      name: 'system-pulse',
      url: 'https://github.com/Asciente-rks/system-pulse',
      stack: 'Monorepo · TypeScript backend (AWS Lambda + DynamoDB) + React + Vite frontend',
    },
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
