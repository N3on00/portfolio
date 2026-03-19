import { createActorStateStore, resolveActorDefinition } from "@shared/actors";
import { portfolioContent } from "@shared/content/portfolio-content";
import { interactiveActorDefinitions, interactiveActorRegistry } from "./actor-registry";
import type {
  InteractiveSceneDefinition,
  ResolvedSceneActor,
  ResolvedSceneDefinition,
  SceneInteractionZone,
  SceneOverlayContent,
} from "./scene-contracts";
import { toSceneContentCards } from "./scene-contracts";

const defaultInputModes = ["pointer", "touch", "keyboard"] as const;

function toInteractionZone(actorId: string): SceneInteractionZone {
  const actor = interactiveActorRegistry.requireActor(actorId);
  const metadataZone = actor.metadata?.interactionZone;

  if (!metadataZone || typeof metadataZone !== "object") {
    return { x: 0, y: 0, width: 0.12, height: 0.12, minTouchTargetPx: 44, inputModes: [...defaultInputModes] };
  }

  const zone = metadataZone as Record<string, unknown>;

  return {
    x: typeof zone.x === "number" ? zone.x : 0,
    y: typeof zone.y === "number" ? zone.y : 0,
    width: typeof zone.width === "number" ? zone.width : 0.12,
    height: typeof zone.height === "number" ? zone.height : 0.12,
    minTouchTargetPx: typeof zone.minTouchTargetPx === "number" ? zone.minTouchTargetPx : 44,
    inputModes: [...defaultInputModes],
  };
}

export function resolveScene(scene: InteractiveSceneDefinition): ResolvedSceneDefinition {
  const stateStore = createActorStateStore(interactiveActorDefinitions);

  const actors: ResolvedSceneActor[] = scene.actors.map((placement) => {
    const actor = interactiveActorRegistry.requireActor(placement.actorId);
    const resolvedActor = resolveActorDefinition({
      actorId: placement.actorId,
      registry: interactiveActorRegistry,
      stateStore,
      content: portfolioContent,
    });

    return {
      id: placement.id,
      actor,
      resolvedActor,
      label: placement.label,
      placement: placement.placement,
      interactionZone: placement.interactionZone ?? toInteractionZone(placement.actorId),
      hint: placement.hint,
    };
  });

  return {
    scene,
    actors,
  };
}

export function getSceneOverlayContent(
  resolvedScene: ResolvedSceneDefinition,
  sceneActorId: string,
): SceneOverlayContent | undefined {
  const actor = resolvedScene.actors.find((entry) => entry.id === sceneActorId);

  if (!actor) {
    return undefined;
  }

  return {
    headline: actor.label,
    cards: toSceneContentCards(actor.resolvedActor.contentLinks, actor.label),
  };
}
