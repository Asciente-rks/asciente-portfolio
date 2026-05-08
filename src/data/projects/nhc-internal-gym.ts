import type { Project } from "./types";

export const nhcInternalGym: Project = {
  slug: 'nhc-internal-gym',
  title: 'NHC Internal Gym',
  role: 'Desktop',
  status: 'archived',
  tagline:
    'A custom desktop management solution for an internal gym — focused on high-performance local data handling, time tracking, and member search.',
  summary:
    '.NET Windows Forms application with SQL Server backend. Built for offline-first internal use where speed and reliability matter more than connectivity. Source not on GitHub — delivered as a binary to the client.',
  language: 'C#',
  tech: ['.NET', 'Windows Forms', 'C#', 'SQL Server Express', 'ADO.NET', 'Visual Studio'],
  techGroups: [
    {
      label: 'Desktop App',
      items: ['C#', '.NET Framework / .NET', 'Windows Forms', 'Modular form architecture'],
    },
    {
      label: 'Database',
      items: ['SQL Server Express', 'Local instance (sub-ms queries)'],
    },
    {
      label: 'Data Access',
      items: ['ADO.NET', 'SQL stored procedures'],
    },
    {
      label: 'Tooling',
      items: ['Visual Studio', 'SQL Server Management Studio'],
    },
  ],

  thumbnail: 'NHC/Login.png',
  gallery: [
    { src: 'NHC/Login.png', caption: 'Sign-in screen' },
    { src: 'NHC/SearchMember.png', caption: 'Member search' },
    { src: 'NHC/TimeTracking.png', caption: 'Time tracking' },
    { src: 'NHC/Inventory.png', caption: 'Inventory' },
    { src: 'NHC/Inventory2.png', caption: 'Inventory — detail view' },
  ],

  architecture: {
    mermaid: `graph TB
    Forms["Windows Forms · .NET / C#<br/>Sign-in · Search · Time<br/>Inventory · Member CRUD"]
    SQL[("SQL Server Express<br/>local instance · sub-ms queries<br/>members · time_logs · inventory")]

    Forms -->|ADO.NET| SQL

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Forms edge
    class SQL store`,
    notes: [
      'Offline-first by design — internal gym workflow tolerates no network downtime, so the entire stack runs locally.',
      'Direct SQL access via ADO.NET for sub-millisecond local queries.',
      'Modular form architecture — each operations area (members, time, inventory) is its own form module, easy to maintain.',
    ],
  },
  database: {
    blurb: 'Local SQL Server schema covering members, plans, time logs, sessions, inventory, employees, and an audit log.',
    mermaid: `erDiagram
    MEMBERSHIP_PLAN ||--o{ MEMBER : subscribes
    MEMBER ||--o{ TIME_LOG : logs
    MEMBER ||--o{ SESSION : attends
    EMPLOYEE ||--o{ TIME_LOG : verifies
    EMPLOYEE ||--o{ AUDIT_LOG : creates
    INVENTORY_CATEGORY ||--o{ INVENTORY : categorizes

    MEMBER {
        int id PK
        string firstName
        string lastName
        date joinDate
        int planId FK
    }
    MEMBERSHIP_PLAN {
        int id PK
        string name UK
        decimal price
        int durationDays
    }
    TIME_LOG {
        int id PK
        int memberId FK
        datetime checkIn
        datetime checkOut
        int verifiedBy FK
    }
    SESSION {
        int id PK
        int memberId FK
        datetime startTime
        string activity
    }
    INVENTORY {
        int id PK
        string name
        int quantity
        int categoryId FK
    }
    INVENTORY_CATEGORY {
        int id PK
        string name UK
    }
    EMPLOYEE {
        int id PK
        string name
        string role
        string passwordHash
    }
    AUDIT_LOG {
        int id PK
        int employeeId FK
        string action
        datetime timestamp
    }`,
    tables: [],
  },
  cost: {
    monthlyTotal: 'On-prem',
    rows: [
      { service: '.NET runtime', freeTier: 'free, redistributable', weUse: 'embedded', headroom: 'n/a' },
      { service: 'SQL Server Express', freeTier: '10 GB DB size', weUse: '<500 MB', headroom: '95%' },
      { service: 'Windows host', freeTier: 'on-prem hardware', weUse: 'existing internal machine', headroom: 'n/a' },
    ],
    rationale: [
      'Internal gym workflow tolerates no internet downtime — chose offline-first .NET over a web stack.',
      'SQL Server Express over MySQL — first-class .NET tooling and the gym already had Windows infrastructure.',
    ],
  },
};
