import type { Project } from "./types";

export const h100Ecolodge: Project = {
  slug: 'h100-ecolodge',
  title: 'H100 Ecolodge',
  role: 'Backend / Full-Stack',
  status: 'archived',
  tagline:
    'A commercial booking engine for an ecolodge — built under zero-cost infrastructure constraints as the client requested. Delivered as a school capstone.',
  summary:
    'Spring Boot + Spring Data JPA backend with MySQL on Aiven, vanilla HTML/CSS/JS on the customer-facing storefront, and a full admin panel for bookings, rooms, halls, catering, payments, and analytics. No live deployment — handed off to the client.',
  language: 'Java',
  tech: ['Java 17', 'Spring Boot', 'Spring Data JPA', 'Spring Security', 'MySQL', 'Aiven', 'HTML', 'CSS', 'JavaScript', 'Maven'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Java 17', 'Spring Boot 3', 'Spring MVC', 'Spring Data JPA', 'Hibernate', 'Spring Security (session-based)', 'Maven'],
    },
    {
      label: 'Database',
      items: ['MySQL', 'Aiven (free tier)'],
    },
    {
      label: 'Frontend (storefront)',
      items: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Bootstrap-style layouts'],
    },
    {
      label: 'Frontend (admin)',
      items: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Charting library for analytics'],
    },
    {
      label: 'Hosting',
      items: ['Java host (Render / Railway)', 'Aiven (DB)'],
    },
  ],

  sourceUrl: 'https://github.com/Ecolodge-STI/EcoWeb',
  thumbnail: 'H100/ADMIN_Login.png',
  gallery: [
    { src: 'H100/ADMIN_Login.png', caption: 'Admin login' },
    { src: 'H100/CXUI_Homepage.png', caption: 'Customer homepage' },
    { src: 'H100/CXUI_Hompage2.png', caption: 'Customer homepage — secondary view' },
    { src: 'H100/CXUI_Halls.png', caption: 'Function halls catalog' },
    { src: 'H100/CXUI_Rooms.png', caption: 'Rooms catalog' },
    { src: 'H100/CXUI_Catering.png', caption: 'Catering catalog' },
    { src: 'H100/CXUI_BranchSelection.png', caption: 'Branch selection' },
    { src: 'H100/CXUI_Bookings.png', caption: 'Customer bookings' },
    { src: 'H100/CXUI_Bookings2.png', caption: 'Customer bookings — detail view' },
    { src: 'H100/ADMIN_Dashboard.png', caption: 'Admin dashboard' },
    { src: 'H100/ADMIN_Dashboard2.png', caption: 'Admin dashboard — analytics' },
    { src: 'H100/ADMIN_Booking.png', caption: 'Admin bookings' },
    { src: 'H100/ADMIN_Booking2.png', caption: 'Admin bookings — detail' },
    { src: 'H100/ADMIN_ManageRooms.png', caption: 'Manage rooms' },
    { src: 'H100/ADMIN_ManageRooms2.png', caption: 'Manage rooms — detail' },
    { src: 'H100/ADMIN_Payments.png', caption: 'Payments' },
    { src: 'H100/ADMIN_Payments2.png', caption: 'Payments — ledger' },
    { src: 'H100/ADMIN_PaymentLogs.png', caption: 'Payment logs' },
    { src: 'H100/ADMIN_ReservationLogs.png', caption: 'Reservation logs' },
    { src: 'H100/ADMIN_SystemLogs.png', caption: 'System logs' },
    { src: 'H100/ADMIN_DataAnalytics.png', caption: 'Data analytics' },
    { src: 'H100/ADMIN_ManageUsers.png', caption: 'Manage users' },
    { src: 'H100/ADMIN_ManageUsers2.png', caption: 'Manage users — detail' },
    { src: 'H100/ADMIN_EmployeeManagement.png', caption: 'Employee management' },
    { src: 'H100/ADMIN_Content.png', caption: 'Content management' },
  ],
  repos: [
    {
      name: 'EcoWeb',
      url: 'https://github.com/Ecolodge-STI/EcoWeb',
      stack: 'Spring Boot + Spring Data JPA + MySQL · Customer storefront + admin panel',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Customer["Customer Browser<br/>Vanilla HTML/CSS/JS<br/>storefront + bookings"]
    Admin["Admin Browser<br/>Admin Panel<br/>operations console"]
    Spring["Spring Boot · Java 17<br/>Spring MVC + Spring Data JPA<br/>Spring Security session auth"]
    MySQL[("MySQL · Aiven free tier<br/>bookings · rooms · halls<br/>catering · payments<br/>+ audit logs")]

    Customer -->|REST + Session| Spring
    Admin -->|REST + Session| Spring
    Spring --> MySQL

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Customer,Admin,Spring edge
    class MySQL store`,
    notes: [
      'Zero-cost infrastructure constraint — chose Aiven\'s free MySQL tier and a free-tier-friendly Java host instead of paid cloud DBs.',
      'Customer-facing storefront served as static HTML/CSS/JS — fast, no SPA build pipeline, easy to maintain for the client.',
      'Admin panel is a complete operations console: bookings, rooms, halls, catering, payments, payment logs, reservation logs, system logs, employee management, data analytics.',
      'Audit-trail tables (payment_logs, reservation_logs, system_logs) preserve every state change for forensic review.',
    ],
  },
  database: {
    blurb:
      'Relational schema across bookings, branches, rooms, halls, catering, users, employees, payments, and three audit-trail tables.',
    mermaid: `erDiagram
    BRANCH ||--o{ ROOM : has
    BRANCH ||--o{ HALL : has
    BRANCH ||--o{ CATERING : has
    USER ||--o{ BOOKING : makes
    ROOM ||--o{ BOOKING : booked
    HALL ||--o{ BOOKING : booked
    CATERING ||--o{ BOOKING : ordered
    BOOKING ||--o{ PAYMENT : has
    PAYMENT ||--o{ PAYMENT_LOG : audits
    BOOKING ||--o{ RESERVATION_LOG : audits
    USER ||--o| EMPLOYEE : isStaff
    EMPLOYEE ||--o{ SYSTEM_LOG : creates

    USER {
        uuid id PK
        string email UK
        string role
        string passwordHash
    }
    BRANCH {
        uuid id PK
        string name
        string address
    }
    ROOM {
        uuid id PK
        uuid branchId FK
        string type
        decimal price
    }
    HALL {
        uuid id PK
        uuid branchId FK
        int capacity
        decimal price
    }
    CATERING {
        uuid id PK
        uuid branchId FK
        string menu
        decimal pricePerHead
    }
    BOOKING {
        uuid id PK
        uuid userId FK
        date checkIn
        date checkOut
        string status
    }
    PAYMENT {
        uuid id PK
        uuid bookingId FK
        decimal amount
        string method
    }
    PAYMENT_LOG {
        uuid id PK
        uuid paymentId FK
        string action
        datetime at
    }
    RESERVATION_LOG {
        uuid id PK
        uuid bookingId FK
        string action
        datetime at
    }
    SYSTEM_LOG {
        uuid id PK
        uuid actorId FK
        string event
        datetime at
    }
    EMPLOYEE {
        uuid id PK
        uuid userId FK
        string position
        date hiredAt
    }`,
    tables: [],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'Java host (Render / Railway)', freeTier: 'free-tier with sleep behavior', weUse: 'within free tier', headroom: 'within limits' },
      { service: 'MySQL (Aiven)', freeTier: 'Free DB tier', weUse: '<100 MB', headroom: '95%+' },
      { service: 'Static frontend hosting', freeTier: 'unlimited bandwidth on most providers', weUse: '<1 GB/mo', headroom: '99%' },
    ],
    rationale: [
      'Aiven free tier for MySQL — managed, zero ops, low risk for a commercial workload at this scale.',
      'Vanilla HTML/CSS/JS storefront — no SPA build, simple deploy, content updates by editing files.',
      'Spring Boot + Spring Data JPA — mature Java ecosystem, easy to hand off to another developer for client maintenance.',
    ],
  },
};
