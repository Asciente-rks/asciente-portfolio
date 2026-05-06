import type { Project } from "./types";

// =============================================================================
// SwiftRace
// Edit the fields below to update what shows on the home card and the
// /projects/<slug> detail page. Architecture / database mermaid diagrams
// live in the same object below for editor-friendly co-location.
// =============================================================================

export const swiftRace: Project = {
  slug: 'swiftrace',
  title: 'SwiftRace',
  role: 'Cloud Native Backend',
  status: 'live',
  tagline:
    'A serverless logistics tracking platform — customers place sample orders, shippers progress them through a four-stage delivery lifecycle, admins verify status changes.',
  summary:
    '15 independent AWS Lambdas behind API Gateway, DynamoDB single-table design, React 19 + Vite frontend, immutable history timeline.',
  language: 'TypeScript',
  tech: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Serverless Framework', 'React 19', 'Vite', 'Vercel', 'Nodemailer'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js 20', 'TypeScript 5', 'Serverless Framework v3', 'AWS Lambda (15 functions)', 'aws-sdk v2 DocumentClient', 'JWT (jsonwebtoken)', 'scrypt', 'Yup', 'nodemailer + SMTP', 'serverless-dotenv-plugin'],
    },
    {
      label: 'Cloud · AWS',
      items: ['AWS API Gateway REST', 'AWS Lambda', 'DynamoDB (single-table + 4 GSIs)', 'CloudWatch Logs', 'IAM (per-function scope)', 'ap-southeast-1'],
    },
    {
      label: 'Frontend',
      items: ['React 19', 'TypeScript 5', 'Vite 8', 'react-router-dom 7', 'fetch', 'localStorage', 'CSS modules'],
    },
    {
      label: 'Hosting',
      items: ['AWS Lambda + API Gateway (ap-southeast-1)', 'Vercel (frontend)'],
    },
  ],
  liveUrl: 'https://swiftrace.vercel.app/',
  sourceUrl: 'https://github.com/Asciente-rks/swiftrace',
  thumbnail: 'Swiftrace/Login_Swiftrace.png',
  gallery: [
    { src: 'Swiftrace/Login_Swiftrace.png', caption: 'Login' },
    { src: 'Swiftrace/Dashboard_Swiftrace.png', caption: 'Dashboard · KPIs + recent shipments' },
    { src: 'Swiftrace/PlaceOrder_Swiftrace.png', caption: 'Place order · sample order helper' },
    { src: 'Swiftrace/ManageShipments_Swiftrace.png', caption: 'Manage shipments' },
    { src: 'Swiftrace/ShipmentDetails_Swiftrace.png', caption: 'Shipment details · history timeline' },
    { src: 'Swiftrace/EditShipment_Swiftrace.png', caption: 'Edit shipment · update status' },
    { src: 'Swiftrace/ManageUsers_Swiftrace.png', caption: 'Manage users' },
    { src: 'Swiftrace/CreateUser_Swiftrace.png', caption: 'Create user' },
    { src: 'Swiftrace/EditUser_Swiftrace.png', caption: 'Edit user · verify shipper / admin' },
  ],
  repos: [
    {
      name: 'swiftrace',
      url: 'https://github.com/Asciente-rks/swiftrace',
      stack: 'Monorepo · 15 AWS Lambdas (TypeScript) + React 19 + Vite frontend',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Browser["Browser<br/>React 19 + Vite + react-router 7"]
    APIGW["AWS API Gateway · REST<br/>ap-southeast-1"]
    UserFns["5 User Lambdas<br/>create / login / update<br/>delete / getByRole"]
    ShipFns["7 Shipment Lambdas<br/>create / update / track<br/>history / sample / email"]
    DevFns["2 Dev Lambdas<br/>seed / clear DB"]
    DDB[("DynamoDB single table<br/>USER · SHIPMENT · HISTORY<br/>4 GSIs")]
    SMTP["nodemailer + SMTP<br/>tracking emails"]

    Browser -->|REST + JWT| APIGW
    APIGW --> UserFns
    APIGW --> ShipFns
    APIGW --> DevFns
    UserFns --> DDB
    ShipFns --> DDB
    DevFns --> DDB
    ShipFns --> SMTP

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Browser,APIGW,UserFns,ShipFns,DevFns,SMTP edge
    class DDB store`,
    notes: [
      '15 independent Lambdas rather than one router-Lambda — each function does one thing. serverless.yml declares route, IAM, and timeout per function. Rollbacks are per-function.',
      'Single-table DynamoDB with PK/SK prefixes. Four GSIs cover the read patterns the API needs.',
      'Tracking number as the partition key — every customer-facing read is "look up shipment X by tracking" — public reads need zero GSI hops.',
      'History events sit under the same partition as the parent shipment — a single Query returns the full timeline.',
    ],
  },
  database: {
    blurb:
      'DynamoDB single-table design. One table stores users, shipments, and shipment history events; four GSIs cover the read patterns.',
    mermaid: `erDiagram
    USER ||--o{ SHIPMENT : places
    SHIPMENT ||--o{ HISTORY : tracked

    USER {
        string user_id PK
        string email UK
        string role
        string verification_status
        string password_hash
    }
    SHIPMENT {
        string tracking_number PK
        string shipment_id
        string customer_id FK
        string origin
        string destination
        string status
    }
    HISTORY {
        string tracking_number FK
        string history_id
        string history_type
        string history_at
        bool admin_verified
        string verified_at
    }`,
    tables: [
      {
        name: 'USER',
        description: 'PK: USER#<user_id>, SK: METADATA',
        columns: [
          { name: 'user_id', type: 'String', notes: 'UUID' },
          { name: 'email', type: 'String', notes: 'login key' },
          { name: 'role', type: 'String', notes: 'customer / shipper / admin' },
          { name: 'verification_status', type: 'String', notes: 'pending / verified / rejected' },
          { name: 'password_hash', type: 'String', notes: 'scrypt; never returned via API' },
        ],
      },
      {
        name: 'SHIPMENT',
        description: 'PK: SHIPMENT#<tracking_number>, SK: METADATA',
        columns: [
          { name: 'shipment_id', type: 'String', notes: 'UUID' },
          { name: 'tracking_number', type: 'String', notes: 'unique, primary lookup key' },
          { name: 'origin', type: 'String' },
          { name: 'destination', type: 'String' },
          { name: 'status_', type: 'String', notes: 'STATUS#<status> in storage; plain status in API responses' },
        ],
      },
      {
        name: 'HISTORY',
        description: 'PK: SHIPMENT#<tracking_number>, SK: EVENT#<historyId>',
        columns: [
          { name: 'historyType', type: 'String', notes: 'created / picked_up / in_transit / out_for_delivery / delivered' },
          { name: 'admin_verified', type: 'Boolean', notes: 'internal — stripped from public history responses' },
          { name: 'verifiedAt', type: 'String', notes: 'also stripped' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'AWS Lambda', freeTier: '1M invocations/mo + 400K GB-s', weUse: '~5K invocations/mo', headroom: '99.5%' },
      { service: 'API Gateway REST', freeTier: '1M requests/mo (12 months)', weUse: '~5K requests/mo', headroom: '99.5%' },
      { service: 'DynamoDB (PAY_PER_REQUEST)', freeTier: '25 GB storage + 25 R/W units (perpetual)', weUse: '<100 MB', headroom: '99%+' },
      { service: 'Vercel Hobby', freeTier: '100 GB bandwidth, unlimited deploys', weUse: '<500 MB/mo', headroom: '99.5%' },
    ],
    rationale: [
      'DynamoDB over RDS — 25 GB free perpetually, single-digit ms latency, no cold start.',
      'Per-function Lambdas over a router-Lambda — granular cold starts, isolated failures, IAM scoped per route.',
      'Serverless Framework over CDK / SAM — simpler YAML, mature ecosystem, faster onboarding.',
      'Public history responses use a stripped variant (ShipmentHistoryResponse) that hides admin_verified — customers never see internal moderation metadata.',
    ],
  },
};
