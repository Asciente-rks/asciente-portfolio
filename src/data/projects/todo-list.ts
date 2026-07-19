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

export const todoList: Project = {
  slug: "todo-list-app",
  title: "To-Do List App",
  status: "live",
  tagline: "A multi-user todo system with a native mobile app — sign up, sign in, and manage tasks from your phone with cloud sync.",
  summary: "Express + Sequelize + MySQL backend deployed on Render, Expo / React Native mobile client distributed as an Android APK via EAS Build. Cold-start resilient with 2-minute timeouts and a friendly wake-up notice.",
  tech: [
    "Express 5",
    "Sequelize",
    "MySQL",
    "Expo SDK 54",
    "React Native",
    "EAS Build",
    "Render",
    "Android",
    "iOS",
  ],
  techGroups: [
    {
      label: "Backend",
      items: ["Node.js", "TypeScript 5", "Express 5", "Sequelize 6", "mysql2", "JWT", "bcrypt", "Yup", "ts-node-dev"],
    },
    {
      label: "Database",
      items: ["MySQL", "Aiven", "FreeSQLDatabase", "Filess.io"],
    },
    {
      label: "Mobile App",
      items: [
        "Expo SDK 54",
        "React Native 0.81",
        "React 19",
        "TypeScript 5",
        "@react-native-async-storage/async-storage",
        "@react-native-community/datetimepicker",
        "lucide-react-native",
        "fetch + AbortController",
      ],
    },
    {
      label: "Build · Distribution",
      items: ["EAS Build", "GitHub Releases", "Android APK", "iOS", "Web"],
    },
    {
      label: "Hosting",
      items: ["Render Web Service"],
    },
  ],
  liveUrl: "https://expo.dev/accounts/asciente-rks/projects/to-do-list-ts-frontend/builds/b3c0fe0b-93d5-4a8d-a56f-7ebd12440418",
  liveLabel: "Download APK",
  sourceUrl: "https://github.com/Asciente-rks/todo-list",
  cinematicUrl: "/cinematics/todo-list",
  cinematicCaption: "An 8-scene walkthrough of TaskFlow — a real native Android todo app with cloud sync. Login flow, the honest cold-start banner, task list, add modal, and the $0/month full stack. Click anywhere or press → / Space to advance.",
  thumbnail: "Todo/Login_Todo.jpg",
  gallery: [
    {
      src: "Todo/Login_Todo.jpg",
      caption: "Sign-in",
    },
    {
      src: "Todo/Register_Todo.jpg",
      caption: "Register",
    },
    {
      src: "Todo/Tasks_Todo.jpg",
      caption: "Task list with due dates",
    },
    {
      src: "Todo/ProfileSettings_Todo.jpg",
      caption: "Profile settings",
    },
    {
      src: "Todo/ChangePassword_Todo.jpg",
      caption: "Change password",
    },
  ],
  cost: {
    monthlyTotal: "$0/month",
    rows: [
      {
        service: "Render Web Service",
        freeTier: "750 hours/mo, sleeps after 15 min",
        weUse: "always-on under monitoring",
        headroom: "within limits",
      },
      {
        service: "MySQL (Aiven / Filess.io)",
        freeTier: "5 GB / 1 GB depending on provider",
        weUse: "<50 MB",
        headroom: "95%+",
      },
      {
        service: "EAS Build (Expo)",
        freeTier: "30 builds/mo on free",
        weUse: "<5 builds/mo",
        headroom: "80%+",
      },
      {
        service: "GitHub Releases (APK)",
        freeTier: "unlimited public assets",
        weUse: "<50 MB total",
        headroom: "unlimited",
      },
    ],
  },
};
