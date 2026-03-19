import type { AppModeKey } from "@shared/types/portfolio";
import type { ActorCapability, ActorDefinition, ActorRegistry } from "./actor-contracts";

export const createActorRegistry = (definitions: ActorDefinition[]): ActorRegistry => {
  const actorMap = new Map<string, ActorDefinition>();

  definitions.forEach((definition) => {
    if (actorMap.has(definition.id)) {
      throw new Error(`Duplicate actor id: ${definition.id}`);
    }

    actorMap.set(definition.id, definition);
  });

  const listActors = () => Array.from(actorMap.values());

  return {
    getActor: (actorId) => actorMap.get(actorId),
    requireActor: (actorId) => {
      const actor = actorMap.get(actorId);

      if (!actor) {
        throw new Error(`Unknown actor: ${actorId}`);
      }

      return actor;
    },
    listActors,
    listByCapability: (capability: ActorCapability) =>
      listActors().filter((actor) => actor.capabilities.includes(capability)),
    listByMode: (mode: AppModeKey | "shared") =>
      listActors().filter((actor) =>
        actor.placements.some((placement) => placement.mode === mode || placement.mode === "shared"),
      ),
  };
};
