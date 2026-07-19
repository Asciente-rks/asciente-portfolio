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

export const theLastLight: Project = {
  slug: "the-last-light",
  title: "The Last Light",
  status: "archived",
  tagline: "A tutorial-based 3D horror game from User1 Productions, extended with additional enemy AI, UI, accessibility features, and sound design for a more exciting gameplay loop.",
  summary: "Built on User1 Productions' Unity 3D series. Extensions include a second enemy archetype, expanded HUD, options menu with rebindable controls, accessibility toggles, and a custom SFX/music pass.",
  tech: ["Unity", "C#", "Blender", "VS Code", "ScriptableObjects", "Animator FSM"],
  techGroups: [
    {
      label: "Engine",
      items: [
        "Unity 2022 LTS",
        "C# scripting",
        "ScriptableObjects",
        "Animator state machines",
        "NavMesh AI",
      ],
    },
    {
      label: "Asset Pipeline",
      items: ["Blender (3D models)", "Unity Asset Pipeline", "Custom SFX + music pass"],
    },
    {
      label: "Tooling",
      items: ["VS Code", "Unity Editor", "Git LFS"],
    },
    {
      label: "Distribution",
      items: ["Windows Standalone build (.exe)"],
    },
  ],
  sourceUrl: "https://github.com/Asciente-rks/the-last-light",
  cinematicUrl: "/cinematics/the-last-light",
  cinematicCaption: "An 8-scene atmospheric trailer for The Last Light — a 3D survival horror built in Unity. Maynard alone, a lantern in hand, two hunters in the dark. Click anywhere or press → / Space to advance.",
  thumbnail: "TheLastLight/MainMenu.png",
  gallery: [
    {
      src: "TheLastLight/ShortClip.mp4",
      caption: "Gameplay demonstration",
      type: "video",
    },
    {
      src: "TheLastLight/MainMenu.png",
      caption: "Main menu",
    },
    {
      src: "TheLastLight/InGame.png",
      caption: "In-game — exterior",
    },
    {
      src: "TheLastLight/InGame2.png",
      caption: "In-game — interior",
    },
    {
      src: "TheLastLight/Maynard.png",
      caption: "Protagonist (Maynard)",
    },
    {
      src: "TheLastLight/Zombie.png",
      caption: "Enemy archetype — zombie",
    },
    {
      src: "TheLastLight/EditorSample.png",
      caption: "Unity editor — scene view",
    },
    {
      src: "TheLastLight/EditorSample2.png",
      caption: "Unity editor — second scene",
    },
    {
      src: "TheLastLight/Settings.png",
      caption: "Settings + accessibility",
    },
  ],
  featuredVideo: {
    src: "TheLastLight/ShortClip.mp4",
    caption: "Short gameplay demonstration",
  },
  cost: {
    monthlyTotal: "Free",
    rows: [
      {
        service: "Unity (Personal)",
        freeTier: "free under revenue threshold",
        weUse: "personal project",
        headroom: "within limits",
      },
      {
        service: "Blender",
        freeTier: "free open-source",
        weUse: "asset modelling",
        headroom: "unlimited",
      },
      {
        service: "VS Code",
        freeTier: "free editor",
        weUse: "C# scripting",
        headroom: "unlimited",
      },
    ],
  },
};
