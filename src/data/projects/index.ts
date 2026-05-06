// To re-order the homepage cards, just rearrange the entries in the
// `projects` array at the bottom of this file.

import { judgementCut } from "./judgement-cut";
import { swiftRace } from "./swiftrace";
import { systemPulse } from "./system-pulse";
import { ascienteHub } from "./asciente-hub";
import { serviceTicketSystem } from "./service-ticket-system";
import { todoList } from "./todo-list";
import { h100Ecolodge } from "./h100-ecolodge";
import { nhcInternalGym } from "./nhc-internal-gym";
import { theLastLight } from "./the-last-light";

export type { Project, ProjectStatus, CostRow, DbColumn, DbTable, TechGroup, GalleryItem, RepoEntry } from "./types";

import type { Project } from "./types";

export const projects: Project[] = [
  judgementCut,
  swiftRace,
  systemPulse,
  ascienteHub,
  serviceTicketSystem,
  todoList,
  h100Ecolodge,
  nhcInternalGym,
  theLastLight,
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
