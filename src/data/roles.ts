/* ============================================================
   ROLE EXPLORER — the "choose a role" section on the homepage.

   Edit anything between quotes. The Software Engineer panel
   automatically shows your stack (src/data/stack.ts) and your
   projects (src/data/projects/), so only its intro text lives
   here. The QA panel content is fully controlled from this file.
   ============================================================ */

export const roleExplorer = {
  eyebrow: "Explore my work",
  heading: "Which role would you like to explore?",
  subline:
    "I work across two disciplines. Pick one to see the relevant side of my portfolio.",

  softwareEngineer: {
    label: "Software Engineer",
    /** Short line shown inside the selection button. */
    buttonHint: "Projects · Architecture · Stack",
    /** Intro shown at the top of the panel once selected. */
    intro:
      "Nine systems designed, shipped, and kept alive — serverless AWS backends, desktop apps, mobile apps, and full-stack products. Every one runs at $0/month on carefully chosen free tiers.",
  },

  qaEngineer: {
    label: "QA Engineer",
    buttonHint: "Manual · Automation · Process",
    intro:
      "Quality assurance is not an afterthought to my engineering work — it is a concurrent discipline. At IOL Inc. I manually tested 5+ internal production systems while shipping backend features. Today that practice extends into automation: Jest for unit testing, Supertest for integration testing, and Playwright for end-to-end testing.",

    /** The practice cards. Add or remove blocks freely. */
    practices: [
      {
        title: "Manual & Exploratory Testing",
        body: "Structured test passes across web, desktop, and mobile builds — happy paths, edge cases, and the unhappy paths developers forget. Release candidates get validated before anything reaches production.",
      },
      {
        title: "Automated Testing",
        body: "Jest for unit tests, Supertest for API integration tests, and Playwright for end-to-end browser flows — automation practice that grew directly out of manual QA. Postman stays in the loop for exploratory API checks.",
      },
      {
        title: "Bug Reporting & Triage",
        body: "Reproducible reports with steps, expected vs. actual behaviour, environment, and evidence — written so a developer can act without a single follow-up question. Severity tagging and ticket triage keep the queue honest.",
      },
      {
        title: "Regression & Release Validation",
        body: "Fixes get verified, surrounding features get re-tested, and regression sweeps run before every deploy. Coordinating directly with developers shortened regression turnaround at IOL Inc.",
      },
      {
        title: "Quality Standards",
        body: "Acceptance criteria mapped to the ISO/IEC 25010 quality model — functional suitability, reliability, usability, security — so \"done\" means measurably done.",
      },
      {
        title: "Developer Collaboration",
        body: "QA that works with engineering, not against it: sprint follow-ups, release notes review, and direct pairing with backend and frontend developers to close defects fast.",
      },
    ],

    /** Chips shown under "QA toolkit". */
    toolkit: [
      "Manual Testing",
      "Exploratory Testing",
      "Jest (unit)",
      "Supertest (integration)",
      "Playwright (E2E)",
      "Postman",
      "Regression Testing",
      "Bug Reports",
      "Test Documentation",
      "ISO/IEC 25010",
      "GitHub Issues",
      "SQL (data checks)",
      "Chrome DevTools",
    ],

    /** Three headline facts. Keep them short. */
    stats: [
      { value: "5+", label: "production systems tested at IOL Inc." },
      { value: "ISO/IEC 25010", label: "quality model applied to acceptance criteria" },
      { value: "QA + Dev", label: "full-time return offer earned in both roles" },
    ],
  },
};
