import type { Project } from "./types";

export const serviceTicketSystem: Project = {
  slug: 'service-ticket-system',
  title: 'Service Ticket System',
  role: 'Full-Stack',
  status: 'live',
  tagline:
    'Internal IT/QA ticketing platform with a built-in approval workflow — testers report defects, developers fix them, admins triage, approvers sign off before tickets close.',
  summary:
    'Four-role ticket workflow (SUPER_ADMIN, ADMIN, TESTER, DEVELOPER) with six lifecycle statuses (Open → In Progress → Ready for QA → Resolved / Error Persists → Closed), per-ticket approval/rejection (Approval rows are an immutable audit log), granular per-user in-app notification settings, and a node-cron-driven stale-ticket scan.',
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
  liveUrl: 'https://service-ticket-system-frontend.vercel.app/login',
  sourceUrl: 'https://github.com/Asciente-rks/service-ticket-system',
  thumbnail: 'ServiceTicket/Login_STS.png',
  gallery: [
    { src: 'ServiceTicket/Login_STS.png', caption: 'Login' },
    { src: 'ServiceTicket/Dashboard_STS.png', caption: 'Dashboard · KPIs + recent tickets' },
    { src: 'ServiceTicket/CreateTicket_STS.png', caption: 'Create ticket · tester submits a defect' },
    { src: 'ServiceTicket/ViewTicket_STS.png', caption: 'View ticket · approval & history timeline' },
    { src: 'ServiceTicket/EditTicket_STS.png', caption: 'Edit ticket · update status / assignee' },
    { src: 'ServiceTicket/UserManagement_STS.png', caption: 'User management · super admin view' },
    { src: 'ServiceTicket/CreateUser_STS.png', caption: 'Create user · invite tester / developer / approver' },
    { src: 'ServiceTicket/NotificationSettings_STS.png', caption: 'Notification preferences · per-user settings' },
    { src: 'ServiceTicket/Profile_STS.png', caption: 'Profile · password reset' },
  ],
  repos: [
    {
      name: 'service-ticket-system',
      url: 'https://github.com/Asciente-rks/service-ticket-system',
      stack: 'REST API · Express 4 + Sequelize + MySQL + node-cron',
    },
    {
      name: 'service-ticket-system-frontend',
      url: 'https://github.com/Asciente-rks/service-ticket-system-frontend',
      stack: 'Web SPA · React 19 + Vite 8 + Tailwind 4',
    },
  ],
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
      'Single Express process — no queue, no worker. helmet, cors, express.json, route mounts, /health probe. On startup: connectDB() → defineAssociations() → seed (idempotent) → initCronJobs() → listen.',
      'Cron co-located with the API — saves an additional service. node-cron fires inside the same Node process; the trade-off is that scaling horizontally requires either a leader-election strategy or moving cron to a dedicated worker.',
      'Modular DDD-ish layout — each domain (tickets, users, notifications) has its own controllers/services/repositories/dtos/models/routes. No cross-module imports beyond the associations file.',
      'Snake_case DB columns mapped to camelCase model attributes via Sequelize field — clean SQL audit trail, idiomatic JS code.',
      'Auto-seed on boot (SEED_ON_BOOT=true) — idempotent role + status + demo user seeding runs every start, making fresh Render deploys zero-manual-step.',
      'bcryptjs over bcrypt — pure JS, no native build step; deploys cleanly to Render free tier and any serverless platform.',
    ],
    flows: [
      {
        title: 'Role hierarchy & permissions',
        blurb:
          'Four roles with non-overlapping responsibilities. SUPER_ADMIN and ADMIN both triage and approve; DEVELOPERs only work tickets assigned to them; TESTERs only own the tickets they reported. permissions.middleware.ts enforces this on every route.',
        mermaid: `flowchart LR
    super["SUPER_ADMIN<br/>platform owner<br/>full access"]
    admin["ADMIN<br/>triage + manage users<br/>assign & update tickets"]
    dev["DEVELOPER<br/>work assigned tickets<br/>resolve defects"]
    tester["TESTER<br/>report defects<br/>track own tickets"]
    approval["Approval Flow<br/>SUPER_ADMIN or ADMIN<br/>approve / reject resolved tickets"]

    super -->|create / delete / update users| admin
    super -->|approve / reject| approval
    admin -->|assign tickets to| dev
    admin -->|approve / reject| approval
    tester -.create tickets.-> super
    tester -.create tickets.-> admin
    dev -.update status to Resolved.-> approval

    classDef tier fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef flow fill:#1f0f22,stroke:#a978ff,color:#e2c8ff
    class super,admin,dev,tester tier
    class approval flow`,
        notes: [
          'SUPER_ADMIN: create / delete / update users · create / update / approve any ticket · manage users incl. ADMINs.',
          'ADMIN: same operational reach as SUPER_ADMIN minus deleting / managing other ADMINs and SUPER_ADMINs.',
          'DEVELOPER: work assigned tickets only. Cannot create tickets, cannot approve, cannot manage users.',
          'TESTER: create defects, track tickets they reported, no admin or approval reach.',
        ],
      },
      {
        title: 'Ticket lifecycle · end to end',
        blurb:
          'A complete walkthrough of one ticket from a tester report to an approver decision. Every status update fans out to the relevant notification table rows so the right people see the change in their inbox.',
        mermaid: `sequenceDiagram
    autonumber
    actor Tester
    actor Admin
    actor Developer
    actor Approver as Admin / Super Admin
    participant API as Express API
    participant DB as MySQL

    Tester->>API: POST /tickets { title, description, priority }
    API->>DB: INSERT ticket (statusId=Open, reportedBy=tester)
    API-->>Tester: 201 ticket created

    Admin->>API: PATCH /tickets/:id { assignedTo, statusId=In Progress }
    API->>DB: UPDATE ticket + INSERT notification for developer
    API-->>Admin: 200 updated

    Developer->>API: PATCH /tickets/:id { statusId=Ready for QA }
    API->>DB: UPDATE ticket + INSERT notification for admin
    API-->>Developer: 200 ready for review

    Approver->>API: POST /tickets/:id/approval { status=Approved, comment }
    API->>DB: INSERT approval + UPDATE ticket statusId=Resolved
    API->>DB: INSERT notification for reporter (gated by NOTIFICATION_SETTINGS)
    API-->>Approver: 201 approval recorded

    Note over Approver,DB: If status=Rejected, ticket statusId becomes Error Persists; developer iterates and re-submits for QA.`,
        notes: [
          'Each approval is its own immutable APPROVAL row — multiple decisions over a ticket\'s lifetime are preserved as a full audit trail.',
          'Notifications respect each user\'s NOTIFICATION_SETTINGS row — opt-in per event type (assigned, updated, approved, rejected).',
        ],
      },
      {
        title: 'Status state machine',
        blurb:
          'Six lifecycle statuses, with a Rejected → InProgress loop for rework. Statuses live in the TICKET_STATUS reference table — adding a status is a row insert, not a schema change.',
        mermaid: `stateDiagram-v2
    [*] --> Open: Tester creates ticket
    Open --> InProgress: Developer picks up / Admin assigns
    InProgress --> ReadyForQA: Developer marks complete
    ReadyForQA --> Resolved: Admin / Super Admin approves (Approval row status=Approved)
    ReadyForQA --> ErrorPersists: Admin / Super Admin rejects (Approval row status=Rejected)
    ErrorPersists --> InProgress: Developer iterates
    Resolved --> Closed: Admin closes
    Closed --> [*]`,
        notes: [
          'Approved and Rejected are values on APPROVAL rows, not ticket statuses. The ticket itself transitions to Resolved (on approve) or Error Persists (on reject) — see approval.service.ts.',
        ],
      },
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
        bool notifyReportedTicketUpdated
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
  apiEndpoints: [
    { method: 'POST', path: '/auth/login', auth: 'none', purpose: 'Email + password → JWT (accounts are admin-created via POST /users, no public register endpoint)' },
    { method: 'GET', path: '/users', auth: 'session + ADMIN / DEVELOPER / TESTER', purpose: 'List users (role-filtered server-side)' },
    { method: 'GET', path: '/users/:id', auth: 'session + owner-or-admin', purpose: 'Get a single user' },
    { method: 'POST', path: '/users', auth: 'session + admin', purpose: 'Create user with role assignment' },
    { method: 'PUT', path: '/users/:id', auth: 'session + owner-or-admin + role-hierarchy check', purpose: 'Update user details' },
    { method: 'DELETE', path: '/users/:id', auth: 'session + owner-or-admin + role-hierarchy check', purpose: 'Hard delete user' },
    { method: 'GET', path: '/users/roles', auth: 'none', purpose: 'List all roles (lookup table)' },
    { method: 'GET', path: '/users/notification-settings', auth: 'session', purpose: "Get the current user's notification preferences" },
    { method: 'PATCH', path: '/users/notification-settings', auth: 'session', purpose: "Update the current user's notification preferences" },
    { method: 'GET', path: '/tickets/statuses', auth: 'none', purpose: 'List all ticket statuses (reference data, no auth)' },
    { method: 'GET', path: '/tickets', auth: 'session', purpose: 'List tickets (role-filtered server-side)' },
    { method: 'GET', path: '/tickets/:id', auth: 'session', purpose: 'Ticket detail' },
    { method: 'POST', path: '/tickets', auth: 'session + SUPER_ADMIN / ADMIN / TESTER', purpose: 'Create a ticket' },
    { method: 'PATCH', path: '/tickets/:id', auth: 'session', purpose: 'Update status, assignee, details (deeper permission checks live in the service)' },
    { method: 'POST', path: '/tickets/:id/approval', auth: 'session + SUPER_ADMIN / ADMIN', purpose: 'Approve (→ Resolved) or reject (→ Error Persists) a Ready-for-QA ticket' },
    { method: 'GET', path: '/notifications', auth: 'session', purpose: 'List notifications for the current user' },
    { method: 'GET', path: '/health', auth: 'none', purpose: '{ status: "UP", service, timestamp } — Render health check' },
  ],
};
