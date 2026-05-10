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
      'Direct R2 download from Rust — game ZIPs are fetched by the Tauri shell with reqwest straight from Cloudflare R2 (zero egress), not proxied through Lambda. Keeps Lambda compute near zero for large binary transfers.',
      'Tauri 2 over Electron — Rust shell is ~5 MB vs. 200+ MB for an Electron bundle. OS calls (download, extract, spawn) are native async Tokio tasks.',
    ],
    flows: [
      {
        title: 'Role hierarchy',
        blurb:
          'Three primary roles plus two pseudo-states (pending developer, banned user). Developers are gated by an explicit admin approval — no self-promotion. Bans are reversible.',
        mermaid: `flowchart LR
    admin["Admin<br/>platform moderator<br/>full approval reach"]
    developer["Developer<br/>gated by admin approval<br/>own games only"]
    user["Player / User<br/>browse · buy · install<br/>review + library"]
    pending["Pending Developer<br/>application submitted<br/>awaiting review"]
    banned["Banned User<br/>login blocked"]

    admin -->|approve / reject application| pending
    pending -->|approved| developer
    admin -->|approve / reject games| developer
    admin -->|ban / unban| user
    user -->|apply| pending
    user -.->|banned| banned

    classDef tier fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef warn fill:#1a0f0f,stroke:#f87171,color:#fecaca
    class admin,developer,user,pending tier
    class banned warn`,
        notes: [
          'Admin: full cross-platform reach — moderates games + developers + users. Seeded via provision.ts.',
          'Developer: own-games CRUD only. Cannot moderate; cannot see other developers\' drafts.',
          'User (player): browse, purchase, library, reviews, profile. Self-registers + email-OTP-verifies.',
        ],
      },
      {
        title: 'Self-registration · email OTP',
        blurb:
          'Registration is intentionally two-step: email + password creates an unverified record, a 6-digit OTP confirms ownership of the email, and only then does the account become loginable. No auto-login after verify — the user must authenticate with their new password.',
        mermaid: `sequenceDiagram
    autonumber
    actor User
    participant SPA as Tauri / React SPA
    participant API as Lambda /api/auth/*
    participant TiDB as TiDB Cloud
    participant Email as Resend / nodemailer

    User->>SPA: Submit username + email + password
    SPA->>API: POST /api/auth/register
    API->>TiDB: INSERT INTO otps (type='verification', expiresAt)
    API->>Email: 6-digit OTP email
    Email-->>User: OTP code
    User->>SPA: Enter OTP
    SPA->>API: POST /api/auth/verify
    API->>TiDB: UPDATE users SET isVerified=true
    API-->>SPA: 200 + success
    SPA-->>User: "Account verified — sign in"
    Note right of SPA: NO auto-login. User authenticates with their new password.`,
        notes: [
          'OTPs are keyed by email, not userId — verification works before the user record is fully loginable.',
          '6-character codes with expiresAt enforced on every read; brute-force attempts capped at the rate-limit middleware.',
        ],
      },
      {
        title: '3-D Secure payment flow',
        blurb:
          'Cart checkout drives a single PayMongo charge with 3DS automatic. The redirect URL opens in the system browser via webbrowser::open (Rust) or window.open (web), the webhook lands on Lambda, and the SPA polls /api/payments/status until the success state lands.',
        mermaid: `flowchart LR
    Cart["Cart.tsx<br/>checkout button"]
    PS["paymentService.ts<br/>POST /api/payments/checkout"]
    Lambda["Lambda<br/>create PaymentIntent<br/>+ attach method"]
    DS["3-D Secure check"]
    Redirect["webbrowser::open<br/>or window.open<br/>3DS URL in browser"]
    Webhook["Lambda webhook<br/>settle transaction<br/>add to library"]
    Poll["Cart.tsx<br/>poll /api/payments/status"]
    Done["Success screen<br/>games added to library"]

    Cart --> PS
    PS --> Lambda
    Lambda --> DS
    DS -->|3DS required| Redirect
    Redirect -.user completes 3DS.-> Webhook
    Webhook --> Poll
    Poll --> Done
    DS -->|not required| Webhook

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Cart,PS,Lambda,DS,Redirect,Poll,Done edge
    class Webhook store`,
        notes: [
          'PayMongo handles card tokenization on its hosted page — no PAN ever reaches the React layer.',
          'Saved cards store only the PayMongo paymentMethodId, brand, and last-4 digits; deleting a card removes the local row only — the PayMongo handle is detached server-side.',
          'Webhook signature is verified in payment.controller.ts before any DB mutation.',
        ],
      },
      {
        title: 'Install & launch · Tauri Rust shell',
        blurb:
          'When a user clicks Install in the library, the React layer invokes a Tauri IPC command. The Rust shell downloads the ZIP straight from Cloudflare R2 (zero egress, no Lambda hop), extracts to %APPDATA%, and on Launch finds the first .exe under the slug directory and spawns it natively.',
        mermaid: `flowchart TD
    LibraryPage["Library.tsx<br/>Install button"]
    TauriCmd["tauriRuntime.ts<br/>invoke('download_and_install', { url, slug })"]
    RustDL["Rust: reqwest GET<br/>R2 presigned URL → ZIP bytes"]
    RustExtract["Rust: zip::ZipArchive<br/>extract to %APPDATA%/ascientehub/games/slug"]
    InstallDone["Library.tsx<br/>Install state → installed<br/>Launch button enabled"]
    LaunchCmd["tauriRuntime.ts<br/>invoke('launch_game', { slug })"]
    RustWalk["Rust: walkdir<br/>find first .exe under slug dir"]
    Spawn["Rust: Command::new(exe_path).spawn()"]

    LibraryPage --> TauriCmd
    TauriCmd --> RustDL
    RustDL --> RustExtract
    RustExtract --> InstallDone
    InstallDone --> LaunchCmd
    LaunchCmd --> RustWalk
    RustWalk --> Spawn

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef rust fill:#1f0f22,stroke:#a978ff,color:#e2c8ff
    class LibraryPage,TauriCmd,InstallDone,LaunchCmd edge
    class RustDL,RustExtract,RustWalk,Spawn rust`,
        notes: [
          'tauriRuntime.ts detects Tauri (window.__TAURI_INTERNALS__) — same SPA runs in browser dev mode with install/launch buttons disabled.',
          'Installed state checks for the slug directory via a separate IPC command — no server round-trip required to know if a game is local.',
        ],
      },
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
  apiEndpoints: [
    { method: 'POST', path: '/api/auth/register', auth: 'none', purpose: 'Register + send 6-digit OTP' },
    { method: 'POST', path: '/api/auth/verify', auth: 'OTP', purpose: 'Verify email → isVerified: true (no auto-login)' },
    { method: 'POST', path: '/api/auth/login', auth: 'none', purpose: 'Email + password → JWT' },
    { method: 'POST', path: '/api/auth/forgot-password', auth: 'none', purpose: 'Email a password-reset OTP' },
    { method: 'POST', path: '/api/auth/reset-password', auth: 'OTP', purpose: 'Set new password using the reset OTP' },
    { method: 'GET', path: '/api/public/games', auth: 'none', purpose: 'Browse the catalog (Redis-cached 1h)' },
    { method: 'GET', path: '/api/games/:id', auth: 'JWT', purpose: 'Game detail · auth bypasses cache' },
    { method: 'POST', path: '/api/cart', auth: 'JWT', purpose: 'Add a game to cart' },
    { method: 'POST', path: '/api/payments/sources', auth: 'JWT', purpose: 'Tokenize card → PayMongo source' },
    { method: 'POST', path: '/api/payments/checkout', auth: 'JWT', purpose: 'Checkout entire cart in one PayMongo charge (3DS automatic)' },
    { method: 'POST', path: '/api/payments/complete', auth: 'JWT', purpose: 'Finalize 3DS-authorized payment + add games to library' },
    { method: 'GET', path: '/api/payments/methods', auth: 'JWT', purpose: 'List saved cards (paymongoId + brand + last4 only)' },
    { method: 'POST', path: '/api/payments/webhook', auth: 'PUBLIC (signed)', purpose: 'PayMongo webhook callbacks · signature verified' },
    { method: 'POST', path: '/api/developer/apply', auth: 'JWT', purpose: 'Submit developer application (admin-gated)' },
    { method: 'POST', path: '/api/uploads', auth: 'JWT', purpose: 'Multipart upload → Cloudflare R2 (≤ 50 MB per file)' },
    { method: 'POST', path: '/api/admin/games/:id/approve', auth: 'JWT (admin)', purpose: 'Approve a submitted game' },
    { method: 'POST', path: '/api/admin/users/:id/ban', auth: 'JWT (admin)', purpose: 'Ban a user (login blocked)' },
  ],
};
