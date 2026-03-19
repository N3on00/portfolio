import { createActorRegistry } from "@shared/actors";
import type { ActorDefinition } from "@shared/actors";
import { classicSectionRegistry } from "./classic-sections";

export const classicSectionActors: ActorDefinition[] = classicSectionRegistry.map((section) => ({
  id: section.actorId,
  type: "classic-section",
  label: section.label,
  capabilities: ["linked-content"],
  defaultState: "available",
  states: ["available", "focused"],
  placements: [{ mode: "classic", surface: "page", slot: section.id, order: section.order }],
  actions: [
    {
      id: `${section.actorId}-focus`,
      kind: "focus",
      label: `Focus ${section.label}`,
      intent: "Resolve the section through shared mappings and shared entities.",
      effects: [{ type: "set-state", state: "focused" }],
    },
  ],
  contentLinks: [
    {
      id: `${section.actorId}-mapping`,
      collection: "mode-mappings",
      contentId: "classic-shared-foundation",
      role: "primary",
      required: true,
    },
  ],
  metadata: {
    sectionId: section.id,
    surfaceId: section.surfaceId,
  },
}));

export const classicSectionActorRegistry = createActorRegistry(classicSectionActors);
