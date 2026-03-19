import type { ModeDefinition } from "@shared/types/portfolio";

export const classicModeDefinition: ModeDefinition = {
  key: "classic",
  label: "Classic Mode",
  routeBase: "/classic",
  ownership: {
    primary: ["classic-render-flow", "actor-driven-sections", "block-renderers", "contact-surface"],
    sharedDependencies: ["portfolio-content", "actor-mappings", "ui-tokens", "app-shell"],
  },
  extensionPoints: ["section-order", "section-actor-bindings", "block-renderers"],
  contentMappingId: "classic-shared-foundation",
  checklist: [
    {
      id: "classic-ia",
      label: "Scan-first information architecture is defined through shared section metadata.",
      status: "done",
    },
    {
      id: "classic-mapping",
      label: "Shared actors map into classic render blocks without content duplication.",
      status: "done",
    },
    {
      id: "classic-renderer",
      label: "Classic renderer stays monochrome and renderer-focused while consuming shared tokens.",
      status: "done",
    },
  ],
};
