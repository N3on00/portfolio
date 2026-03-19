import type {
  ActorActionKind,
  ActorDefinition,
  ResolvedActorContentLink,
  ResolvedActorDefinition,
} from "@shared/actors";

export type SceneId = string;
export type SceneActorId = string;
export type ScenePhaseId = string;
export type SceneTriggerKind = "timer" | "actor-action";
export type SceneEffectKind = "set-phase" | "show-hint" | "focus-actor";
export type SceneInputMode = "pointer" | "touch" | "keyboard";

export interface ScenePlacement {
  x: number;
  y: number;
  width: number;
  height: number;
  layer: "background" | "midground" | "foreground" | "overlay";
  zIndex?: number;
}

export interface SceneInteractionZone {
  x: number;
  y: number;
  width: number;
  height: number;
  minTouchTargetPx?: number;
  inputModes: SceneInputMode[];
}

export interface SceneHintDefinition {
  label: string;
  tone: "ambient" | "guided" | "reward";
}

export interface SceneActorPlacement {
  id: SceneActorId;
  actorId: string;
  label: string;
  placement: ScenePlacement;
  interactionZone?: SceneInteractionZone;
  hint?: SceneHintDefinition;
}

export interface ScenePhaseDefinition {
  id: ScenePhaseId;
  label: string;
  description: string;
  enabledActorIds: SceneActorId[];
  visibleHintActorIds: SceneActorId[];
}

export interface SceneTriggerCondition {
  kind: SceneTriggerKind;
  phaseId?: ScenePhaseId;
  afterMs?: number;
  actorId?: SceneActorId;
  actionKind?: ActorActionKind;
}

export interface SceneTriggerEffect {
  kind: SceneEffectKind;
  phaseId?: ScenePhaseId;
  actorId?: SceneActorId;
}

export interface SceneTriggerDefinition {
  id: string;
  once?: boolean;
  condition: SceneTriggerCondition;
  effects: SceneTriggerEffect[];
}

export interface InteractiveSceneDefinition {
  id: SceneId;
  label: string;
  synopsis: string;
  entryPhaseId: ScenePhaseId;
  actors: SceneActorPlacement[];
  phases: ScenePhaseDefinition[];
  triggers: SceneTriggerDefinition[];
}

export interface ResolvedSceneActor {
  id: SceneActorId;
  actor: ActorDefinition;
  resolvedActor: ResolvedActorDefinition;
  label: string;
  placement: ScenePlacement;
  interactionZone: SceneInteractionZone;
  hint?: SceneHintDefinition;
}

export interface ResolvedSceneDefinition {
  scene: InteractiveSceneDefinition;
  actors: ResolvedSceneActor[];
}

export interface SceneInteractionTarget {
  actorId: SceneActorId;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputModes: SceneInputMode[];
  hintLabel?: string;
}

export interface SceneProgressState {
  currentPhaseId: ScenePhaseId;
  startedAtMs: number;
  triggeredIds: string[];
  focusedActorId?: SceneActorId;
  shownHintActorIds: SceneActorId[];
  completedActorIds: SceneActorId[];
}

export interface SceneSignal {
  kind: "tick" | "actor-action";
  atMs: number;
  actorId?: SceneActorId;
  actionKind?: ActorActionKind;
}

export interface ViewportMetrics {
  width: number;
  height: number;
  inputMode: SceneInputMode;
}

export interface SceneContentCard {
  id: string;
  title: string;
  eyebrow: string;
  body: string;
  tags: string[];
}

export interface SceneOverlayContent {
  headline: string;
  cards: SceneContentCard[];
}

export function toSceneContentCards(
  links: ResolvedActorContentLink[],
  fallbackTitle: string,
): SceneContentCard[] {
  return links.flatMap((link) => {
    if (!link.found || !link.value || typeof link.value !== "object") {
      return [];
    }

    const value = link.value as Record<string, unknown>;
    const title = typeof value.title === "string" ? value.title : fallbackTitle;
    const body =
      typeof value.summary === "string"
        ? value.summary
        : typeof value.text === "string"
          ? value.text
          : typeof value.label === "string"
            ? value.label
            : fallbackTitle;
    const eyebrow = link.collection;
    const tags = Array.isArray(value.tags)
      ? value.tags.filter((entry): entry is string => typeof entry === "string")
      : typeof value.category === "string"
        ? [value.category]
        : [];

    return [
      {
        id: link.id,
        title,
        eyebrow,
        body,
        tags,
      },
    ];
  });
}
