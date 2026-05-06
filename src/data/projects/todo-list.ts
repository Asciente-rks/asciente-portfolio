import type { Project } from "./types";

// =============================================================================
// Todo List
// Edit the fields below to update what shows on the home card and the
// /projects/<slug> detail page. Architecture / database mermaid diagrams
// live in the same object below for editor-friendly co-location.
// =============================================================================

export const todoList: Project = {
  slug: 'todo-list-app',
  title: 'To-Do List App',
  role: 'Full-Stack Mobile',
  status: 'live',
  tagline:
    'A multi-user todo system with a native mobile app — sign up, sign in, and manage tasks from your phone with cloud sync.',
  summary:
    'Express + Sequelize + MySQL backend deployed on Render, Expo / React Native mobile client distributed as an Android APK via EAS Build. Cold-start resilient with 2-minute timeouts and a friendly wake-up notice.',
  language: 'TypeScript',
  tech: ['Express 5', 'Sequelize', 'MySQL', 'Expo SDK 54', 'React Native', 'EAS Build', 'Render', 'Android', 'iOS'],
  techGroups: [
    {
      label: 'Backend',
      items: ['Node.js', 'TypeScript 5', 'Express 5', 'Sequelize 6', 'mysql2', 'JWT', 'bcrypt', 'Yup', 'ts-node-dev'],
    },
    {
      label: 'Database',
      items: ['MySQL', 'Aiven', 'FreeSQLDatabase', 'Filess.io'],
    },
    {
      label: 'Mobile App',
      items: ['Expo SDK 54', 'React Native 0.81', 'React 19', 'TypeScript 5', '@react-native-async-storage/async-storage', '@react-native-community/datetimepicker', 'lucide-react-native', 'fetch + AbortController'],
    },
    {
      label: 'Build · Distribution',
      items: ['EAS Build', 'GitHub Releases', 'Android APK', 'iOS', 'Web'],
    },
    {
      label: 'Hosting',
      items: ['Render Web Service'],
    },
  ],
  liveUrl: 'https://expo.dev/accounts/asciente-rks/projects/to-do-list-ts-frontend/builds/b3c0fe0b-93d5-4a8d-a56f-7ebd12440418',
  liveLabel: 'Download APK',
  sourceUrl: 'https://github.com/Asciente-rks/todo-list',
  thumbnail: 'Todo/Login_Todo.jpg',
  gallery: [
    { src: 'Todo/Login_Todo.jpg', caption: 'Sign-in' },
    { src: 'Todo/Register_Todo.jpg', caption: 'Register' },
    { src: 'Todo/Tasks_Todo.jpg', caption: 'Task list with due dates' },
    { src: 'Todo/ProfileSettings_Todo.jpg', caption: 'Profile settings' },
    { src: 'Todo/ChangePassword_Todo.jpg', caption: 'Change password' },
  ],
  repos: [
    { name: 'todo-list', url: 'https://github.com/Asciente-rks/todo-list', stack: 'Express 5 + Sequelize + MySQL + JWT' },
    { name: 'todo-list-frontend', url: 'https://github.com/Asciente-rks/todo-list-frontend', stack: 'Expo / React Native — Android, iOS, web' },
  ],
  architecture: {
    mermaid: `graph TB
    Mobile["Mobile / Web<br/>Expo SDK 54 + RN 0.81<br/>AsyncStorage JWT<br/>2-min AbortController"]
    Express["Express 5 backend<br/>Render Web Service<br/>Sequelize 6 + mysql2"]
    MySQL[("MySQL · free-tier provider<br/>users · todos<br/>indexed FK on userId")]
    EAS["EAS Build · Expo"]
    Outputs["Android APK · iOS · Web"]

    Mobile -->|HTTPS + JWT with retry| Express
    Express --> MySQL
    EAS --> Outputs
    Mobile -.- EAS

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    classDef store fill:#0a0e1a,stroke:#5eead4,color:#5eead4
    class Mobile,Express,EAS,Outputs edge
    class MySQL store`,
    notes: [
      'Render free tier for the backend — sleeps after 15 min idle. The mobile app handles this gracefully: 2-minute request timeout (covers cold start) + WakeUpNotice banner + retry wrapper.',
      'JWT in AsyncStorage — works the same on Android, iOS, and web. No platform-specific secure storage needed at this scale.',
      'Single-flag auth state in App.tsx — isAuthenticated + isRegistering toggle which screen renders. No navigation library; keeps the bundle small.',
    ],
  },
  database: {
    blurb: 'Two tables. Both keyed by UUID v4. Simple 1-to-many: one user → many todos.',
    mermaid: `erDiagram
    USER ||--o{ TODO : owns

    USER {
        uuid id PK
        string username UK
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }
    TODO {
        uuid id PK
        string title
        string description
        bool completed
        datetime dueDate
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }`,
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'username', type: 'VARCHAR', notes: 'unique' },
          { name: 'email', type: 'VARCHAR', notes: 'unique' },
          { name: 'password', type: 'VARCHAR', notes: 'bcrypt hash' },
        ],
      },
      {
        name: 'todos',
        columns: [
          { name: 'id', type: 'UUID (PK)' },
          { name: 'title', type: 'VARCHAR' },
          { name: 'description', type: 'VARCHAR', notes: 'optional' },
          { name: 'completed', type: 'BOOLEAN' },
          { name: 'dueDate', type: 'DATETIME', notes: 'nullable' },
          { name: 'userId', type: 'UUID (FK)', notes: 'indexed' },
        ],
      },
    ],
  },
  cost: {
    monthlyTotal: '$0/month',
    rows: [
      { service: 'Render Web Service', freeTier: '750 hours/mo, sleeps after 15 min', weUse: 'always-on under monitoring', headroom: 'within limits' },
      { service: 'MySQL (Aiven / Filess.io)', freeTier: '5 GB / 1 GB depending on provider', weUse: '<50 MB', headroom: '95%+' },
      { service: 'EAS Build (Expo)', freeTier: '30 builds/mo on free', weUse: '<5 builds/mo', headroom: '80%+' },
      { service: 'GitHub Releases (APK)', freeTier: 'unlimited public assets', weUse: '<50 MB total', headroom: 'unlimited' },
    ],
    rationale: [
      'Render over a long-running VPS — auto-deploys on push, free SSL, free tier includes managed Postgres or external MySQL.',
      'Expo over bare React Native — managed builds, OTA updates, single codebase for Android + iOS + web.',
      'APK sideload over Play Store — Play Store costs $25 once + ongoing review overhead. Sideload is free.',
      '2-min client timeout — Render\'s free-tier cold start can take 30–60s; padding to 2 min covers worst-case wake-up cleanly.',
    ],
  },
};
