import type { ModeDefinition } from "@shared/types/portfolio";

export const interactiveModeDefinition: ModeDefinition = {
  key: "interactive",
  label: "Interactive Mode",
  routeBase: "/interactive",
  ownership: {
    primary: ["scene", "room-navigation", "project-hotspots", "pc-overlay"],
    sharedDependencies: ["portfolio-content", "shared-ui", "app-shell"],
  },
  extensionPoints: [
    "2d-scene-renderer",
    "object-interactions",
    "project-detail-popups",
    "room-audio-and-ambience",
  ],
  contentMappingId: "interactive-shared-foundation",
  checklist: [
    {
      id: "interactive-react-adapter",
      label: "React runtime adapter stays mounted through the shared registry.",
      status: "done",
    },
    {
      id: "interactive-actor-registry",
      label: "Actor registry seam exists before renderer-specific visuals.",
      status: "done",
    },
    {
      id: "interactive-shared-ui-shells",
      label: "Shared UI shells cover panels, triggers, dialogs and hints without owning scene behavior.",
      status: "done",
    },
    {
      id: "interactive-renderer-adapter",
      label: "Connect the resolved scene model to the final renderer adapter.",
      status: "todo",
    },
    {
      id: "interactive-project-overlays",
      label: "Build project overlay presentation on top of the shared shells without coupling it to the renderer.",
      status: "todo",
    },
  ],
};
