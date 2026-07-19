/* ============================================================
   EXPERIENCE — the timeline on the homepage.

   Each block between { } is one entry. To add a new job, copy a
   whole block (from { to },) and edit the text. Entries appear
   in the order listed here — newest first is recommended.

   `track` controls the small badge colour:
     "software"   → Software Engineering badge
     "qa"         → Quality Assurance badge
     "foundation" → Early-career badge
   ============================================================ */

export type ExperienceTrack = "software" | "qa" | "foundation";

export type ExperienceEntry = {
  company: string;
  role: string;
  track: ExperienceTrack;
  trackLabel: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
};

export const experienceIntro =
  "One internship, two concurrent disciplines — listed separately because they were practiced separately, every day.";

export const experience: ExperienceEntry[] = [
  {
    company: "IOL Inc.",
    role: "Backend Developer Intern",
    track: "software",
    trackLabel: "Software Engineering",
    period: "January 2026 – May 2026",
    location: "Baguio City, Philippines",
    summary:
      "Backend engineering on real internal systems, trained directly under the CTO and senior backend engineers.",
    bullets: [
      "Worked inside production codebases — code reviews, git workflow, sprint ceremonies — applying the team's production-grade coding standards from day one, not a sandboxed intern project.",
      "Built and shipped serverless features on AWS using Lambda, DynamoDB, CloudFormation, and the Serverless Framework, following the company's architecture and review process.",
      "Designed, built, and solo-presented Nexus Track — a full-stack, AI-assisted bug tracking system — to the CTO, senior engineers, and the frontend lead as the CTO-assigned capstone project.",
      "Nexus Track was later flagged for engineering-team adoption and earned repeated commendation for technical depth.",
      "Earned a full-time return offer as Junior Backend Developer / QA on the strength of production delivery and performance reviews from the CTO and senior engineering team.",
    ],
  },
  {
    company: "IOL Inc.",
    role: "Quality Assurance Engineer · concurrent role",
    track: "qa",
    trackLabel: "Quality Assurance",
    period: "January 2026 – May 2026",
    location: "Baguio City, Philippines",
    summary:
      "A standing QA assignment carried alongside backend deliverables — testing the company's internal production systems end to end.",
    bullets: [
      "Performed manual and exploratory testing across 5+ internal production systems, validating new features and release candidates before production deployment.",
      "Wrote reproducible bug reports — steps, expected vs. actual behaviour, environment, and evidence — that developers could act on without back-and-forth.",
      "Verified fixes and re-tested surrounding functionality, coordinating directly with backend and frontend developers to shorten regression turnaround time.",
      "Handled ticket triage and sprint follow-ups, keeping defect queues clean and release-blocking issues visible to the team.",
      "Validated release stability across builds, giving the go / no-go signal QA exists to provide.",
    ],
  },
  {
    company: "Concentrix Baguio",
    role: "Customer Service Representative",
    track: "foundation",
    trackLabel: "Foundation",
    period: "October 2021 – April 2022",
    location: "Baguio City, Philippines",
    summary:
      "Marketplace dispute mediation under strict SLA windows — where the triage instincts started.",
    bullets: [
      "Mediated buyer–seller marketplace disputes within strict SLA windows, balancing policy, evidence, and de-escalation.",
      "Practiced root-cause analysis on every escalation — the same discipline now applied to defect triage and bug reproduction in QA.",
      "Built the habits used daily in QA work: precise written communication, calm handling of pressure, and documentation that holds up later.",
    ],
  },
];
