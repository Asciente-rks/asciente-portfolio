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

export const swiftRace: Project = {
  slug: "swiftrace",
  title: "SwiftRace",
  status: "live",
  tagline: "A serverless logistics tracking platform — customers place sample orders, shippers progress them through a four-stage delivery lifecycle, admins verify status changes.",
  summary: "A single AWS Lambda exposed via Function URL, internally fanning out to 14 handler functions, DynamoDB single-table design, React 19 + Vite frontend, and an immutable history timeline. Deployed straight from GitHub Actions to Lambda — no API Gateway, no S3 deploy bucket, no CloudFormation. $0/month forever, no 12-month timer.",
  tech: [
    "AWS Lambda",
    "Lambda Function URL",
    "DynamoDB",
    "GitHub Actions",
    "esbuild",
    "React 19",
    "Vite",
    "Vercel",
    "Nodemailer",
  ],
  techGroups: [
    {
      label: "Backend",
      items: [
        "Node.js 20",
        "TypeScript 5",
        "esbuild (bundler)",
        "AWS Lambda (1 function · internal router)",
        "aws-sdk v2 DocumentClient",
        "JWT (jsonwebtoken)",
        "scrypt",
        "Yup",
        "nodemailer + SMTP",
      ],
    },
    {
      label: "Cloud · AWS",
      items: [
        "AWS Lambda + Function URL (no API Gateway)",
        "DynamoDB (single-table + 4 GSIs)",
        "CloudWatch Logs",
        "IAM (single execution role, scoped inline policy)",
        "ap-southeast-1",
      ],
    },
    {
      label: "CI/CD",
      items: [
        "GitHub Actions",
        "aws-actions/configure-aws-credentials",
        "aws-cli (lambda update-function-code, dynamodb create-table, iam create-role)",
        "idempotent bash deploy script",
      ],
    },
    {
      label: "Frontend",
      items: [
        "React 19",
        "TypeScript 5",
        "Vite 8",
        "react-router-dom 7",
        "fetch",
        "localStorage",
        "CSS modules",
      ],
    },
    {
      label: "Hosting",
      items: ["AWS Lambda Function URL (ap-southeast-1)", "Vercel (frontend)"],
    },
  ],
  liveUrl: "https://swiftrace.vercel.app/",
  sourceUrl: "https://github.com/Asciente-rks/swiftrace",
  cinematicUrl: "/cinematics/swiftrace",
  cinematicCaption: "A 12-scene interactive walkthrough of the SwiftRace UI — login flow, role-based dashboards, the four-stage shipment pipeline, user management, place-order flow, and the light/dark themes. Click anywhere or press → / Space to advance.",
  thumbnail: "Swiftrace/Login_Swiftrace.png",
  gallery: [
    {
      src: "Swiftrace/Login_Swiftrace.png",
      caption: "Login",
    },
    {
      src: "Swiftrace/Dashboard_Swiftrace.png",
      caption: "Dashboard · KPIs + recent shipments",
    },
    {
      src: "Swiftrace/PlaceOrder_Swiftrace.png",
      caption: "Place order · sample order helper",
    },
    {
      src: "Swiftrace/ManageShipments_Swiftrace.png",
      caption: "Manage shipments",
    },
    {
      src: "Swiftrace/ShipmentDetails_Swiftrace.png",
      caption: "Shipment details · history timeline",
    },
    {
      src: "Swiftrace/EditShipment_Swiftrace.png",
      caption: "Edit shipment · update status",
    },
    {
      src: "Swiftrace/ManageUsers_Swiftrace.png",
      caption: "Manage users",
    },
    {
      src: "Swiftrace/CreateUser_Swiftrace.png",
      caption: "Create user",
    },
    {
      src: "Swiftrace/EditUser_Swiftrace.png",
      caption: "Edit user · verify shipper / admin",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "AWS Lambda",
        freeTier: "1M invocations/mo + 400K GB-s (perpetual)",
        weUse: "~5K invocations/mo",
        headroom: "99.5%",
      },
      {
        service: "Lambda Function URL",
        freeTier: "included with Lambda invocations",
        weUse: "same",
        headroom: "99.5%",
      },
      {
        service: "DynamoDB (PAY_PER_REQUEST)",
        freeTier: "25 GB storage + 25 R/W units (perpetual)",
        weUse: "<100 MB",
        headroom: "99%+",
      },
      {
        service: "CloudWatch Logs",
        freeTier: "5 GB ingestion/mo (perpetual)",
        weUse: "<50 MB",
        headroom: "99%",
      },
      {
        service: "GitHub Actions",
        freeTier: "unlimited minutes (public repo)",
        weUse: "<2 min/deploy",
        headroom: "unlimited",
      },
      {
        service: "Vercel Hobby",
        freeTier: "100 GB bandwidth, unlimited deploys",
        weUse: "<500 MB/mo",
        headroom: "99.5%",
      },
    ],
  },
};
