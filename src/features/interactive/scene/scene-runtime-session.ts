import { createActorStateStore } from "@shared/actors";
import type { ActorActionKind, ActorStateMap } from "@shared/actors";
import { interactiveActorDefinitions, interactiveActorRegistry } from "./actor-registry";
import type {
  InteractiveSceneDefinition,
  ResolvedSceneActor,
  ResolvedSceneDefinition,
  SceneProgressState,
  SceneSignal,
} from "./scene-contracts";
import { createInitialSceneProgress, reduceSceneProgress } from "./scene-progression";
import { resolveSceneWithState } from "./scene-resolver";

export interface SceneRuntimeSessionSnapshot {
  resolvedScene: ResolvedSceneDefinition;
  progress: SceneProgressState;
  actorState: ActorStateMap;
}

export interface SceneRuntimeSession {
  snapshot: () => SceneRuntimeSessionSnapshot;
  tick: (atMs: number) => SceneRuntimeSessionSnapshot;
  applyActorAction: (
    sceneActorId: string,
    actionKind: ActorActionKind,
    atMs: number,
  ) => SceneRuntimeSessionSnapshot;
}

const cloneProgress = (progress: SceneProgressState): SceneProgressState => ({
  ...progress,
  triggeredIds: [...progress.triggeredIds],
  shownHintActorIds: [...progress.shownHintActorIds],
  completedActorIds: [...progress.completedActorIds],
});

const resolveSceneActor = (
  resolvedScene: ResolvedSceneDefinition,
  sceneActorId: string,
): ResolvedSceneActor => {
  const actor = resolvedScene.actors.find((entry) => entry.id === sceneActorId);

  if (!actor) {
    throw new Error(`Unknown scene actor: ${sceneActorId}`);
  }

  return actor;
};

export const createSceneRuntimeSession = (
  scene: InteractiveSceneDefinition,
  startedAtMs = 0,
): SceneRuntimeSession => {
  const stateStore = createActorStateStore(interactiveActorDefinitions);
  let progress = createInitialSceneProgress(resolveSceneWithState(scene, stateStore), startedAtMs);

  const snapshot = (): SceneRuntimeSessionSnapshot => {
    const resolvedScene = resolveSceneWithState(scene, stateStore);

    return {
      resolvedScene,
      progress: cloneProgress(progress),
      actorState: stateStore.snapshot(),
    };
  };

  const applySignal = (signal: SceneSignal): SceneRuntimeSessionSnapshot => {
    const currentResolvedScene = resolveSceneWithState(scene, stateStore);
    progress = reduceSceneProgress(currentResolvedScene, progress, signal);
    return snapshot();
  };

  return {
    snapshot,
    tick: (atMs) => applySignal({ kind: "tick", atMs }),
    applyActorAction: (sceneActorId, actionKind, atMs) => {
      const currentResolvedScene = resolveSceneWithState(scene, stateStore);
      const sceneActor = resolveSceneActor(currentResolvedScene, sceneActorId);
      const action = sceneActor.resolvedActor.actions.find((entry) => entry.kind === actionKind);

      if (!action) {
        throw new Error(`Actor ${sceneActor.actor.id} does not expose action kind ${actionKind}.`);
      }

      if (!action.available) {
        return snapshot();
      }

      stateStore.applyAction(sceneActor.actor.id, action.id, action.effects);

      return applySignal({
        kind: "actor-action",
        actorId: sceneActorId,
        actionKind,
        atMs,
      });
    },
  };
};
