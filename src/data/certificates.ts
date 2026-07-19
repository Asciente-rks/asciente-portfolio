/* ============================================================
   CERTIFICATES — the certificate wall on the homepage.

   Each block is one certificate. The images live in:
     src/assets/Certificates/previews/   (the preview shown on the page)
     src/assets/Certificates/            (the original PDF, opened on click)

   TO ADD A NEW CERTIFICATE:
   1. Put the PDF in src/assets/Certificates/
   2. Add a preview image of it in src/assets/Certificates/previews/
      (a screenshot or export of page 1 works — .svg, .png or .webp)
   3. Copy one block below and update the file names + text.

   ============================================================ */

export type Certificate = {
  title: string;
  issuer: string;
  detail: string;
  /** File name inside src/assets/Certificates/previews/ */
  preview: string;
  /** File name inside src/assets/Certificates/ — the PDF opened on click. */
  pdf: string;
};

export const certificatesIntro =
  "Every credential below is the real document — tap to enlarge, or download the original PDF.";

export const certificates: Certificate[] = [
  {
    title: "Serverless with AWS Lambda",
    issuer: "Frontend Masters",
    detail: "Production serverless architecture · 2026",
    preview: "serverless-aws.svg",
    pdf: "serverless-aws-dark.pdf",
  },
  {
    title: "Enterprise TypeScript",
    issuer: "Frontend Masters",
    detail: "Type-safe systems at scale · 2026",
    preview: "enterprise-typescript.svg",
    pdf: "enterprise-typescript-dark.pdf",
  },
  {
    title: "Enterprise Architecture Patterns",
    issuer: "Frontend Masters",
    detail: "Scalable application architecture · 2026",
    preview: "enterprise-patterns.svg",
    pdf: "enterprise-patterns-dark.pdf",
  },
  {
    title: "API Design in Node.js, v5",
    issuer: "Frontend Masters",
    detail: "REST API design & implementation · 2026",
    preview: "api-design-nodejs.svg",
    pdf: "api-design-nodejs-v5-dark.pdf",
  },
  {
    title: "Web Security, v2",
    issuer: "Frontend Masters",
    detail: "OWASP, auth & attack surface defence · 2026",
    preview: "web-security.svg",
    pdf: "web-security-v2-dark.pdf",
  },
  {
    title: "The Good Parts of AWS",
    issuer: "Educative",
    detail: "Cutting through the AWS clutter · 2026",
    preview: "good-parts-of-aws.svg",
    pdf: "P5L83VGPGD.pdf",
  },
  {
    title: "Web Application Security",
    issuer: "Educative",
    detail: "Security for the everyday software engineer · 2026",
    preview: "web-app-security-educative.svg",
    pdf: "ZSGE4ZXN8R.pdf",
  },
  {
    title: "GitHub Foundations",
    issuer: "DataCamp",
    detail: "Version control & collaboration",
    preview: "github-foundations.svg",
    pdf: "Github_Foundations.pdf",
  },
  {
    title: "Introduction to SQL Server",
    issuer: "DataCamp",
    detail: "Relational databases & T-SQL · 2026",
    preview: "intro-sql-server.svg",
    pdf: "Intro_SQL_Server.pdf",
  },
  {
    title: "Java Fundamentals",
    issuer: "Course Completion Award",
    detail: "Object-oriented programming · 2023",
    preview: "java-fundamentals.svg",
    pdf: "Java_Fundamentals.pdf",
  },
  {
    title: "Systems Administration",
    issuer: "Course Completion Award",
    detail: "Infrastructure & operations · 2023",
    preview: "systems-administration.svg",
    pdf: "Systems_Administration.pdf",
  },
];
