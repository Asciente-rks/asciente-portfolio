import type { Project } from "./types";

// =============================================================================
// Service Ticket System
// Edit the fields below to update what shows on the home card and the
// /projects/<slug> detail page. Architecture / database mermaid diagrams
// live in the same object below for editor-friendly co-location.
// =============================================================================

export const serviceTicketSystem: Project = {
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
  liveUrl: 'https://service-ticket-system-frontend.vercel.app/login',
  sourceUrl: 'https://github.com/Asciente-rks/service-ticket-system',
  thumbnail: 'ServiceTicket/LoginServiceTicket.png',
  gallery: [
    { src: 'ServiceTicket/LoginServiceTicket.png', caption: 'Login screen' },
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
