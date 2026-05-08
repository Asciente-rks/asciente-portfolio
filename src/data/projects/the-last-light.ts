import type { Project } from "./types";

export const theLastLight: Project = {
  slug: 'the-last-light',
  title: 'The Last Light',
  role: 'Game Development',
  status: 'archived',
  tagline:
    "A tutorial-based 3D horror game from User1 Productions, extended with additional enemy AI, UI, accessibility features, and sound design for a more exciting gameplay loop.",
  summary:
    'Built on User1 Productions\' Unity 3D series. Extensions include a second enemy archetype, expanded HUD, options menu with rebindable controls, accessibility toggles, and a custom SFX/music pass.',
  language: 'C#',
  tech: ['Unity', 'C#', 'Blender', 'VS Code', 'ScriptableObjects', 'Animator FSM'],
  techGroups: [
    {
      label: 'Engine',
      items: ['Unity 2022 LTS', 'C# scripting', 'ScriptableObjects', 'Animator state machines', 'NavMesh AI'],
    },
    {
      label: 'Asset Pipeline',
      items: ['Blender (3D models)', 'Unity Asset Pipeline', 'Custom SFX + music pass'],
    },
    {
      label: 'Tooling',
      items: ['VS Code', 'Unity Editor', 'Git LFS'],
    },
    {
      label: 'Distribution',
      items: ['Windows Standalone build (.exe)'],
    },
  ],

  sourceUrl: 'https://github.com/Asciente-rks/the-last-light',
  thumbnail: 'TheLastLight/MainMenu.png',
  featuredVideo: {
    src: 'TheLastLight/ShortClip.mp4',
    caption: 'Short gameplay demonstration',
  },
  gallery: [
    { src: 'TheLastLight/ShortClip.mp4', caption: 'Gameplay demonstration', type: 'video' },
    { src: 'TheLastLight/MainMenu.png', caption: 'Main menu' },
    { src: 'TheLastLight/InGame.png', caption: 'In-game — exterior' },
    { src: 'TheLastLight/InGame2.png', caption: 'In-game — interior' },
    { src: 'TheLastLight/Maynard.png', caption: 'Protagonist (Maynard)' },
    { src: 'TheLastLight/Zombie.png', caption: 'Enemy archetype — zombie' },
    { src: 'TheLastLight/EditorSample.png', caption: 'Unity editor — scene view' },
    { src: 'TheLastLight/EditorSample2.png', caption: 'Unity editor — second scene' },
    { src: 'TheLastLight/Settings.png', caption: 'Settings + accessibility' },
  ],
  repos: [
    {
      name: 'the-last-light',
      url: 'https://github.com/Asciente-rks/the-last-light',
      stack: 'Unity 3D project · C# scripts + Blender assets',
    },
  ],
  architecture: {
    mermaid: `graph TB
    Unity["Unity 3D Project<br/>C# scripts + ScriptableObjects<br/>Animator FSMs"]
    Player["Player Controller<br/>movement + interaction"]
    AI["Enemy AI<br/>2 archetypes incl. zombie"]
    UI["HUD + Options<br/>accessibility toggles"]
    Assets["Asset Pipeline<br/>Blender models · SFX · music"]
    Build["Windows Standalone .exe"]

    Unity --> Player
    Unity --> AI
    Unity --> UI
    Unity --> Assets
    Assets -.imports.-> Unity
    Unity --> Build

    classDef edge fill:#0f1422,stroke:#5eead4,color:#e2e8f0
    class Unity,Player,AI,UI,Assets,Build edge`,
    notes: [
      'Originally a tutorial project from User1 Productions — extended with second enemy archetype, expanded HUD, accessibility toggles, and a custom audio pass.',
      'C# component scripts for player, AI, and UI; ScriptableObjects for game config; Animator state machines for character animation.',
      'Blender for modelling secondary characters (zombie variant) and props.',
    ],
  },
  cost: {
    monthlyTotal: 'Free',
    rows: [
      { service: 'Unity (Personal)', freeTier: 'free under revenue threshold', weUse: 'personal project', headroom: 'within limits' },
      { service: 'Blender', freeTier: 'free open-source', weUse: 'asset modelling', headroom: 'unlimited' },
      { service: 'VS Code', freeTier: 'free editor', weUse: 'C# scripting', headroom: 'unlimited' },
    ],
    rationale: [
      'Unity Personal — free under the revenue threshold; perfect for portfolio / educational projects.',
      'Blender for modelling — zero-cost professional 3D toolchain.',
    ],
  },
};
