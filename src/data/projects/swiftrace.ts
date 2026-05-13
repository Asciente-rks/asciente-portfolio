import type { Project } from "./types";

export const swiftRace: Project = {
  slug: 'swiftrace',
  title: 'SwiftRace',
  role: 'Cloud Native Backend',
  status: 'live',
  tagline:
    'A serverless logistics tracking platform — customers place sample orders, shippers progress them through a four-stage delivery lifecycle, admins verify status changes.',
  summary:
    'A single AWS Lambda exposed via Function URL, internally fanning out to 14 handler functions, DynamoDB single-table design, React 19 + Vite frontend, and an immutable history timeline. Deployed straight from GitHub Actions to Lambda — no API Gateway, no S3 deploy bucket, no CloudFormation. $0/month forever, no 12-month timer.',
  language: 'TypeScript',
  tech: ['AWS Lambda', 'Lambda Function URL', 'DynamoDB', 'GitHub Actions', 'esbuild', 'React 19', 'Vite', 'Vercel', 'Nodemailer'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js 20', 'TypeScript 5', 'esbuild (bundler)', 'AWS Lambda (1 function · internal router)', 'aws-sdk v2 DocumentClient', 'JWT (jsonwebtoken)', 'scrypt', 'Yup', 'nodemailer + SMTP'],
    },
    {
      label: 'Cloud · AWS',
      items: ['AWS Lambda + Function URL (no API Gateway)', 'DynamoDB (single-table + 4 GSIs)', 'CloudWatch Logs', 'IAM (single execution role, scoped inline policy)', 'ap-southeast-1'],
    },
    {
      label: 'CI/CD',
      items: ['GitHub Actions', 'aws-actions/configure-aws-credentials', 'aws-cli (lambda update-function-code, dynamodb create-table, iam create-role)', 'idempotent bash deploy script'],
    },
    {
      label: 'Frontend',
      items: ['React 19', 'TypeScript 5', 'Vite 8', 'react-router-dom 7', 'fetch', 'localStorage', 'CSS modules'],
    },
    {
      label: 'Hosting',
      items: ['AWS Lambda Function URL (ap-southeast-1)', 'Vercel (frontend)'],
    },
  ],
  liveUrl: 'https://swiftrace.vercel.app/',
  sourceUrl: 'https://github.com/Asciente-rks/swiftrace',
  cinematicUrl: '/cinematics/swiftrace-cinematic.html',
  cinematicCaption:
    'A 12-scene interactive walkthrough of the SwiftRace UI — login flow, role-based dashboards, the four-stage shipment pipeline, user management, place-order flow, and the light/dark themes. Click anywhere or press → / Space to advance.',
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
      stack: 'Monorepo · single AWS Lambda (TypeScript, esbuild) + React 19 + Vite frontend',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Browser["Browser<br/>React 19 + Vite + react-router 7"]
    FuncURL["Lambda Function URL<br/>https://*.lambda-url.ap-southeast-1.on.aws"]
    Router["swiftrace-api · single Lambda<br/>router.ts (pattern-matches 14 routes)<br/>adaptEvent(v2 → v1)"]
    UserFns["5 user handlers<br/>create / login / update<br/>delete / getByRole"]
    ShipFns["7 shipment handlers<br/>create / update / track<br/>history / sample / email"]
    DevFns["2 dev handlers<br/>seed / clear DB"]
    DDB[("DynamoDB single table<br/>USER · SHIPMENT · HISTORY<br/>4 GSIs · PAY_PER_REQUEST")]
    SMTP["nodemailer + SMTP<br/>tracking emails"]
    GHA["GitHub Actions<br/>esbuild → zip → aws lambda<br/>update-function-code"]

    Browser -->|fetch + JWT| FuncURL
    FuncURL --> Router
    Router --> UserFns
    Router --> ShipFns
    Router --> DevFns
    UserFns --> DDB
    ShipFns --> DDB
    DevFns --> DDB
    ShipFns --> SMTP
    GHA -.deploy.-> Router

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    classDef ci fill:#0a0e1a,stroke:#94a3b8,color:#94a3b8,stroke-dasharray:4 3
    class Browser,FuncURL,Router,UserFns,ShipFns,DevFns,SMTP edge
    class DDB store
    class GHA ci`,
    notes: [
      'Single-Lambda router fan-out, not 14 separate Lambdas. router.ts pattern-matches the rawPath + HTTP method and dispatches to the matching handler under src/functions/**.',
      'Function URL replaces API Gateway entirely — perpetual free tier, no per-request fee after month 12.',
      'event-adapter.ts translates Function URL events (payload v2.0) into the APIGatewayProxyEvent (v1.0) shape every handler was originally written against — zero handler-code churn.',
      'Single-table DynamoDB with PK/SK prefixes. Four GSIs cover the read patterns the API needs.',
      'Tracking number as the partition key — every customer-facing read is "look up shipment X by tracking" — public reads need zero GSI hops.',
      'History events sit under the same partition as the parent shipment — a single Query returns the full timeline.',
      'Idempotent provisioning — scripts/deploy.sh checks each resource (describe-table, get-function, etc.) before creating it. Re-runs are safe; the "first deploy creates everything" path is the same code as the "1000th deploy updates code" path.',
    ],
    flows: [
      {
        title: 'Role hierarchy',
        blurb:
          'Three roles with a verification gate on top. Admins create users and set the verification status; shippers progress shipments only when verified; customers place orders and track them.',
        mermaid: `flowchart LR
    admin["Admin<br/>manages users<br/>verifies shipment history"]
    shipper["Shipper<br/>updates shipment status<br/>sends tracking emails"]
    customer["Customer<br/>places orders<br/>tracks shipments"]
    verif["verification_status<br/>pending / verified / rejected"]

    admin -->|create / update / delete| shipper
    admin -->|create / update / delete| customer
    admin -.sets.-> verif
    verif -.gates access for.-> shipper
    shipper -->|update status| customer

    classDef tier fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef meta fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class admin,shipper,customer tier
    class verif meta`,
        notes: [
          'verification_status on USER: pending (gated), verified (active shipper), rejected (treated as inactive). Admin-controlled.',
          'Customers can self-register; shippers and admins are admin-created only.',
        ],
      },
      {
        title: 'Order placement & lifecycle',
        blurb:
          'Sample order placement is a single TransactWrite that creates the SHIPMENT row and the initial HISTORY event together. Subsequent shipper updates append immutable HISTORY events under the same partition key — a single Query returns the whole timeline.',
        mermaid: `sequenceDiagram
    autonumber
    actor Customer
    participant SPA as React SPA
    participant API as Lambda /orders/sample
    participant DDB as DynamoDB

    Customer->>SPA: Fill sample order form
    SPA->>API: POST /orders/sample (origin, destination, item)
    API->>DDB: TransactWrite — SHIPMENT (status: created) + HISTORY (historyType: created)
    API-->>SPA: 201 + tracking_number
    SPA-->>Customer: "Order placed — tracking: SR-XXXXXX"

    Note over Customer,DDB: Shipper picks up the package

    actor Shipper
    Shipper->>SPA: Update shipment → picked_up
    SPA->>API: PUT /shipments/{shipment_id}
    API->>DDB: UpdateItem SHIPMENT status_ + PutItem HISTORY event
    API-->>SPA: 200 + updated shipment

    Customer->>SPA: View tracking page
    SPA->>API: GET /shipments/tracking/{tracking_number}
    API->>DDB: Query PK=SHIPMENT#<tracking>
    API-->>SPA: shipment + history array
    SPA-->>Customer: Timeline: created → picked_up`,
      },
      {
        title: 'Delivery status state machine',
        blurb:
          'Five states, strict forward-only transitions. Each transition appends an immutable HISTORY event; the SHIPMENT.status_ field is updated in place so list-by-status reads stay cheap.',
        mermaid: `stateDiagram-v2
    [*] --> created : POST /orders/sample\\nor POST /shipments
    created --> picked_up : Shipper updates status
    picked_up --> in_transit : Shipper updates status
    in_transit --> out_for_delivery : Shipper updates status
    out_for_delivery --> delivered : Shipper updates status
    delivered --> [*]

    note right of created
        Each transition appends
        an immutable HISTORY row.
        Shipment status_ field
        is also updated in place.
    end note`,
      },
      {
        title: 'Admin verification flow',
        blurb:
          'Every HISTORY event carries an admin_verified flag for internal moderation. The flag is stored on the row but stripped from public responses by ShipmentHistoryResponse — customers and shippers never see the verification metadata.',
        mermaid: `flowchart LR
    HistEvent["HISTORY row<br/>historyType: in_transit<br/>admin_verified: false"]
    AdminView["Admin reviews<br/>shipment history"]
    VerifyCall["PUT /shipments/{id}<br/>{ admin_verified: true }"]
    HistUpdated["HISTORY row<br/>admin_verified: true<br/>verifiedAt: iso"]
    PublicResp["Public GET /history<br/>strips admin_verified<br/>+ verifiedAt"]

    HistEvent --> AdminView
    AdminView --> VerifyCall
    VerifyCall --> HistUpdated
    HistUpdated --> PublicResp

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class HistEvent,AdminView,VerifyCall,PublicResp edge
    class HistUpdated store`,
      },
    ],
  },
  database: {
    blurb:
      'DynamoDB single-table design. One table stores users, shipments, and shipment history events; four GSIs cover the read patterns. The same schema is provisioned on first deploy by `aws dynamodb create-table` inside scripts/deploy.sh — no Serverless / CloudFormation involvement.',
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
      { service: 'AWS Lambda', freeTier: '1M invocations/mo + 400K GB-s (perpetual)', weUse: '~5K invocations/mo', headroom: '99.5%' },
      { service: 'Lambda Function URL', freeTier: 'included with Lambda invocations', weUse: 'same', headroom: '99.5%' },
      { service: 'DynamoDB (PAY_PER_REQUEST)', freeTier: '25 GB storage + 25 R/W units (perpetual)', weUse: '<100 MB', headroom: '99%+' },
      { service: 'CloudWatch Logs', freeTier: '5 GB ingestion/mo (perpetual)', weUse: '<50 MB', headroom: '99%' },
      { service: 'GitHub Actions', freeTier: 'unlimited minutes (public repo)', weUse: '<2 min/deploy', headroom: 'unlimited' },
      { service: 'Vercel Hobby', freeTier: '100 GB bandwidth, unlimited deploys', weUse: '<500 MB/mo', headroom: '99.5%' },
    ],
    rationale: [
      'Lambda Function URL over API Gateway — eliminates the $3.50/M request fee that kicked in after the 12-month free tier.',
      'aws-cli direct upload over Serverless Framework — no S3 deploy bucket (which leaves the perpetual free tier after 12 months) and no CloudFormation churn.',
      'DynamoDB over RDS — 25 GB free perpetually, single-digit ms latency, no cold start.',
      'Single-Lambda router over per-route Lambdas — one cold start per warm container instead of 14, simpler IAM, same $0 bill.',
      'Public history responses use a stripped variant (ShipmentHistoryResponse) that hides admin_verified — customers never see internal moderation metadata.',
    ],
  },
  apiEndpoints: [
    { method: 'POST', path: '/auth/login', auth: 'none', purpose: 'Email + password → JWT' },
    { method: 'POST', path: '/users', auth: 'JWT (admin)', purpose: 'Create a new user account' },
    { method: 'GET', path: '/users', auth: 'JWT (admin / shipper)', purpose: 'List users filtered by ?role=' },
    { method: 'PUT', path: '/users/:user_id', auth: 'JWT (admin)', purpose: 'Update user fields, verification status, role' },
    { method: 'DELETE', path: '/users/:user_id', auth: 'JWT (admin)', purpose: 'Permanently delete user' },
    { method: 'POST', path: '/shipments', auth: 'JWT (admin / shipper)', purpose: 'Create a shipment manually' },
    { method: 'PUT', path: '/shipments/:shipment_id', auth: 'JWT (shipper / admin)', purpose: 'Update status — appends a HISTORY event' },
    { method: 'GET', path: '/shipments/tracking/:tracking_number', auth: 'JWT', purpose: 'Fetch shipment by tracking number (no GSI hop)' },
    { method: 'GET', path: '/shipments/status/:status_', auth: 'JWT (shipper / admin)', purpose: 'List all shipments with a given status' },
    { method: 'GET', path: '/shipments/:tracking_number/history', auth: 'JWT', purpose: 'Full history timeline for a shipment' },
    { method: 'POST', path: '/shipments/tracking/email', auth: 'JWT', purpose: 'Send a tracking email to the customer' },
    { method: 'POST', path: '/orders/sample', auth: 'JWT (customer)', purpose: 'Place a sample order — TransactWrite SHIPMENT + initial HISTORY' },
    { method: 'GET', path: '/health', auth: 'none', purpose: 'Lambda health check → { service: "swiftrace-api", message: "ok" }' },
  ],
  conversion: {
    summary:
      'In May 2026, SwiftRace was migrated off Serverless Framework + API Gateway + a Serverless-managed S3 deploy bucket + CloudFormation, and onto a thinner GitHub Actions → AWS Lambda Function URL pipeline. Every handler kept its source unchanged; the conversion lives entirely in router.ts (single Lambda fan-out), event-adapter.ts (v2 → v1 event shape), scripts/deploy.sh (idempotent provisioning), and the new .github/workflows/deploy-backend.yml.',
    mermaid: `flowchart LR
    subgraph BEFORE["BEFORE · Serverless Framework"]
      direction TB
      B1["Browser"]
      B2["AWS API Gateway · REST<br/>billed per request after month 12"]
      B3["14 × Lambda<br/>per-route IAM"]
      B4[("DynamoDB<br/>single table")]
      B5[/"S3 deploy bucket<br/>(serverless artifacts)"/]
      B6["CloudFormation stack"]
      B1 --> B2 --> B3 --> B4
      B6 -.manages.-> B2
      B6 -.manages.-> B3
      B6 -.uses.-> B5
    end

    subgraph AFTER["AFTER · GitHub Actions + Lambda Function URL"]
      direction TB
      A1["Browser"]
      A2["Lambda Function URL<br/>perpetual free tier"]
      A3["1 × Lambda<br/>router.ts → 14 handlers<br/>event-adapter v2 → v1"]
      A4[("DynamoDB<br/>single table · same schema")]
      A5["GitHub Actions<br/>aws lambda update-function-code"]
      A1 --> A2 --> A3 --> A4
      A5 -.deploy zip.-> A3
    end

    BEFORE ==>|migrated 2026-05| AFTER

    classDef before fill:#1e1b1b,stroke:#a78bfa,color:#e2e8f0
    classDef after fill:#0a0e1a,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class B1,B2,B3,B5,B6 before
    class B4 store
    class A1,A2,A3,A5 after
    class A4 store`,
    changes: [
      { before: 'Serverless Framework v3 + serverless.yml', after: 'GitHub Actions workflow + scripts/deploy.sh' },
      { before: 'AWS API Gateway REST (per-route)', after: 'AWS Lambda Function URL (single)' },
      { before: '14 separate Lambda functions', after: '1 Lambda + internal router (router.ts)' },
      { before: 'CloudFormation stack', after: 'Direct aws-cli calls (idempotent)' },
      { before: 'Serverless-managed S3 bucket for code', after: 'aws lambda update-function-code --zip-file (no S3)' },
      { before: 'serverless-dotenv-plugin → Lambda env', after: 'GitHub Secrets/Variables → workflow env → Lambda env' },
      { before: 'Per-function CloudWatch log groups', after: 'Single CloudWatch log group for swiftrace-api' },
      { before: 'API Gateway free tier expires after 12 months', after: 'All free tiers perpetual ($0 forever)' },
    ],
    notes: [
      'Why the change · API Gateway and the Serverless-managed S3 bucket both leave their free tiers at month 12. Replacing them with Lambda Function URL + direct aws-cli upload pushes the perpetual-free promise from "12 months" to "as long as AWS keeps the free tier."',
      'How handler code stayed the same · The router builds an APIGatewayProxyEvent (v1.0) from the Function URL event (v2.0) before delegating. Every file under src/functions/** still reads event.pathParameters / event.body the original way.',
      'Single-Lambda fan-out · One cold start per warm container instead of 14. Memory and timeout tuned once. IAM is one inline policy on one role instead of 14 separate scopings.',
      'Idempotent provisioning · scripts/deploy.sh checks each resource (table, role, function, URL) with describe-* / get-* before creating it, so re-runs are safe and the "first deploy creates everything" path is the same code as the "1000th deploy updates code" path.',
    ],
  },
};
