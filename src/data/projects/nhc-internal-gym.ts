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

export const nhcInternalGym: Project = {
  slug: "nhc-internal-gym",
  title: "NHC Internal Gym",
  status: "archived",
  tagline: "A custom desktop management solution for an internal gym — focused on high-performance local data handling, time tracking, and member search.",
  summary: ".NET Windows Forms application with SQL Server backend. Built for offline-first internal use where speed and reliability matter more than connectivity. Source not on GitHub — delivered as a binary to the client.",
  tech: [".NET", "Windows Forms", "C#", "SQL Server Express", "ADO.NET", "Visual Studio"],
  techGroups: [
    {
      label: "Desktop App",
      items: ["C#", ".NET Framework / .NET", "Windows Forms", "Modular form architecture"],
    },
    {
      label: "Database",
      items: ["SQL Server Express", "Local instance (sub-ms queries)"],
    },
    {
      label: "Data Access",
      items: ["ADO.NET", "SQL stored procedures"],
    },
    {
      label: "Tooling",
      items: ["Visual Studio", "SQL Server Management Studio"],
    },
  ],
  thumbnail: "NHC/Login.png",
  gallery: [
    {
      src: "NHC/Login.png",
      caption: "Sign-in screen",
    },
    {
      src: "NHC/SearchMember.png",
      caption: "Member search",
    },
    {
      src: "NHC/TimeTracking.png",
      caption: "Time tracking",
    },
    {
      src: "NHC/Inventory.png",
      caption: "Inventory",
    },
    {
      src: "NHC/Inventory2.png",
      caption: "Inventory — detail view",
    },
  ],
  cost: {
    monthlyTotal: "On-prem",
    rows: [
      {
        service: ".NET runtime",
        freeTier: "free, redistributable",
        weUse: "embedded",
        headroom: "n/a",
      },
      {
        service: "SQL Server Express",
        freeTier: "10 GB DB size",
        weUse: "<500 MB",
        headroom: "95%",
      },
      {
        service: "Windows host",
        freeTier: "on-prem hardware",
        weUse: "existing internal machine",
        headroom: "n/a",
      },
    ],
  },
};
