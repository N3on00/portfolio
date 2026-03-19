import { roomSceneDefinition } from "./scene";
import { interactiveActorRegistry } from "./scene";
import { resolveScene } from "./scene";

export const interactiveSceneRegistry = {
  [roomSceneDefinition.id]: roomSceneDefinition,
};

export const getInteractiveScene = (sceneId: keyof typeof interactiveSceneRegistry | string) => {
  const scene = interactiveSceneRegistry[sceneId as keyof typeof interactiveSceneRegistry];

  if (!scene) {
    throw new Error(`Unknown interactive scene: ${sceneId}`);
  }

  return resolveScene(scene);
};

export const interactiveExperience = {
  actorRegistry: interactiveActorRegistry,
  sceneRegistry: interactiveSceneRegistry,
  getScene: getInteractiveScene,
  defaultSceneId: roomSceneDefinition.id,
};
