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

export const judgementCut: Project = {
  slug: "judgement-cut",
  title: "Judgement Cut",
  status: "live",
  tagline: "A daily-refreshing dashboard of game deals across Steam, GOG, Humble, and Epic — with native Steam Philippine peso pricing so the numbers match what you actually pay.",
  summary: "Designed for $0/month forever. CheapShark feeds deals, Steam regional API gives native PHP prices, Zyte Scrapy Cloud runs the daily crawl, AWS Lambda + TiDB Cloud + Cloudflare R2 handle the rest.",
  tech: ["Python", "Scrapy", "FastAPI", "AWS Lambda", "TiDB Cloud", "Cloudflare R2", "React", "Vite", "Tailwind"],
  techGroups: [
    {
      label: "Spider",
      items: ["Python 3", "Scrapy", "Zyte Scrapy Cloud", "requests"],
    },
    {
      label: "Backend",
      items: [
        "Python 3.11",
        "FastAPI",
        "Mangum (ASGI for Lambda)",
        "aiomysql",
        "pymysql",
        "AWS Lambda Function URL",
        "JWT",
        "bcrypt",
      ],
    },
    {
      label: "Data Sources",
      items: [
        "CheapShark API",
        "Steam Storefront API (cc=PH, storesearch)",
        "open.er-api.com (FX rates)",
      ],
    },
    {
      label: "Storage",
      items: ["TiDB Cloud Serverless (5 GB free)", "Cloudflare R2", "boto3 (S3-compatible)"],
    },
    {
      label: "Frontend",
      items: ["React 18 (JSX)", "Vite 5", "Tailwind 3", "native fetch", "single-file SPA — no router"],
    },
    {
      label: "CI/CD · Hosting",
      items: [
        "GitHub Actions cron (daily 02:00 PHT)",
        "Zyte Scrapy Cloud",
        "AWS ap-southeast-1",
        "Cloudflare R2",
        "Vercel (frontend)",
      ],
    },
  ],
  liveUrl: "https://judgement-cut.vercel.app/",
  sourceUrl: "https://github.com/Asciente-rks/judgement-cut",
  cinematicUrl: "/cinematics/judgement-cut",
  cinematicCaption: "An 8-scene walkthrough of Judgement Cut — the daily-refreshed game-deals dashboard with native Philippine peso pricing. Click anywhere or press → / Space to advance.",
  thumbnail: "JudgementCut/Login_JC.png",
  gallery: [
    {
      src: "JudgementCut/Login_JC.png",
      caption: "Login",
    },
    {
      src: "JudgementCut/Dashboard_JC.png",
      caption: "Dashboard · daily-refreshed deals",
    },
    {
      src: "JudgementCut/Search_JC.png",
      caption: "Live CheapShark search",
    },
    {
      src: "JudgementCut/AdminControl_JC.png",
      caption: "Admin · platform toggles + heartbeat",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "AWS Lambda",
        freeTier: "1M invocations/mo",
        weUse: "~900",
        headroom: "99.9%",
      },
      {
        service: "TiDB Cloud Serverless",
        freeTier: "5 GB storage",
        weUse: "<100 MB",
        headroom: "98%",
      },
      {
        service: "Cloudflare R2",
        freeTier: "10 GB / 10M ops/mo",
        weUse: "<1 GB",
        headroom: "90%+",
      },
      {
        service: "GitHub Actions (cron)",
        freeTier: "2000 min/mo / unlimited (public)",
        weUse: "~1 min",
        headroom: "99.9%",
      },
      {
        service: "Zyte Scrapy Cloud",
        freeTier: "1 free spider, daily run",
        weUse: "1 spider",
        headroom: "within limits",
      },
    ],
  },
};
