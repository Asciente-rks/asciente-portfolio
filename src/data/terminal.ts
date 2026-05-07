// =============================================================================
// TERMINAL CONTENT
// Anything that prints inside the home-page command prompt lives here. Edit
// these arrays / strings and the terminal updates - no need to touch the
// component itself.
// =============================================================================

export const terminalIntro: string[] = [
  "ralph kenneth f. sonio · cloud-native backend engineer & qa tester",
  "",
  "--check-status",
  "currently shipping: All systems shipped",
  "",
  "principle: every project ships at $0/month on free tiers — designed, not stitched.",
  "",
  "type 'ls' to list projects · 'cd <name>' to open one",
];

export interface TerminalToolkitEntry {
  command: string;
  description: string;
}

export const terminalToolkit: TerminalToolkitEntry[] = [
  { command: "ls", description: "list every project" },
  { command: "cd <name>", description: "open a case study" },
  { command: "↑ / ↓", description: "cycle through projects" },
  { command: "about / stack / contact", description: "jump to a page section" },
];

export const terminalToolkitFooter: string =
  "<kbd>⌘</kbd> <kbd>K</kbd> · open the full palette";

export const terminalPromptPrefix: string = "~/ralph-sonio $ ";

export const terminalWindowTitle: string = "~/ralph-sonio — bash";

export const terminalHelp: string[] = [
  "available commands:",
  "  ls            list projects",
  "  cd <project>  open project case study",
  "  about         scroll to about",
  "  stack         scroll to stack",
  "  contact       scroll to contact",
  "  clear         clear the terminal",
];

export const terminalNotFound = (cmd: string): string =>
  `The system cannot find the path specified: ${cmd}`;

export const terminalScrollMessage = (target: string): string =>
  `scrolling to ${target}…`;

export const terminalSectionMissing = (target: string): string =>
  `section "${target}" not found`;

export const terminalOpening = (target: string): string => `opening ${target}…`;
