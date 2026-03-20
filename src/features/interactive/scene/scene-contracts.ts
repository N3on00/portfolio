import type {
  ActorContentValue,
  ActorActionKind,
  ActorDefinition,
  ResolvedActorContentLink,
  ResolvedActorDefinition,
} from "@shared/actors";
import type { ContentEntity, ContentLink, ContentNote, ContentRelation, ModeContentMapping } from "@shared/types/portfolio";

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

function isContentEntity(value: ActorContentValue): value is ContentEntity {
  return "kind" in value;
}

function isContentRelation(value: ActorContentValue): value is ContentRelation {
  return "sourceId" in value && "targetId" in value;
}

function isModeContentMapping(value: ActorContentValue): value is ModeContentMapping {
  return "mode" in value && "surfaces" in value;
}

function isContentNote(value: ActorContentValue): value is ContentNote {
  return "text" in value;
}

function isContentLink(value: ActorContentValue): value is ContentLink {
  return "url" in value && "label" in value;
}

function toCardTitle(value: ActorContentValue, fallbackTitle: string): string {
  if (isContentEntity(value)) {
    return value.title;
  }

  if (isContentLink(value)) {
    return value.label;
  }

  if (isModeContentMapping(value)) {
    return value.id;
  }

  if (isContentRelation(value)) {
    return value.id;
  }

  if (isContentNote(value)) {
    return fallbackTitle;
  }

  return fallbackTitle;
}

function toCardBody(value: ActorContentValue, fallbackTitle: string): string {
  if (isContentEntity(value)) {
    return value.summary;
  }

  if (isContentLink(value)) {
    return value.url;
  }

  if (isContentNote(value)) {
    return value.text;
  }

  if (isModeContentMapping(value)) {
    return `${value.mode} mode with ${value.surfaces.length} mapped surfaces.`;
  }

  if (isContentRelation(value)) {
    return value.note ?? `${value.type} relation between ${value.sourceId} and ${value.targetId}.`;
  }

  return fallbackTitle;
}

function toCardTags(value: ActorContentValue): string[] {
  if (isContentEntity(value)) {
    return value.tags;
  }

  if (isModeContentMapping(value)) {
    return [value.mode];
  }

  if (isContentRelation(value)) {
    return [value.type, value.strength];
  }

  return [];
}

export function toSceneContentCards(
  links: ResolvedActorContentLink[],
  fallbackTitle: string,
): SceneContentCard[] {
  return links.flatMap((link) => {
    if (!link.found || !link.value) {
      return [];
    }

    return [
      {
        id: link.id,
        title: toCardTitle(link.value, fallbackTitle),
        eyebrow: link.collection,
        body: toCardBody(link.value, fallbackTitle),
        tags: toCardTags(link.value),
      },
    ];
  });
}
