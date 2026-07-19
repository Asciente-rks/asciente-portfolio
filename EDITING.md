# How to edit this portfolio (no coding needed)

Everything you'd ever want to change lives in **`src/data/`**. You never need
to touch the design files. Edit a file on GitHub (press `.` or the pencil
icon), commit to `main`, and Vercel redeploys the site automatically in
~1 minute.

> **The one rule:** only change text **between quotes** (`"like this"`), and
> never delete the commas, brackets or braces around it. If the site fails to
> build after an edit, you most likely removed a quote or comma — compare
> against this guide.

---

## Cheat sheet — "I want to change…"

| What you want to change | File to edit |
| --- | --- |
| My name, role line, intro paragraph, quick facts | `src/data/site.ts` |
| Email / GitHub / LinkedIn links, footer text | `src/data/site.ts` |
| The "Which role would you like to explore?" wording | `src/data/roles.ts` |
| Everything inside the **QA Engineer** panel | `src/data/roles.ts` |
| The tech stack categories (Software Engineer panel) | `src/data/stack.ts` |
| A project's title, description, gallery, cost table | `src/data/projects/<project>.ts` |
| Which projects appear, and in what order | `src/data/projects/index.ts` |
| Experience entries (jobs, bullets, badges) | `src/data/experience.ts` |
| Education & awards row | `src/data/experience.ts` (bottom) |
| Certificates | `src/data/certificates.ts` |
| My photo | replace `src/assets/GradPic_Sonio.jpg` (keep the same file name) |

---

## Common tasks

### Change my intro or role line
Open `src/data/site.ts`. The `roleTitle` line controls the text under your
name and in the browser tab. The `summary` is the intro paragraph.

### Add a work experience
Open `src/data/experience.ts`. Copy one whole block — everything from `{` to
`},` — paste it above the others, and edit the text. The `track` value
controls the badge: `"software"`, `"qa"`, or `"foundation"`.

### Add a certificate
1. Upload the PDF into `src/assets/Certificates/`.
2. Make a preview image of page 1 (a screenshot works — `.png`, `.webp` or
   `.svg`) and upload it into `src/assets/Certificates/previews/`.
3. Open `src/data/certificates.ts`, copy one block, and update the
   `title`, `issuer`, `detail`, `preview` and `pdf` file names.

### Add a project
1. Create a folder of screenshots in `src/assets/YourProject/`.
2. In `src/data/projects/`, duplicate an existing project file (e.g.
   `judgement-cut.ts`), rename it, and edit its content. Give it a unique
   `slug` (lowercase-with-dashes — this becomes the page URL).
3. Register it in `src/data/projects/index.ts`: add an import line at the
   top and the project's name to the list below — same pattern as the
   others. The list order is the display order.

### Hide a project without deleting it
Open `src/data/projects/index.ts` and remove it from the `projects: [...]`
list (leave its file in place).

### Change the site colours
Open `src/styles/globals.css` — section `01 · THEME TOKENS` at the top. The
`--accent` value is the highlight colour used everywhere. Light theme is
under `:root.theme-light`, dark under `:root`.

---

## What's where (for the curious)

```
src/
├── data/          ← ALL your content. This is where you edit.
├── assets/        ← images, certificate PDFs + previews
├── components/    ← reusable page pieces (design — rarely touched)
├── layouts/       ← page shell: fonts, theme, top bar (rarely touched)
├── pages/         ← the routes: homepage, project pages, cinematics
└── styles/        ← globals.css (site design system)
```

The homepage (`src/pages/index.astro`) is just a stack of components — Hero,
RoleSelector, Experience, Certificates — each of which reads its content
from `src/data/`. That's the whole architecture.
