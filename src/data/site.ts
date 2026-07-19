/* ============================================================
   SITE-WIDE TEXT & LINKS — edit anything between quotes.

   This file controls: your name, the role line under it, the
   intro paragraph, contact links, and browser-tab titles.
   No coding knowledge needed — just change the text.
   ============================================================ */

export const siteConfig = {
  identity: {
    fullName: "Ralph Kenneth Sonio",
    firstName: "Ralph",
    /** The role line shown under your name, in the header and browser tab. */
    roleTitle: "Software Engineer | QA Engineer",
    location: "Baguio City, Philippines",
  },

  hero: {
    /** Small label above your name. */
    eyebrow: "Portfolio",
    /** Your intro paragraph. Keep it to 2–3 sentences for the cleanest look. */
    summary:
      "I build serverless, cloud-native backend systems on AWS — and I test software the way a QA engineer does: methodically, reproducibly, and before users ever see a defect. Every project here is live, documented, and runs at $0/month by design.",
    /** Quick facts shown under the summary. Edit freely. */
    facts: [
      { label: "Focus", value: "Cloud-native backend · QA automation" },
      { label: "Based in", value: "Baguio City, Philippines" },
    ],
  },

  contact: {
    email: "sonioralphkenneth@gmail.com",
    github: "https://github.com/Asciente-rks",
    linkedin: "https://www.linkedin.com/in/ralph-kenneth-sonio-59a615391",
    footerEyebrow: "Contact",
    footerHeading: "Let's build something reliable.",
    footerLine:
      "Open to backend engineering and QA roles — or a conversation about either.",
  },

  /** Browser tab + search-engine text. */
  meta: {
    title: "Ralph Kenneth Sonio · Software Engineer | QA Engineer",
    description:
      "Software Engineer and QA Engineer. Serverless AWS backend projects, quality assurance practice, experience, and certifications.",
    siteUrl: "https://asciente-portfolio.vercel.app",
  },
};
