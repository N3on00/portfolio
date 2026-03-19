import type { AppModeKey } from "@shared/types/portfolio";

export type ActorCapability =
  | "inspectable"
  | "triggerable"
  | "linked-content"
  | "timed-event"
  | "gated-progression";

export type ActorStateKey =
  | "idle"
  | "available"
  | "focused"
  | "active"
  | "resolved"
  | "completed"
  | "locked"
  | "hidden";

export type ActorActionKind =
  | "focus"
  | "inspect"
  | "trigger"
  | "open-content"
  | "advance"
  | "dismiss";

export type ActorReactionType =
  | "panel"
  | "overlay"
  | "inline"
  | "navigation"
  | "state-change";

export type ActorContentCollection =
  | "identity"
  | "entities"
  | "projects"
  | "skills"
  | "experience"
  | "contact-links"
  | "story-hints"
  | "relations"
  | "mode-mappings"
  | "notes";

export type ActorContentRole = "primary" | "secondary" | "hint" | "unlock" | "related";

export interface ActorPlacement {
  mode: AppModeKey | "shared";
  surface: string;
  slot: string;
  order?: number;
}

export interface ActorReactionDefinition {
  type: ActorReactionType;
  target: string;
  variant?: string;
}

export interface ActorContentLinkDefinition {
  id: string;
  collection: ActorContentCollection;
  contentId: string;
  role: ActorContentRole;
  required?: boolean;
}

export interface ActorGateDefinition {
  id: string;
  label: string;
  requiredFlags?: string[];
  requiredActorStates?: Array<{
    actorId: string;
    states: ActorStateKey[];
  }>;
}

export interface ActorActionRequirement {
  states?: ActorStateKey[];
  missingFlags?: string[];
  requiredFlags?: string[];
  openGates?: string[];
}

export interface ActorActionEffect {
  type: "set-state" | "set-flag" | "clear-flag" | "emit";
  state?: ActorStateKey;
  flag?: string;
  event?: string;
  payload?: Record<string, unknown>;
}

export interface ActorActionDefinition {
  id: string;
  kind: ActorActionKind;
  label: string;
  intent: string;
  requirements?: ActorActionRequirement;
  reaction?: ActorReactionDefinition;
  effects?: ActorActionEffect[];
}

export interface ActorDefinition {
  id: string;
  type: string;
  label: string;
  capabilities: ActorCapability[];
  defaultState: ActorStateKey;
  states: ActorStateKey[];
  placements: ActorPlacement[];
  actions: ActorActionDefinition[];
  contentLinks?: ActorContentLinkDefinition[];
  gates?: ActorGateDefinition[];
  metadata?: Record<string, unknown>;
}

export interface ActorStateSnapshot {
  actorId: string;
  state: ActorStateKey;
  flags: string[];
  lastActionId?: string;
  eventLog: string[];
}

export type ActorStateMap = Record<string, ActorStateSnapshot>;

export interface ResolvedActorAction extends ActorActionDefinition {
  available: boolean;
  blockedBy: string[];
}

export interface ResolvedActorGate extends ActorGateDefinition {
  open: boolean;
  blockedBy: string[];
}

export interface ResolvedActorContentLink extends ActorContentLinkDefinition {
  found: boolean;
  value?: unknown;
}

export interface ResolvedActorDefinition {
  actor: ActorDefinition;
  state: ActorStateSnapshot;
  gates: ResolvedActorGate[];
  actions: ResolvedActorAction[];
  contentLinks: ResolvedActorContentLink[];
}

export interface ActorRegistry {
  getActor: (actorId: string) => ActorDefinition | undefined;
  requireActor: (actorId: string) => ActorDefinition;
  listActors: () => ActorDefinition[];
  listByCapability: (capability: ActorCapability) => ActorDefinition[];
  listByMode: (mode: AppModeKey | "shared") => ActorDefinition[];
}

export interface ActorStateStore {
  get: (actorId: string) => ActorStateSnapshot | undefined;
  ensure: (actor: ActorDefinition) => ActorStateSnapshot;
  setState: (actorId: string, state: ActorStateKey) => ActorStateSnapshot;
  setFlag: (actorId: string, flag: string) => ActorStateSnapshot;
  clearFlag: (actorId: string, flag: string) => ActorStateSnapshot;
  applyAction: (
    actorId: string,
    actionId: string,
    effects?: ActorActionEffect[],
  ) => ActorStateSnapshot;
  snapshot: () => ActorStateMap;
}
