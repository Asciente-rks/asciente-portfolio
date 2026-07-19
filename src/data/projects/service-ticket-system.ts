/* ============================================================
   PROJECT FILE — safe to edit, no coding knowledge needed.

   WHAT YOU CAN CHANGE HERE:
   - Any text between quotes ("...") — titles, descriptions, captions.
   - `status`: "live", "in-dev", or "archived".
   - `gallery`: add/remove lines. `src` is the image path inside
     src/assets/, `caption` is the label shown under it.
   - `tech`: the short chips shown on the project card (max 5 shown).
   - `techGroups`: the "Stack used" section on the project page.
   - `cost.rows`: the free-tier cost table.

   RULES: keep the commas and quotes exactly as they are.
   After editing, commit the change — the site rebuilds itself.
   ============================================================ */
import type { Project } from "./types";

export const serviceTicketSystem: Project = {
  slug: "service-ticket-system",
  title: "Nexus Track",
  status: "live",
  tagline: "Multi-tenant QA/defect tracking SaaS — organizations split work into Collections (project spaces), each with its own board, approval workflow, and a built-in AI assistant that answers questions and flags duplicate tickets.",
  summary: "Nexus Track is a multi-tenant ticketing platform: every organization is an isolated workspace, and work is split into Collections (one per system/product) — each collection has its own dashboard, members pick from a per-collection platform/version catalog, and the AI assistant scopes itself to the active collection. Four roles (SUPER_ADMIN, ADMIN, TESTER, DEVELOPER) drive a six-status lifecycle (Open → In Progress → Ready for QA → Error Persists → Resolved → Closed) with status-driven auto-reassignment, multiple assignees per ticket, an immutable approval audit log, threaded comments + an activity timeline, teammate direct messaging, and an AI layer (conversational assistant, in-ticket Q&A, and deterministic duplicate detection) powered by Groq + Google Gemini with automatic rate-limit failover. The React 19 SPA runs on Vercel; the Express 4 API runs on AWS Lambda behind a Lambda Function URL (no API Gateway), deployed by GitHub Actions, backed by TiDB Cloud Serverless (MySQL).",
  tech: [
    "Express 4",
    "AWS Lambda",
    "Sequelize 6",
    "TiDB Cloud (MySQL)",
    "Groq",
    "Gemini",
    "React 19",
    "Vite 8",
    "Tailwind 4",
    "GitHub Actions",
    "Vercel",
  ],
  techGroups: [
    {
      label: "Backend",
      items: [
        "Node.js 20",
        "TypeScript 5",
        "Express 4",
        "serverless-http",
        "Sequelize 6",
        "mysql2",
        "JWT (jsonwebtoken)",
        "bcryptjs",
        "Yup",
        "helmet",
        "cors",
      ],
    },
    {
      label: "AI",
      items: [
        "Groq (primary)",
        "Google Gemini (fallback)",
        "OpenAI-compatible chat API",
        "function-calling tools",
        "duplicate detection",
        "multi-provider rate-limit failover",
      ],
    },
    {
      label: "Database",
      items: [
        "TiDB Cloud Serverless",
        "MySQL-compatible",
        "UUID v4 PKs",
        "runtime self-provisioning",
      ],
    },
    {
      label: "Frontend",
      items: [
        "React 19",
        "TypeScript 5",
        "Vite 8",
        "Tailwind CSS 4",
        "react-router-dom 7",
        "axios",
        "jwt-decode",
        "lucide-react",
        "ESLint 9",
      ],
    },
    {
      label: "Cloud · CI/CD",
      items: [
        "AWS Lambda + Function URL",
        "EventBridge (SLA cron)",
        "GitHub Actions (build → zip → deploy)",
        "TiDB Cloud",
        "Vercel (auto-deploy)",
      ],
    },
  ],
  liveUrl: "https://service-ticket-system-frontend.vercel.app/login",
  sourceUrl: "https://github.com/Asciente-rks/service-ticket-system",
  cinematicUrl: "/cinematics/service-ticket-system",
  cinematicCaption: "A scene-by-scene walkthrough of Nexus Track — a multi-tenant QA tracker with per-collection workspaces, a six-status lifecycle, multiple assignees, platform/version tagging, and a built-in AI assistant. Click anywhere or press → / Space to advance.",
  thumbnail: "ServiceTicket/Login_NT.png",
  gallery: [
    {
      src: "ServiceTicket/Login_NT.png",
      caption: "Login · email-OTP onboarding",
    },
    {
      src: "ServiceTicket/Collections_NT.png",
      caption: "Collections · pick a project workspace (the high-level gate)",
    },
    {
      src: "ServiceTicket/Dashboard_NT.png",
      caption: "Dashboard · per-collection board, KPIs & AI duplicate banner",
    },
    {
      src: "ServiceTicket/Create_Ticket_NT.png",
      caption: "Create ticket · multiple assignees + platform/version",
    },
    {
      src: "ServiceTicket/Edit_Ticket_NT.png",
      caption: "Edit ticket · status, assignees, platform/version",
    },
    {
      src: "ServiceTicket/Ticket_Details_NT.png",
      caption: "Ticket detail · assignees, platform/version & approval",
    },
    {
      src: "ServiceTicket/Thread_Discussion_NT.png",
      caption: "Ticket detail · threaded comments + activity timeline",
    },
    {
      src: "ServiceTicket/Ticket_Details_AI_NT.png",
      caption: "In-ticket AI assistant · summarize & ask about one ticket",
    },
    {
      src: "ServiceTicket/AI_Assist_NT.png",
      caption: "In-ticket AI assistant · contextual answers",
    },
    {
      src: "ServiceTicket/AI_Conversation_NT.png",
      caption: "AI assistant · org/collection-scoped conversational queries",
    },
    {
      src: "ServiceTicket/AI_Conversation_2_NT.png",
      caption: "AI assistant · duplicate-ticket review with inline open/delete/keep",
    },
    {
      src: "ServiceTicket/Approval_NT.png",
      caption: "Approval · approve / reject with an audit comment",
    },
    {
      src: "ServiceTicket/Chat_NT.png",
      caption: "Conversations · teammate direct messaging",
    },
    {
      src: "ServiceTicket/User_Management_NT.png",
      caption: "Team · admin user management",
    },
    {
      src: "ServiceTicket/Profile_NT.png",
      caption: "Profile · self-service account settings",
    },
    {
      src: "ServiceTicket/Settings_NT.png",
      caption: "Settings · theme & preferences",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "AWS Lambda + Function URL",
        freeTier: "1M requests + 400k GB-s / mo (always-free)",
        weUse: "portfolio traffic",
        headroom: "99%+",
      },
      {
        service: "AWS EventBridge",
        freeTier: "14M scheduled invocations / mo",
        weUse: "~1 / day (SLA scan)",
        headroom: "~100%",
      },
      {
        service: "TiDB Cloud Serverless (MySQL)",
        freeTier: "5 GB storage + generous RUs",
        weUse: "<50 MB",
        headroom: "99%+",
      },
      {
        service: "Groq + Google Gemini",
        freeTier: "free-tier RPM/RPD per model",
        weUse: "cached, low volume",
        headroom: "failover across providers",
      },
      {
        service: "Vercel Hobby (frontend)",
        freeTier: "100 GB bandwidth, unlimited deploys",
        weUse: "<500 MB/mo",
        headroom: "99.5%",
      },
      {
        service: "GitHub Actions (public repo)",
        freeTier: "unlimited minutes",
        weUse: "CI/CD deploys",
        headroom: "unlimited",
      },
    ],
  },
};
