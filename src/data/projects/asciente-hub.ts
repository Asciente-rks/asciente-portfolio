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

export const ascienteHub: Project = {
  slug: "asciente-hub",
  title: "AscienteHub",
  status: "live",
  tagline: "A Steam-style desktop game launcher and storefront. Players sign up, browse a catalog, pay with PayMongo, and install + launch titles from a real native Windows binary.",
  summary: "Tauri 2 desktop launcher backed by a TypeScript/Express API on AWS Lambda. TiDB Cloud for storage, Cloudflare R2 for game installers, PayMongo for card payments with 3-D Secure automatic.",
  tech: [
    "Tauri 2",
    "Rust",
    "React 18",
    "Express 5",
    "AWS Lambda",
    "TiDB Cloud",
    "Cloudflare R2",
    "PayMongo",
    "Sequelize",
    "Redis",
  ],
  techGroups: [
    {
      label: "Desktop Shell",
      items: ["Tauri 2", "Rust 2021", "reqwest", "tokio", "walkdir", "webbrowser", "zip"],
    },
    {
      label: "Desktop UI",
      items: [
        "React 18",
        "TypeScript 4.9",
        "react-scripts (CRA)",
        "react-router-dom 6",
        "Tailwind CSS 3",
        "axios",
      ],
    },
    {
      label: "Backend",
      items: [
        "Node.js 18",
        "TypeScript 6",
        "Express 5",
        "@vendia/serverless-express",
        "Sequelize 6",
        "mysql2",
        "JWT (jsonwebtoken)",
        "bcrypt",
        "Yup",
        "Multer",
        "Resend",
        "nodemailer",
      ],
    },
    {
      label: "Cloud · Data · Payments",
      items: [
        "AWS Lambda (Function URL)",
        "TiDB Cloud Serverless",
        "Cloudflare R2",
        "@aws-sdk/client-s3",
        "Redis (Upstash)",
        "ioredis",
        "node-cache",
        "PayMongo (3-D Secure)",
      ],
    },
    {
      label: "Testing · Tooling",
      items: ["Jest", "Supertest", "sequelize-cli", "GitHub Actions", "GitHub Releases"],
    },
  ],
  liveUrl: "https://github.com/Asciente-rks/ascientehub-frontend/releases/download/v1.0.2/ascientehub_0.1.0_x64-setup.exe",
  liveLabel: "Download .exe",
  sourceUrl: "https://github.com/Asciente-rks/ascientehub-backend",
  cinematicUrl: "/cinematics/asciente-hub",
  cinematicCaption: "An 8-scene walkthrough of AscienteHub — the Tauri-Rust desktop game marketplace with PayMongo 3-D Secure checkout and native install + launch. Click anywhere or press → / Space to advance.",
  thumbnail: "AscienteHub/LoginAscienteHub.png",
  gallery: [
    {
      src: "AscienteHub/LoginAscienteHub.png",
      caption: "Sign-in screen",
    },
    {
      src: "AscienteHub/Dashboard_AH.png",
      caption: "Dashboard · catalog hero",
    },
    {
      src: "AscienteHub/Games_AH.png",
      caption: "Game catalog",
    },
    {
      src: "AscienteHub/ViewGameDetails_AH.png",
      caption: "Game detail · purchase + install",
    },
    {
      src: "AscienteHub/Cart_AH.png",
      caption: "Shopping cart",
    },
    {
      src: "AscienteHub/3DSTrigger_AH.png",
      caption: "3-D Secure trigger · PayMongo",
    },
    {
      src: "AscienteHub/After3DS_AH.png",
      caption: "Post-3DS confirmation",
    },
    {
      src: "AscienteHub/Library_AH.png",
      caption: "Library · owned games",
    },
    {
      src: "AscienteHub/PurchaseHistory_AH.png",
      caption: "Purchase history",
    },
    {
      src: "AscienteHub/ProfileView_AH.png",
      caption: "Profile view",
    },
    {
      src: "AscienteHub/DevApplication_AH.png",
      caption: "Developer application gate",
    },
    {
      src: "AscienteHub/CreateGame_AH.png",
      caption: "Developer · upload game",
    },
    {
      src: "AscienteHub/UserControl_AH.png",
      caption: "Admin · user management",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "AWS Lambda",
        freeTier: "1M invocations/mo + 400K GB-s",
        weUse: "~5K invocations/mo",
        headroom: "99.5%",
      },
      {
        service: "TiDB Cloud Serverless",
        freeTier: "5 GB storage, 250M RU/mo",
        weUse: "<100 MB",
        headroom: "98%+",
      },
      {
        service: "Cloudflare R2",
        freeTier: "10 GB storage, 1M Class A ops, zero egress",
        weUse: "<1 GB",
        headroom: "90%+",
      },
      {
        service: "Redis (Upstash)",
        freeTier: "10K commands/day",
        weUse: "~1K cmds/day",
        headroom: "90%",
      },
      {
        service: "Resend",
        freeTier: "3K emails/mo, 100/day",
        weUse: "~20/day during testing",
        headroom: "80%+",
      },
      {
        service: "PayMongo",
        freeTier: "Free signup, no monthly fee",
        weUse: "only transaction %",
        headroom: "n/a",
      },
    ],
  },
};
