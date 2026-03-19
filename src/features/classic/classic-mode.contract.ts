import type { ModeDefinition } from "@shared/types/portfolio";

export const classicModeDefinition: ModeDefinition = {
  key: "classic",
  label: "Classic Mode",
  routeBase: "/classic",
  ownership: {
    primary: ["classic-render-flow", "actor-driven-sections", "block-renderers", "contact-surface"],
    sharedDependencies: ["portfolio-content", "shared-ui", "app-shell"],
  },
  extensionPoints: ["section-order", "section-actor-bindings", "block-renderers"],
  contentMappingId: "classic-shared-foundation",
  checklist: [
    {
      id: "classic-ia",
      label: "Scan-first information architecture is driven by shared section definitions.",
      status: "done",
    },
    {
      id: "classic-mapping",
      label: "Shared actors map into classic blocks without duplicating project content.",
      status: "done",
    },
    {
      id: "classic-shared-ui",
      label: "Classic mode builds on shared layout, surface and typography primitives.",
      status: "done",
    },
    {
      id: "classic-section-order",
      label: "Define final section ordering and scan priority.",
      status: "todo",
    },
    {
      id: "classic-render-blocks",
      label: "Continue refining block renderers without moving section logic into shared UI.",
      status: "todo",
    },
  ],
};
