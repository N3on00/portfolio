import type {
  ResolvedSceneDefinition,
  SceneInteractionTarget,
  ScenePhaseDefinition,
  SceneProgressState,
  SceneSignal,
  ViewportMetrics,
} from "./scene-contracts";

function getPhase(resolvedScene: ResolvedSceneDefinition, phaseId: string): ScenePhaseDefinition {
  const phase = resolvedScene.scene.phases.find((entry) => entry.id === phaseId);

  if (!phase) {
    throw new Error(`Unknown phase: ${phaseId}`);
  }

  return phase;
}

export function createInitialSceneProgress(
  resolvedScene: ResolvedSceneDefinition,
  startedAtMs = 0,
): SceneProgressState {
  return {
    currentPhaseId: resolvedScene.scene.entryPhaseId,
    startedAtMs,
    triggeredIds: [],
    shownHintActorIds: [],
    completedActorIds: [],
  };
}

export function reduceSceneProgress(
  resolvedScene: ResolvedSceneDefinition,
  current: SceneProgressState,
  signal: SceneSignal,
): SceneProgressState {
  const next: SceneProgressState = {
    ...current,
    triggeredIds: [...current.triggeredIds],
    shownHintActorIds: [...current.shownHintActorIds],
    completedActorIds: [...current.completedActorIds],
  };

  if (signal.kind === "actor-action" && signal.actorId) {
    next.focusedActorId = signal.actorId;

    if (signal.actionKind === "open-content" || signal.actionKind === "inspect") {
      if (!next.completedActorIds.includes(signal.actorId)) {
        next.completedActorIds.push(signal.actorId);
      }
    }
  }

  for (const trigger of resolvedScene.scene.triggers) {
    if (trigger.once && next.triggeredIds.includes(trigger.id)) {
      continue;
    }

    if (trigger.condition.phaseId && trigger.condition.phaseId !== next.currentPhaseId) {
      continue;
    }

    const conditionMet =
      (trigger.condition.kind === "timer" &&
        typeof trigger.condition.afterMs === "number" &&
        signal.atMs - next.startedAtMs >= trigger.condition.afterMs) ||
      (trigger.condition.kind === "actor-action" &&
        signal.kind === "actor-action" &&
        trigger.condition.actorId === signal.actorId &&
        trigger.condition.actionKind === signal.actionKind);

    if (!conditionMet) {
      continue;
    }

    for (const effect of trigger.effects) {
      if (effect.kind === "set-phase" && effect.phaseId) {
        next.currentPhaseId = effect.phaseId;
      }

      if (effect.kind === "show-hint" && effect.actorId && !next.shownHintActorIds.includes(effect.actorId)) {
        next.shownHintActorIds.push(effect.actorId);
      }

      if (effect.kind === "focus-actor" && effect.actorId) {
        next.focusedActorId = effect.actorId;
      }
    }

    next.triggeredIds.push(trigger.id);
  }

  return next;
}

export function getActiveInteractionTargets(
  resolvedScene: ResolvedSceneDefinition,
  progress: SceneProgressState,
  viewport: ViewportMetrics,
): SceneInteractionTarget[] {
  const phase = getPhase(resolvedScene, progress.currentPhaseId);

  return resolvedScene.actors
    .filter((actor) => phase.enabledActorIds.includes(actor.id))
    .map((actor) => {
      const zone = actor.interactionZone;
      const minTouchTargetPx = viewport.inputMode === "touch" ? Math.max(zone.minTouchTargetPx ?? 44, 44) : 0;
      const widthPx = zone.width * viewport.width;
      const heightPx = zone.height * viewport.height;
      const extraWidthPx = Math.max(minTouchTargetPx - widthPx, 0);
      const extraHeightPx = Math.max(minTouchTargetPx - heightPx, 0);

      return {
        actorId: actor.id,
        label: actor.label,
        x: actor.placement.x + zone.x - extraWidthPx / (2 * viewport.width),
        y: actor.placement.y + zone.y - extraHeightPx / (2 * viewport.height),
        width: zone.width + extraWidthPx / viewport.width,
        height: zone.height + extraHeightPx / viewport.height,
        inputModes: zone.inputModes,
        hintLabel:
          phase.visibleHintActorIds.includes(actor.id) || progress.shownHintActorIds.includes(actor.id)
            ? actor.hint?.label
            : undefined,
      };
    })
    .filter((target) => target.inputModes.includes(viewport.inputMode));
}
