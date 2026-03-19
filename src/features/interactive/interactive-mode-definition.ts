import type { ModeDefinition } from "@shared/types/portfolio";

export const interactiveModeDefinition: ModeDefinition = {
  key: "interactive",
  label: "Interactive Mode",
  routeBase: "/interactive",
  ownership: {
    primary: ["scene", "room-navigation", "actor-surfaces", "overlay-orchestration"],
    sharedDependencies: ["portfolio-content", "actor-system", "ui-tokens", "app-shell"],
  },
  extensionPoints: [
    "2d-scene-renderer",
    "actor-registry-bindings",
    "actor-interaction-adapters",
    "room-audio-and-ambience",
  ],
  contentMappingId: "interactive-shared-foundation",
  checklist: [
    {
      id: "interactive-scene-resolution",
      label: "Resolved scene model is available without coupling shell logic to the renderer.",
      status: "done",
    },
    {
      id: "interactive-progression",
      label: "Phases, triggers, and interaction targets are available as runtime-ready feature state.",
      status: "done",
    },
    {
      id: "interactive-overlay-seam",
      label: "Overlay content is derived from shared content links instead of hardcoded object copy.",
      status: "done",
    },
  ],
};
