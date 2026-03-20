import type { ModeDefinition } from "@shared/types/portfolio";

export const interactiveModeDefinition: ModeDefinition = {
  key: "interactive",
  label: "Interactive Mode",
  routeBase: "/interactive",
  ownership: {
    primary: ["scene", "phaser-room-renderer", "project-hotspots", "reaction-surfaces"],
    sharedDependencies: ["portfolio-content", "app-shell"],
  },
  extensionPoints: [
    "phaser-scene-renderer",
    "object-interactions",
    "project-detail-popups",
    "room-audio-and-ambience",
  ],
  contentMappingId: "interactive-shared-foundation",
  checklist: [
    {
      id: "interactive-runtime-mount",
      label: "React only mounts the runtime; Phaser owns the interactive presentation.",
      status: "done",
    },
    {
      id: "interactive-actor-registry",
      label: "Actor registry seam exists before renderer-specific visuals.",
      status: "done",
    },
    {
      id: "interactive-phaser-scene",
      label: "Scene, hotspots, and detail overlays render inside Phaser from resolved feature state.",
      status: "done",
    },
    {
      id: "interactive-renderer-adapter",
      label: "Keep the Phaser scene thin and fed by shared actor and scene contracts.",
      status: "done",
    },
    {
      id: "interactive-project-overlays",
      label: "Project overlay presentation stays data-driven even though it now renders in Phaser.",
      status: "done",
    },
  ],
};
