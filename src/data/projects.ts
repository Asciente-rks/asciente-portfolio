// Backward-compatibility shim. The real source of truth now lives in
// src/data/projects/ - one file per project plus a shared types.ts.
// To edit a project, open src/data/projects/<slug>.ts.
// To re-order homepage cards, edit the array in src/data/projects/index.ts.

export * from "./projects/index";
