import type { Project } from "./types";

export const ascienteHub: Project = {
  slug: 'asciente-hub',
  title: 'AscienteHub',
  role: 'Full-Stack',
  status: 'live',
  tagline:
    'A Steam-style desktop game launcher and storefront. Players sign up, browse a catalog, pay with PayMongo, and install + launch titles from a real native Windows binary.',
  summary:
    'Tauri 2 desktop launcher backed by a TypeScript/Express API on AWS Lambda. TiDB Cloud for storage, Cloudflare R2 for game installers, PayMongo for card payments with 3-D Secure automatic.',
  language: 'TypeScript',
  tech: ['Tauri 2', 'Rust', 'React 18', 'Express 5', 'AWS Lambda', 'TiDB Cloud', 'Cloudflare R2', 'PayMongo', 'Sequelize', 'Redis'],
  techGroups: [
    {
      label: 'Desktop Shell',
      items: ['Tauri 2', 'Rust 2021', 'reqwest', 'tokio', 'walkdir', 'webbrowser', 'zip'],
    },
    {
      label: 'Desktop UI',
      items: ['React 18', 'TypeScript 4.9', 'react-scripts (CRA)', 'react-router-dom 6', 'Tailwind CSS 3', 'axios'],
    },
    {
      label: 'Backend',
      items: ['Node.js 18', 'TypeScript 6', 'Express 5', '@vendia/serverless-express', 'Sequelize 6', 'mysql2', 'JWT (jsonwebtoken)', 'bcrypt', 'Yup', 'Multer', 'Resend', 'nodemailer'],
    },
    {
      label: 'Cloud · Data · Payments',
      items: ['AWS Lambda (Function URL)', 'TiDB Cloud Serverless', 'Cloudflare R2', '@aws-sdk/client-s3', 'Redis (Upstash)', 'ioredis', 'node-cache', 'PayMongo (3-D Secure)'],
    },
    {
      label: 'Testing · Tooling',
      items: ['Jest', 'Supertest', 'sequelize-cli', 'GitHub Actions', 'GitHub Releases'],
    },
  ],
  liveUrl: 'https://github.com/Asciente-rks/ascientehub-frontend/releases/download/v1.0.2/ascientehub_0.1.0_x64-setup.exe',
  liveLabel: 'Download .exe',
  sourceUrl: 'https://github.com/Asciente-rks/ascientehub-backend',
  thumbnail: 'AscienteHub/LoginAscienteHub.png',
  gallery: [
    { src: 'AscienteHub/LoginAscienteHub.png', caption: 'Sign-in screen' },
    { src: 'AscienteHub/Dashboard_AH.png', caption: 'Dashboard · catalog hero' },
    { src: 'AscienteHub/Games_AH.png', caption: 'Game catalog' },
    { src: 'AscienteHub/ViewGameDetails_AH.png', caption: 'Game detail · purchase + install' },
    { src: 'AscienteHub/Cart_AH.png', caption: 'Shopping cart' },
    { src: 'AscienteHub/3DSTrigger_AH.png', caption: '3-D Secure trigger · PayMongo' },
    { src: 'AscienteHub/After3DS_AH.png', caption: 'Post-3DS confirmation' },
    { src: 'AscienteHub/Library_AH.png', caption: 'Library · owned games' },
    { src: 'AscienteHub/PurchaseHistory_AH.png', caption: 'Purchase history' },
    { src: 'AscienteHub/ProfileView_AH.png', caption: 'Profile view' },
    { src: 'AscienteHub/DevApplication_AH.png', caption: 'Developer application gate' },
    { src: 'AscienteHub/CreateGame_AH.png', caption: 'Developer · upload game' },
    { src: 'AscienteHub/UserControl_AH.png', caption: 'Admin · user management' },
  ],
  repos: [
    {
      name: 'ascientehub-frontend',
      url: 'https://github.com/Asciente-rks/ascientehub-frontend',
      stack: 'Tauri 2 desktop launcher · Rust shell + React 18 + TypeScript + Tailwind',
    },
    {
      name: 'ascientehub-backend',
      url: 'https://github.com/Asciente-rks/ascientehub-backend',
      stack: 'Serverless REST API · Node.js 18 + TypeScript + Express 5 + Sequelize',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Tauri["Tauri 2 Desktop<br/>Windows native<br/>Rust shell + React 18"]
    Lambda["AWS Lambda<br/>ascientehub-backend<br/>Express 5 + Sequelize"]
    R2["Cloudflare R2<br/>installers · trailers · media"]
    TiDB[("TiDB Cloud Serverless<br/>MySQL-compatible")]
    Redis[("Redis · Upstash<br/>1h cache + rate limit")]
    Resend["Resend / nodemailer<br/>OTP email"]
    PayMongo["PayMongo API<br/>3DS card payments"]
    AppData["%APPDATA% / games / per-slug<br/>extract + spawn .exe"]

    Tauri -->|HTTPS + JWT via axios| Lambda
    Lambda --> Resend
    Lambda --> PayMongo
    Lambda --> Redis
    Lambda --> TiDB
    Lambda --> R2
    Tauri -.download zip directly.-> R2
    Tauri --> AppData

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Tauri,Lambda,Resend,PayMongo,AppData edge
    class R2,TiDB,Redis store`,
    notes: [
      'Lambda cold-start hardened in src/lambda.ts: OPTIONS preflights short-circuit before DB init, the Sequelize connection is cached at module scope, and ensureGameSchema() adds optional columns idempotently on cold starts.',
      'Public-GET cache (Redis, 1h TTL) on /api/public/*, /api/games, and /api/games/:id — only when no auth headers are present, so authenticated users always see fresh data.',
      'CORS headers force-injected on every response (including 5xx), so the desktop client never sees a missing-CORS error.',
      'Direct R2 uploads capped at 50 MB — larger installers should be uploaded out-of-band to R2.',
    ],
  },
  database: {
    blurb:
      'All primary keys are UUID v4. Relationships wired in src/models/associations.ts. Schema managed by Sequelize sync() plus a defensive ensureGameSchema() step on cold start.',
    mermaid: `erDiagram
    ROLE ||--o{ USER : assigned
    USER ||--o{ GAME : develops
    USER ||--o{ LIBRARY : owns
    USER ||--o{ CART : has
    USER ||--o{ TRANSACTION : made
    USER ||--o{ REVIEW : wrote
    USER ||--o{ PAYMENT_METHOD : saves
    USER ||--o| SUBSCRIPTION : "pay to publish"
    USER ||--o{ OTP : verifies
    CATEGORY ||--o{ GAME : categorizes
    GAME ||--o{ GAME_MEDIA : has
    GAME ||--o{ LIBRARY : "owned in"
    GAME ||--o{ CART : "in cart"
    GAME ||--o{ TRANSACTION : purchased
    GAME ||--o{ REVIEW : has

    ROLE {
        uuid id PK
        string name UK
    }
    USER {
        uuid id PK
        string email UK
        string passwordHash
        uuid roleId FK
        bool isVerified
        string status
    }
    CATEGORY {
        uuid id PK
        string name UK
        string slug UK
    }
    GAME {
        uuid id PK
        string slug UK
        decimal basePrice
        decimal salePrice
        uuid developerId FK
        uuid categoryId FK
        string status
        string thumbnailUrl
        text installerUrl
    }
    GAME_MEDIA {
        uuid id PK
        uuid gameId FK
        string url
        string type
        bool isFeatured
    }
    LIBRARY {
        uuid id PK
        uuid userId FK
        uuid gameId FK
        datetime purchaseDate
    }
    CART {
        uuid id PK
        uuid userId FK
        uuid gameId FK
    }
    TRANSACTION {
        uuid id PK
        uuid userId FK
        uuid gameId FK
        decimal amount
        string status
    }
    REVIEW {
        uuid id PK
        uuid userId FK
        uuid gameId FK
        int rating
        text comment
    }
    PAYMENT_METHOD {
        uuid id PK
        uuid userId FK
        string paymongoId UK
        string brand
        string last4
    }
    SUBSCRIPTION {
        uuid id PK
        uuid developerId FK
        string status
        datetime nextBillingDate
    }
    OTP {
        uuid id PK
        string email
        string code
        string type
        datetime expiresAt
    }`,
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'UUID (PK)', notes: 'UUIDv4' },
          { name: 'username', type: 'VARCHAR', notes: 'unique' },
          { name: 'email', type: 'VARCHAR', notes: 'unique, validated' },
          { name: 'password', type: 'VARCHAR', notes: 'bcrypt, nullable for OAuth' },
          { name: 'roleId', type: 'UUID (FK → roles.id)' },
          { name: 'isVerified', type: 'BOOLEAN' },
          { name: 'status', type: 'ENUM', notes: 'active / pending / rejected (developer-app gate)' },
        ],
      },
      {
        name: 'games',
        description: 'Slug auto-generated from title in a beforeValidate Sequelize hook.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'title', type: 'VARCHAR' },
          { name: 'slug', type: 'VARCHAR', notes: 'unique, lowercase + dashed' },
          { name: 'basePrice', type: 'DECIMAL(10,2)', notes: 'PHP' },
          { name: 'salePrice', type: 'DECIMAL(10,2)' },
          { name: 'developerId', type: 'UUID (FK → users.id)' },
          { name: 'categoryId', type: 'UUID (FK → categories.id)' },
          { name: 'status', type: 'ENUM', notes: 'pending / approved / rejected' },
          { name: 'thumbnailUrl', type: 'VARCHAR', notes: 'R2 URL' },
          { name: 'installerUrl', type: 'TEXT', notes: 'R2 URL of .zip' },
        ],
      },
      {
        name: 'payment_methods',
        description: 'Tokenized cards. No PAN ever stored — only the PayMongo handle.',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'userId', type: 'UUID (FK)' },
          { name: 'paymongoId', type: 'VARCHAR', notes: 'unique, PayMongo payment-method ID' },
          { name: 'brand', type: 'VARCHAR', notes: 'visa / mastercard / etc.' },
          { name: 'last4', type: 'VARCHAR' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda', freeTier: '1M invocations/mo + 400K GB-s', weUse: '~5K invocations/mo', headroom: '99.5%' },
      { service: 'TiDB Cloud Serverless', freeTier: '5 GB storage, 250M RU/mo', weUse: '<100 MB', headroom: '98%+' },
      { service: 'Cloudflare R2', freeTier: '10 GB storage, 1M Class A ops, zero egress', weUse: '<1 GB', headroom: '90%+' },
      { service: 'Redis (Upstash)', freeTier: '10K commands/day', weUse: '~1K cmds/day', headroom: '90%' },
      { service: 'Resend', freeTier: '3K emails/mo, 100/day', weUse: '~20/day during testing', headroom: '80%+' },
      { service: 'PayMongo', freeTier: 'Free signup, no monthly fee', weUse: 'only transaction %', headroom: 'n/a' },
    ],
    rationale: [
      'AWS Lambda over a long-running server — pay only for actual invocations; idle launcher users cost zero.',
      'TiDB over RDS / Aurora — RDS free tier expires after 12 months; TiDB Cloud\'s free tier is perpetual.',
      'R2 over S3 — S3 charges per-GB egress; R2 is zero egress, which matters when shipping installer ZIPs to end users.',
      'PayMongo over Stripe — local PH provider, lower cards-not-present fees, native PHP currency, no FX conversion.',
    ],
  },
};
