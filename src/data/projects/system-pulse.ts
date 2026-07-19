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

export const systemPulse: Project = {
  slug: "system-pulse",
  title: "System Pulse",
  status: "live",
  tagline: "A multi-tenant uptime + health-check SaaS. Self-serve registration with email-OTP, organization tenancy, granular per-user permissions, and a demo mode with editable permission templates — all running on AWS free-tier forever.",
  summary: "Real SaaS shape: superadmin → owner → admin → user role hierarchy with granular permission toggles, suspend/delete flows with reason+notes+email, account lockout, profile self-service, SSRF-safe URL probes, and Render cold-start handling via SQS re-enqueue. Two Lambdas sharing one codebase, single-table DynamoDB with 3 GSIs.",
  tech: [
    "TypeScript",
    "Node.js 20",
    "AWS Lambda",
    "DynamoDB",
    "SQS",
    "SNS",
    "React 18",
    "Vite 5",
    "Tailwind CSS 4",
    "Vercel",
  ],
  techGroups: [
    {
      label: "Backend",
      items: [
        "TypeScript",
        "Node.js 20 (ESM)",
        "Custom HTTP router (~150 LOC)",
        "@aws-sdk/lib-dynamodb v3",
        "Yup + validator (shared FE+BE)",
        "scrypt password hashing",
        "nodemailer",
        "SMTP",
        "SSRF guard (loopback, RFC1918, link-local, CGNAT, IPv6)",
      ],
    },
    {
      label: "Cloud · AWS",
      items: [
        "AWS Lambda (api + worker)",
        "Lambda Function URL",
        "DynamoDB (single-table + 3 GSIs + TTL on 4 entity types)",
        "SQS + Dead-Letter Queue + delayed re-enqueue",
        "SNS",
        "CloudWatch Logs",
        "IAM (inline scoped policy)",
        "KMS (optional)",
      ],
    },
    {
      label: "Frontend",
      items: [
        "React 18",
        "TypeScript 5",
        "Vite 5",
        "Tailwind CSS 4",
        "react-router-dom 6",
        "Live PasswordChecklist (validator-backed)",
        "Real-time polling (4s/10s)",
        "Mermaid diagrams (in repo README)",
      ],
    },
    {
      label: "Hosting · CI/CD",
      items: [
        "Vercel (frontend)",
        "AWS ap-southeast-1",
        "GitHub Actions (idempotent deploy workflow)",
        "Env-gated seed (no creds in source)",
      ],
    },
  ],
  liveUrl: "https://system-pulse-sn3w.vercel.app/login",
  sourceUrl: "https://github.com/Asciente-rks/system-pulse",
  cinematicUrl: "/cinematics/system-pulse",
  cinematicCaption: "An 8-scene walkthrough of System Pulse — the multi-tenant uptime + health-check platform running on AWS free tier forever. Click anywhere or press → / Space to advance.",
  thumbnail: "SystemPulse/LoginPage_SystemPulse.png",
  gallery: [
    {
      src: "SystemPulse/LoginPage_SystemPulse.png",
      caption: "Tabbed login · sign in / forgot / sign up",
    },
    {
      src: "SystemPulse/SystemTrigger_SystemPulse.png",
      caption: "On-demand health probe with real-time polling",
    },
    {
      src: "SystemPulse/Logs_SP.png",
      caption: "Rolling 30-day probe history (auto-refreshing)",
    },
    {
      src: "SystemPulse/ManageUsers_SP.png",
      caption: "User management — invites + role filter + suspend/unlock",
    },
    {
      src: "SystemPulse/EditUser_SP.png",
      caption: "Edit user · system access + permission toggles",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "AWS Lambda",
        freeTier: "1M invocations/mo + 400K GB-s",
        weUse: "~3K invocations/mo",
        headroom: "99.7%",
      },
      {
        service: "DynamoDB (PAY_PER_REQUEST)",
        freeTier: "25 GB storage + 25 R/W units (perpetual)",
        weUse: "<50 MB",
        headroom: "99%+",
      },
      {
        service: "SQS",
        freeTier: "1M requests/mo",
        weUse: "<500 req/mo",
        headroom: "99.95%",
      },
      {
        service: "SNS",
        freeTier: "1M publishes/mo",
        weUse: "<100/mo",
        headroom: "99.99%",
      },
      {
        service: "CloudWatch Logs",
        freeTier: "5 GB ingestion/mo",
        weUse: "<50 MB",
        headroom: "99%",
      },
      {
        service: "Vercel Hobby",
        freeTier: "100 GB bandwidth, unlimited deploys",
        weUse: "<1 GB/mo",
        headroom: "99%",
      },
      {
        service: "SMTP (Gmail)",
        freeTier: "500/day",
        weUse: "<10/day",
        headroom: "97%+",
      },
    ],
  },
};
